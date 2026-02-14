'use strict';

const { CategoryPermission, ForumCategory, sequelize } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');
const categoryPermissionService = require('../services/categoryPermissionService');

/**
 * Liste les permissions directes d'une catégorie (sans héritage)
 * GET /api/admin/forum/categories/:id/permissions
 */
const getPermissions = asyncHandler(async (req, res) => {
  const category = await ForumCategory.findByPk(req.params.id);

  if (!category) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  const permissions = await CategoryPermission.findAll({
    where: { categoryId: req.params.id },
    order: [
      ['permission', 'ASC'],
      ['granteeType', 'ASC'],
    ],
  });

  res.status(200).json({
    success: true,
    data: { permissions },
  });
});

/**
 * Liste les permissions effectives d'une catégorie (directes + héritées)
 * GET /api/admin/forum/categories/:id/permissions/effective
 */
const getEffectivePermissions = asyncHandler(async (req, res) => {
  const category = await ForumCategory.findByPk(req.params.id);

  if (!category) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  // Charger les permissions directes
  const direct = await CategoryPermission.findAll({
    where: { categoryId: req.params.id },
    order: [
      ['permission', 'ASC'],
      ['granteeType', 'ASC'],
    ],
  });

  // Charger les permissions effectives (directes + héritées)
  const effective = await categoryPermissionService.resolvePermissions(req.params.id);

  // Calculer les permissions héritées uniquement (différence entre effective et direct)
  const directKeys = new Set(
    direct.map(p => `${p.permission}|${p.granteeType}|${p.granteeId || 'null'}`)
  );

  const inherited = effective.filter(p => {
    const key = `${p.permission}|${p.granteeType}|${p.granteeId || 'null'}`;
    return !directKeys.has(key);
  });

  res.status(200).json({
    success: true,
    data: {
      direct,
      inherited,
      effective,
    },
  });
});

/**
 * Ajoute une permission à une catégorie
 * POST /api/admin/forum/categories/:id/permissions
 * Body: { permission, granteeType, granteeId }
 */
const addPermission = asyncHandler(async (req, res) => {
  const { permission, granteeType, granteeId } = req.body;

  // Vérifier que la catégorie existe
  const category = await ForumCategory.findByPk(req.params.id);
  if (!category) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  // Valider que permission est dans l'ENUM
  if (!CategoryPermission.PERMISSIONS.includes(permission)) {
    throw ApiError.badRequest(`Permission invalide. Valeurs autorisées: ${CategoryPermission.PERMISSIONS.join(', ')}`);
  }

  // Valider que granteeType est dans l'ENUM
  if (!CategoryPermission.GRANTEE_TYPES.includes(granteeType)) {
    throw ApiError.badRequest(`Type de cible invalide. Valeurs autorisées: ${CategoryPermission.GRANTEE_TYPES.join(', ')}`);
  }

  // Valider granteeId selon granteeType
  const requiresId = CategoryPermission.GRANTEE_REQUIRES_ID.includes(granteeType);

  if (requiresId && (!granteeId || granteeId === '')) {
    throw ApiError.badRequest(`Le champ granteeId est requis pour le type de cible "${granteeType}"`);
  }

  if (!requiresId && granteeId && granteeId !== '') {
    throw ApiError.badRequest(`Le champ granteeId ne doit pas être fourni pour le type de cible "${granteeType}"`);
  }

  // Vérifier l'unicité (même combinaison categoryId + permission + granteeType + granteeId)
  const existing = await CategoryPermission.findOne({
    where: {
      categoryId: req.params.id,
      permission,
      granteeType,
      granteeId: granteeId || null,
    },
  });

  if (existing) {
    throw ApiError.conflict('Cette permission existe déjà pour cette catégorie et cette cible');
  }

  // Créer la permission
  const newPermission = await CategoryPermission.create({
    categoryId: req.params.id,
    permission,
    granteeType,
    granteeId: granteeId || null,
  });

  // Invalider le cache
  await categoryPermissionService.invalidateCache(req.params.id);

  res.status(201).json({
    success: true,
    data: { permission: newPermission },
    message: 'Permission ajoutée avec succès',
  });
});

/**
 * Supprime une permission d'une catégorie
 * DELETE /api/admin/forum/categories/:id/permissions/:permissionId
 */
const removePermission = asyncHandler(async (req, res) => {
  const { id: categoryId, permissionId } = req.params;

  // Vérifier que la catégorie existe
  const category = await ForumCategory.findByPk(categoryId);
  if (!category) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  // Récupérer la permission
  const permission = await CategoryPermission.findByPk(permissionId);

  if (!permission) {
    throw ApiError.notFound('Permission non trouvée');
  }

  // Vérifier que la permission appartient bien à cette catégorie
  if (permission.categoryId !== parseInt(categoryId)) {
    throw ApiError.badRequest('Cette permission n\'appartient pas à la catégorie spécifiée');
  }

  // Supprimer la permission
  await permission.destroy();

  // Invalider le cache
  await categoryPermissionService.invalidateCache(categoryId);

  res.status(200).json({
    success: true,
    message: 'Permission supprimée avec succès',
  });
});

module.exports = {
  getPermissions,
  getEffectivePermissions,
  addPermission,
  removePermission,
};
