'use strict';

module.exports = (sequelize, DataTypes) => {
  const CategoryPermission = sequelize.define('CategoryPermission', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permission: {
      type: DataTypes.ENUM(
        'access_category',
        'edit_category',
        'create_subcategory',
        'move_category',
        'create_topic',
        'edit_topic',
        'move_topic',
        'merge_topic'
      ),
      allowNull: false,
    },
    granteeType: {
      type: DataTypes.ENUM(
        'public',
        'player',
        'player_accepted_rules',
        'player_with_character',
        'player_character_faction',
        'player_character_clan',
        'specific_user',
        'specific_character',
        'game_master',
        'moderator'
      ),
      allowNull: false,
    },
    granteeId: {
      type: DataTypes.STRING(36),
      allowNull: true,
    },
  }, {
    tableName: 'category_permissions',
    underscored: true,
    paranoid: false,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['category_id', 'permission', 'grantee_type', 'grantee_id'],
        name: 'unique_category_permission',
      },
    ],
  });

  // Constants
  CategoryPermission.PERMISSIONS = [
    'access_category',
    'edit_category',
    'create_subcategory',
    'move_category',
    'create_topic',
    'edit_topic',
    'move_topic',
    'merge_topic',
  ];

  CategoryPermission.GRANTEE_TYPES = [
    'public',
    'player',
    'player_accepted_rules',
    'player_with_character',
    'player_character_faction',
    'player_character_clan',
    'specific_user',
    'specific_character',
    'game_master',
    'moderator',
  ];

  CategoryPermission.GRANTEE_REQUIRES_ID = [
    'player_character_faction',
    'player_character_clan',
    'specific_user',
    'specific_character',
  ];

  CategoryPermission.associate = (models) => {
    CategoryPermission.belongsTo(models.ForumCategory, {
      foreignKey: 'categoryId',
      as: 'category',
      onDelete: 'CASCADE',
    });

    // Add reverse association on ForumCategory
    models.ForumCategory.hasMany(CategoryPermission, {
      foreignKey: 'categoryId',
      as: 'permissions',
    });
  };

  return CategoryPermission;
};
