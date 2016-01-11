'use strict';

/**
 * This module contains functions concerning the authentication/authorization
 * system used in Zotago.
 *
 * Authentication is currently supported only via Facebook OAuth. Further,
 * authorization is very coarse: either a request is authorized on not.
 * Resource-level authorization is required before release.
 *
 * The auth system uses the concept of _providers_ (auth methods) indexed by
 * names (strings). The `loginHandlers` and `registrationHandlers` dictionaries
 * exported by this module associate the provider name with its handler
 * function. The handlers are functions that take an authorization request and
 * produce a Zotago token. Zotago tokens are used as authentication proof in
 * subsequent requests.
 *
 * This module also exports some express middleware functions to facilitate
 * working with auth in route handlers.
 *
 * Zotago tokens are cached server-side; use of the API is not entirely
 * stateless. See the /util/cache.js module for details of the cache that is
 * currently used.
 *
 * For testing/debugging, a login handler named `debug` is available.
 */

var debug = require('debug')('zotago:auth');
var models = require('../models');
var facebook = require('./facebook.js');
var cache = require('./cache.js');

var shortid = require('shortid');

/**
 * An exception signifying that a post could not be found.
 *
 * @param {string} [message] - A message associated with this exception.
 */
function NoSuchPostError(message) {
    this.message = message;
    this.name = name;
    Error.captureStackTrace(this, NoSuchPostError);
}
NoSuchPostError.prototype = Object.create(Error.prototype);
NoSuchPostError.prototype.constructor = NoSuchPostError;

/**
 * An exception signifying that an account is already registered.
 *
 * @param {string} [message] - A message associated with this exception.
 */
function AlreadyRegisteredError(message) {
    this.message = message;
    this.name = "AlreadyRegisteredError";
    Error.captureStackTrace(this, AlreadyRegisteredError);
}
AlreadyRegisteredError.prototype = Object.create(Error.prototype);
AlreadyRegisteredError.prototype.constructor = AlreadyRegisteredError;

/**
 * An exception signifying that an account is already registered.
 *
 * @param {string} [message] - A message associated with this exception.
 */
function NoSuchAccountError(message) {
    this.message = message;
    this.name = "NoSuchAccountError";
    Error.captureStackTrace(this, NoSuchAccountError);
}
NoSuchAccountError.prototype = Object.create(Error.prototype);
NoSuchAccountError.prototype.constructor = NoSuchAccountError;

/**
 * An exception signifying that a registration request is invalid.
 *
 * @param {string} [message] - A message associated with this exception.
 */
function InvalidRegistrationError(methodName, message) {
    this.message = message;
    this.methodName = methodName;
}
InvalidRegistrationError.prototype = Object.create(Error.prototype);
InvalidRegistrationError.prototype.constructor = InvalidRegistrationError;

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

        if(!username) {
            debug("No username given for Facebook registration.");
            throw new InvalidRegistrationError(
                "facebook",
                "A username is required."
            );
        }

        debug('registering with Facebook');

        // Perform the facebook token exchange to obtain a long token and user
        // information.
        return basicFacebookExchange(shortToken)
            .then(function(fbData) {
                // Create the Account model with the Facebook information and
                // the username.
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
    // TODO ABSOLUTELY REMOVE THIS BEFORE GOING INTO PRODUCTION
    if(token === 'debug')
        return Promise.resolve(1); // just return user id 1

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

            return models.Account.findById(accountId);
        })
        .catch(function(e) {
            res.status(500).json({
                message: "Database error."
            });
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

/**
 * Express middleware. Parses the HTTP Authorization header to pull out a
 * Zotago token and fetches the associated account in the database. The account
 * is then stored in the request object in the field `account`.
 *
 * If no Authorization header is present, the `account` field remains unset and
 * control passes to the next middleware in the stack.
 *
 * If an Authorization header is present, but invalid, an error is given to the
 * client.
 */
function optionalAuth(req, res, next) {
    var authorization = req.get('Authorization');
    if(typeof authorization === 'undefined') {
        debug("no auth (optional): no Authorization header");
        next();
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
        requiresAuth: requiresAuth,
        optionalAuth: optionalAuth,
    },
    checkToken: checkToken,
    NoSuchPostError: NoSuchPostError,
    NoSuchAccountError: NoSuchAccountError,
    AlreadyRegisteredError: AlreadyRegisteredError,
};
