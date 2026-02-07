'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clans', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ethnicity_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'ethnicities',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      faction_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'factions',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      emblem: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      is_playable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      background: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      goals: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('draft', 'pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'draft',
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      approved_by: {
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

    await queryInterface.addIndex('clans', ['ethnicity_id']);
    await queryInterface.addIndex('clans', ['faction_id']);
    await queryInterface.addIndex('clans', ['status']);
    await queryInterface.addIndex('clans', ['is_active']);
    await queryInterface.addIndex('clans', ['is_playable']);
    await queryInterface.addIndex('clans', ['approved_by']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('clans');
  },
};
