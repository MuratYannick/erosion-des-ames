import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: "Nom du rôle (admin, moderator, game_master, player)",
    },
    label: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Libellé du rôle pour l'affichage",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Description des permissions associées au rôle",
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Niveau hiérarchique du rôle (plus élevé = plus de permissions)",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: "Indique si le rôle est actif",
    },
  },
  {
    tableName: "roles",
    underscored: true,
    timestamps: true,
  }
);

export default Role;
