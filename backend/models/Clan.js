'use strict';

module.exports = (sequelize, DataTypes) => {
  const Clan = sequelize.define('Clan', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ethnicityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    factionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [2, 50],
          msg: 'Le nom doit contenir entre 2 et 50 caractères',
        },
      },
    },
    emblem: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isPlayable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    background: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    goals: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('draft', 'pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'draft',
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approvedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  }, {
    tableName: 'clans',
    underscored: true,
    paranoid: true,
    timestamps: true,
    scopes: {
      active: {
        where: { isActive: true },
      },
      approved: {
        where: { status: 'approved' },
      },
      pending: {
        where: { status: 'pending' },
      },
      draft: {
        where: { status: 'draft' },
      },
      playable: {
        where: { isPlayable: true },
      },
    },
  });

  // Instance methods
  Clan.prototype.approve = async function (userId) {
    this.status = 'approved';
    this.approvedBy = userId;
    this.approvedAt = new Date();
    this.rejectionReason = null;
    return this.save();
  };

  Clan.prototype.reject = async function (reason) {
    this.status = 'rejected';
    this.rejectionReason = reason;
    this.approvedBy = null;
    this.approvedAt = null;
    return this.save();
  };

  Clan.prototype.archive = async function () {
    this.isActive = false;
    return this.save();
  };

  Clan.associate = (models) => {
    Clan.belongsTo(models.Ethnicity, { foreignKey: 'ethnicityId', as: 'ethnicity' });
    Clan.belongsTo(models.Faction, { foreignKey: 'factionId', as: 'faction' });
    Clan.belongsTo(models.User, { foreignKey: 'approvedBy', as: 'approver' });
  };

  return Clan;
};
