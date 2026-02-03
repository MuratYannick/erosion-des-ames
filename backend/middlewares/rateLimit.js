'use strict';

const rateLimit = require('express-rate-limit');

/**
 * Rate limiter pour les tentatives de connexion
 * 5 tentatives par 15 minutes par IP
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requêtes maximum
  message: {
    success: false,
    error: {
      message: 'Trop de tentatives de connexion. Réessaye dans 15 minutes.',
      code: 'TOO_MANY_LOGIN_ATTEMPTS',
    },
  },
  standardHeaders: true, // Retourne les infos de rate limit dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

/**
 * Rate limiter pour les inscriptions
 * 3 inscriptions par heure par IP
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 requêtes maximum
  message: {
    success: false,
    error: {
      message: 'Trop de tentatives d\'inscription. Réessaye dans 1 heure.',
      code: 'TOO_MANY_REGISTER_ATTEMPTS',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne compte que les échecs
  skipFailedRequests: false,
});

/**
 * Rate limiter pour les demandes de réinitialisation de mot de passe
 * 3 demandes par heure par IP
 */
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // 3 requêtes maximum
  message: {
    success: false,
    error: {
      message: 'Trop de demandes de réinitialisation. Réessaye dans 1 heure.',
      code: 'TOO_MANY_RESET_ATTEMPTS',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

/**
 * Rate limiter général pour les endpoints d'authentification
 * 20 requêtes par 15 minutes par IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requêtes maximum
  message: {
    success: false,
    error: {
      message: 'Trop de requêtes. Réessaye dans quelques minutes.',
      code: 'TOO_MANY_REQUESTS',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

module.exports = {
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  authLimiter,
};
