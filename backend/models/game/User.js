import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: "Ce nom d'utilisateur est déjà pris",
      },
      validate: {
        len: {
          args: [3, 50],
          msg: "Le nom d'utilisateur doit contenir entre 3 et 50 caractères",
        },
        is: {
          args: /^[a-zA-Z0-9_-]+$/,
          msg: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets (-) et underscores (_)",
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: {
        msg: "Cet email est déjà utilisé",
      },
      validate: {
        isEmail: {
          msg: "L'adresse email n'est pas valide",
        },
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "MODERATOR", "GAME_MASTER", "PLAYER"),
      defaultValue: "PLAYER",
      allowNull: false,
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    locked_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    terms_accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    terms_accepted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

export default User;
