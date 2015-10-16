'use strict';
module.exports = function(sequelize, DataTypes) {
    var SellPost = sequelize.define('SellPost', {
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        externalUrl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        classMethods: {
            associate: function(models) {
                SellPost.belongsToMany(models.Tag, {
                    through: models.SellPostTag,
                    as: 'tags',
                    foreignKey: 'sellPostId',
                    otherKey: 'tagId'
                });

                SellPost.belongsToMany(models.WantPost, {
                    through: models.Offer,
                    as: 'offers',
                    foreignKey: 'sellPostId',
                    otherKey: 'wantPostId'
                });

                SellPost.belongsToMany(models.Account, {
                    through: models.SellPostFollower,
                    as: 'followers',
                    foreignKey: 'postId',
                    otherKey: 'accountId'
                });

                SellPost.belongsTo(models.Account, {
                    as: 'creator'
                });
            }
        }
    });
    return SellPost;
}
