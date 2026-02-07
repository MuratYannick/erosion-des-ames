'use strict';

const express = require('express');
const router = express.Router();

const ethnicityController = require('../controllers/ethnicityController');
const { authenticate, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  createEthnicityValidation,
  updateEthnicityValidation,
} = require('../validators/ethnicityValidators');

/**
 * @route   GET /api/ethnicities
 * @desc    Récupérer toutes les ethnies
 * @access  Public
 */
router.get('/', ethnicityController.getAll);

/**
 * @route   GET /api/ethnicities/:id
 * @desc    Récupérer une ethnie par son ID
 * @access  Public
 */
router.get('/:id', ethnicityController.getById);

/**
 * @route   POST /api/ethnicities
 * @desc    Créer une ethnie
 * @access  ADMIN, MODERATOR
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  createEthnicityValidation,
  validate,
  ethnicityController.create
);

/**
 * @route   PUT /api/ethnicities/:id
 * @desc    Mettre à jour une ethnie
 * @access  ADMIN, MODERATOR
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  updateEthnicityValidation,
  validate,
  ethnicityController.update
);

/**
 * @route   DELETE /api/ethnicities/:id
 * @desc    Supprimer une ethnie (soft delete)
 * @access  ADMIN
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  ethnicityController.remove
);

module.exports = router;
