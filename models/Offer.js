'use strict';
module.exports = function(sequelize, DataTypes) {
    var Offer = sequelize.define('Offer', {
        sellPostId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        wantPostId: {
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
    return Offer;
}

