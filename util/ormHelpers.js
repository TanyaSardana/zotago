'use strict';

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
