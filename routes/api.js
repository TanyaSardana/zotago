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
        return models.Tag.findAll()
            .then(function(tags) {
                res.json(tags);
            });
    });

module.exports = router;
