'use strict';

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  authLimiter,
} = require('../middlewares/rateLimit');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
  updateProfileValidation,
  verifyEmailValidation,
  resendVerificationValidation,
  selectCharacterValidation,
} = require('../validators/authValidators');

/**
 * @route   POST /api/auth/register
 * @desc    Inscription d'un nouvel utilisateur
 * @access  Public
 */
router.post(
  '/register',
  registerLimiter,
  registerValidation,
  validate,
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Connexion d'un utilisateur
 * @access  Public
 */
router.post(
  '/login',
  loginLimiter,
  loginValidation,
  validate,
  authController.login
);

/**
 * @route   POST /api/auth/logout
 * @desc    Déconnexion d'un utilisateur
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Récupérer les informations de l'utilisateur connecté
 * @access  Private
 */
router.get('/me', authenticate, authController.me);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Vérifier l'email d'un utilisateur
 * @access  Public
 */
router.post(
  '/verify-email',
  verifyEmailValidation,
  validate,
  authController.verifyEmail
);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Renvoyer l'email de vérification
 * @access  Public
 */
router.post(
  '/resend-verification',
  authLimiter,
  resendVerificationValidation,
  validate,
  authController.resendVerification
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Demande de réinitialisation de mot de passe
 * @access  Public
 */
router.post(
  '/forgot-password',
  passwordResetLimiter,
  forgotPasswordValidation,
  validate,
  authController.forgotPassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Réinitialisation de mot de passe
 * @access  Public
 */
router.post(
  '/reset-password',
  resetPasswordValidation,
  validate,
  authController.resetPassword
);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Changement de mot de passe
 * @access  Private
 */
router.put(
  '/change-password',
  authenticate,
  changePasswordValidation,
  validate,
  authController.changePassword
);

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Mise à jour du profil utilisateur
 * @access  Private
 */
router.put(
  '/update-profile',
  authenticate,
  updateProfileValidation,
  validate,
  authController.updateProfile
);

/**
 * @route   PUT /api/auth/select-character
 * @desc    Sélectionner un personnage actif
 * @access  Private
 */
router.put(
  '/select-character',
  authenticate,
  selectCharacterValidation,
  validate,
  authController.selectCharacter
);

/**
 * @route   DELETE /api/auth/select-character
 * @desc    Désélectionner le personnage actif
 * @access  Private
 */
router.delete(
  '/select-character',
  authenticate,
  authController.deselectCharacter
);

module.exports = router;
