import express from "express";
import {
  getCategories,
  getCategoryBySlug,
  getSections,
  getSectionBySlug,
  getTopicById,
  createSection,
  createTopic,
  updateSection,
  deleteSection,
  updateTopic,
  deleteTopic,
  createPost,
  moveSection,
  moveTopic,
} from "../controllers/forumController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import { isModeratorOrAdmin, isStaff } from "../middleware/permissionMiddleware.js";

const router = express.Router();

// Routes publiques avec authentification optionnelle (lecture seule)
// optionalAuth permet de charger l'utilisateur s'il est connecté, sinon req.user = null
router.get("/categories", optionalAuth, getCategories);
router.get("/categories/:slug", optionalAuth, getCategoryBySlug);
router.get("/sections", optionalAuth, getSections);
router.get("/sections/:slug", optionalAuth, getSectionBySlug);
router.get("/topics/:id", optionalAuth, getTopicById);

// Routes protégées - Gestion des sections (Admin/Modérateur uniquement)
router.post("/sections", protect, isModeratorOrAdmin, createSection);
router.put("/sections/:id", protect, isModeratorOrAdmin, updateSection);
router.put("/sections/:id/move", protect, isModeratorOrAdmin, moveSection);
router.delete("/sections/:id", protect, isModeratorOrAdmin, deleteSection);

// Routes protégées - Gestion des topics (tous utilisateurs authentifiés)
// Note: updateTopic et deleteTopic vérifient la propriété dans le controller
router.post("/topics", protect, createTopic);
router.put("/topics/:id", protect, updateTopic);
router.put("/topics/:id/move", protect, moveTopic);
router.delete("/topics/:id", protect, deleteTopic);

// Routes protégées - Gestion des posts (tous utilisateurs authentifiés)
router.post("/posts", protect, createPost);

export default router;
