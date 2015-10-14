'use strict';
module.exports = function(sequelize, DataTypes) {
    var SellPostTag = sequelize.define('SellPostTag', {
        sellPostId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        tagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    }, {
        classMethods: {
            associate: function(models) {
            }
        },
        timestamps: false
    });
    return SellPostTag;
}
