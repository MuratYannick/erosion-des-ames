'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('moderation_actions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      action_type: {
        type: Sequelize.ENUM(
          'ban_user',
          'unban_user',
          'mute_user',
          'unmute_user',
          'warn_user',
          'change_role',
          'delete_user',
          'activate_user',
          'deactivate_user',
          'approve_character',
          'reject_character',
          'delete_character',
          'delete_post',
          'delete_topic',
          'lock_topic',
          'unlock_topic',
          'pin_topic',
          'unpin_topic',
          'move_topic',
          'merge_topics',
          'review_report',
          'edit_category',
          'delete_category'
        ),
        allowNull: false,
      },
      moderator_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      target_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      target_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      target_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      details: {
        type: Sequelize.JSON,
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

    await queryInterface.addIndex('moderation_actions', ['moderator_id']);
    await queryInterface.addIndex('moderation_actions', ['target_user_id']);
    await queryInterface.addIndex('moderation_actions', ['action_type']);
    await queryInterface.addIndex('moderation_actions', ['created_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('moderation_actions');
  },
};
