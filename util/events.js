'use strict';

/**
 * This module exports a simple event system.
 *
 * Handlers can be registered with `on` and events can be raised with `raise`,
 * which will in turn call all handlers associated with a given event.
 *
 * `raise` is asynchronous; the handlers associated with the event will be run
 * at the next tick of the Node event loop.
 */

/**
 * Map from event names to arrays of handlers.
 */
var handlers = {};

/**
 * Registers a handler for an event. Subsequent calls to {@link raise} for the
 * given event will cause the invocation of the given provided handler in
 * addition to any existing handlers that have been registered for the event.
 *
 * @param {string} eventName - The event to register the handler on.
 * @param {function} callback - The function to run in response to the event.
 */
var on = function(eventName, callback) {
    if(typeof handlers[eventName] === 'undefined')
        handlers[eventName] = [];
    handlers[eventName].push(callback);
}

/**
 * Raises a given event.
 *
 * All arguments following the event name are passed to the handlers associated
 * with the event.
 *
 * @param {string} eventName - The name of the event to raise. See {@link
 * eventTypes}.
 * @return {undefined} Nothing.
 */
var raise = function(eventName) {
    var args = Array.prototype.slice.call(arguments, 1);
    if(typeof handlers[eventName] === 'undefined')
        return;

    // TODO should each event handler be scheduled separately within the Node
    // event loop, or is it best to schedule one batch of event processing at
    // once?

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

module.exports = {
    eventTypes: eventTypes,
    raise: raise,
    on: on
};
