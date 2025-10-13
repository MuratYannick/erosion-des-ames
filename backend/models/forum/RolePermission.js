import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const RolePermission = sequelize.define(
  "RolePermission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "MODERATOR", "GAME_MASTER", "PLAYER"),
      allowNull: false,
      comment: "Rôle utilisateur (correspondant à User.role)",
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "permissions",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    granted: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: "true = permission accordée, false = permission refusée",
    },
  },
  {
    tableName: "role_permissions",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["role", "permission_id"],
        name: "unique_role_permission",
      },
    ],
  }
);

export default RolePermission;
