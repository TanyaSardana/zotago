'use strict';

/**
 * This module exports some extremely simple functions for interacting with a
 * cache with promises.
 *
 * The cache is currently implemented as a simple in-memory hashtable keyed on
 * strings. A real cache like Redis should be used instead. The value of this
 * module however is that swapping out the implementations of the hashtable
 * caching functions with something backed by Redis should not break any
 * existing code that interacts with the cache.
 */

// TODO use a real cache.
var cache = {};

function remove(key) {
    console.log("Deleting key '" + key + "'.");
    return new Promise(function(resolve, reject) {
        cache[key] = undefined; 
        resolve();
    });
}

function set(key, value, ttl) {
    console.log("Setting key '" + key + "'");
    return new Promise(function(resolve, reject) {
        cache[key] = value;
        resolve();
    });
}

function get(key) {
    console.log("Fetching key '" + key + "'.");
    return new Promise(function(resolve, reject) {
        if(typeof cache[key] === 'undefined')
            reject(new Error("No such key '" + key + "'."));

        resolve(cache[key]);
    });
}

module.exports = {
    set: set,
    delete: remove,
    get: get
};
