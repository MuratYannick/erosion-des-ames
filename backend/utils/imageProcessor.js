'use strict';

const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'avatars');

/**
 * Crée le dossier de destination s'il n'existe pas
 * @param {string} dir
 */
const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

/**
 * Traite un buffer image : redimensionne à 200x200, convertit en WebP et sauvegarde.
 * @param {Buffer} buffer  - Buffer de l'image source (depuis multer memoryStorage)
 * @param {string} userId  - ID utilisateur (inclus dans le nom de fichier)
 * @returns {Promise<string>} URL relative de l'avatar sauvegardé (ex: /uploads/avatars/avatar-uuid-1234567890.webp)
 */
const processAvatar = async (buffer, userId) => {
  await ensureDir(UPLOAD_DIR);

  const filename = `avatar-${userId}-${Date.now()}.webp`;
  const filepath = path.join(UPLOAD_DIR, filename);

  await sharp(buffer)
    .resize(200, 200, { fit: 'cover', position: 'center' })
    .webp({ quality: 80 })
    .toFile(filepath);

  return `/uploads/avatars/${filename}`;
};

module.exports = { processAvatar };
