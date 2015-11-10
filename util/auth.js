'use strict';

var models = require('../models');
var fb = require('./facebook.js');

var handlers = {
    facebook: function(authReq) {
        var shortToken = authReq.shortToken;

        return fb.exchangeToken(shortToken)
            .then(function(response) {
                console.log(response);
                // TODO actually return the long-lived access token
                return {
                    accessToken: response
                };
            });
    }
};

module.exports = {
    handlers: handlers
};
