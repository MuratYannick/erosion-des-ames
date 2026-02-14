'use strict';

const express = require('express');
const router = express.Router();

const forumCategoryController = require('../../controllers/forumCategoryController');
const categoryPermissionController = require('../../controllers/categoryPermissionController');
const { authenticate, authorize, optionalAuth, checkMute } = require('../../middlewares/auth');
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
 * @route   GET /api/forum/categories/:id/my-permissions
 * @desc    Récupérer les permissions de l'utilisateur courant pour une catégorie
 * @access  Public (optionalAuth)
 * @query   characterId - UUID du personnage sélectionné (optionnel)
 */
router.get('/:id/my-permissions', optionalAuth, categoryPermissionController.getMyPermissions);

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
  checkMute,
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
  checkMute,
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
  checkMute,
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
  checkMute,
  forumCategoryController.remove
);

module.exports = router;
