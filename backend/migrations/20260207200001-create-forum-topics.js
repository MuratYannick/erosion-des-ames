'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('forum_topics', {
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
      character_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'characters',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      is_pinned: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_locked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      view_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      post_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      last_post_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      last_post_at: {
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
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('forum_topics', ['category_id']);
    await queryInterface.addIndex('forum_topics', ['user_id']);
    await queryInterface.addIndex('forum_topics', ['character_id']);
    await queryInterface.addIndex('forum_topics', ['slug']);
    await queryInterface.addIndex('forum_topics', ['is_pinned']);
    await queryInterface.addIndex('forum_topics', ['is_locked']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('forum_topics');
  },
};
