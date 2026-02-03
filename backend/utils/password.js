'use strict';

const bcrypt = require('bcrypt');
const authConfig = require('../config/auth');

/**
 * Hash un mot de passe avec bcrypt
 * @param {string} password - Le mot de passe en clair
 * @returns {Promise<string>} Le hash du mot de passe
 */
const hashPassword = async (password) => {
  return bcrypt.hash(password, authConfig.bcryptSaltRounds);
};

/**
 * Compare un mot de passe en clair avec un hash
 * @param {string} password - Le mot de passe en clair
 * @param {string} hash - Le hash à comparer
 * @returns {Promise<boolean>} True si le mot de passe correspond
 */
const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword,
};
