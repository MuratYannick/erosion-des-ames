'use strict';

const express = require('express');
const router = express.Router();

const characterController = require('../controllers/characterController');
const { authenticate, authorize, optionalAuth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  createCharacterValidation,
  updateCharacterValidation,
  rejectCharacterValidation,
} = require('../validators/characterValidators');

/**
 * @route   GET /api/characters
 * @desc    Récupérer tous les personnages (filtrage selon rôle)
 * @access  Public (filtre active+approved) / Staff (tous + filtres)
 */
router.get('/', optionalAuth, characterController.getAll);

/**
 * @route   GET /api/characters/:id
 * @desc    Récupérer un personnage par son ID
 * @access  Public (active+approved) / Staff (tous)
 */
router.get('/:id', optionalAuth, characterController.getById);

/**
 * @route   POST /api/characters
 * @desc    Créer un personnage
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  createCharacterValidation,
  validate,
  characterController.create
);

/**
 * @route   PUT /api/characters/:id
 * @desc    Mettre à jour un personnage
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  updateCharacterValidation,
  validate,
  characterController.update
);

/**
 * @route   PATCH /api/characters/:id/submit
 * @desc    Soumettre un personnage pour approbation
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.patch(
  '/:id/submit',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  characterController.submit
);

/**
 * @route   PATCH /api/characters/:id/approve
 * @desc    Approuver un personnage
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/approve',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  characterController.approve
);

/**
 * @route   PATCH /api/characters/:id/reject
 * @desc    Rejeter un personnage
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/reject',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  rejectCharacterValidation,
  validate,
  characterController.reject
);

/**
 * @route   DELETE /api/characters/:id
 * @desc    Supprimer un personnage (soft delete)
 * @access  ADMIN
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  characterController.remove
);

module.exports = router;
