'use strict';

/**
 * The matching algorithm.
 */

var models = require('../models');
var events = require('./events');
var mailer = require('./mailer');
var zotagoConfig = require('../config/gottafindit.json');

var alpha = 1.0;
var beta = 0.5;
var gamma = 0.25;
var delta = 0.125;

var Promise = require('bluebird');

/**
 * Computes the match value between two tags.
 *
 * If the tags are exactly the same, then the match value is 1; else, it is
 * 0.
 *
 * @param {object} t1 - The first tag.
 * @param {object} t2 - The second tag.
 * @return {integer} - The match value of the two tags.
 */
function f(t1, t2) {
    return t1.id === t2.id ? 1 : 0;
}

/**
 * Computes the match data between two sets of tags. This data can in turn be
 * used to compute a raw score suitable for ranking searches, or a normalized
 * score suitable for deciding whether to send notifications.
 *
 * The algorithm works by counting the following quantities:
 *     q_alpha: the tags in p1 that are in p2
 *     q_beta: the tags in p1 that are in M(p2)
 *     q_gamma: the tags in M(p1) that are in p2
 *     q_delta: the tags in M(p1) that are in M(p2)
 *
 * where
 *     p1: the source set of tags
 *     p2: the target set of tags
 *     M(P): denotes the union of the sets of metatags for each tag in P.
 *
 * Multiplying each count by exponentially decreasing weights and summing gives
 * the total raw match score.
 *
 * These weights are presently called "alpha", "beta", "gamma", and "delta".
 *
 * This score should be normalized somehow according to |Tp1| and |Tp2|. A
 * normalization scheme is currently implemented, although it probably isn't
 * very good. We simply divide the raw match score by the total count of
 * matched tags.
 *
 * @param {array} Tp1 - The source tag set.
 * @param {array} Tp2 - The target tag set.
 * @return {MatchData} - A match dataset representing the matching between two
 * the two sets of tags.
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

/**
 * Computes the raw match score on a match dataset.
 *
 * @param {MatchData} matchData - The match data.
 * @return {float} - The raw match score represented by the match dataset.
 */
function rawScore(matchData) {
    return alpha * matchData.match.alpha
        + beta * matchData.match.beta
        + gamma * matchData.match.gamma
        + delta * matchData.match.delta;
}

/**
 * Computes a normalized match score on a match dataset.
 *
 * @param {MatchData} matchData - The match data.
 * @param {float} - The normalized match score represented by the match
 * dataset.
 */
function normalScore(matchData) {
    var d =
        matchData.count.alpha +
        matchData.count.beta +
        matchData.count.gamma +
        matchData.count.delta;

    return rawScore(matchData) / d;
}

/**
 * Computes the matching score for a new post against all existing posts of a
 * given post model class.
 *
 * This function will fetch all the posts of the given target class and compute
 * matching data for each of them against the given full source post. The match
 * data that is computed is persisted to the database as Match objects.
 *
 * For each match that is computed, the {@link events.eventTypes.MATCH_MADE}
 * event is raised.
 *
 * @param {FullPost} fullSourcePost - The full post object representing the
 * source post.
 * @param {models.Post} targetPostModel - The model class of the target posts.
 * @return {Promise.<Array.<Match>>} - A promise that resolves to the array of
 * Match objects that have been created.
 */
var makeMatches = function(fullSourcePost, targetPostModel, options) {
    var sourcePost = fullSourcePost.post;
    var Tp1 = fullSourcePost.tags;

    var makeMatch = null;
    var raiseMatchEvent = null;

    if(options.sourceIs === "want") {
        raiseMatchEvent = function(targetPost, matchData) {
            events.raise(events.eventTypes.MATCH_MADE, matchData, {
                wantPost: sourcePost,
                sellPost: targetPost,
            });
        }

        makeMatch = function(sourceId, targetId, rawScore, normalScore) {
            return models.Match.create({
                wantPostId: sourceId,
                sellPostId: targetId,
                rawScore: rawScore,
                normalScore: normalScore,
            });
        };
    }
    else if(options.sourceIs === "sell") {
        raiseMatchEvent = function(targetPost, matchData) {
            events.raise(events.eventTypes.MATCH_MADE, matchData, {
                wantPost: targetPost,
                sellPost: sourcePost,
            });
        }

        makeMatch = function(sourceId, targetId, rawScore, normalScore) {
            return models.Match.create({
                wantPostId: targetId,
                sellPostId: sourceId,
                rawScore: rawScore,
                normalScore: normalScore,
            });
        };
    }
    else
        throw new Error("Invalid value for option sourceIs.");

    return targetPostModel.findAll()
        .then(function(targetPosts) {
            return Promise.map(targetPosts, function(targetPost) {
                return targetPost.getTags()
                    .then(function(Tp2) {
                        return matchCount(Tp1, Tp2);
                    })
                .then(function(matchData) {
                    var rs = rawScore(matchData);
                    var ns = normalScore(matchData);

                    raiseMatchEvent(targetPost, matchData);
                    return makeMatch(
                            sourcePost.id,
                            targetPost.id,
                            rs,
                            ns
                    );
                });
            });
        });
}

events.on(events.eventTypes.MATCH_MADE, function(matchData, options) {
    var wantPost = options.wantPost;
    var sellPost = options.sellPost;

    if(normalScore(matchData) < zotagoConfig.matchThreshold)
        return;

    console.log("STUB: MATCH_MADE event handler");
    // TODO get email address of wanter and seller from database
    // dispatch HTML email by rendering templates.
});

module.exports = {
    match: matchCount,
    rawScore: rawScore,
    normalScore: normalScore,
    makeMatches: makeMatches,
};
