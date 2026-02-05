'use strict';

/**
 * Classe d'erreur personnalisée pour l'API
 * Permet de définir un code de statut HTTP et un message d'erreur
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true; // Distingue les erreurs opérationnelles des erreurs de programmation
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details = null) {
    return new ApiError(400, message || 'Bad Request', details);
  }

  static unauthorized(message, details = null) {
    return new ApiError(401, message || 'Unauthorized', details);
  }

  static forbidden(message, details = null) {
    return new ApiError(403, message || 'Forbidden', details);
  }

  static notFound(message, details = null) {
    return new ApiError(404, message || 'Not Found', details);
  }

  static conflict(message, details = null) {
    return new ApiError(409, message || 'Conflict', details);
  }

  static unprocessableEntity(message, details = null) {
    return new ApiError(422, message || 'Unprocessable Entity', details);
  }

  static tooManyRequests(message, details = null) {
    return new ApiError(429, message || 'Too Many Requests', details);
  }

  static internal(message, details = null) {
    return new ApiError(500, message || 'Internal Server Error', details);
  }
}

/**
 * Middleware de gestion des erreurs
 * Formate toutes les erreurs dans un format standardisé
 */
const errorHandler = (err, req, res, next) => {
  // Log de l'erreur
  console.error('Error:', {
    message: err.message,
    statusCode: err.statusCode || 500,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Déterminer le code de statut
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // Gérer les erreurs Sequelize
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Resource already exists';
    details = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Invalid reference';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Cacher les détails de l'erreur en production pour les erreurs 500
  if (statusCode === 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal Server Error';
    details = null;
  }

  // Format de réponse standardisé
  const response = {
    success: false,
    error: {
      code: statusCode,
      message,
      ...(details && { details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  res.status(statusCode).json(response);
};

/**
 * Middleware pour les routes non trouvées (404)
 */
const notFoundHandler = (req, res, next) => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};

/**
 * Wrapper pour les fonctions async des routes
 * Capture automatiquement les erreurs et les passe au middleware d'erreurs
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  ApiError,
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
