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

        return ormHelpers.createPost(models.SellPost, {
            mkPost: mkPost,
            tags: tags
        })
        .then(function(fullPost) {
            res.json(fullPost);
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
