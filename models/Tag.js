'use strict';
module.exports = function(sequelize, DataTypes) {
    var Tag = sequelize.define('Tag', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        classMethods: {
            associate: function(models) {
                Tag.belongsToMany(models.WantPost, { 
                    through: models.WantPostTag,
                    as: 'wantPosts',
                    foreignKey: 'tagId',
                    otherKey: 'wantPostId'
                });

                Tag.belongsToMany(models.SellPost, {
                    through: models.SellPostTag,
                    as: 'sellPosts',
                    foreignKey: 'tagId',
                    otherKey: 'sellPostId'
                });

                Tag.belongsToMany(Tag, {
                    through: models.TagTag,
                    as: "metatags",
                    foreignKey: 'subtagId',
                    otherKey: 'metatagId'
                });

                Tag.belongsToMany(Tag, {
                    through: models.TagTag,
                    as: "subtags",
                    foreignKey: 'metatagId',
                    otherKey: 'subtagId'
                });
            }
        }
    });
    return Tag;
}
