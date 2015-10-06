'use strict';
module.exports = function(sequelize, DataTypes) {
    var WantPostTag = sequelize.define('WantPostTag', {
    }, {
        classMethods: {
            associate: function(models) {
            }
        }
    });
    return WantPostTag;
}
