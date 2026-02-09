'use strict';

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const ethnicitiesRoutes = require('./ethnicities');
const factionsRoutes = require('./factions');
const clansRoutes = require('./clans');
const charactersRoutes = require('./characters');
const forumRoutes = require('./forum');

/**
 * Montage des routes
 */
router.use('/auth', authRoutes);
router.use('/ethnicities', ethnicitiesRoutes);
router.use('/factions', factionsRoutes);
router.use('/clans', clansRoutes);
router.use('/characters', charactersRoutes);
router.use('/forum', forumRoutes);

/**
 * Route de santé de l'API (alternative à /api/health)
 * Peut être utilisée pour les vérifications de disponibilité
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'operational',
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = router;
