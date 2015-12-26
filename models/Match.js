'use strict';
module.exports = function(sequelize, DataTypes) {
    var Match = sequelize.define('Match', {
        wantPostId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        sellPostId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        rawScore: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        normalScore: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
    }, {
        classMethods: {
            associate: function(models) {
            },
        },
    });
    return Match;
}
