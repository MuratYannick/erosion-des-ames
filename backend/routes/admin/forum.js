'use strict';

const express = require('express');
const router = express.Router();

const adminForumController = require('../../controllers/adminForumController');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  reorderCategoriesValidation,
} = require('../../validators/adminValidators');
const {
  moveTopicValidation,
  mergeTopicsValidation,
} = require('../../validators/moderationValidators');

/**
 * @route   GET /api/admin/forum/categories
 * @desc    Lister toutes les catégories (y compris inactives)
 * @access  ADMIN
 */
router.get(
  '/categories',
  authenticate,
  authorize('ADMIN'),
  adminForumController.getCategories
);

/**
 * @route   POST /api/admin/forum/categories
 * @desc    Créer une catégorie
 * @access  ADMIN
 */
router.post(
  '/categories',
  authenticate,
  authorize('ADMIN'),
  adminForumController.createCategory
);

/**
 * @route   PUT /api/admin/forum/categories/:id
 * @desc    Mettre à jour une catégorie
 * @access  ADMIN
 */
router.put(
  '/categories/:id',
  authenticate,
  authorize('ADMIN'),
  adminForumController.updateCategory
);

/**
 * @route   DELETE /api/admin/forum/categories/:id
 * @desc    Supprimer une catégorie
 * @access  ADMIN
 */
router.delete(
  '/categories/:id',
  authenticate,
  authorize('ADMIN'),
  adminForumController.deleteCategory
);

/**
 * @route   PATCH /api/admin/forum/categories/reorder
 * @desc    Réorganiser l'ordre des catégories
 * @access  ADMIN
 *
 * Note: cette route doit être déclarée avant /categories/:id
 * pour éviter que "reorder" soit interprété comme un :id param.
 */
router.patch(
  '/categories/reorder',
  authenticate,
  authorize('ADMIN'),
  reorderCategoriesValidation,
  validate,
  adminForumController.reorderCategories
);

/**
 * @route   PATCH /api/admin/forum/topics/:id/move
 * @desc    Déplacer un sujet vers une autre catégorie
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/topics/:id/move',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  moveTopicValidation,
  validate,
  adminForumController.moveTopic
);

/**
 * @route   PATCH /api/admin/forum/topics/merge
 * @desc    Fusionner deux sujets (sourceTopicId + targetTopicId dans le body)
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/topics/merge',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  mergeTopicsValidation,
  validate,
  adminForumController.mergeTopics
);

module.exports = router;
