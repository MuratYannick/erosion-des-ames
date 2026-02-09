'use strict';

const express = require('express');
const router = express.Router();

const forumPostController = require('../../controllers/forumPostController');
const { authenticate, optionalAuth } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  createPostValidation,
  updatePostValidation,
  reportPostValidation,
} = require('../../validators/forumPostValidators');

/**
 * @route   GET /api/forum/posts/topic/:topicId
 * @desc    Récupérer les messages d'un sujet
 * @access  Public
 */
router.get('/topic/:topicId', optionalAuth, forumPostController.getByTopic);

/**
 * @route   POST /api/forum/posts/topic/:topicId
 * @desc    Créer un nouveau message dans un sujet
 * @access  Authentifié
 */
router.post(
  '/topic/:topicId',
  authenticate,
  createPostValidation,
  validate,
  forumPostController.create
);

/**
 * @route   PUT /api/forum/posts/:id
 * @desc    Mettre à jour un message
 * @access  Authentifié
 */
router.put(
  '/:id',
  authenticate,
  updatePostValidation,
  validate,
  forumPostController.update
);

/**
 * @route   DELETE /api/forum/posts/:id
 * @desc    Supprimer un message
 * @access  Authentifié
 */
router.delete(
  '/:id',
  authenticate,
  forumPostController.remove
);

/**
 * @route   POST /api/forum/posts/:id/report
 * @desc    Signaler un message
 * @access  Authentifié
 */
router.post(
  '/:id/report',
  authenticate,
  reportPostValidation,
  validate,
  forumPostController.report
);

module.exports = router;
