'use strict';

const express = require('express');
const router = express.Router();

const forumReportController = require('../../controllers/forumReportController');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  reviewReportValidation,
} = require('../../validators/forumPostValidators');

/**
 * @route   GET /api/forum/reports
 * @desc    Récupérer les signalements en attente
 * @access  ADMIN, MODERATOR
 */
router.get(
  '/',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  forumReportController.getPending
);

/**
 * @route   PATCH /api/forum/reports/:id/review
 * @desc    Examiner et traiter un signalement
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/:id/review',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  reviewReportValidation,
  validate,
  forumReportController.review
);

module.exports = router;
