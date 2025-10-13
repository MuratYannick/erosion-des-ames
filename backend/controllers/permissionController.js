import {
  Permission,
  RolePermission,
  SectionPermission,
  TopicPermission,
  Section,
  Topic,
  User,
} from "../models/index.js";

// ═══════════════════════════════════════════════════════════
// GESTION DES PERMISSIONS GLOBALES
// ═══════════════════════════════════════════════════════════

/**
 * Récupérer toutes les permissions du système
 */
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      order: [["resource_type", "ASC"], ["action", "ASC"]],
    });

    res.json({
      success: true,
      data: permissions,
    });
  } catch (error) {
    console.error("Erreur getAllPermissions:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des permissions",
      error: error.message,
    });
  }
};

/**
 * Récupérer les permissions d'un rôle spécifique
 */
export const getRolePermissions = async (req, res) => {
  try {
    const { role } = req.params;

    // Valider le rôle
    const validRoles = ["ADMIN", "MODERATOR", "GAME_MASTER", "PLAYER"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Rôle invalide",
      });
    }

    const rolePermissions = await RolePermission.findAll({
      where: { role },
      include: [
        {
          model: Permission,
          as: "permission",
        },
      ],
    });

    res.json({
      success: true,
      data: rolePermissions,
    });
  } catch (error) {
    console.error("Erreur getRolePermissions:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des permissions du rôle",
      error: error.message,
    });
  }
};

/**
 * Attribuer ou retirer une permission à un rôle
 */
export const setRolePermission = async (req, res) => {
  try {
    const { role } = req.params;
    const { permission_id, granted } = req.body;

    // Valider le rôle
    const validRoles = ["ADMIN", "MODERATOR", "GAME_MASTER", "PLAYER"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Rôle invalide",
      });
    }

    // Vérifier que la permission existe
    const permission = await Permission.findByPk(permission_id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission non trouvée",
      });
    }

    // Vérifier si une RolePermission existe déjà
    let rolePermission = await RolePermission.findOne({
      where: { role, permission_id },
    });

    if (rolePermission) {
      // Mettre à jour
      await rolePermission.update({ granted });
    } else {
      // Créer
      rolePermission = await RolePermission.create({
        role,
        permission_id,
        granted,
      });
    }

    res.json({
      success: true,
      message: `Permission ${granted ? "accordée" : "refusée"} au rôle ${role}`,
      data: rolePermission,
    });
  } catch (error) {
    console.error("Erreur setRolePermission:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la modification de la permission",
      error: error.message,
    });
  }
};

/**
 * Supprimer une permission d'un rôle (revient aux permissions par défaut)
 */
export const deleteRolePermission = async (req, res) => {
  try {
    const { role, permission_id } = req.params;

    // Valider le rôle
    const validRoles = ["ADMIN", "MODERATOR", "GAME_MASTER", "PLAYER"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Rôle invalide",
      });
    }

    const rolePermission = await RolePermission.findOne({
      where: { role, permission_id },
    });

    if (!rolePermission) {
      return res.status(404).json({
        success: false,
        message: "Permission de rôle non trouvée",
      });
    }

    await rolePermission.destroy();

    res.json({
      success: true,
      message: "Permission de rôle supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteRolePermission:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la permission",
      error: error.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════
// PERMISSIONS SPÉCIFIQUES PAR SECTION
// ═══════════════════════════════════════════════════════════

/**
 * Récupérer toutes les permissions d'une section
 */
export const getSectionPermissions = async (req, res) => {
  try {
    const { section_id } = req.params;

    // Vérifier que la section existe
    const section = await Section.findByPk(section_id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section non trouvée",
      });
    }

    const sectionPermissions = await SectionPermission.findAll({
      where: { section_id },
      include: [
        {
          model: Permission,
          as: "permission",
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    res.json({
      success: true,
      data: {
        section,
        permissions: sectionPermissions,
      },
    });
  } catch (error) {
    console.error("Erreur getSectionPermissions:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des permissions de la section",
      error: error.message,
    });
  }
};

/**
 * Définir une permission spécifique pour une section
 */
export const setSectionPermission = async (req, res) => {
  try {
    const { section_id } = req.params;
    const { permission_id, role, user_id, granted, inherit_to_subsections } =
      req.body;

    // Validation
    if (!permission_id) {
      return res.status(400).json({
        success: false,
        message: "L'ID de la permission est requis",
      });
    }

    if (!role && !user_id) {
      return res.status(400).json({
        success: false,
        message: "Soit le rôle, soit l'ID utilisateur doit être fourni",
      });
    }

    if (role && user_id) {
      return res.status(400).json({
        success: false,
        message:
          "Vous ne pouvez pas spécifier à la fois un rôle et un utilisateur",
      });
    }

    // Vérifier que la section existe
    const section = await Section.findByPk(section_id);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section non trouvée",
      });
    }

    // Vérifier que la permission existe
    const permission = await Permission.findByPk(permission_id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission non trouvée",
      });
    }

    // Si user_id est fourni, vérifier que l'utilisateur existe
    if (user_id) {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }
    }

    // Vérifier si une permission existe déjà
    const where = {
      section_id,
      permission_id,
    };

    if (role) {
      where.role = role;
      where.user_id = null;
    } else {
      where.user_id = user_id;
      where.role = null;
    }

    let sectionPermission = await SectionPermission.findOne({ where });

    if (sectionPermission) {
      // Mettre à jour
      await sectionPermission.update({
        granted,
        inherit_to_subsections:
          inherit_to_subsections !== undefined
            ? inherit_to_subsections
            : sectionPermission.inherit_to_subsections,
      });
    } else {
      // Créer
      sectionPermission = await SectionPermission.create({
        section_id,
        permission_id,
        role: role || null,
        user_id: user_id || null,
        granted,
        inherit_to_subsections:
          inherit_to_subsections !== undefined ? inherit_to_subsections : true,
      });
    }

    // Recharger avec les relations
    await sectionPermission.reload({
      include: [
        {
          model: Permission,
          as: "permission",
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Permission de section configurée avec succès",
      data: sectionPermission,
    });
  } catch (error) {
    console.error("Erreur setSectionPermission:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la configuration de la permission",
      error: error.message,
    });
  }
};

/**
 * Supprimer une permission spécifique d'une section
 */
export const deleteSectionPermission = async (req, res) => {
  try {
    const { id } = req.params;

    const sectionPermission = await SectionPermission.findByPk(id);
    if (!sectionPermission) {
      return res.status(404).json({
        success: false,
        message: "Permission de section non trouvée",
      });
    }

    await sectionPermission.destroy();

    res.json({
      success: true,
      message: "Permission de section supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteSectionPermission:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la permission",
      error: error.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════
// PERMISSIONS SPÉCIFIQUES PAR TOPIC
// ═══════════════════════════════════════════════════════════

/**
 * Récupérer toutes les permissions d'un topic
 */
export const getTopicPermissions = async (req, res) => {
  try {
    const { topic_id } = req.params;

    // Vérifier que le topic existe
    const topic = await Topic.findByPk(topic_id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic non trouvé",
      });
    }

    const topicPermissions = await TopicPermission.findAll({
      where: { topic_id },
      include: [
        {
          model: Permission,
          as: "permission",
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    res.json({
      success: true,
      data: {
        topic,
        permissions: topicPermissions,
      },
    });
  } catch (error) {
    console.error("Erreur getTopicPermissions:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des permissions du topic",
      error: error.message,
    });
  }
};

/**
 * Définir une permission spécifique pour un topic
 */
export const setTopicPermission = async (req, res) => {
  try {
    const { topic_id } = req.params;
    const { permission_id, role, user_id, granted } = req.body;

    // Validation
    if (!permission_id) {
      return res.status(400).json({
        success: false,
        message: "L'ID de la permission est requis",
      });
    }

    if (!role && !user_id) {
      return res.status(400).json({
        success: false,
        message: "Soit le rôle, soit l'ID utilisateur doit être fourni",
      });
    }

    if (role && user_id) {
      return res.status(400).json({
        success: false,
        message:
          "Vous ne pouvez pas spécifier à la fois un rôle et un utilisateur",
      });
    }

    // Vérifier que le topic existe
    const topic = await Topic.findByPk(topic_id);
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: "Topic non trouvé",
      });
    }

    // Vérifier que la permission existe
    const permission = await Permission.findByPk(permission_id);
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission non trouvée",
      });
    }

    // Si user_id est fourni, vérifier que l'utilisateur existe
    if (user_id) {
      const user = await User.findByPk(user_id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé",
        });
      }
    }

    // Vérifier si une permission existe déjà
    const where = {
      topic_id,
      permission_id,
    };

    if (role) {
      where.role = role;
      where.user_id = null;
    } else {
      where.user_id = user_id;
      where.role = null;
    }

    let topicPermission = await TopicPermission.findOne({ where });

    if (topicPermission) {
      // Mettre à jour
      await topicPermission.update({ granted });
    } else {
      // Créer
      topicPermission = await TopicPermission.create({
        topic_id,
        permission_id,
        role: role || null,
        user_id: user_id || null,
        granted,
      });
    }

    // Recharger avec les relations
    await topicPermission.reload({
      include: [
        {
          model: Permission,
          as: "permission",
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Permission de topic configurée avec succès",
      data: topicPermission,
    });
  } catch (error) {
    console.error("Erreur setTopicPermission:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la configuration de la permission",
      error: error.message,
    });
  }
};

/**
 * Supprimer une permission spécifique d'un topic
 */
export const deleteTopicPermission = async (req, res) => {
  try {
    const { id } = req.params;

    const topicPermission = await TopicPermission.findByPk(id);
    if (!topicPermission) {
      return res.status(404).json({
        success: false,
        message: "Permission de topic non trouvée",
      });
    }

    await topicPermission.destroy();

    res.json({
      success: true,
      message: "Permission de topic supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur deleteTopicPermission:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression de la permission",
      error: error.message,
    });
  }
};

// ═══════════════════════════════════════════════════════════
// VÉRIFICATION DES PERMISSIONS POUR UN UTILISATEUR
// ═══════════════════════════════════════════════════════════

/**
 * Vérifier les permissions d'un utilisateur pour une ressource
 */
export const checkUserPermissions = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { section_id, topic_id } = req.query;

    // Vérifier que l'utilisateur existe
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Récupérer toutes les permissions du système
    const allPermissions = await Permission.findAll();

    // Récupérer les permissions du rôle de l'utilisateur
    const rolePermissions = await RolePermission.findAll({
      where: { role: user.role, granted: true },
      include: [{ model: Permission, as: "permission" }],
    });

    const result = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      rolePermissions: rolePermissions.map((rp) => rp.permission.name),
    };

    // Si section_id est fourni
    if (section_id) {
      const sectionPermissions = await SectionPermission.findAll({
        where: { section_id, granted: true },
        include: [{ model: Permission, as: "permission" }],
      });

      result.sectionPermissions = sectionPermissions
        .filter((sp) => sp.role === user.role || sp.user_id === user.id)
        .map((sp) => sp.permission.name);
    }

    // Si topic_id est fourni
    if (topic_id) {
      const topicPermissions = await TopicPermission.findAll({
        where: { topic_id, granted: true },
        include: [{ model: Permission, as: "permission" }],
      });

      result.topicPermissions = topicPermissions
        .filter((tp) => tp.role === user.role || tp.user_id === user.id)
        .map((tp) => tp.permission.name);
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Erreur checkUserPermissions:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification des permissions",
      error: error.message,
    });
  }
};

export default {
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
};
