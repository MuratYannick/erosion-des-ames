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
  updatePost,
  deletePost,
  moveSection,
  moveTopic,
} from "../controllers/forumController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requirePermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

// Routes publiques (lecture seule)
// Note: Les permissions de vue seront gérées au niveau du controller
router.get("/categories", getCategories);
router.get("/categories/:slug", getCategoryBySlug);
router.get("/sections", getSections);
router.get("/sections/:slug", getSectionBySlug);
router.get("/topics/:id", getTopicById);

// ═══════════════════════════════════════════════════════════
// ROUTES SECTIONS (protégées avec permissions)
// ═══════════════════════════════════════════════════════════

// Créer une section/sous-section
router.post(
  "/sections",
  protect,
  requirePermission("section.create", { sectionIdParam: "parent_section_id" }),
  createSection
);

// Modifier une section
router.put(
  "/sections/:id",
  protect,
  requirePermission("section.edit", { sectionIdParam: "id" }),
  updateSection
);

// Déplacer une section
router.put(
  "/sections/:id/move",
  protect,
  requirePermission("section.move", { sectionIdParam: "id" }),
  moveSection
);

// Supprimer une section
router.delete(
  "/sections/:id",
  protect,
  requirePermission("section.delete", { sectionIdParam: "id" }),
  deleteSection
);

// ═══════════════════════════════════════════════════════════
// ROUTES TOPICS (protégées avec permissions)
// ═══════════════════════════════════════════════════════════

// Créer un topic
router.post(
  "/topics",
  protect,
  requirePermission("topic.create", { sectionIdParam: "section_id" }),
  createTopic
);

// Modifier un topic
router.put(
  "/topics/:id",
  protect,
  requirePermission("topic.edit", { topicIdParam: "id" }),
  updateTopic
);

// Déplacer un topic
router.put(
  "/topics/:id/move",
  protect,
  requirePermission("topic.move", { topicIdParam: "id" }),
  moveTopic
);

// Supprimer un topic
router.delete(
  "/topics/:id",
  protect,
  requirePermission("topic.delete", { topicIdParam: "id" }),
  deleteTopic
);

// ═══════════════════════════════════════════════════════════
// ROUTES POSTS (protégées avec permissions)
// ═══════════════════════════════════════════════════════════

// Créer un post (réponse)
router.post(
  "/posts",
  protect,
  requirePermission("post.create", { topicIdParam: "topic_id" }),
  createPost
);

// Modifier un post
router.put(
  "/posts/:id",
  protect,
  requirePermission("post.edit", { postIdParam: "id" }),
  updatePost
);

// Supprimer un post
router.delete(
  "/posts/:id",
  protect,
  requirePermission("post.delete", { postIdParam: "id" }),
  deletePost
);

export default router;
