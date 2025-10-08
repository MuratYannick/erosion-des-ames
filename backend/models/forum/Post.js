import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_edited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    edited_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    author_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Nom de l'auteur préservé même si le compte/personnage est supprimé",
    },
    // Relations
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "topics",
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
    tableName: "posts",
    timestamps: true,
    underscored: true,
  }
);

export default Post;
