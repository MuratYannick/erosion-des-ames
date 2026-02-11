'use strict';

module.exports = (sequelize, DataTypes) => {
  const { Op } = sequelize.Sequelize;

  const UserSanction = sequelize.define('UserSanction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('ban', 'mute'),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    issuedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    startsAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // NULL means the sanction is permanent
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    revokedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'user_sanctions',
    underscored: true,
    // Sanction history must be preserved — no soft delete
    paranoid: false,
    timestamps: true,
    scopes: {
      // Active sanctions that have not yet expired (includes permanent ones)
      active: {
        where: {
          isActive: true,
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: sequelize.Sequelize.fn('NOW') } },
          ],
        },
      },
      bans: {
        where: { type: 'ban' },
      },
      mutes: {
        where: { type: 'mute' },
      },
      // Sanctions that are still marked active but whose expiry date has passed
      // (these should be cleaned up by a scheduled job)
      expired: {
        where: {
          isActive: true,
          expiresAt: {
            [Op.ne]: null,
            [Op.lte]: sequelize.Sequelize.fn('NOW'),
          },
        },
      },
    },
  });

  // Instance method: revoke a sanction before its natural expiry.
  // Sets isActive to false and records who revoked it and when.
  UserSanction.prototype.revoke = async function (revokerId, options = {}) {
    this.isActive = false;
    this.revokedBy = revokerId;
    this.revokedAt = new Date();
    return this.save(options);
  };

  // Instance method: returns true when the sanction has a finite expiry
  // that has already passed (regardless of the isActive flag).
  UserSanction.prototype.isExpired = function () {
    return this.expiresAt !== null && this.expiresAt < new Date();
  };

  UserSanction.associate = (models) => {
    UserSanction.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    UserSanction.belongsTo(models.User, { foreignKey: 'issuedBy', as: 'issuer' });
    UserSanction.belongsTo(models.User, { foreignKey: 'revokedBy', as: 'revoker' });
  };

  return UserSanction;
};
