'use strict';

const { query } = require('express-validator');

/**
 * Règles de validation pour la recherche forum
 */
const searchValidation = [
  query('query')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('La recherche doit contenir entre 2 et 200 caractères'),

  query('categoryId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de la catégorie doit être un entier valide'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier positif'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('La limite doit être un entier entre 1 et 50'),
];

module.exports = {
  searchValidation,
};
