import express from "express";

// Importer les contrôleurs séparés
import {
  getCategories,
  getCategoryBySlug,
} from "../controllers/forum/categoryController.js";

import {
  getSections,
  getSectionBySlug,
  createSection,
  updateSection,
  deleteSection,
  moveSection,
} from "../controllers/forum/sectionController.js";

import {
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  moveTopic,
  togglePinTopic,
  toggleLockTopic,
} from "../controllers/forum/topicController.js";

import {
  createPost,
  updatePost,
  deletePost,
  movePost,
} from "../controllers/forum/postController.js";

import {
  getPermissions,
  updatePermissions,
  inheritPermissionsFromParent,
} from "../controllers/forum/permissionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ═══════════════════════════════════════════════════════════
// ROUTES PUBLIQUES (lecture seule)
// ═══════════════════════════════════════════════════════════

// Catégories
router.get("/categories", getCategories);
router.get("/categories/:slug", getCategoryBySlug);

// Sections
router.get("/sections", getSections);
router.get("/sections/:slug", getSectionBySlug);

// Topics
router.get("/topics/:id", getTopicById);

// ═══════════════════════════════════════════════════════════
// ROUTES PROTÉGÉES (nécessitent une authentification JWT)
// ═══════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────
// SECTIONS - CRUD complet
// ──────────────────────────────────────────────────────────
router.post("/sections", protect, createSection);
router.put("/sections/:id", protect, updateSection);
router.put("/sections/:id/move", protect, moveSection);
router.delete("/sections/:id", protect, deleteSection);

// ──────────────────────────────────────────────────────────
// TOPICS - CRUD complet + actions spéciales
// ──────────────────────────────────────────────────────────
router.post("/topics", protect, createTopic);
router.put("/topics/:id", protect, updateTopic);
router.put("/topics/:id/move", protect, moveTopic);
router.put("/topics/:id/pin", protect, togglePinTopic);
router.put("/topics/:id/lock", protect, toggleLockTopic);
router.delete("/topics/:id", protect, deleteTopic);

// ──────────────────────────────────────────────────────────
// POSTS - CRUD complet
// ──────────────────────────────────────────────────────────
router.post("/posts", protect, createPost);
router.put("/posts/:id", protect, updatePost);
router.put("/posts/:id/move", protect, movePost);
router.delete("/posts/:id", protect, deletePost);

// ──────────────────────────────────────────────────────────
// PERMISSIONS - Gestion des permissions du forum
// ──────────────────────────────────────────────────────────
// Récupérer les permissions d'une entité (public pour voir les restrictions)
router.get("/permissions/:entityType/:entityId", getPermissions);

// Mettre à jour les permissions (protégé)
router.put("/permissions/:entityType/:entityId", protect, updatePermissions);

// Hériter des permissions du parent (protégé)
router.post("/permissions/:entityType/:entityId/inherit", protect, inheritPermissionsFromParent);

export default router;
