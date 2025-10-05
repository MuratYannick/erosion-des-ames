import express from 'express';
import {
  createCharacter,
  getMyCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter
} from '../controllers/characterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes sont protégées (nécessitent un token)
router.use(protect);

// POST /api/characters - Créer un personnage
router.post('/', createCharacter);

// GET /api/characters - Récupérer tous mes personnages
router.get('/', getMyCharacters);

// GET /api/characters/:id - Récupérer un personnage spécifique
router.get('/:id', getCharacterById);

// PUT /api/characters/:id - Mettre à jour un personnage
router.put('/:id', updateCharacter);

// DELETE /api/characters/:id - Supprimer un personnage
router.delete('/:id', deleteCharacter);

export default router;