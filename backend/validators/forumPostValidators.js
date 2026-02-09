'use strict';

const { body } = require('express-validator');

/**
 * Règles de validation pour la création d'un post de forum
 */
const createPostValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Le contenu est requis'),

  body('characterId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant du personnage doit être un entier valide'),

  body('quotedPostId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant du post cité doit être un entier valide'),
];

/**
 * Règles de validation pour la mise à jour d'un post de forum
 */
const updatePostValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Le contenu est requis'),

  body('characterId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant du personnage doit être un entier valide'),
];

/**
 * Règles de validation pour le signalement d'un post
 */
const reportPostValidation = [
  body('reason')
    .notEmpty()
    .withMessage('La raison est requise')
    .isIn(['spam', 'offensive', 'off_topic', 'other'])
    .withMessage('La raison doit être l\'une des suivantes : spam, offensive, off_topic, other'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La description ne doit pas dépasser 1000 caractères'),
];

/**
 * Règles de validation pour la révision d'un signalement
 */
const reviewReportValidation = [
  body('status')
    .notEmpty()
    .withMessage('Le statut est requis')
    .isIn(['reviewed', 'dismissed'])
    .withMessage('Le statut doit être \'reviewed\' ou \'dismissed\''),
];

module.exports = {
  createPostValidation,
  updatePostValidation,
  reportPostValidation,
  reviewReportValidation,
};
