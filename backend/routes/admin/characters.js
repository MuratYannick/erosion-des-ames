'use strict';

const express = require('express');
const router = express.Router();

const adminCharacterController = require('../../controllers/adminCharacterController');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  rejectCharacterValidation,
} = require('../../validators/characterValidators');

/**
 * @route   GET /api/admin/characters
 * @desc    Lister les personnages (paginé, filtrable)
 * @access  ADMIN, MODERATOR
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  adminCharacterController.getAll
);

/**
 * @route   GET /api/admin/characters/pending
 * @desc    File d'attente des personnages en attente d'approbation
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.get(
  '/pending',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  adminCharacterController.getPending
);

/**
 * @route   PATCH /api/admin/characters/:id/approve
 * @desc    Approuver un personnage
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.patch(
  '/:id/approve',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  adminCharacterController.approve
);

/**
 * @route   PATCH /api/admin/characters/:id/reject
 * @desc    Rejeter un personnage
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.patch(
  '/:id/reject',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  rejectCharacterValidation,
  validate,
  adminCharacterController.reject
);

/**
 * @route   DELETE /api/admin/characters/:id
 * @desc    Supprimer un personnage (soft delete)
 * @access  ADMIN
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  adminCharacterController.remove
);

module.exports = router;
