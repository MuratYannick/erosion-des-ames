import express from "express";
import {
  getAllClans,
  getClanById,
  getClansByType,
  getClansByFaction,
} from "../controllers/clanController.js";

const router = express.Router();

// GET /api/clans - Récupérer tous les clans
router.get("/", getAllClans);

// GET /api/clans/type/:type - Récupérer les clans par type
router.get("/type/:type", getClansByType);

// GET /api/clans/faction/:factionId - Récupérer les clans d'une faction
router.get("/faction/:factionId", getClansByFaction);

// GET /api/clans/:id - Récupérer un clan par ID
router.get("/:id", getClanById);

export default router;
