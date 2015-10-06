'use strict';
module.exports = function(sequelize, DataTypes) {
    var WantPost = sequelize.define('WantPost', {
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                WantPost.belongsToMany(models.Tag, {
                    through: models.WantPostTag,
                    as: 'tags'
                });

                WantPost.belongsToMany(models.SellPost, {
                    through: models.Offer,
                    as: 'offeredSellPosts',
                    foreignKey: 'wantPostId',
                    otherKey: 'sellPostId'
                });

                WantPost.belongsToMany(models.Account, {
                    through: models.WantPostFollower,
                    as: 'followers',
                    foreignKey: 'postId',
                    otherKey: 'accountId'
                });

                WantPost.belongsTo(models.Account, {
                    as: 'creator'
                });
            }
        }
    });
    return WantPost;
}