'use strict';

module.exports = (sequelize, DataTypes) => {
  const Character = sequelize.define('Character', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    ethnicityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    factionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clanId: {
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
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: {
          args: [1],
          msg: "L'âge doit être supérieur ou égal à 1",
        },
      },
    },
    appearance: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    personality: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'characters',
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
      playersCharacters: {
        where: {
          userId: { [sequelize.Sequelize.Op.ne]: null },
        },
      },
    },
  });

  // Instance methods
  Character.prototype.approve = async function (userId) {
    this.status = 'approved';
    this.approvedBy = userId;
    this.approvedAt = new Date();
    this.rejectionReason = null;
    return this.save();
  };

  Character.prototype.reject = async function (reason) {
    this.status = 'rejected';
    this.rejectionReason = reason;
    this.approvedBy = null;
    this.approvedAt = null;
    return this.save();
  };

  Character.prototype.archive = async function () {
    this.isActive = false;
    return this.save();
  };

  Character.associate = (models) => {
    Character.belongsTo(models.Ethnicity, { foreignKey: 'ethnicityId', as: 'ethnicity' });
    Character.belongsTo(models.Faction, { foreignKey: 'factionId', as: 'faction' });
    Character.belongsTo(models.Clan, { foreignKey: 'clanId', as: 'clan' });
    Character.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' });
    Character.belongsTo(models.User, { foreignKey: 'approvedBy', as: 'approver' });
  };

  return Character;
};
