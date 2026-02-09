'use strict';

const express = require('express');
const router = express.Router();

const searchRoutes = require('./search');
const categoriesRoutes = require('./categories');
const topicsRoutes = require('./topics');
const postsRoutes = require('./posts');
const reportsRoutes = require('./reports');

/**
 * Montage des sous-routes du forum
 */
router.use('/search', searchRoutes);
router.use('/categories', categoriesRoutes);
router.use('/topics', topicsRoutes);
router.use('/posts', postsRoutes);
router.use('/reports', reportsRoutes);

module.exports = router;
