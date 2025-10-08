import express from "express";
import {
  getCategories,
  getCategoryBySlug,
  getSections,
  getSectionBySlug,
  getTopicById,
} from "../controllers/forumController.js";

const router = express.Router();

// Routes publiques (lecture seule pour le moment)
router.get("/categories", getCategories);
router.get("/categories/:slug", getCategoryBySlug);
router.get("/sections", getSections);
router.get("/sections/:slug", getSectionBySlug);
router.get("/topics/:id", getTopicById);

export default router;
