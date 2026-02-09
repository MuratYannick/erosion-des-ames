'use strict';

const { body } = require('express-validator');

/**
 * Règles de validation pour la création d'une catégorie de forum
 */
const createCategoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),

  body('parentId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de la catégorie parente doit être un entier valide'),

  body('description')
    .optional()
    .trim(),

  body('icon')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('L\'icône ne doit pas dépasser 255 caractères'),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('L\'ordre d\'affichage doit être un entier positif ou nul'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive doit être un booléen'),

  body('isRp')
    .optional()
    .isBoolean()
    .withMessage('isRp doit être un booléen'),
];

/**
 * Règles de validation pour la mise à jour d'une catégorie de forum
 */
const updateCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),

  body('parentId')
    .optional({ values: 'null' })
    .isInt({ min: 1 })
    .withMessage('L\'identifiant de la catégorie parente doit être un entier valide'),

  body('description')
    .optional()
    .trim(),

  body('icon')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('L\'icône ne doit pas dépasser 255 caractères'),

  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('L\'ordre d\'affichage doit être un entier positif ou nul'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive doit être un booléen'),

  body('isRp')
    .optional()
    .isBoolean()
    .withMessage('isRp doit être un booléen'),
];

/**
 * Règles de validation pour la réorganisation des catégories
 */
const reorderCategoriesValidation = [
  body('categories')
    .notEmpty()
    .withMessage('La liste des catégories est requise')
    .isArray()
    .withMessage('Les catégories doivent être un tableau'),

  body('categories.*.id')
    .notEmpty()
    .withMessage('L\'identifiant est requis')
    .isInt({ min: 1 })
    .withMessage('L\'identifiant doit être un entier valide'),

  body('categories.*.displayOrder')
    .notEmpty()
    .withMessage('L\'ordre d\'affichage est requis')
    .isInt({ min: 0 })
    .withMessage('L\'ordre d\'affichage doit être un entier positif ou nul'),
];

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
  reorderCategoriesValidation,
};
