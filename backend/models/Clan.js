import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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
    type: {
      type: DataTypes.ENUM("caste_mutant", "caste_non_mutant", "clan_neutre"),
      allowNull: false,
      comment: "Type de clan",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Description du clan et de ses activités",
    },
    specialization: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Spécialisation du clan (Ressources, Combat, Exploration, etc.)",
    },
    max_members: {
      type: DataTypes.INTEGER,
      defaultValue: 50,
      comment: "Nombre maximum de membres",
    },
    is_recruitable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "Le clan recrute de nouveaux membres",
    },
  },
  {
    tableName: "clans",
    timestamps: true,
    underscored: true,
  }
);

export default Clan;
