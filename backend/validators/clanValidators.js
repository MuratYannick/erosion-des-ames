'use strict';

const { body } = require('express-validator');

/**
 * Règles de validation pour la création d'un clan
 */
const createClanValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),

  body('ethnicityId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de l\'ethnie doit être un entier valide'),

  body('factionId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de la faction doit être un entier valide'),

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
 * Règles de validation pour la mise à jour d'un clan
 */
const updateClanValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),

  body('ethnicityId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de l\'ethnie doit être un entier valide'),

  body('factionId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de la faction doit être un entier valide'),

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
 * Règles de validation pour le rejet d'un clan
 */
const rejectClanValidation = [
  body('rejectionReason')
    .trim()
    .notEmpty()
    .withMessage('La raison du rejet est requise')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La raison du rejet doit contenir entre 10 et 1000 caractères'),
];

module.exports = {
  createClanValidation,
  updateClanValidation,
  rejectClanValidation,
};
