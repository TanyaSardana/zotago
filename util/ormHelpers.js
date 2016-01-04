'use strict';

var dataHelpers = require('./dataHelpers');
var util = require('./.');
var models = require('../models');


/**
 * Gets a nice JSON form of a specific post.
 *
 * @param object postModel -- The post model to obtain. Must be either {@link
 * models.SellPost} or {@link models.WantPost}
 * @param object where -- A Sequelize `where` object.
 * @return Promise -- Resolves to an object fully representing the post.
 */
function getPost(postModel, where) {
    var thePost = {};

    return postModel
        .findOne({
            where: where
        })
        .then(function(post) {
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
function getPosts(postModel, query) {
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
    });

    // Because there's no good way to perform this kind of filtering on the
    // Sequelize level (believe me, I tried) we'll have to do it on the
    // application level (and hit the database more times than I would like).
    // TODO optimize this code to run in the database.
    if(query.tags)
        p = p.then(function(wantPosts) {
            return Promise.all(
                wantPosts.map(function(wp) {
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
            )
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
    var p = Promise.accept();

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
            return getPost(postModel, thePost.id);
        })
}
module.exports.createPost = createPost;
