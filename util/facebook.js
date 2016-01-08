'use strict';

/**
 * A wrapper module for a Facebook library.
 *
 * Most of the Facebook API is provided by the `promise-facebook` library, with
 * one glaring omission, the /oauth/access_token endpoint which is used for
 * exchanging browser tokens for server tokens.
 * As a patch, this module provides the `exchangeToken` function to hit this
 * endpoint.
 *
 * This module initialized the `promise-facebook` library using settings from
 * /config/facebook.json.
 */

var fbConfig = require('../config/facebook.json');
var request = require('request');
var Promise = require('bluebird');
var qs = require('querystring');
var FB = require('promise-facebook')(fbConfig.appId);

module.exports = {
    /**
     * The Facebook API object from the `promise-facebook` library. Note that
     * this attribute is in fact a promise that *resolves* to the actual
     * Facebook API wrapper.
     */
    FB: FB,
    /**
     * Exchanges a Facebook browser token for a server token.
     *
     * @param {string} shortToken - The browser token to exchange.
     * @return {Promise.<object>} - The result of the call to the Facebook
     * /oauth/access_token endpoint.
     */
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
                var q = qs.parse(response);
                if(!q)
                    reject(new Error(
                        "Could not parse Facebook token exchange response"));
                resolve(q);
            });
        });
    }
};
