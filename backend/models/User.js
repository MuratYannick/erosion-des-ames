import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

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
        isAlphanumeric: {
          msg: "Le nom d'utilisateur ne peut contenir que des lettres et des chiffres",
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
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
