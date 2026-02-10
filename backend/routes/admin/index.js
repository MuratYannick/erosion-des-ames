'use strict';

const express = require('express');
const router = express.Router();

const dashboardRoutes = require('./dashboard');
const usersRoutes = require('./users');
const charactersRoutes = require('./characters');
const forumRoutes = require('./forum');
const moderationRoutes = require('./moderation');

/**
 * Montage des sous-routes d'administration
 */
router.use('/dashboard', dashboardRoutes);
router.use('/users', usersRoutes);
router.use('/characters', charactersRoutes);
router.use('/forum', forumRoutes);
router.use('/moderation', moderationRoutes);

module.exports = router;
