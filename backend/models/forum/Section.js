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
    // Visibilité par faction (null = visible par tous)
    visible_by_faction_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "factions",
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "Si défini, seule cette faction peut voir la section. Null = visible par tous",
    },
    // Visibilité par clan (null = visible par tous)
    visible_by_clan_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "clans",
        key: "id",
      },
      onDelete: "SET NULL",
      comment: "Si défini, seul ce clan peut voir la section. Null = visible par tous",
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
  },
  {
    tableName: "sections",
    timestamps: true,
    underscored: true,
  }
);

export default Section;
