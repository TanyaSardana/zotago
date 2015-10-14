#!/usr/bin/env node

var models = require('../models');

function seedData() {
    models.Tag.bulkCreate([
        "mcgill",
        "blue",
        "black",
        "yellow",
        "montreal",
        "scarf",
        "shirt",
        "pants",
        "jeans"
    ].map(function(x) {
         return {
             name: x
         };
    })).then(function() {
        var jake;
        var wantPost;
        var mcgill, blue, shirt;
        var montreal, scarf, yellow;

        models.Account.create({
            email: 'jake@mail.jerrington.me',
            firstName: 'Jake',
            lastName: 'Errington'
        })
        .then(function(x) {
            jake = x;

            return models.Tag.findOne({
                where: {
                    name: "mcgill"
                }
            });
        })
        .then(function(x) {
            mcgill = x;

            return models.Tag.findOne({
                where: {
                    name: "blue"
                }
            });
        })
        .then(function(x) {
            blue = x;

            return models.Tag.findOne({
                where: {
                    name: "shirt"
                }
            });
        })
        .then(function(x) {
            shirt = x;

            return models.Tag.findOne({
                where: {
                    name: "montreal"
                }
            });
        })
        .then(function(x) {
            montreal = x;

            return models.Tag.findOne({
                where: {
                    name: "scarf"
                }
            });
        })
        .then(function(x) {
            scarf = x;

            return models.Tag.findOne({
                where: {
                    name: "yellow"
                }
            });
        })
        .then(function(x) {
            yellow = x;

            return jake.createWantPost({
                imageUrl: "http://example.com/",
                description: "example want post"
            });
        })
        .then(function(post) {
            wantPost = post;
            return wantPost.addTags([
                blue,
                shirt,
                mcgill
            ]);
        })
        .then(function() {
            return jake.createWantPost({
                imageUrl: "http://exmaple.com/",
                description: "a want post with different tags"
            });
        })
        .then(function(post) {
            console.log("second post: " + JSON.stringify(post));

            return post.addTags([
                montreal,
                scarf,
                yellow
            ]);
        })
        .then(function(x) {
        })
        ;
    })
    ;
}

models.sequelize.sync({ force: true })
//models.sequelize.sync()
    .then(seedData);
