'use strict';

/**
 * A wrapper around nodemailer.
 */

// TODO unset this when the SMTP server that is used actually has a legit TLS
// certificate.
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var emailConfig = require('../config/email.json');
var nodemailer = require('nodemailer');
var transporter
    = nodemailer.createTransport(
        emailConfig.transportConfig,
        emailConfig.defaults
    );

/**
 * Send an email.
 *
 * @param {object} options - Options of the email to send.
 * @param {object} options.to - The recipient email address.
 * @param {object} options.from - The indicated sender address.
 * @param {object} options.subject - The email subject line.
 * @param {object} options.text - The plain text contents of the email, if any.
 * @param {object} options.html - The HTML contents of the email, if any.
 */
var sendMail = function(options) {
    return transporter.sendMail(options);
}

module.exports = {
    sendMail: sendMail
};
