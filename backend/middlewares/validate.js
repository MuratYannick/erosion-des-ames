'use strict';

const { validationResult } = require('express-validator');

/**
 * Middleware de validation - collecte les erreurs de express-validator
 * et renvoie une réponse 422 formatée si des erreurs sont présentes
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {function} next - Next middleware
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value,
    }));

    return res.status(422).json({
      success: false,
      error: {
        message: 'Erreur de validation',
        code: 'VALIDATION_ERROR',
        details: formattedErrors,
      },
    });
  }

  next();
};

module.exports = {
  validate,
};
