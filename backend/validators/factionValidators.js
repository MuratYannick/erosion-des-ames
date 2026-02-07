'use strict';

const { body } = require('express-validator');

/**
 * Règles de validation pour la création d'une faction
 */
const createFactionValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),

  body('ethnicityId')
    .notEmpty()
    .withMessage('L\'ethnie est requise')
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de l\'ethnie doit être un entier valide'),

  body('emblem')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('L\'emblème ne doit pas dépasser 255 caractères'),

  body('isPlayable')
    .optional()
    .isBoolean()
    .withMessage('isPlayable doit être un booléen'),

  body('background')
    .optional()
    .trim(),

  body('goals')
    .optional()
    .trim(),
];

/**
 * Règles de validation pour la mise à jour d'une faction
 */
const updateFactionValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),

  body('ethnicityId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de l\'ethnie doit être un entier valide'),

  body('emblem')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('L\'emblème ne doit pas dépasser 255 caractères'),

  body('isPlayable')
    .optional()
    .isBoolean()
    .withMessage('isPlayable doit être un booléen'),

  body('background')
    .optional()
    .trim(),

  body('goals')
    .optional()
    .trim(),
];

/**
 * Règles de validation pour le rejet d'une faction
 */
const rejectFactionValidation = [
  body('rejectionReason')
    .trim()
    .notEmpty()
    .withMessage('La raison du rejet est requise')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La raison du rejet doit contenir entre 10 et 1000 caractères'),
];

module.exports = {
  createFactionValidation,
  updateFactionValidation,
  rejectFactionValidation,
};
