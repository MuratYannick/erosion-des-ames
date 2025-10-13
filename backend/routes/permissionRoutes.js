import express from "express";
import {
  getAllPermissions,
  getRolePermissions,
  setRolePermission,
  deleteRolePermission,
  getSectionPermissions,
  setSectionPermission,
  deleteSectionPermission,
  getTopicPermissions,
  setTopicPermission,
  deleteTopicPermission,
  checkUserPermissions,
} from "../controllers/permissionController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/permissionMiddleware.js";

const router = express.Router();

// ═══════════════════════════════════════════════════════════
// ROUTES PERMISSIONS GLOBALES (Admin uniquement)
// ═══════════════════════════════════════════════════════════

// Récupérer toutes les permissions du système
router.get("/", protect, requireAdmin, getAllPermissions);

// Récupérer les permissions d'un rôle
router.get("/roles/:role", protect, requireAdmin, getRolePermissions);

// Attribuer/modifier une permission pour un rôle
router.post("/roles/:role", protect, requireAdmin, setRolePermission);

// Supprimer une permission d'un rôle
router.delete(
  "/roles/:role/:permission_id",
  protect,
  requireAdmin,
  deleteRolePermission
);

// ═══════════════════════════════════════════════════════════
// ROUTES PERMISSIONS PAR SECTION (Admin uniquement)
// ═══════════════════════════════════════════════════════════

// Récupérer les permissions d'une section
router.get(
  "/sections/:section_id",
  protect,
  requireAdmin,
  getSectionPermissions
);

// Définir une permission pour une section
router.post(
  "/sections/:section_id",
  protect,
  requireAdmin,
  setSectionPermission
);

// Supprimer une permission spécifique d'une section
router.delete(
  "/sections/permission/:id",
  protect,
  requireAdmin,
  deleteSectionPermission
);

// ═══════════════════════════════════════════════════════════
// ROUTES PERMISSIONS PAR TOPIC (Admin uniquement)
// ═══════════════════════════════════════════════════════════

// Récupérer les permissions d'un topic
router.get("/topics/:topic_id", protect, requireAdmin, getTopicPermissions);

// Définir une permission pour un topic
router.post("/topics/:topic_id", protect, requireAdmin, setTopicPermission);

// Supprimer une permission spécifique d'un topic
router.delete(
  "/topics/permission/:id",
  protect,
  requireAdmin,
  deleteTopicPermission
);

// ═══════════════════════════════════════════════════════════
// VÉRIFICATION DES PERMISSIONS UTILISATEUR
// ═══════════════════════════════════════════════════════════

// Vérifier les permissions d'un utilisateur (Admin ou l'utilisateur lui-même)
router.get("/users/:user_id/check", protect, checkUserPermissions);

export default router;
