import { hasPermission } from "../utils/permissionHelper.js";

/**
 * Middleware générique pour vérifier une permission
 * @param {string} permissionName - Nom de la permission à vérifier
 * @param {Object} options - Options pour extraire les paramètres de la requête
 * @returns {Function} Middleware Express
 */
export const requirePermission = (permissionName, options = {}) => {
  return async (req, res, next) => {
    try {
      // Vérifier que l'utilisateur est authentifié
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentification requise",
        });
      }

      // Extraire les paramètres selon les options
      const permissionOptions = {};

      if (options.sectionIdParam) {
        permissionOptions.sectionId =
          req.params[options.sectionIdParam] ||
          req.body[options.sectionIdParam];
      }

      if (options.topicIdParam) {
        permissionOptions.topicId =
          req.params[options.topicIdParam] || req.body[options.topicIdParam];
      }

      if (options.authorIdParam) {
        permissionOptions.authorUserId =
          req.params[options.authorIdParam] || req.body[options.authorIdParam];
      }

      // Si une ressource est attachée à la requête (via un middleware précédent)
      if (req.section) {
        permissionOptions.sectionId = req.section.id;
      }

      if (req.topic) {
        permissionOptions.topicId = req.topic.id;
        permissionOptions.sectionId = req.topic.section_id;
        permissionOptions.authorUserId = req.topic.author_user_id;
      }

      if (req.post) {
        permissionOptions.authorUserId = req.post.author_user_id;
      }

      // Vérifier la permission
      const hasAccess = await hasPermission(
        req.user,
        permissionName,
        permissionOptions
      );

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: "Vous n'avez pas la permission d'effectuer cette action",
          permission: permissionName,
        });
      }

      next();
    } catch (error) {
      console.error("Erreur middleware permission:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la vérification des permissions",
      });
    }
  };
};

/**
 * Middleware pour vérifier si l'utilisateur est admin
 * @returns {Function} Middleware Express
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentification requise",
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: "Accès réservé aux administrateurs",
    });
  }

  next();
};

/**
 * Middleware pour vérifier si l'utilisateur est au moins modérateur
 * @returns {Function} Middleware Express
 */
export const requireModerator = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentification requise",
    });
  }

  if (!["ADMIN", "MODERATOR"].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: "Accès réservé aux modérateurs",
    });
  }

  next();
};

/**
 * Middleware pour vérifier plusieurs permissions (OR logic)
 * L'utilisateur doit avoir AU MOINS UNE des permissions listées
 * @param {string[]} permissionNames - Liste des noms de permissions
 * @param {Object} options - Options pour extraire les paramètres
 * @returns {Function} Middleware Express
 */
export const requireAnyPermission = (permissionNames, options = {}) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentification requise",
        });
      }

      // Extraire les paramètres
      const permissionOptions = {};

      if (options.sectionIdParam) {
        permissionOptions.sectionId =
          req.params[options.sectionIdParam] ||
          req.body[options.sectionIdParam];
      }

      if (options.topicIdParam) {
        permissionOptions.topicId =
          req.params[options.topicIdParam] || req.body[options.topicIdParam];
      }

      if (req.section) permissionOptions.sectionId = req.section.id;
      if (req.topic) {
        permissionOptions.topicId = req.topic.id;
        permissionOptions.sectionId = req.topic.section_id;
      }

      // Vérifier chaque permission
      for (const permissionName of permissionNames) {
        const hasAccess = await hasPermission(
          req.user,
          permissionName,
          permissionOptions
        );
        if (hasAccess) {
          return next();
        }
      }

      // Aucune permission ne correspond
      return res.status(403).json({
        success: false,
        error: "Vous n'avez pas la permission d'effectuer cette action",
        requiredPermissions: permissionNames,
      });
    } catch (error) {
      console.error("Erreur middleware permission:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la vérification des permissions",
      });
    }
  };
};

/**
 * Middleware pour vérifier plusieurs permissions (AND logic)
 * L'utilisateur doit avoir TOUTES les permissions listées
 * @param {string[]} permissionNames - Liste des noms de permissions
 * @param {Object} options - Options pour extraire les paramètres
 * @returns {Function} Middleware Express
 */
export const requireAllPermissions = (permissionNames, options = {}) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Authentification requise",
        });
      }

      // Extraire les paramètres
      const permissionOptions = {};

      if (options.sectionIdParam) {
        permissionOptions.sectionId =
          req.params[options.sectionIdParam] ||
          req.body[options.sectionIdParam];
      }

      if (options.topicIdParam) {
        permissionOptions.topicId =
          req.params[options.topicIdParam] || req.body[options.topicIdParam];
      }

      if (req.section) permissionOptions.sectionId = req.section.id;
      if (req.topic) {
        permissionOptions.topicId = req.topic.id;
        permissionOptions.sectionId = req.topic.section_id;
      }

      // Vérifier toutes les permissions
      for (const permissionName of permissionNames) {
        const hasAccess = await hasPermission(
          req.user,
          permissionName,
          permissionOptions
        );
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            error: "Vous n'avez pas toutes les permissions requises",
            requiredPermissions: permissionNames,
          });
        }
      }

      next();
    } catch (error) {
      console.error("Erreur middleware permission:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la vérification des permissions",
      });
    }
  };
};

export default {
  requirePermission,
  requireAdmin,
  requireModerator,
  requireAnyPermission,
  requireAllPermissions,
};
