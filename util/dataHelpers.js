var fs = require('fs');
var shortid = require('shortid');
var Promise = require('bluebird');

module.exports = {
    /**
     * Parses a data Url into a {@link Buffer}.
     *
     * @param {string} dataUrl -- The data URL to parse.
     */
    parseDataUrl: function(dataUrl) {
        return new Buffer(dataUrl.split(",")[1], 'base64');
    },

    /**
     * Saves the given buffer as an image with a unique ID and returns the
     * generated ID. This ID can be used in {@link getImageUrl} to retrieve a
     * URL for that image.
     *
     * @param {Buffer} buf -- the buffer to write out
     * @return {Object} -- an object describing the generated image
     */
    saveImage: function(buf) {
        var id = shortid.generate() + '.png';

        return new Promise(
            function(resolve, reject) {
                // TODO use an environment variable / config to say which
                // directory to save the uploads.
                fs.writeFile("uploads/img/" + id, buf, function(err) {
                    if(err) reject(err);
                    else resolve({
                        id: id
                    });
                });
            }
        );
    },

    /**
     * Gets an internal URL for an image with a given ID.
     */
    getImageUrl: function(imageId) {
        return '/uploads/' + imageId;
    }
};
