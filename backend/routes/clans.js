'use strict';

const express = require('express');
const router = express.Router();

const clanController = require('../controllers/clanController');
const { authenticate, authorize, optionalAuth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  createClanValidation,
  updateClanValidation,
  rejectClanValidation,
} = require('../validators/clanValidators');

/**
 * @route   GET /api/clans
 * @desc    Récupérer tous les clans (filtrage selon rôle)
 * @access  Public (filtre active+approved) / Staff (tous + filtres)
 */
router.get(
  '/',
  (req, res, next) => { res.set('Cache-Control', 'public, max-age=3600'); next(); },
  optionalAuth,
  clanController.getAll
);

/**
 * @route   GET /api/clans/:id
 * @desc    Récupérer un clan par son ID
 * @access  Public (active+approved) / Staff (tous)
 */
router.get(
  '/:id',
  (req, res, next) => { res.set('Cache-Control', 'public, max-age=3600'); next(); },
  optionalAuth,
  clanController.getById
);

/**
 * @route   POST /api/clans
 * @desc    Créer un clan
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  createClanValidation,
  validate,
  clanController.create
);

/**
 * @route   PUT /api/clans/:id
 * @desc    Mettre à jour un clan
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  updateClanValidation,
  validate,
  clanController.update
);

/**
 * @route   PATCH /api/clans/:id/submit
 * @desc    Soumettre un clan pour approbation
 * @access  ADMIN, MODERATOR, GAME_MASTER
 */
router.patch(
  '/:id/submit',
  authenticate,
  authorize('ADMIN', 'MODERATOR', 'GAME_MASTER'),
  clanController.submit
);

/**
 * @route   PATCH /api/clans/:id/approve
 * @desc    Approuver un clan
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/approve',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  clanController.approve
);

/**
 * @route   PATCH /api/clans/:id/reject
 * @desc    Rejeter un clan
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/reject',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  rejectClanValidation,
  validate,
  clanController.reject
);

/**
 * @route   DELETE /api/clans/:id
 * @desc    Supprimer un clan (soft delete)
 * @access  ADMIN
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  clanController.remove
);

module.exports = router;
