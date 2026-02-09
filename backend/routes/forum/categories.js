'use strict';

const express = require('express');
const router = express.Router();

const forumCategoryController = require('../../controllers/forumCategoryController');
const { authenticate, authorize, optionalAuth } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  createCategoryValidation,
  updateCategoryValidation,
  reorderCategoriesValidation,
} = require('../../validators/forumCategoryValidators');

/**
 * @route   GET /api/forum/categories
 * @desc    Récupérer toutes les catégories du forum
 * @access  Public
 */
router.get('/', optionalAuth, forumCategoryController.getAll);

/**
 * @route   GET /api/forum/categories/:id
 * @desc    Récupérer une catégorie par son ID
 * @access  Public
 */
router.get('/:id', optionalAuth, forumCategoryController.getById);

/**
 * @route   POST /api/forum/categories
 * @desc    Créer une nouvelle catégorie
 * @access  ADMIN
 */
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  createCategoryValidation,
  validate,
  forumCategoryController.create
);

/**
 * @route   PUT /api/forum/categories/:id
 * @desc    Mettre à jour une catégorie
 * @access  ADMIN
 */
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  updateCategoryValidation,
  validate,
  forumCategoryController.update
);

/**
 * @route   PATCH /api/forum/categories/reorder
 * @desc    Réorganiser l'ordre des catégories
 * @access  ADMIN
 */
router.patch(
  '/reorder',
  authenticate,
  authorize('ADMIN'),
  reorderCategoriesValidation,
  validate,
  forumCategoryController.reorder
);

/**
 * @route   DELETE /api/forum/categories/:id
 * @desc    Supprimer une catégorie
 * @access  ADMIN
 */
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  forumCategoryController.remove
);

module.exports = router;
