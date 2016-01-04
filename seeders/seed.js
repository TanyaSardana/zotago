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
            lastName: 'Errington',
            username: 'jake'
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

            return Promise.all([{
                imageUrl: "http://example.com/want-1",
                description: "example want post"
            }, {
                imageUrl: "http://example.com/want-2",
                description: "a want post with different tags"
            }].map(function(o) {
                return jake.createWantPost(o);
            }));
        })
        .then(function(wantPosts) {
            var wp1 = wantPosts[0];
            var wp2 = wantPosts[1];

            return Promise.all([
                wp1.addTags([
                    blue,
                    shirt,
                    mcgill
                ]),
                wp2.addTags([
                    montreal,
                    scarf,
                    yellow
                ])
            ])
        })
        .then(function() {
            return Promise.all([{
                imageUrl: "http://example.com/sell-1",
                description: "An example sell post."
            }, {
                imageUrl: "http://example.com/sell-2",
                description: "Another example sell post."
            }, {
                imageUrl: "http://example.com/sell-3",
                externalUrl: "http://example.com/external-1",
                description: "A sell post with an external URL."
            }].map(function(o) {
                return jake.createSellPost(o);
            }));
        })
        .then(function(sellPosts) {
            return Promise.all([
                sellPosts[0].addTags([yellow, shirt, mcgill]),
                sellPosts[1].addTags([blue, yellow, shirt]),
                sellPosts[2].addTags([blue, scarf, mcgill])
            ]);
        })
        ;
    })
    ;
}

models.sequelize.sync({ force: true })
//models.sequelize.sync()
    .then(seedData);
