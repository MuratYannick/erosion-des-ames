import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Faction = sequelize.define(
  "Faction",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      comment: "Nom de la faction (Les Éveillés, Les Purs, etc.)",
    },
    type: {
      type: DataTypes.ENUM("mutant", "non_mutant", "neutre"),
      allowNull: false,
      comment: "Type de faction",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Description détaillée de la faction",
    },
    base_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment:
        "Nom de l'avant-poste principal (L'Oasis des Transformés, La Citadelle Inaltérée)",
    },
    ideology: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Idéologie et croyances de la faction",
    },
    is_playable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "La faction peut être choisie par les joueurs",
    },
  },
  {
    tableName: "factions",
    timestamps: true,
    underscored: true,
  }
);

export default Faction;
