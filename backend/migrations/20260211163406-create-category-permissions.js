'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('category_permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'forum_categories',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      permission: {
        type: Sequelize.ENUM(
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
      grantee_type: {
        type: Sequelize.ENUM(
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
      grantee_id: {
        type: Sequelize.STRING(36),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('category_permissions', ['category_id']);
    await queryInterface.addIndex('category_permissions', ['grantee_type']);
    await queryInterface.addIndex(
      'category_permissions',
      ['category_id', 'permission', 'grantee_type', 'grantee_id'],
      {
        unique: true,
        name: 'unique_category_permission',
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('category_permissions');
  },
};
