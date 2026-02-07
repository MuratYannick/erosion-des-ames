'use strict';

const { body } = require('express-validator');

/**
 * Règles de validation pour la création d'une ethnie
 */
const createEthnicityValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
];

/**
 * Règles de validation pour la mise à jour d'une ethnie
 */
const updateEthnicityValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),
];

module.exports = {
  createEthnicityValidation,
  updateEthnicityValidation,
};
