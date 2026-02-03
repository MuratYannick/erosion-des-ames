'use strict';

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');

/**
 * Montage des routes d'authentification
 */
router.use('/auth', authRoutes);

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
