'use strict';

var models = require('../models');
var fb = require('./facebook.js');

var handlers = {
    facebook: function(authReq) {
        var shortToken = authReq.shortToken;

        return fb.exchangeToken(shortToken)
            .then(function(response) {
                console.log(response);
                // TODO return the long-lived access token
            });
    }
};

module.exports = {
    handlers: handlers
};
