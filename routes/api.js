'use strict';

var express = require('express');
var router = express.Router();
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
    .route('/sellposts')
    .get(function(req, res) {
        return models.SellPost.findAll()
            .then(function(sellPosts) {
                res.json(sellPosts);
            });
    });

router
    .route('/wantposts')
    .get(function(req, res) {
        var q = {
            where: {},
            include: []
        };

        var tagSet;
        if(req.query.tags)
            tagSet = util.toSet(JSON.parse('[' + req.query.tags + ']'));

        // want to find all want posts whose tags are a superset of the given
        // tagSet.
        var p = models.WantPost.findAll()

        if(tagSet)
            p = p.then(function(wantPosts) {
                return Promise.all(
                    wantPosts.map(function(wp) {
                        return wp.getTags()
                            .then(function(wpTags) {
                                if(util.isSubset(
                                    tagSet,
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

        return p
            .then(function(wantPosts) {
                res.json(wantPosts);
            });
    })
    .post(function(req, res) {
        var mkPost = req.body.post;
        var tags = req.body.tags;

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
                return models.WantPost.create(mkPost);
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
                return ormHelpers.getPost(models.WantPost, thePost.id);
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
    });

router
    .route('/wantposts/:id')
    .get(function(req, res) {
        return ormHelpers.getPost(models.WantPost, parseInt(req.params.id))
            .then(function(post) {
                res.json(post);
            });
    });

router
    .route('/tags')
    .get(function(req, res) {
        return models.Tag.findAll()
            .then(function(tags) {
                res.json(tags);
            });
    });

module.exports = router;
