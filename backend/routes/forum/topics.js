'use strict';

const express = require('express');
const router = express.Router();

const forumTopicController = require('../../controllers/forumTopicController');
const { authenticate, authorize, optionalAuth } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  createTopicValidation,
  updateTopicValidation,
} = require('../../validators/forumTopicValidators');

/**
 * @route   GET /api/forum/topics/recent
 * @desc    Récupérer les sujets récents
 * @access  Public
 */
router.get('/recent', optionalAuth, forumTopicController.getRecent);

/**
 * @route   GET /api/forum/topics/category/:categoryId
 * @desc    Récupérer les sujets d'une catégorie
 * @access  Public
 */
router.get('/category/:categoryId', optionalAuth, forumTopicController.getByCategory);

/**
 * @route   POST /api/forum/topics/mark-all-read
 * @desc    Marquer tous les sujets comme lus
 * @access  Authentifié
 */
router.post('/mark-all-read', authenticate, forumTopicController.markAllAsRead);

/**
 * @route   GET /api/forum/topics/:id
 * @desc    Récupérer un sujet par son ID
 * @access  Public
 */
router.get('/:id', optionalAuth, forumTopicController.getById);

/**
 * @route   POST /api/forum/topics
 * @desc    Créer un nouveau sujet
 * @access  Authentifié
 */
router.post(
  '/',
  authenticate,
  createTopicValidation,
  validate,
  forumTopicController.create
);

/**
 * @route   PUT /api/forum/topics/:id
 * @desc    Mettre à jour un sujet
 * @access  Authentifié
 */
router.put(
  '/:id',
  authenticate,
  updateTopicValidation,
  validate,
  forumTopicController.update
);

/**
 * @route   PATCH /api/forum/topics/:id/pin
 * @desc    Épingler ou désépingler un sujet
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/pin',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  forumTopicController.pin
);

/**
 * @route   PATCH /api/forum/topics/:id/lock
 * @desc    Verrouiller ou déverrouiller un sujet
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/lock',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  forumTopicController.lock
);

/**
 * @route   POST /api/forum/topics/:id/read
 * @desc    Marquer un sujet comme lu
 * @access  Authentifié
 */
router.post(
  '/:id/read',
  authenticate,
  forumTopicController.markAsRead
);

/**
 * @route   POST /api/forum/topics/:id/subscribe
 * @desc    S'abonner ou se désabonner d'un sujet
 * @access  Authentifié
 */
router.post(
  '/:id/subscribe',
  authenticate,
  forumTopicController.toggleSubscription
);

/**
 * @route   DELETE /api/forum/topics/:id
 * @desc    Supprimer un sujet
 * @access  Authentifié
 */
router.delete(
  '/:id',
  authenticate,
  forumTopicController.remove
);

module.exports = router;
