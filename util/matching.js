'use strict';

var models = require('../models');

var alpha = 1.0;
var beta = 0.5;
var gamma = 0.25;
var delta = 0.125;

var Promise = require('bluebird');

function f(t1, t2) {
    return t1.id === t2.id ? 1 : 0;
}

/**
 * Computes the match data between two sets of tags. This data can in turn be
 * used to compute a raw score suitable for ranking searches, or a normalized
 * score suitable for deciding whether to send notifications.
 *
 * The algorithm works by counting the following quantities:
 *     the tags in p1 that are in p2
 *     the tags in p1 that are in M(p2)
 *     the tags in M(p1) that are in p2
 *     the tags in M(p1) that are in M(p2)
 *
 * Multiplying by exponentially decreasing weights and summing gives the total
 * raw match score.
 *
 * This score should be normalized somehow according to |Tp1| and |Tp2|.
 */
function matchCount(Tp1, Tp2) {
    // TODO optimize fetching sets of metatags by using a single SQL statement.
    var Mp1, Mp2;

    var result = {
        count: {
            alpha: 0,
            beta: 0,
            gamma: 0,
            delta: 0
        },
        match: {
            alpha: 0,
            beta: 0,
            gamma: 0,
            delta: 0
        }
    };

    return Promise.map(Tp1, function(t) {
        return t.getMetatags();
    })
    .then(function(metatags) {
        Mp1 = metatags;
        return Promise.map(Tp2, function(t) {
            return t.getMetatags();
        });
    })
    .then(function(metatags) {
        Mp2 = metatags;

        console.log(JSON.stringify({
            Tp1: Tp1,
            Tp2: Tp2,
            Mp1: Mp1,
            Mp2: Mp2
        }));

        for(var i = 0; i < Tp1.length; i++) {
            for(var j = 0; j < Tp2.length; j++) {
                result.count.alpha++;
                result.match.alpha += f(Tp1[i], Tp2[j]);
            }

            for(var j = 0; j < Mp2.length; j++) {
                for(var k = 0; k < Mp2[j].length; k++) {
                    result.count.beta++;
                    result.match.beta += f(Tp1[i], Mp2[j][k]);
                }
            }
        }

        for(var i = 0; i < Mp1.length; i++) {
            for(var j = 0; j < Mp1[i].length; j++) {
                for(var k = 0; k < Tp2.length; k++) {
                    result.count.gamma++;
                    result.match.gamma += f(Mp1[i][j], Tp2[k]);
                }

                for(var k = 0; k < Mp2.length; k++) {
                    for(var l = 0; l < Mp2[k].length; l++) {
                        result.count.delta++;
                        result.match.delta += f(Mp1[i][j], Mp2[k][l]);
                    }
                }
            }
        }

        return result;
    });
}

function rawScore(matchData) {
    return alpha * matchData.match.alpha
        + beta * matchData.match.beta
        + gamma * matchData.match.gamma
        + delta * matchData.match.delta;
}

function normalScore(matchData) {
    var d =
        matchData.count.alpha +
        matchData.count.beta +
        matchData.count.gamma +
        matchData.count.delta;

    return rawScore(matchData) / d;
}

module.exports = {
    match: matchCount,
    rawScore: rawScore,
    normalScore: normalScore
};
