import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Clan = sequelize.define(
  "Clan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    faction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "factions",
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "NULL pour les clans neutres indépendants",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment:
        "Nom du clan (Les Symbiotes, Les Sentinelles, Les Veilleurs des Ruines, etc.)",
    },
    ethnic_group: {
      type: DataTypes.ENUM("Les Eveillés", "Les Inaltérés"),
      allowNull: true,
      comment: "Groupe ethnique du clan (null pour les clans mixtes)",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Description du clan et de ses activités",
    },
    is_playable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Le clan peut être choisi par les joueurs",
    },
    is_recruitable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Le clan recrute de nouveaux membres",
    },
    leader_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Nom du chef du clan",
    },
    leader_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "characters",
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "ID du personnage chef du clan",
    },
  },
  {
    tableName: "clans",
    timestamps: true,
    underscored: true,
  }
);

export default Clan;
