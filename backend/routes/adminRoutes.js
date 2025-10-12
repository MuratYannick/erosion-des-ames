import express from "express";
import {
  getRoles,
  getUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
  activateUser,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/permissionMiddleware.js";

const router = express.Router();

// Routes pour les rôles (accessible par tous les utilisateurs authentifiés)
router.get("/roles", protect, getRoles);

// Routes pour la gestion des utilisateurs (Admin uniquement)
router.get("/users", protect, isAdmin, getUsers);
router.get("/users/:id", protect, isAdmin, getUserById);
router.put("/users/:id/role", protect, isAdmin, updateUserRole);
router.put("/users/:id/deactivate", protect, isAdmin, deactivateUser);
router.put("/users/:id/activate", protect, isAdmin, activateUser);

export default router;
