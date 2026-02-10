'use strict';

const { body } = require('express-validator');

/**
 * Règles de validation pour le déplacement d'un sujet vers une autre catégorie
 */
const moveTopicValidation = [
  body('categoryId')
    .notEmpty()
    .withMessage('L\'identifiant de la catégorie est requis')
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de la catégorie doit être un entier valide'),
];

/**
 * Règles de validation pour la fusion de deux sujets
 */
const mergeTopicsValidation = [
  body('sourceTopicId')
    .notEmpty()
    .withMessage('L\'identifiant du sujet source est requis')
    .isInt({ min: 1 })
    .withMessage('L\'identifiant du sujet source doit être un entier valide'),

  body('targetTopicId')
    .notEmpty()
    .withMessage('L\'identifiant du sujet cible est requis')
    .isInt({ min: 1 })
    .withMessage('L\'identifiant du sujet cible doit être un entier valide'),
];

/**
 * Règles de validation pour l'examen d'un signalement
 */
const reviewReportValidation = [
  body('status')
    .notEmpty()
    .withMessage('Le statut est requis')
    .isIn(['reviewed', 'dismissed'])
    .withMessage('Le statut doit être \'reviewed\' ou \'dismissed\''),

  body('note')
    .optional()
    .trim(),
];

module.exports = {
  moveTopicValidation,
  mergeTopicsValidation,
  reviewReportValidation,
};
