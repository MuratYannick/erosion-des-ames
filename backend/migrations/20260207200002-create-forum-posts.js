'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('forum_posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      topic_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'forum_topics',
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
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_first_post: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      quoted_post_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'forum_posts',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      edited_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      edited_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
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

    await queryInterface.addIndex('forum_posts', ['topic_id']);
    await queryInterface.addIndex('forum_posts', ['user_id']);
    await queryInterface.addIndex('forum_posts', ['character_id']);
    await queryInterface.addIndex('forum_posts', ['quoted_post_id']);
    await queryInterface.addIndex('forum_posts', ['edited_by']);
    await queryInterface.addIndex('forum_posts', ['is_first_post']);

    // Add deferred FK constraints for last_post_id
    await queryInterface.addConstraint('forum_categories', {
      fields: ['last_post_id'],
      type: 'foreign key',
      name: 'fk_forum_categories_last_post_id',
      references: { table: 'forum_posts', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint('forum_topics', {
      fields: ['last_post_id'],
      type: 'foreign key',
      name: 'fk_forum_topics_last_post_id',
      references: { table: 'forum_posts', field: 'id' },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('forum_categories', 'fk_forum_categories_last_post_id');
    await queryInterface.removeConstraint('forum_topics', 'fk_forum_topics_last_post_id');
    await queryInterface.dropTable('forum_posts');
  },
};
