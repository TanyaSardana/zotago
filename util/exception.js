'use strict';

function makeSimpleException(name) {
    var exception = function(message) {
        this.message = message;
        this.name = name;
        Error.captureStackTrace(this, exception);
    }
    exception.prototype = Object.create(Error.prototype);
    exception.prototype.constructor = exception;
    return exception;
}
