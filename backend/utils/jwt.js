'use strict';

const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

/**
 * Génère un token JWT pour un utilisateur
 * @param {string} userId - L'ID de l'utilisateur
 * @returns {string} Le token JWT
 */
const signToken = (userId) => {
  if (!authConfig.jwtSecret) {
    throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
  }

  return jwt.sign(
    { userId },
    authConfig.jwtSecret,
    { expiresIn: authConfig.jwtExpiresIn }
  );
};

/**
 * Vérifie et décode un token JWT
 * @param {string} token - Le token JWT à vérifier
 * @returns {object} Le payload décodé du token
 * @throws {Error} Si le token est invalide ou expiré
 */
const verifyToken = (token) => {
  if (!authConfig.jwtSecret) {
    throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
  }

  try {
    return jwt.verify(token, authConfig.jwtSecret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Le token a expiré');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Le token est invalide');
    }
    throw error;
  }
};

module.exports = {
  signToken,
  verifyToken,
};
