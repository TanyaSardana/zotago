'use strict';

var fbConfig = require('../config/facebook.json');
var request = require('request');
var Promise = require('bluebird');

module.exports = {
    exchangeToken: function(shortToken) {
        return new Promise(function(resolve, reject) {
            request({
                uri: "https://graph.facebook.com/oauth/access_token",
                qs: {
                    grant_type: "fb_exchange_token",
                    client_id: fbConfig.appId,
                    client_secret: fbConfig.appSecret,
                    fb_exchange_token: shortToken
                }
            }, function(error, msg, response) {
                if(error)
                    reject(error);
                resolve(response);
            });
        });
    }
};
