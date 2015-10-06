'use strict';
module.exports = function(sequelize, DataTypes) {
    var WantPostFollower = sequelize.define('WantPostFollower', {
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    }, {
        classMethods: {
            associate: function(models) {
            }
        }
    });
    return WantPostFollower;
}
