'use strict';

const { body } = require('express-validator');

/**
 * Règles de validation pour l'inscription
 */
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 5 et 50 caractères')
    .matches(/^[a-zA-Z0-9]([a-zA-Z0-9]|[_ -](?=[a-zA-Z0-9]))*$/)
    .withMessage('Le nom d\'utilisateur doit commencer et finir par un caractère alphanumérique. Les underscores, espaces et tirets doivent être entre deux caractères alphanumériques'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('L\'adresse email est invalide')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Les mots de passe ne correspondent pas'),

  body('acceptedCgu')
    .custom((value) => value === true || value === 'true')
    .withMessage('Vous devez accepter les conditions générales d\'utilisation'),

  body('acceptedRules')
    .custom((value) => value === true || value === 'true')
    .withMessage('Vous devez accepter le règlement du site'),
];

/**
 * Règles de validation pour la connexion
 * Accepte email ou nom d'utilisateur dans le champ 'identifier'
 */
const loginValidation = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('L\'identifiant est requis'),

  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
];

/**
 * Règles de validation pour la demande de réinitialisation de mot de passe
 */
const forgotPasswordValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('L\'adresse email est invalide')
    .normalizeEmail(),
];

/**
 * Règles de validation pour la réinitialisation de mot de passe
 */
const resetPasswordValidation = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Le token de réinitialisation est requis'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'),

  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Les mots de passe ne correspondent pas'),
];

/**
 * Règles de validation pour le changement de mot de passe
 */
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Le mot de passe actuel est requis'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/)
    .withMessage('Le nouveau mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('Le nouveau mot de passe doit être différent de l\'ancien'),

  body('confirmNewPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Les mots de passe ne correspondent pas'),
];

/**
 * Règles de validation pour la mise à jour du profil
 */
const updateProfileValidation = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 5 et 50 caractères')
    .matches(/^[a-zA-Z0-9]([a-zA-Z0-9]|[_ -](?=[a-zA-Z0-9]))*$/)
    .withMessage('Le nom d\'utilisateur doit commencer et finir par un caractère alphanumérique. Les underscores, espaces et tirets doivent être entre deux caractères alphanumériques'),

  body('avatar')
    .optional()
    .trim()
    .isURL()
    .withMessage('L\'avatar doit être une URL valide'),
];

/**
 * Règles de validation pour la vérification d'email
 */
const verifyEmailValidation = [
  body('token')
    .trim()
    .notEmpty()
    .withMessage('Le token de vérification est requis'),
];

/**
 * Règles de validation pour le renvoi de l'email de vérification
 */
const resendVerificationValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('L\'adresse email est invalide')
    .normalizeEmail(),
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  updateProfileValidation,
  verifyEmailValidation,
  resendVerificationValidation,
};
