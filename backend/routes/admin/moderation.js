'use strict';

const express = require('express');
const router = express.Router();

const moderationController = require('../../controllers/moderationController');
const { authenticate, authorize } = require('../../middlewares/auth');
const { validate } = require('../../middlewares/validate');
const {
  reviewReportValidation,
} = require('../../validators/moderationValidators');

/**
 * @route   GET /api/admin/moderation/actions
 * @desc    Historique des actions de modération
 * @access  ADMIN, MODERATOR
 */
router.get(
  '/actions',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  moderationController.getActions
);

/**
 * @route   GET /api/admin/moderation/sanctions
 * @desc    Liste des sanctions actives et passées
 * @access  ADMIN, MODERATOR
 */
router.get(
  '/sanctions',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  moderationController.getSanctions
);

/**
 * @route   GET /api/admin/moderation/reports
 * @desc    Signalements en attente de traitement
 * @access  ADMIN, MODERATOR
 */
router.get(
  '/reports',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  moderationController.getReports
);

/**
 * @route   PATCH /api/admin/moderation/reports/:id/review
 * @desc    Examiner et traiter un signalement
 * @access  ADMIN, MODERATOR
 */
router.patch(
  '/reports/:id/review',
  authenticate,
  authorize('ADMIN', 'MODERATOR'),
  reviewReportValidation,
  validate,
  moderationController.reviewReport
);

module.exports = router;
