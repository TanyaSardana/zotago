'use strict';

var express = require('express');
var router = express.Router();
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
    // TODO definitely move this to a more appropriate module

    var thePost;

    return postModel.findOne({
        where: {
            id: id
        }
    }).then(function(post) {
        thePost = post;
        return thePost.getTags();
    }).then(function(tags) {
        thePost.tags = tags;
        return thePost.getOffers();
    }).then(function(offers) {
        thePost.offers = offers;
        return thePost.getFollowers();
    }).then(function(followers) {
        thePost.followers = followers;
        return thePost.getCreator();
    }).then(function(creator) {
        thePost.creator = creator;
        return thePost;
    });
}

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
        return models.WantPost.findAll()
            .then(function(wantPosts) {
                res.json(wantPosts);
            });
    });

router
    .route('/sellposts/:id')
    .get(function(req, res) {
        return getPost(models.SellPost, req.params.id)
            .then(function(post) {
                res.json(post);
            });
    });

router
    .route('/wantposts/:id')
    .get(function(req, res) {
        return getPost(models.WantPost, req.params.id)
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
