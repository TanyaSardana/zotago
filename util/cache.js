'use strict';

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
