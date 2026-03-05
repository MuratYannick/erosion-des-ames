'use strict';

const multer = require('multer');

// Stockage en mémoire pour passer le buffer à sharp ensuite
const storage = multer.memoryStorage();

/**
 * Filtre : accepte uniquement les formats image courants
 */
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP, GIF'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
});

module.exports = upload;
