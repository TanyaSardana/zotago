'use strict';

module.exports = function(sequelize, DataTypes) {
    var FacebookAccount = sequelize.define('FacebookAccount', {
        accessToken: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        }
    }, {
        classMethods: {
            associate: function(models) {
                FacebookAccount.belongsTo(models.Account, {
                    foreignKey: 'accountId',
                    targetKey: 'id'
                });
            }
        }
    });
    return FacebookAccount;
};

