'use strict';

const { verifyToken } = require('../utils/jwt');
const { User, UserSanction } = require('../models');

/**
 * Middleware d'authentification - vérifie le JWT et attache req.user
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware
 */
const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentification requise',
          code: 'NO_TOKEN',
        },
      });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "

    // Vérifier et décoder le token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: {
          message: error.message,
          code: 'INVALID_TOKEN',
        },
      });
    }

    // Récupérer l'utilisateur depuis la base de données
    const user = await User.scope('active').findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Utilisateur non trouvé ou inactif',
          code: 'USER_NOT_FOUND',
        },
      });
    }

    // Attacher l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur dans le middleware authenticate:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Erreur lors de l\'authentification',
        code: 'AUTH_ERROR',
      },
    });
  }
};

/**
 * Middleware d'autorisation - vérifie que l'utilisateur a un des rôles autorisés
 * @param {...string} roles - Liste des rôles autorisés
 * @returns {function} Middleware function
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentification requise',
          code: 'NOT_AUTHENTICATED',
        },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Accès refusé. Permissions insuffisantes.',
          code: 'FORBIDDEN',
        },
      });
    }

    next();
  };
};

/**
 * Middleware d'authentification optionnelle - attache req.user si un token valide est fourni
 * Ne renvoie pas d'erreur si aucun token n'est présent
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Si pas de header, continuer sans utilisateur
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.substring(7);

    // Tenter de vérifier le token
    try {
      const decoded = verifyToken(token);
      const user = await User.scope('active').findByPk(decoded.userId);

      if (user) {
        req.user = user;
      } else {
        req.user = null;
      }
    } catch (error) {
      // Token invalide ou expiré, continuer sans utilisateur
      req.user = null;
    }

    next();
  } catch (error) {
    console.error('Erreur dans le middleware optionalAuth:', error);
    req.user = null;
    next();
  }
};

/**
 * Middleware de vérification du mute - bloque les utilisateurs sous sanction mute active
 * À placer après authenticate sur les routes d'écriture (création de topic, post, etc.)
 */
const checkMute = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    const activeMute = await UserSanction.scope(['active', 'mutes']).findOne({
      where: { userId: req.user.id },
    });

    if (activeMute) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Votre compte est actuellement sous silence (mute). Vous ne pouvez pas publier de contenu.',
          code: 'USER_MUTED',
          expiresAt: activeMute.expiresAt,
        },
      });
    }

    next();
  } catch (error) {
    console.error('Erreur dans le middleware checkMute:', error);
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  optionalAuth,
  checkMute,
};
