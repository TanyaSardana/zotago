'use strict';
module.exports = function(sequelize, DataTypes) {
    var WantPostTag = sequelize.define('WantPostTag', {
        wantPostId: {
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
        }
    });
    return WantPostTag;
}
