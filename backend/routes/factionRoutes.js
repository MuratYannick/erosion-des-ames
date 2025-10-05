import express from "express";
import {
  getAllFactions,
  getFactionById,
  getPlayableFactions,
} from "../controllers/factionController.js";

const router = express.Router();

// GET /api/factions - Récupérer toutes les factions
router.get("/", getAllFactions);

// GET /api/factions/playable - Récupérer les factions jouables
router.get("/playable", getPlayableFactions);

// GET /api/factions/:id - Récupérer une faction par ID
router.get("/:id", getFactionById);

export default router;
