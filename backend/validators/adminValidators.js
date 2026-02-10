'use strict';

const { body } = require('express-validator');

/**
 * Règles de validation pour le changement de rôle d'un utilisateur
 */
const changeRoleValidation = [
  body('role')
    .notEmpty()
    .withMessage('Le rôle est requis')
    .isIn(['ADMIN', 'MODERATOR', 'GAME_MASTER', 'PLAYER'])
    .withMessage('Le rôle doit être l\'un des suivants : ADMIN, MODERATOR, GAME_MASTER, PLAYER'),
];

/**
 * Règles de validation pour le bannissement d'un utilisateur
 * La durée est exprimée en heures ; si omise, le bannissement est permanent
 */
const banUserValidation = [
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('La raison du bannissement est requise'),

  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La durée doit être un entier supérieur ou égal à 1 (en heures)'),
];

/**
 * Règles de validation pour le mise en sourdine d'un utilisateur
 * La durée est exprimée en heures ; si omise, la mise en sourdine est permanente
 */
const muteUserValidation = [
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('La raison de la mise en sourdine est requise'),

  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La durée doit être un entier supérieur ou égal à 1 (en heures)'),
];

/**
 * Règles de validation pour la mise à jour du statut d'un utilisateur
 */
const updateUserStatusValidation = [
  body('isActive')
    .notEmpty()
    .withMessage('Le statut est requis')
    .isBoolean()
    .withMessage('isActive doit être un booléen'),
];

/**
 * Règles de validation pour la réorganisation des catégories de forum
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
  changeRoleValidation,
  banUserValidation,
  muteUserValidation,
  updateUserStatusValidation,
  reorderCategoriesValidation,
};
