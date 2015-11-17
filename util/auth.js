'use strict';

var models = require('../models');
var facebook = require('./facebook.js');
var cache = require('./cache.js');
var shortid = require('shortid');

var handlers = {
    facebook: function(authReq) {
        var shortToken = authReq.shortToken;
        var theLongToken;
        var userId;
        var fbAccount;
        var fbMe;
        var zotagoToken;

        return facebook.exchangeToken(shortToken)
            .then(function(response) {
                theLongToken = response.access_token;
                return facebook.FB;
            })
            .then(function(fb) {
                console.log('going to send facebook request');
                return fb.api('/me', "GET", {
                    access_token: theLongToken,
                    fields: "id,first_name,last_name,email"
                });
            })
            .then(function(me) {
                fbMe = me;
                // TODO refactor this to use findOrCreate
                return models.FacebookAccount.findOne({
                    where: {
                        userId: fbMe.id
                    }
                });
            })
            .then(function(account) {
                if(account) return account;

                return models.Account.create({
                    firstName: fbMe.first_name,
                    lastName: fbMe.last_name,
                    email: fbMe.email ? fmMe.email : null,
                    FacebookAccount: {
                        accessToken: theLongToken,
                        userId: fbMe.id
                    }
                }, {
                    include: [ models.FacebookAccount ]
                });
            })
            .then(function(account) {
                fbAccount = account;
                // TODO use a configuration value for the default ttl for
                // logins, and for token prefix
                zotagoToken = shortid.generate();
                return cache.set(
                    'zotagoToken:' + zotagoToken,
                    account.id);
            })
            .then(function(account) {
                return zotagoToken;
            });
    }
};

module.exports = {
    handlers: handlers,

    /**
     * Checks whether a given token is valid to make API calls.
     *
     * If the token is able to make API calls, returns the ID of the account of
     * the associated user or `true` if the token is an administrative-level
     * token.
     *
     * If the token is invalid, returns false.
     */
    checkToken: function(token) {
        return cache.get('zotagoToken:' + token)
            .then(function(v) {
                return v;
            })
            .catch(function() {
                return false;
            })
    }
};
