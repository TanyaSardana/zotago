'use strict';

var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
Promise.longStackTraces();
var imageSearch = require('../util/imageSearch');

var models = require('../models');
var util = require('../util');
var ormHelpers = require('../util/ormHelpers');
var dataHelpers = require('../util/dataHelpers');
var auth = require('../util/auth');
var matching = require('../util/matching.js');

router
    .route('/auth')
    .post(function(req, res) {
        var authReq = req.body;
        var handler = auth.handlers[authReq.method];
        if(typeof handler === 'undefined') {
            // there is no handler to deal with the desired authentication
            // scheme.
            res.status(400).json({
                message: "Unsupported authentication scheme.",
                scheme: authReq.method
            });
        }

        return handler(authReq)
            .then(function(zotagoToken) {
                res.json({
                    accessToken: zotagoToken
                });
            })
            .catch(function(e) {
                console.error('Promise rejection causing auth failure.');
                console.error(e);
                res.status(400).json({
                    message: "Authentication failed."
                });
            });
    });

// module with all api endpoints
router
    .route('/accounts')
    .get(function(req, res) {
        return models.Account.findAll()
            .then(function(accounts) {
                res.json(accounts);
            });
    });

router
    .route('/image')
    .get(function(req, res) {
        var query = req.query.q;
        return imageSearch.search(query)
            .then(function(b) {
                res.json(b);
            });
    });

router
    .route('/sellposts')
    .get(function(req, res) {
        var tagSet;

        // TODO use real parsing.
        if(req.query.tags)
            tagSet = util.toSet(JSON.parse('[' + req.query.tags + ']'));

        return ormHelpers.getPosts(models.SellPost, {
            tags: tagSet
        })
        .then(function(sellPosts) {
            res.json(sellPosts);
        });
    })
    .post(function(req, res) {
        var mkPost = req.body.post;
        var tags = req.body.tags;
        var Tp1;
        var thePost;

        return ormHelpers.createPost(models.SellPost, {
            mkPost: mkPost,
            tags: tags
        })
        .then(function(fullPost) {
            thePost = fullPost;
            Tp1 = fullPost.tags;
            return models.WantPost.findAll();
        })
        .then(function(wantPosts) {
            return Promise.map(wantPosts, function(wp) {
                return wp.getTags()
                    .then(function(Tp2) {
                        return matching.match(Tp1, Tp2);
                    })
                    .then(function(matchData) {
                        var rawScore = matching.rawScore(matchData);
                        var normalScore = matching.normalScore(matchData);
                        console.log("matched " + thePost.post.id + " to " + 
                                    wp.id + ": " + rawScore + " (raw), " +
                                    normalScore + " (normalized).");
                    });
            });
        })
        .then(function() {
            res.json(thePost);
        });
    });

router
    .route('/wantposts')
    .get(function(req, res) {
        var tagSet;

        // TODO use real parsing.
        if(req.query.tags)
            tagSet = util.toSet(JSON.parse('[' + req.query.tags + ']'));

        return ormHelpers.getPosts(models.WantPost, {
            tags: tagSet
        })
        .then(function(wantPosts) {
            res.json(wantPosts);
        });
    })
    .post(function(req, res) {
        var mkPost = req.body.post;
        var tags = req.body.tags;

        return ormHelpers.createPost(models.WantPost, {
            mkPost: mkPost,
            tags: tags
        })
        .then(function(fullPost) {
            res.json(fullPost);
        });
    });

router
    .route('/sellposts/:id')
    .get(function(req, res) {
        return ormHelpers.getPost(models.SellPost, parseInt(req.params.id))
            .then(function(post) {
                res.json(post);
            });
    })
    .delete(function(req, res) {
        return models.SellPost.destroy({
            where: {
                id: parseInt(req.params.id)
            }
        })
        .then(function() {
            res.status(204).send();
        });
    });

router
    .route('/wantposts/:id/offers')
    .get(function(req, res) {
        var id = req.params.id;

        return models.WantPost.findOne({
            where: {
                id: id
            },
            include: [{
                model: models.SellPost,
                as: 'offers'
            }]
        })
        .then(function(wp) {
            if(wp == null)
                res.status(404).send('Not found'); // TODO JSON 404 errors
            else
                res.json(wp.offers);
        });
    })
    .post(function(req, res) {
        var sellPostId = req.body.postId;
        var id = req.params.id;

        var theWantPost;

        return models.WantPost.findOne({
            where: {
                id: id
            },
            include: [{
                model: models.SellPost,
                as: 'offers'
            }]
        })
        .then(function(wp) {
            if(wp == null)
                res.status(404).send('Not found');

            theWantPost = wp;

            return theWantPost.addOffer(sellPostId);
        })
        .then(function() {
            return ormHelpers.getPost(models.WantPost, theWantPost.id);
        })
        .then(function(p) {
            res.json(p);
        });
    });

router
    .route('/wantposts/:id')
    .get(function(req, res) {
        return ormHelpers.getPost(models.WantPost, parseInt(req.params.id))
            .then(function(post) {
                res.json(post);
            });
    })
    .delete(function(req, res) {
        return models.WantPost.destroy({
            where: {
                id: parseInt(req.params.id)
            }
        })
        .then(function() {
            res.status(204).send();
        });
    });

router
    .route('/tags')
    .get(function(req, res) {
        return models.Tag.findAll({
            include: [{
                model: models.Tag,
                as: 'metatags',
                attributes: [ "id", "name" ]
            }, {
                model: models.Tag,
                as: 'subtags',
                attributes: [ "id", "name" ]
            }]
        })
        .then(function(tags) {
            res.json(tags);
        });
    })
    .post(function(req, res) {
        var body = req.body;
        var theTag;

        return models.Tag.create({
            name: body.name
        })
        .then(function(tag) {
            theTag = tag;
            return Promise.map(body.tags, function(tagName) {
                return models.Tag.findOne({
                    where: {
                        name: tagName
                    },
                    include: [{
                        model: models.Tag,
                        as: 'metatags'
                    }, {
                        model: models.Tag,
                        as: 'subtags'
                    }]
                })
                .then(function(t) {
                    if(t == null)
                        return models.Tag.create({
                            name: tagName
                        });
                    else
                        return t;
                });
            });
        })
        .then(function(metatags) {
            if(metatags)
                return theTag.addMetatags(metatags);
        })
        .then(function() {
            res.json(theTag);
        });
    });

module.exports = router;
