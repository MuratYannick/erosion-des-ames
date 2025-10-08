import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Character = sequelize.define(
  "Character",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      comment: "ID de l'utilisateur (null pour les PNJ)",
    },
    faction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "factions",
        key: "id",
      },
      onDelete: "RESTRICT",
      comment: "ID de la faction (null pour les neutres)",
    },
    ethnic_group: {
      type: DataTypes.ENUM("Les Eveillés", "Les Inaltérés"),
      allowNull: false,
      comment: "Groupe ethnique du personnage",
    },
    clan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "clans",
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "Clan du personnage (optionnel)",
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
          msg: "Le nom du personnage doit contenir entre 2 et 50 caractères",
        },
      },
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 100,
      },
    },
    experience: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    health: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      comment: "Points de vie actuels",
    },
    max_health: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      comment: "Points de vie maximum",
    },
    energy: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      comment: "Points d'énergie actuels",
    },
    max_energy: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      comment: "Points d'énergie maximum",
    },
    // Statistiques
    strength: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      comment: "Force physique",
    },
    agility: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      comment: "Agilité et dextérité",
    },
    intelligence: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      comment: "Intelligence et ruse",
    },
    endurance: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
      comment: "Endurance et résistance",
    },
    // Position dans le monde
    position_x: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      comment: "Position X dans le monde",
    },
    position_y: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      comment: "Position Y dans le monde",
    },
    current_zone: {
      type: DataTypes.STRING(100),
      defaultValue: "zone_depart",
      comment: "Zone actuelle du personnage",
    },
    is_alive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Le personnage est vivant",
    },
    death_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: "Nombre de morts du personnage",
    },
    last_death_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date de la dernière mort",
    },
    is_playable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Le personnage est jouable (false pour les PNJ)",
    },
  },
  {
    tableName: "characters",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["faction_id"],
      },
      {
        fields: ["is_alive"],
      },
    ],
  }
);

export default Character;
