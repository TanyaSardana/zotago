'use strict';

var request = require('request');
var qs = require('querystring');

var config = require('../config/imageSearch.json');

var url = 'https://yboss.yahooapis.com/ysearch/images';
var oauth = {
    consumer_key: config.consumerKey,
    consumer_secret: config.consumerSecret
};

var Promise = require('bluebird');

function makeQueryString (searchQuery) {
    return qs.stringify({
        q: searchQuery,
        format: 'json',
        count: '35'
    });
};
module.exports.makeQueryString = makeQueryString;

function search(searchQuery) {
    return new Promise(function(resolve, reject) {
        request.get({
            url: url + '?' + makeQueryString(searchQuery),
            oauth: oauth,
            json: true
        }, function(e, r, body) {
            if(e)
                reject(e);
            else
                resolve(body);
        });
    });
};
module.exports.search = search;
