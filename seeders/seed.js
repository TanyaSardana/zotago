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

        models.Account.create({
            email: 'jake@mail.jerrington.me',
            firstName: 'Jake',
            lastName: 'Errington'
        }).then(function(x) {
            jake = x;

            return models.Tag.findOne({
                where: {
                    name: "mcgill"
                }
            });
        }).then(function(x) {
            mcgill = x;

            return models.Tag.findOne({
                where: {
                    name: "blue"
                }
            });
        }).then(function(x) {
            blue = x;

            return models.Tag.findOne({
                where: {
                    name: "shirt"
                }
            });
        }).then(function(x) {
            shirt = x;

            return jake.createWantPost({
                imageUrl: "http://example.com/",
                description: "example want post"
            })
        }).then(function(post) {
            wantPost = post;
            return wantPost.addTags([
                blue,
                shirt,
                mcgill
            ]);
        });
    });
}

models.sequelize.sync({ force: true })
//models.sequelize.sync()
    .then(seedData);
