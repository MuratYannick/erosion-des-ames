import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

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
    ethnic_group: {
      type: DataTypes.ENUM("Les Eveillés", "Les Inaltérés"),
      allowNull: true,
      comment: "Groupe ethnique de la faction",
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
        "Nom de l'avant-poste principal (L'Oasis des Transformés, La Citadelle du Renouveau)",
    },
    is_playable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      comment: "La faction peut être choisie par les joueurs",
    },
    leader_clan: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Nom du clan dirigeant de la faction",
    },
    leader_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "clans",
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "ID du clan dirigeant de la faction",
    },
  },
  {
    tableName: "factions",
    timestamps: true,
    underscored: true,
  }
);

export default Faction;
