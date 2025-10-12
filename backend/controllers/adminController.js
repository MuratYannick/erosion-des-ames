import { User, Role, Character } from "../models/index.js";
import { Op } from "sequelize";

/**
 * Récupérer tous les rôles
 */
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      where: { is_active: true },
      order: [["level", "DESC"]],
      attributes: ["id", "name", "label", "description", "level"],
    });

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error("Erreur getRoles:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des rôles",
      error: error.message,
    });
  }
};

/**
 * Récupérer tous les utilisateurs (avec pagination)
 */
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const offset = (page - 1) * limit;

    const where = { is_active: true };
    if (search) {
      where[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name", "label", "level"],
        },
        {
          model: Character,
          as: "characters",
          attributes: ["id", "name", "level"],
        },
      ],
      attributes: { exclude: ["password_hash"] },
      order: [["created_at", "DESC"]],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Erreur getUsers:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs",
      error: error.message,
    });
  }
};

/**
 * Récupérer un utilisateur par ID
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name", "label", "level"],
        },
        {
          model: Character,
          as: "characters",
        },
      ],
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Erreur getUserById:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'utilisateur",
      error: error.message,
    });
  }
};

/**
 * Mettre à jour le rôle d'un utilisateur (Admin uniquement)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role_id } = req.body;

    // Vérifier que le rôle existe
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Rôle non trouvé",
      });
    }

    // Récupérer l'utilisateur
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Empêcher un utilisateur de modifier son propre rôle
    if (user.id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous ne pouvez pas modifier votre propre rôle",
      });
    }

    // Mettre à jour le rôle
    await user.update({ role_id });

    // Récupérer l'utilisateur mis à jour avec son rôle
    const updatedUser = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "name", "label", "level"],
        },
      ],
      attributes: { exclude: ["password_hash"] },
    });

    res.json({
      success: true,
      message: "Rôle mis à jour avec succès",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Erreur updateUserRole:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du rôle",
      error: error.message,
    });
  }
};

/**
 * Désactiver un utilisateur (Admin uniquement)
 */
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Empêcher un utilisateur de se désactiver lui-même
    if (user.id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Vous ne pouvez pas vous désactiver vous-même",
      });
    }

    await user.update({ is_active: false });

    res.json({
      success: true,
      message: "Utilisateur désactivé avec succès",
    });
  } catch (error) {
    console.error("Erreur deactivateUser:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la désactivation de l'utilisateur",
      error: error.message,
    });
  }
};

/**
 * Réactiver un utilisateur (Admin uniquement)
 */
export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    await user.update({ is_active: true });

    res.json({
      success: true,
      message: "Utilisateur réactivé avec succès",
    });
  } catch (error) {
    console.error("Erreur activateUser:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la réactivation de l'utilisateur",
      error: error.message,
    });
  }
};
