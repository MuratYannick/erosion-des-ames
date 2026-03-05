'use strict';

/**
 * Centralise les mocks communs réutilisés dans les fichiers d'intégration.
 * À appeler via jest.mock() au niveau module dans chaque fichier de test.
 *
 * Usage dans un fichier d'intégration :
 *   jest.mock('../../middlewares/rateLimit', () => require('../helpers/setup').rateLimitMocks)
 */

// Rate limiters — bypass complet pour les tests
const rateLimitMocks = {
  loginLimiter: (req, res, next) => next(),
  registerLimiter: (req, res, next) => next(),
  passwordResetLimiter: (req, res, next) => next(),
  authLimiter: (req, res, next) => next(),
  apiLimiter: (req, res, next) => next(),
};

module.exports = { rateLimitMocks };
