'use strict';
module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.define('Account', {
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fbAccessToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Account.hasMany(models.WantPost, {
                    as: 'wantPosts'
                });

                Account.hasMany(models.SellPost, {
                    as: 'sellPosts'
                });
            }
        }
    });
    return Account;
};
