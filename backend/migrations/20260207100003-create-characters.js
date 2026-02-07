'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('characters', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
      ethnicity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ethnicities',
          key: 'id',
        },
        onDelete: 'RESTRICT',
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
      clan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'clans',
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
      avatar: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      appearance: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      personality: {
        type: Sequelize.TEXT,
        allowNull: true,
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

    await queryInterface.addIndex('characters', ['user_id']);
    await queryInterface.addIndex('characters', ['ethnicity_id']);
    await queryInterface.addIndex('characters', ['faction_id']);
    await queryInterface.addIndex('characters', ['clan_id']);
    await queryInterface.addIndex('characters', ['status']);
    await queryInterface.addIndex('characters', ['is_active']);
    await queryInterface.addIndex('characters', ['approved_by']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('characters');
  },
};
