'use strict';

const { ForumCategory } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');
const categoryPermissionService = require('../services/categoryPermissionService');

/**
 * Récupère les permissions de l'utilisateur courant pour une catégorie
 * GET /api/forum/categories/:id/my-permissions
 */
const getMyPermissions = asyncHandler(async (req, res) => {
  // Vérifier que la catégorie existe
  const category = await ForumCategory.findByPk(req.params.id, {
    attributes: ['id', 'name'],
  });

  if (!category) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  // Préparer les options pour la résolution des permissions
  const options = {};

  // Si un characterId est fourni dans la query string, l'ajouter aux options
  if (req.query.characterId) {
    options.characterId = req.query.characterId;

    // TODO: En production, il faudrait vérifier que le characterId appartient bien à l'utilisateur
    // et charger les informations de faction/clan du personnage pour les ajouter aux options
    // Pour l'instant, on passe juste le characterId
  }

  // Obtenir les permissions de l'utilisateur pour cette catégorie
  // req.user peut être null si l'utilisateur n'est pas connecté (optionalAuth)
  const permissions = await categoryPermissionService.getCategoryPermissionsForUser(
    req.user,
    category.id,
    options
  );

  res.json({
    success: true,
    data: {
      permissions,
      categoryId: category.id,
      categoryName: category.name,
    },
  });
});

module.exports = {
  getMyPermissions,
};
