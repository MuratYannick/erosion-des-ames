import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const SectionPermission = sequelize.define(
  "SectionPermission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sections",
        key: "id",
      },
      onDelete: "CASCADE",
      comment: "Section concernée par la permission spécifique",
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "MODERATOR", "GAME_MASTER", "PLAYER"),
      allowNull: true,
      comment: "Rôle spécifique (si null, s'applique à un user_id)",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      comment: "Utilisateur spécifique (si null, s'applique au rôle)",
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
    inherit_to_subsections: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: "La permission s'applique-t-elle aux sous-sections ?",
    },
  },
  {
    tableName: "section_permissions",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["section_id", "role", "permission_id"],
        name: "idx_section_role_permission",
      },
      {
        fields: ["section_id", "user_id", "permission_id"],
        name: "idx_section_user_permission",
      },
    ],
    validate: {
      roleOrUserNotBoth() {
        if (
          (this.role && this.user_id) ||
          (!this.role && !this.user_id)
        ) {
          throw new Error(
            "Soit role, soit user_id doit être défini, mais pas les deux"
          );
        }
      },
    },
  }
);

export default SectionPermission;
