'use strict';

module.exports = (sequelize, DataTypes) => {
  const Ethnicity = sequelize.define('Ethnicity', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
  }, {
    tableName: 'ethnicities',
    underscored: true,
    paranoid: true,
    timestamps: true,
  });

  Ethnicity.associate = (models) => {
    Ethnicity.hasMany(models.Faction, { foreignKey: 'ethnicityId', as: 'factions' });
    Ethnicity.hasMany(models.Clan, { foreignKey: 'ethnicityId', as: 'clans' });
  };

  return Ethnicity;
};
