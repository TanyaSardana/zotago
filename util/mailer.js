'use strict';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var emailConfig = require('../config/email.json');
var nodemailer = require('nodemailer');
var transporter
    = nodemailer.createTransport(
        emailConfig.transportConfig,
        emailConfig.defaults
    );

var sendMail = function(options) {
    return transporter.sendMail(options);
}

module.exports.sendMail = sendMail;
