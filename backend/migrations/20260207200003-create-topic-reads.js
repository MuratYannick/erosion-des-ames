'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('topic_reads', {
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
      last_read_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('topic_reads', ['topic_id', 'user_id'], {
      unique: true,
      name: 'unique_topic_user_read',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('topic_reads');
  },
};
