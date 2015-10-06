'use strict';
module.exports = function(sequelize, DataTypes) {
    var SellPostFollower = sequelize.define('SellPostFollower', {
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
    return SellPostFollower;
}
