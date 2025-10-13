import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Permission = sequelize.define(
  "Permission",
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
      comment: "Nom unique de la permission (ex: section.create, topic.edit)",
    },
    resource_type: {
      type: DataTypes.ENUM(
        "SECTION",
        "SUBSECTION",
        "TOPIC",
        "POST",
        "CATEGORY"
      ),
      allowNull: false,
      comment: "Type de ressource concernée par la permission",
    },
    action: {
      type: DataTypes.ENUM(
        "CREATE",
        "EDIT",
        "DELETE",
        "LOCK",
        "UNLOCK",
        "MOVE",
        "VIEW",
        "PIN",
        "UNPIN"
      ),
      allowNull: false,
      comment: "Action autorisée par la permission",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Description détaillée de la permission",
    },
    is_system: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: "Indique si c'est une permission système (non supprimable)",
    },
  },
  {
    tableName: "permissions",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["resource_type", "action"],
        name: "unique_resource_action",
      },
    ],
  }
);

export default Permission;
