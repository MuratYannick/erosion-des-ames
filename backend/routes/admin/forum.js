'use strict';

const express = require('express');
const router = express.Router();

const adminForumController = require('../../controllers/adminForumController');
const adminCategoryPermissionController = require('../../controllers/adminCategoryPermissionController');
const { authenticate, authorize, checkMute } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  reorderCategoriesValidation,
} = require('../../validators/adminValidators');
const {
  moveTopicValidation,
  mergeTopicsValidation,
} = require('../../validators/moderationValidators');
const {
  addPermissionValidation,
} = require('../../validators/categoryPermissionValidators');

/**
 * @route   GET /api/admin/forum/categories
 * @desc    Lister toutes les catégories (y compris inactives)
 * @access  ADMIN, MODERATOR
 */
router.get(
  '/categories',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  adminForumController.getCategories
);

/**
 * @route   POST /api/admin/forum/categories
 * @desc    Créer une catégorie (permission: create_subcategory sur le parent)
 * @access  ADMIN, MODERATOR
 */
router.post(
  '/categories',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  checkMute,
  adminForumController.createCategory
);

/**
 * @route   PUT /api/admin/forum/categories/:id
 * @desc    Mettre à jour une catégorie (permission: edit_category)
 * @access  ADMIN, MODERATOR
 */
router.put(
  '/categories/:id',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  checkMute,
  adminForumController.updateCategory
);

/**
 * @route   DELETE /api/admin/forum/categories/:id
 * @desc    Supprimer une catégorie (permission: edit_category)
 * @access  ADMIN
 */
router.delete(
  '/categories/:id',
  authenticate,
  authorize('ADMIN'),
  checkMute,
  adminForumController.deleteCategory
);

/**
 * @route   PATCH /api/admin/forum/categories/reorder
 * @desc    Réorganiser l'ordre des catégories (permission: move_category)
 * @access  ADMIN, MODERATOR
 *
 * Note: cette route doit être déclarée avant /categories/:id
 * pour éviter que "reorder" soit interprété comme un :id param.
 */
router.patch(
  '/categories/reorder',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  checkMute,
  reorderCategoriesValidation,
  validate,
  adminForumController.reorderCategories
);

/**
 * @route   GET /api/admin/forum/categories/:id/permissions
 * @desc    Liste les permissions directes d'une catégorie
 * @access  ADMIN
 */
router.get(
  '/categories/:id/permissions',
  authenticate,
  authorize('ADMIN'),
  adminCategoryPermissionController.getPermissions
);

/**
 * @route   GET /api/admin/forum/categories/:id/permissions/effective
 * @desc    Liste les permissions effectives d'une catégorie (directes + héritées)
 * @access  ADMIN
 */
router.get(
  '/categories/:id/permissions/effective',
  authenticate,
  authorize('ADMIN'),
  adminCategoryPermissionController.getEffectivePermissions
);

/**
 * @route   POST /api/admin/forum/categories/:id/permissions
 * @desc    Ajoute une permission à une catégorie
 * @access  ADMIN
 */
router.post(
  '/categories/:id/permissions',
  authenticate,
  authorize('ADMIN'),
  checkMute,
  addPermissionValidation,
  validate,
  adminCategoryPermissionController.addPermission
);

/**
 * @route   DELETE /api/admin/forum/categories/:id/permissions/:permissionId
 * @desc    Supprime une permission d'une catégorie
 * @access  ADMIN
 */
router.delete(
  '/categories/:id/permissions/:permissionId',
  authenticate,
  authorize('ADMIN'),
  checkMute,
  adminCategoryPermissionController.removePermission
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
  checkMute,
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
  checkMute,
  mergeTopicsValidation,
  validate,
  adminForumController.mergeTopics
);

module.exports = router;
