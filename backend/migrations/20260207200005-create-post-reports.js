'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('post_reports', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'forum_posts',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      reason: {
        type: Sequelize.ENUM('spam', 'offensive', 'off_topic', 'other'),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'reviewed', 'dismissed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      reviewed_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      reviewed_at: {
        type: Sequelize.DATE,
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

    await queryInterface.addIndex('post_reports', ['post_id']);
    await queryInterface.addIndex('post_reports', ['user_id']);
    await queryInterface.addIndex('post_reports', ['status']);
    await queryInterface.addIndex('post_reports', ['reviewed_by']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('post_reports');
  },
};
