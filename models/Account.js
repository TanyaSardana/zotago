'use strict';
module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.define('Account', {
        email: {
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
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Account.hasMany(models.WantPost, {
                    as: 'wantPosts',
                    foreignKey: 'creatorId'
                });

                Account.hasMany(models.SellPost, {
                    as: 'sellPosts',
                    foreignKey: 'creatorId'
                });

                Account.hasOne(models.FacebookAccount, {
                    foreignKey: 'accountId'
                });
            }
        }
    });
    return Account;
};
