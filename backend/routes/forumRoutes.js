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
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes publiques (lecture seule)
router.get("/categories", getCategories);
router.get("/categories/:slug", getCategoryBySlug);
router.get("/sections", getSections);
router.get("/sections/:slug", getSectionBySlug);
router.get("/topics/:id", getTopicById);

// Routes protégées (nécessitent une authentification)
router.post("/sections", protect, createSection);
router.put("/sections/:id", protect, updateSection);
router.put("/sections/:id/move", protect, moveSection);
router.delete("/sections/:id", protect, deleteSection);
router.post("/topics", protect, createTopic);
router.put("/topics/:id", protect, updateTopic);
router.put("/topics/:id/move", protect, moveTopic);
router.delete("/topics/:id", protect, deleteTopic);
router.post("/posts", protect, createPost);

export default router;
