'use strict';

// Some basic functions that we want in the core util module.

// Definitely move these two to a utils module
function toSet(array) {
    var s = {};
    array.forEach(function(x) {
        s[x] = true;
    });

    return s;
}
module.exports.toSet = toSet;

function isSubset(small, big) {
    try {
        Object.keys(small).forEach(function(k) {
            if(!big[k])
                throw false;
        });
    }
    catch(f) {
        if(typeof f === 'boolean') {
            return f;
        } else
            throw f;
    }

    return true;
}
module.exports.isSubset = isSubset;
