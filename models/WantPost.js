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
        },
        creatorId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                WantPost.belongsToMany(models.Tag, {
                    through: models.WantPostTag,
                    as: 'tags',
                    foreignKey: 'wantPostId',
                    otherKey: 'tagId'
                });

                WantPost.belongsToMany(models.SellPost, {
                    through: models.Offer,
                    as: 'offers',
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
                    as: 'creator',
                    foreignKey: 'creatorId'
                });
            }
        }
    });
    return WantPost;
}
