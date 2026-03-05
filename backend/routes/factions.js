'use strict';

const express = require('express');
const router = express.Router();

const factionController = require('../controllers/factionController');
const { authenticate, authorize, optionalAuth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  createFactionValidation,
  updateFactionValidation,
  rejectFactionValidation,
} = require('../validators/factionValidators');

/**
 * @route   GET /api/factions
 * @desc    Récupérer toutes les factions (filtrage selon rôle)
 * @access  Public (filtre active+approved) / Staff (tous + filtres)
 */
router.get(
  '/',
  (req, res, next) => { res.set('Cache-Control', 'public, max-age=3600'); next(); },
  optionalAuth,
  factionController.getAll
);

/**
 * @route   GET /api/factions/:id
 * @desc    Récupérer une faction par son ID
 * @access  Public (active+approved) / Staff (tous)
 */
router.get(
  '/:id',
  (req, res, next) => { res.set('Cache-Control', 'public, max-age=3600'); next(); },
  optionalAuth,
  factionController.getById
);

/**
 * @route   POST /api/factions
 * @desc    Créer une faction
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  createFactionValidation,
  validate,
  factionController.create
);

/**
 * @route   PUT /api/factions/:id
 * @desc    Mettre à jour une faction
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  updateFactionValidation,
  validate,
  factionController.update
);

/**
 * @route   PATCH /api/factions/:id/submit
 * @desc    Soumettre une faction pour approbation
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.patch(
  '/:id/submit',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  factionController.submit
);

/**
 * @route   PATCH /api/factions/:id/approve
 * @desc    Approuver une faction
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/approve',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  factionController.approve
);

/**
 * @route   PATCH /api/factions/:id/reject
 * @desc    Rejeter une faction
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/reject',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  rejectFactionValidation,
  validate,
  factionController.reject
);

/**
 * @route   DELETE /api/factions/:id
 * @desc    Supprimer une faction (soft delete)
 * @access  ADMIN
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  factionController.remove
);

module.exports = router;
