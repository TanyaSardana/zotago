'use strict';

var debug = require('debug')('zotago:auth');
var models = require('../models');
var facebook = require('./facebook.js');
var cache = require('./cache.js');
var shortid = require('shortid');

function AlreadyRegisteredError(message) {
    this.message = message;
    this.name = "AlreadyRegisteredError";
    Error.captureStackTrace(this, AlreadyRegisteredError);
}
AlreadyRegisteredError.prototype = Object.create(Error.prototype);
AlreadyRegisteredError.prototype.constructor = AlreadyRegisteredError;

function NoSuchAccountError(message) {
    this.message = message;
    this.name = "NoSuchAccountError";
    Error.captureStackTrace(this, NoSuchAccountError);
}
NoSuchAccountError.prototype = Object.create(Error.prototype);
NoSuchAccountError.prototype.constructor = NoSuchAccountError;

/**
 * Exchanges a browser token for a server token and fetches the /me endpoint.
 *
 * @param string shortToken -- The browser token to exchange for a server
 * token.
 * @return object -- An object representing the result of the basic exchange.
 * It has the fields `me` and `longToken`.
 */
function basicFacebookExchange(shortToken) {
    var data = {};

    debug('Performing facebook token exchange');

    // exchange the browser token for the server token
    return facebook.exchangeToken(shortToken)
        .then(function(response) {
            data.longToken = response.access_token;

            // resolve the FB object (it's a promise)
            return facebook.FB;
        })
        .then(function(fb) {
            // Use the FB object to perform the request for the /me endpoint,
            // to get basic information about the user.
            return fb.api('/me', 'GET', {
                access_token: data.longToken,
                fields: 'id,first_name,last_name,email'
            });
        })
        .then(function(me) {
            // store that information in the data object and return it.
            data.me = me;
            return data;
        });
}

/**
 * Creates a new zotago token and associates it with the given accountId.
 * To be called by authentication handlers after fetching the account from the
 * database.
 *
 * @param {integer} accountId - The ID of the account that the zotago token
 * will be associated with.
 * @return {Promise.<string>} - The zotago token.
 */
function newCachedZotagoToken(accountId) {
    var zotagoToken = shortid.generate();
    debug('created zotago token ' + zotagoToken);
    return cache.set('zotagoToken:' + zotagoToken, accountId)
        .then(function() {
            return zotagoToken;
        });
}

var registrationHandlers = {
    /**
     * Registers an account using information provided by Facebook.
     *
     * @param {object} authReq - The registration request object.
     * @param {string} authReq.shortToken - The Facebook browser token obtained
     * by the client a priori.
     * @param {string} authReq.username - The username to give the account.
     * @return {Promise.<string|null>} - Resolves to a zotago token that can be
     * used to make API calls on behalf of the authenticated user.
     */
    facebook: function(authReq) {
        var shortToken = authReq.shortToken;
        var username = authReq.username;

        debug('registering with Facebook');

        return basicFacebookExchange(shortToken)
            .then(function(fbData) {
                return models.Account.create({
                    username: username,
                    firstName: fbData.me.first_name,
                    lastName: fbData.me.last_name,
                    email: fbData.me.email ? fbData.me.email : null,
                    FacebookAccount: {
                        accessToken: fbData.longToken,
                        userId: fbData.me.id
                    }
                }, {
                    include: [ models.FacebookAccount ]
                });
            })
            .then(function(account) {
                return newCachedZotagoToken(account.id);
            });
    }
};

var loginHandlers = {
    debug: function(authReq) {
        // TODO ABSOLUTELY REMOVE THIS HANDLER BEFORE GOING INTO PRODUCTION

        var username = authReq.username;

        debug('logging with with unsafe debug');

        if(!username)
            return null;

        return models.Account.findOne({
            where: {
                username: username
            }
        })
        .then(function(account) {
            if(!account) {
                // If there's account, then the facebook login strategy has
                // failed.
                throw new NoSuchAccountError(
                    "No account for this user.");
            }

            return newCachedZotagoToken(account.id);
        });
    },
    facebook: function(authReq) {
        var shortToken = authReq.shortToken;
        var fbData;
        var userId;
        var fbAccount;
        var zotagoToken;

        debug('logging in with Facebook');

        // To perform a basic facebook login, we first do a basic token
        // exchange with facebook to get the server token and fetch the /me
        // endpoint for the user.
        // The /me endpoint gives us among other things in id that is unique to
        // that facebook user. Using this ID, we can look up rows in the
        // FacebookAccount table of our database. If a row exists, then the
        // facebook user has an associated zotago account that is given by the
        // `accountId` column of the returned row.
        // It then suffices to look up that account row and return it.

        return basicFacebookExchange(shortToken)
            .then(function(basicFbData) {
                fbData = basicFbData;

                return models.Account.findOne({
                    include: [
                        {
                            model: models.FacebookAccount,
                            where: {
                                userId: fbData.me.id,
                            },
                        }
                    ]
                });
            })
            .then(function(account) {
                if(!account) {
                    // If there's account, then the facebook login strategy has
                    // failed.
                    throw new NoSuchAccountError(
                        "No facebook account for this user.");
                }

                return newCachedZotagoToken(account.id);
            });
    }
};

/**
 * Parses the value of an HTTP Authorization header.
 *
 * @param {string} authorization - The header value to parse.
 * @return {object} - Has two fields: `type` contains the authentication type,
 * which is Zotago under normal circumstances; `token` contains the Zotago
 * token. If the input is incorrectly formatted, the result is `null`.
 */
function parseAuthorization(authorization) {
    var authParts = authorization.split(" ");

    var type = authParts[0];
    var token = authParts[1];

    if(!type || !token)
        return null;

    return {
        type: authParts[0],
        token: authParts[1]
    };
}

/**
 * Checks whether a given token is valid to make API calls.
 *
 * If the token is able to make API calls, returns the ID of the account of the
 * associated user or `true` if the token is an administrative-level token.
 *
 * If the token is invalid, returns false.
 */
function checkToken(token) {
    return cache.get('zotagoToken:' + token)
        .then(function(v) {
            debug('successfully looked up zotago token ' + token);
            return v;
        })
        .catch(function() {
            debug('failed to look up zotago token ' + token);
            return false;
        });
}

/**
 * An express middleware that will use an HTTP Authorization header to try to
 * fetch a user account from the database. If the account can be found, then
 * it will be made available in the request object under the `account` field.
 */
function requiresAuth(req, res, next) {
    var authorization = req.get('Authorization');
    if(typeof authorization === 'undefined') {
        res.status(401).send('This resource requires authentication.');
        return;
    }

    var authInfo = parseAuthorization(authorization);
    if(authInfo.type !== 'Zotago') {
        res.status(401).send('The given authorization type is not supported.');
        return;
    }

    return checkToken(authInfo.token)
        .then(function(accountId) {
            if(!accountId) {
                res.status(401).send(
                    'The given authentication token is invalid.');
                return;
            }

            return models.Account.findById(accountId)
        })
        .then(function(account) {
            if(!account) {
                res.status(401).send(
                    'There is no account associated with this token.');
                return;
            }

            req.account = account;
            return next();
        });
}

module.exports = {
    loginHandlers: loginHandlers,
    registrationHandlers: registrationHandlers,
    middleware: {
        requiresAuth: requiresAuth
    },
    checkToken: checkToken
};
