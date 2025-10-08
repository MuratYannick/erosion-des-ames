import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Topic = sequelize.define(
  "Topic",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    is_pinned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    views_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    author_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Nom de l'auteur préservé même si le compte/personnage est supprimé",
    },
    // Relations
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "sections",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    author_user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    author_character_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "characters",
        key: "id",
      },
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "topics",
    timestamps: true,
    underscored: true,
  }
);

export default Topic;
