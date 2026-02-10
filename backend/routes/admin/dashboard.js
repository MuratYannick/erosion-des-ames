'use strict';

const express = require('express');
const router = express.Router();

const adminDashboardController = require('../../controllers/adminDashboardController');
const { authenticate, authorize } = require('../../middlewares/auth');

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Statistiques générales du site
 * @access  ADMIN
 */
router.get(
  '/stats',
  authenticate,
  authorize('ADMIN'),
  adminDashboardController.getStats
);

module.exports = router;
