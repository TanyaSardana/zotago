'use strict';

/**
 * This module provides useful functions that wrap around Sequelize to perform
 * certain tedious things for us.
 */

var debug = require('debug')('zotago:ormHelpers');
var dataHelpers = require('./dataHelpers');
var util = require('./.');
var models = require('../models');

var Promise = require('bluebird');

// imported so that we can reexport the NoSuchAccountError
var auth = require('./auth');

/**
 * An exception signifying that a post could not be found.
 *
 * @param {string} [message] - A message associated with this exception.
 */
function NoSuchPostError(message) {
    this.message = message;
    this.name = name;
    Error.captureStackTrace(this, NoSuchPostError);
}
NoSuchPostError.prototype = Object.create(Error.prototype);
NoSuchPostError.prototype.constructor = NoSuchPostError;
module.exports.NoSuchPostError = NoSuchPostError;

/**
 * Gets a nice JSON form of a specific post.
 *
 * @param object postModel -- The post model to obtain. Must be either {@link
 * models.SellPost} or {@link models.WantPost}
 * @param object where -- A Sequelize `where` object.
 * @return Promise -- Resolves to an object fully representing the post.
 */
function getPost(postModel, selector) {
    var thePost = {};

    return postModel
        .findOne(selector)
        .then(function(post) {
            if(!post) {
                debug("throwing NoSuchPostError");
                throw new auth.NoSuchPostError();
            }

            thePost.post = post;
            return thePost.post.getTags();
        })
        .then(function(tags) {
            thePost.tags = tags;
            return thePost.post.getOffers();
        })
        .then(function(offers) {
            thePost.offers = offers;
            return thePost.post.getFollowers();
        })
        .then(function(followers) {
            thePost.followers = followers;
            return thePost.post.getCreator();
        })
        .then(function(creator) {
            thePost.creator = creator;
            return thePost;
        })
        .catch(NoSuchPostError, function(exc) {
            debug("Handling NoSuchPostError");
            return null;
        });
}
module.exports.getPost = getPost;

/**
 * Provides a high-level interface for querying different post models.
 *
 * @param object postModel -- the model of the post to query.
 * @param object query -- the parameters of the query.
 * @param object query.tags -- a list of tags that each post must have
 * @return Promise -- resolves to an array of post instances of the given post
 * model.
 */
function getPosts(postModel, query, activeAccount) {
    // want to find all want posts whose tags are a superset of the given
    // query.tags.
    var q = {};

    if(query.creatorId)
        q.creatorId = query.creatorId;

    var p = postModel.findAll({
        where: q,
        include: [{
            model: models.Tag,
            as: 'tags'
        }, {
            model: models.Account,
            as: 'creator'
        }]
    })
    .then(function(posts) {
        return Promise.map(posts, function(post) {
            return post.countFollowers()
                .then(function(count) {
                    post.get().followerCount = count;
                    debug("Counted followers.");
                    return post.countOffers();
                })
                .then(function(count) {
                    post.get().offerCount = count;
                    debug("Counted offers.");
                    return post;
                });
        });
    });

    if(activeAccount) {
        debug("Account active. Determining follow status.");
        p = p.then(function(posts) {
            return Promise.map(posts, function(post) {
                return post.hasFollower(activeAccount)
                    .then(function(followStatus) {
                        // damn that's nasty
                        post.get().isFollowed = followStatus;
                        debug("Set post " + post.id + " follow status " + followStatus);
                        return post;
                    });
            });
        });
    }
    else {
        debug("No active account. Skipping follow status check.");
    }

    // Because there's no good way to perform this kind of filtering on the
    // Sequelize level (believe me, I tried) we'll have to do it on the
    // application level (and hit the database more times than I would like).
    // TODO optimize this code to run in the database.
    if(query.tags)
        p = p.then(function(wantPosts) {
            return Promise.map(wantPosts, function(wp) {
                return wp.getTags()
                    .then(function(wpTags) {
                        if(util.isSubset(
                            query.tags,
                            util.toSet(wpTags.map(function(t) {
                                return t.name;
                            })))) {
                            return wp;
                        }
                        else
                            return null;
                    });
            })
            .then(function(wantPosts) {
                wantPosts = wantPosts.filter(function(wp) {
                    return wp != null
                });

                return wantPosts;
            });
        });

    return p;
}
module.exports.getPosts = getPosts;

/**
 * Creates a new post of the given model.
 *
 * @param Object postModel -- the model of the post to create
 * @param Object data -- the post parameters
 * @param string data.description -- post description
 * @param int data.creatorId -- id of the creator
 * @param string data.imageUrl -- url of image for post
 * @param array data.tags -- names of tags to add to the post
 * @return Promise -- resolves to the post instance that has been created
 */
function createPost(postModel, data) {
    var mkPost = data.mkPost;
    var tags = data.tags;

    var dataUrlScheme = "data";
    var p = Promise.resolve();

    if(mkPost.imageUrl.slice(0, dataUrlScheme.length) === dataUrlScheme) {
        var imageBuf = dataHelpers.parseDataUrl(mkPost.imageUrl);
        p = dataHelpers.saveImage(imageBuf)
            .then(function(imageData) {
                var imageUrl = dataHelpers.getImageUrl(imageData.id)
                mkPost.imageUrl = imageUrl;
            });
    }

    var thePost;

    return p
        .then(function() {
            return postModel.create(mkPost);
        })
        .then(function(post) {
            thePost = post;
            return Promise.all(tags.map(function(tag) {
                return models.Tag.findOne({
                    where: {
                        name: tag
                    }
                });
            }))
        })
        .then(function(tags) {
            return thePost.addTags(tags);
        })
        .then(function() {
            return getPost(postModel, {
                where: {
                    id: thePost.id
                }
            });
        })
}
module.exports.createPost = createPost;

/**
 * Makes an account follow a post.
 *
 * Uses sequelizes `findOne` model method, so only a single account may be
 * associated to a single post with this function.
 *
 * @param {Model} postModel - The model class of the type of post.
 * @param {Object} options - Options for determining the account and post to
 * associate.
 * @param {Object} options.post - Options for selecting the post.
 * @param {Object} options.account - Options for selecting the account.
 * @return {Promise.<Post>} - The full post object of the selected post.
 */
function followPost(postModel, options) {
    var postSelector = options.post;
    var accountSelector = options.account;

    return Promise.all([
        postModel.findOne(postSelector),
        models.Account.findOne(accountSelector)
    ])
    .then(function(resolved) {
        var post = resolved[0];
        var account = resolved[1];

        if(!post) {
            debug("Throwing NoSuchPostError");
            throw new auth.NoSuchPostError();
        }

        if(!account) {
            debug("Throwing NoSuchAccountError");
            throw new auth.NoSuchAccountError();
        }

        debug('Adding follower. ' + post + ' ' + account);

        return post.addFollower(account);
    })
    .then(function(v) {
        debug('Added follower. ' + JSON.stringify(v));

        return getPost(postModel, postSelector);
    })
    .then(function(post) {
        if(!post) {
            debug("Throwing NoSuchPostError");
            throw new auth.NoSuchPostError();
        }

        return post;
    });
}
module.exports.followPost = followPost;

function unfollowPost(postModel, options) {
    var postSelector = options.post;
    var accountSelector = options.account;

    return Promise.all([
        postModel.findOne(postSelector),
        models.Account.findOne(accountSelector)
    ])
    .then(function(resolved) {
        var post = resolved[0];
        var account = resolved[1];

        if(!post) {
            debug("Throwing NoSuchPostError");
            throw new auth.NoSuchPostError();
        }

        if(!account) {
            debug("Throwing NoSuchAccountError");
            throw new auth.NoSuchAccountError();
        }

        debug("Removing follower.");

        return post.removeFollower(account);
    })
    .then(function(v) {
        debug("Removed follower.");

        return getPost(postModel, postSelector);
    })
    .then(function(post) {
        if(!post) {
            debug("Throwing NoSuchPostError");
            throw new auth.NoSuchPostError();
        }

        return post;
    });
}
module.exports.unfollowPost = unfollowPost;
