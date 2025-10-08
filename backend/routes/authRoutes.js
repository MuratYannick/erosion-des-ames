import express from "express";
import { register, login, getMe, acceptTerms } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register - Inscription
router.post("/register", register);

// POST /api/auth/login - Connexion
router.post("/login", login);

// GET /api/auth/me - Profil utilisateur (protégé)
router.get("/me", protect, getMe);

// POST /api/auth/accept-terms - Accepter les CGU (protégé)
router.post("/accept-terms", protect, acceptTerms);

export default router;
