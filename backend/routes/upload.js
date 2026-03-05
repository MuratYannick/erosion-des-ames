'use strict';

const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const { asyncHandler, ApiError } = require('../middlewares/errorHandler');
const { processAvatar } = require('../utils/imageProcessor');

/**
 * @route   POST /api/upload/avatar
 * @desc    Upload et traitement d'un avatar utilisateur
 *          Le fichier est reçu en mémoire (multer memoryStorage), puis traité
 *          par sharp (redimensionnement 200x200, conversion WebP) avant sauvegarde.
 * @access  Authentifié
 */
router.post(
  '/avatar',
  authenticate,
  upload.single('avatar'),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new ApiError(400, 'Aucun fichier fourni');
    }

    const url = await processAvatar(req.file.buffer, req.user.id);

    res.status(200).json({
      success: true,
      data: { url },
      message: 'Avatar uploadé avec succès',
    });
  })
);

module.exports = router;
