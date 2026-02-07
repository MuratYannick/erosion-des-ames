'use strict';

const { body } = require('express-validator');

/**
 * Règles de validation pour la création d'un personnage
 */
const createCharacterValidation = [
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

  body('factionId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de la faction doit être un entier valide'),

  body('clanId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant du clan doit être un entier valide'),

  body('userId')
    .optional({ values: 'null' }),

  body('avatar')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('L\'avatar ne doit pas dépasser 255 caractères'),

  body('age')
    .optional()
    .isInt({ min: 1 })
    .withMessage('L\'âge doit être un entier supérieur ou égal à 1'),

  body('appearance')
    .optional()
    .trim(),

  body('personality')
    .optional()
    .trim(),

  body('background')
    .optional()
    .trim(),

  body('goals')
    .optional()
    .trim(),
];

/**
 * Règles de validation pour la mise à jour d'un personnage
 */
const updateCharacterValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères'),

  body('ethnicityId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de l\'ethnie doit être un entier valide'),

  body('factionId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de la faction doit être un entier valide'),

  body('clanId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant du clan doit être un entier valide'),

  body('userId')
    .optional({ values: 'null' }),

  body('avatar')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('L\'avatar ne doit pas dépasser 255 caractères'),

  body('age')
    .optional()
    .isInt({ min: 1 })
    .withMessage('L\'âge doit être un entier supérieur ou égal à 1'),

  body('appearance')
    .optional()
    .trim(),

  body('personality')
    .optional()
    .trim(),

  body('background')
    .optional()
    .trim(),

  body('goals')
    .optional()
    .trim(),
];

/**
 * Règles de validation pour le rejet d'un personnage
 */
const rejectCharacterValidation = [
  body('rejectionReason')
    .trim()
    .notEmpty()
    .withMessage('La raison du rejet est requise')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La raison du rejet doit contenir entre 10 et 1000 caractères'),
];

module.exports = {
  createCharacterValidation,
  updateCharacterValidation,
  rejectCharacterValidation,
};
