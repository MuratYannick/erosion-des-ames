'use strict';

const express = require('express');
const router = express.Router();

const forumSearchController = require('../../controllers/forumSearchController');
const { optionalAuth } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const { searchValidation } = require('../../validators/forumSearchValidators');

/**
 * @route   GET /api/forum/search
 * @desc    Rechercher dans le forum
 * @access  Public
 */
router.get(
  '/',
  optionalAuth,
  searchValidation,
  validate,
  forumSearchController.search
);

module.exports = router;
