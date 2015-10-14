'use strict';
module.exports = function(sequelize, DataTypes) {
    var TagTag = sequelize.define('TagTag', {
        subtagId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        metatagId: {
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
    return TagTag;
}
