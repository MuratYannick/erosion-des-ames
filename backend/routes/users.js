'use strict';

const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { optionalAuth } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { getUserValidation } = require('../validators/userValidators');

/**
 * @route   GET /api/users/:id
 * @desc    Récupérer le profil public d'un utilisateur
 * @access  Public (optionalAuth)
 */
router.get(
  '/:id',
  optionalAuth,
  getUserValidation,
  validate,
  userController.getPublicProfile
);

/**
 * @route   GET /api/users/:id/characters
 * @desc    Récupérer les personnages d'un utilisateur
 * @access  Public (optionalAuth) - Seuls les personnages approved + active sont visibles pour les non-propriétaires
 */
router.get(
  '/:id/characters',
  optionalAuth,
  getUserValidation,
  validate,
  userController.getUserCharacters
);

/**
 * @route   GET /api/users/:id/posts
 * @desc    Récupérer les posts d'un utilisateur avec pagination
 * @access  Public (optionalAuth)
 */
router.get(
  '/:id/posts',
  optionalAuth,
  getUserValidation,
  validate,
  userController.getUserPosts
);

/**
 * @route   GET /api/users/:id/topics
 * @desc    Récupérer les sujets créés par un utilisateur avec pagination
 * @access  Public (optionalAuth)
 */
router.get(
  '/:id/topics',
  optionalAuth,
  getUserValidation,
  validate,
  userController.getUserTopics
);

module.exports = router;
