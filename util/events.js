'use strict';

/**
 * Map from event names to arrays of handlers.
 */
var handlers = {};

/**
 * Registers an event handler to be run for a given event.
 */
var on = function(eventName, callback) {
    if(typeof handlers[eventName] === 'undefined')
        handlers[eventName] = [];
    handlers[eventName].push(callback);
}

/**
 * Raises a given event.
 */
var raise = function(eventName) {
    var args = Array.prototype.slice.call(arguments, 1);
    if(typeof handlers[eventName] === 'undefined')
        return;

    // Set the event handlers to be run at the next tick.
    setImmediate(function() {
        handlers[eventName].forEach(function(f) {
            f.apply(null, args);
        });
    });
}

/**
 * The event types that currently exist.
 */
var eventTypes = {
    CREATE_WANT_POST: "CREATE_WANT_POST",
    CREATE_SELL_POST: "CREATE_SELL_POST",
    FOLLOW_WANT_POST: "FOLLOW_WANT_POST",
    FOLLOW_SELL_POST: "FOLLOW_SELL_POST",
    MATCH_MADE: "MATCH_MADE",
};

// Register some dummy events for creating posts.

on(eventTypes.CREATE_WANT_POST, function(fullPost) {
    var wantPost = fullPost.post;
    var creator = fullPost.creator;

    console.log(
            "Want post " + wantPost.id + " " +
            "created by " + creator.firstName + " " + creator.lastName
    );
});

on(eventTypes.CREATE_SELL_POST, function(fullPost) {
    var sellPost = fullPost.post;
    var creator = fullPost.creator;

    console.log(
            "Sell post " + sellPost.id + " " +
            "created by " + creator.firstName + " " + creator.lastName
    );
});

module.exports = {
    eventTypes: eventTypes,
    raise: raise,
    on: on
};
