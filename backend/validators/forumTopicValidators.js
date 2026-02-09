'use strict';

const { body } = require('express-validator');

/**
 * Règles de validation pour la création d'un sujet de forum
 */
const createTopicValidation = [
  body('categoryId')
    .notEmpty()
    .withMessage('La catégorie est requise')
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de la catégorie doit être un entier valide'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Le titre est requis')
    .isLength({ min: 3, max: 200 })
    .withMessage('Le titre doit contenir entre 3 et 200 caractères'),

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
 * Règles de validation pour la mise à jour d'un sujet de forum
 */
const updateTopicValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Le titre doit contenir entre 3 et 200 caractères'),

  body('content')
    .optional()
    .trim(),

  body('characterId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant du personnage doit être un entier valide'),
];

module.exports = {
  createTopicValidation,
  updateTopicValidation,
};
