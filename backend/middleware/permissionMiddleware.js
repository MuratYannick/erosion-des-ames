/**
 * Middleware pour vérifier les permissions basées sur les rôles
 */

/**
 * Vérifie que l'utilisateur a l'un des rôles spécifiés
 * @param {string[]} allowedRoles - Liste des noms de rôles autorisés (ex: ['admin', 'moderator'])
 * @returns {Function} Middleware Express
 */
export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Vérifier que l'utilisateur est authentifié
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Non autorisé - Authentification requise",
        });
      }

      // Vérifier que l'utilisateur a un rôle
      if (!req.user.role) {
        return res.status(403).json({
          success: false,
          message: "Accès refusé - Aucun rôle défini",
        });
      }

      // Vérifier si le rôle de l'utilisateur est dans la liste autorisée
      const userRoleName = req.user.role.name;
      if (!allowedRoles.includes(userRoleName)) {
        return res.status(403).json({
          success: false,
          message: "Accès refusé - Permissions insuffisantes",
          required: allowedRoles,
          current: userRoleName,
        });
      }

      next();
    } catch (error) {
      console.error("Erreur checkRole:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification des permissions",
        error: error.message,
      });
    }
  };
};

/**
 * Vérifie que l'utilisateur a un niveau de permission minimum
 * @param {number} minLevel - Niveau minimum requis
 * @returns {Function} Middleware Express
 */
export const checkLevel = (minLevel) => {
  return (req, res, next) => {
    try {
      // Vérifier que l'utilisateur est authentifié
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Non autorisé - Authentification requise",
        });
      }

      // Vérifier que l'utilisateur a un rôle
      if (!req.user.role) {
        return res.status(403).json({
          success: false,
          message: "Accès refusé - Aucun rôle défini",
        });
      }

      // Vérifier le niveau de permission
      const userLevel = req.user.role.level;
      if (userLevel < minLevel) {
        return res.status(403).json({
          success: false,
          message: "Accès refusé - Niveau de permission insuffisant",
          required: minLevel,
          current: userLevel,
        });
      }

      next();
    } catch (error) {
      console.error("Erreur checkLevel:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la vérification des permissions",
        error: error.message,
      });
    }
  };
};

/**
 * Vérifie que l'utilisateur est administrateur
 */
export const isAdmin = checkRole("admin");

/**
 * Vérifie que l'utilisateur est admin ou modérateur
 */
export const isModeratorOrAdmin = checkRole("admin", "moderator");

/**
 * Vérifie que l'utilisateur est admin, modérateur ou maître du jeu
 */
export const isStaff = checkRole("admin", "moderator", "game_master");
