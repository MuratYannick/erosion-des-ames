'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const SALT_ROUNDS = 12;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [5, 50],
          msg: 'Le nom d\'utilisateur doit contenir au moins 5 caractères',
        },
        is: {
          args: /^[a-zA-Z0-9]([a-zA-Z0-9]|[_ -](?=[a-zA-Z0-9]))*$/,
          msg: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, espaces, underscores et tirets (pas en début/fin ni consécutifs)',
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'L\'adresse email n\'est pas valide',
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
          msg: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
        },
      },
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'MODERATOR', 'GAME_MASTER', 'PLAYER'),
      allowNull: false,
      defaultValue: 'PLAYER',
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    emailVerificationExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    acceptedCgu: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    acceptedRules: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    acceptedCguAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    acceptedRulesAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'users',
    underscored: true,
    paranoid: true,
    timestamps: true,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
      active: {
        where: { isActive: true },
      },
      verified: {
        where: { isEmailVerified: true },
      },
    },
  });

  // Hooks
  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
    }
  });

  // Instance methods
  User.prototype.validatePassword = async function (plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
  };

  User.prototype.generateEmailVerificationToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = token;
    this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return token;
  };

  User.prototype.generatePasswordResetToken = function () {
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = token;
    this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    return token;
  };

  User.prototype.generateAuthToken = function () {
    const { signToken } = require('../utils/jwt');
    return signToken(this.id);
  };

  return User;
};
