'use strict';

const express = require('express');
const router = express.Router();

const adminUserController = require('../../controllers/adminUserController');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  changeRoleValidation,
  banUserValidation,
  muteUserValidation,
  updateUserStatusValidation,
} = require('../../validators/adminValidators');

/**
 * @route   GET /api/admin/users
 * @desc    Lister les utilisateurs (paginé, filtrable)
 * @access  ADMIN, MODERATOR
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  adminUserController.getAll
);

/**
 * @route   GET /api/admin/users/:id
 * @desc    Détail d'un utilisateur
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.get(
  '/:id',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  adminUserController.getById
);

/**
 * @route   PATCH /api/admin/users/:id/role
 * @desc    Modifier le rôle d'un utilisateur
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.patch(
  '/:id/role',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  changeRoleValidation,
  validate,
  adminUserController.changeRole
);

/**
 * @route   PATCH /api/admin/users/:id/ban
 * @desc    Bannir un utilisateur
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/ban',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  banUserValidation,
  validate,
  adminUserController.ban
);

/**
 * @route   PATCH /api/admin/users/:id/unban
 * @desc    Débannir un utilisateur
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/unban',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  adminUserController.unban
);

/**
 * @route   PATCH /api/admin/users/:id/mute
 * @desc    Mettre un utilisateur en sourdine
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/mute',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  muteUserValidation,
  validate,
  adminUserController.mute
);

/**
 * @route   PATCH /api/admin/users/:id/unmute
 * @desc    Retirer la sourdine d'un utilisateur
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/unmute',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  adminUserController.unmute
);

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Activer ou désactiver un compte utilisateur
 * @access  ADMIN
 */
router.patch(
  '/:id/status',
  authenticate,
  authorize('ADMIN'),
  updateUserStatusValidation,
  validate,
  adminUserController.updateStatus
);

module.exports = router;
