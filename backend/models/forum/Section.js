import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Section = sequelize.define(
  "Section",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    // Relations
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    parent_section_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "sections",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    faction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "factions",
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "Faction propriétaire de la section (hérité de la section parent si non spécifié)",
    },
    clan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "clans",
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "Clan propriétaire de la section (hérité de la section parent si non spécifié)",
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "Section publique ou privée (hérité de la section parent si non spécifié)",
    },
    is_locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Section verrouillée - empêche la création de topics et sous-sections",
    },
  },
  {
    tableName: "sections",
    timestamps: true,
    underscored: true,
  }
);

export default Section;
