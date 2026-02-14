'use strict';

const { ForumCategory, ForumPost, ForumTopic, User, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');
const categoryPermissionService = require('../services/categoryPermissionService');

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER'];

/**
 * Récupère toutes les catégories (arborescence)
 * GET /api/forum/categories
 */
const getAll = asyncHandler(async (req, res) => {
  const isStaff = req.user && STAFF_ROLES.includes(req.user.role);
  const activeCondition = isStaff ? {} : { isActive: true };

  const categories = await ForumCategory.findAll({
    where: { parentId: null, ...activeCondition },
    include: [
      {
        model: ForumCategory,
        as: 'children',
        where: activeCondition,
        required: false,
      },
      {
        model: ForumPost,
        as: 'lastPost',
        include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
      },
    ],
    order: [
      ['displayOrder', 'ASC'],
      [{ model: ForumCategory, as: 'children' }, 'displayOrder', 'ASC'],
    ],
  });

  // Ajouter unreadCount pour les utilisateurs connectés
  let categoryData = categories.map((c) => c.toJSON());
  if (req.user) {
    const unreadRows = await sequelize.query(
      `SELECT t.category_id, COUNT(*) as unread_count
       FROM forum_topics t
       LEFT JOIN topic_reads tr ON tr.topic_id = t.id AND tr.user_id = :userId
       WHERE t.deleted_at IS NULL
       AND (tr.id IS NULL OR tr.last_read_at < t.last_post_at)
       GROUP BY t.category_id`,
      {
        replacements: { userId: req.user.id },
        type: QueryTypes.SELECT,
      }
    );
    const unreadMap = new Map(unreadRows.map((r) => [r.category_id, parseInt(r.unread_count, 10)]));
    categoryData = categoryData.map((cat) => ({
      ...cat,
      unreadCount: unreadMap.get(cat.id) || 0,
      children: cat.children
        ? cat.children.map((child) => ({
            ...child,
            unreadCount: unreadMap.get(child.id) || 0,
          }))
        : [],
    }));
  }

  // Filter categories by access_category permission
  // Check permission for each category (includes child categories)
  const filterCategoriesByPermission = async (cats) => {
    const filtered = [];

    for (const cat of cats) {
      const hasAccess = await categoryPermissionService.hasPermissionOrNoRestrictions(
        req.user,
        cat.id,
        'access_category'
      );

      if (hasAccess) {
        // If the category has children, filter them recursively
        if (cat.children && cat.children.length > 0) {
          cat.children = await filterCategoriesByPermission(cat.children);
        }
        filtered.push(cat);
      }
    }

    return filtered;
  };

  categoryData = await filterCategoriesByPermission(categoryData);

  res.status(200).json({
    success: true,
    data: { categories: categoryData },
  });
});

/**
 * Récupère une catégorie par son ID avec ses sujets paginés
 * GET /api/forum/categories/:id
 */
const getById = asyncHandler(async (req, res) => {
  const isStaff = req.user && STAFF_ROLES.includes(req.user.role);
  const activeCondition = isStaff ? {} : { isActive: true };

  const includeOptions = [
    {
      model: ForumCategory,
      as: 'children',
      where: activeCondition,
      required: false,
    },
    {
      model: ForumPost,
      as: 'lastPost',
      include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
    },
  ];

  // Supporter la recherche par slug ou par ID numérique
  const isNumeric = /^\d+$/.test(req.params.id);
  const category = isNumeric
    ? await ForumCategory.findByPk(req.params.id, { include: includeOptions })
    : await ForumCategory.findOne({ where: { slug: req.params.id }, include: includeOptions });

  if (!category) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  if (!category.isActive && !isStaff) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  // Pagination des topics
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const { Character } = require('../models');

  const { count, rows } = await ForumTopic.findAndCountAll({
    where: { categoryId: category.id },
    include: [
      { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
      { model: Character, as: 'character', attributes: ['id', 'name'] },
      {
        model: ForumPost,
        as: 'lastPost',
        include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
      },
    ],
    order: [
      ['isPinned', 'DESC'],
      [sequelize.literal('COALESCE(`ForumTopic`.`last_post_at`, `ForumTopic`.`created_at`)'), 'DESC'],
    ],
    limit,
    offset,
  });

  res.status(200).json({
    success: true,
    data: {
      category,
      topics: {
        items: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        limit,
      },
    },
  });
});

/**
 * Crée une nouvelle catégorie
 * POST /api/forum/categories
 */
const create = asyncHandler(async (req, res) => {
  const { name, parentId, description, icon, displayOrder, isActive, isRp } = req.body;

  // Vérifier la catégorie parente si fournie
  if (parentId) {
    const parent = await ForumCategory.findByPk(parentId);
    if (!parent) {
      throw ApiError.badRequest('La catégorie parente n\'existe pas');
    }
  }

  // Vérifier l'unicité du nom
  const existing = await ForumCategory.findOne({ where: { name } });
  if (existing) {
    throw ApiError.conflict('Une catégorie avec ce nom existe déjà');
  }

  // Créer la catégorie avec génération du slug
  const category = ForumCategory.build({
    name,
    parentId: parentId || null,
    description,
    icon,
    displayOrder: displayOrder || 0,
    isActive: isActive !== undefined ? isActive : true,
    isRp: isRp || false,
  });
  category.generateSlug();
  await category.save();

  res.status(201).json({
    success: true,
    data: { category },
    message: 'Catégorie créée avec succès',
  });
});

/**
 * Met à jour une catégorie
 * PUT /api/forum/categories/:id
 */
const update = asyncHandler(async (req, res) => {
  const category = await ForumCategory.findByPk(req.params.id);

  if (!category) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  const { name, parentId, description, icon, displayOrder, isActive, isRp } = req.body;

  const updateData = {};

  if (name !== undefined) {
    // Vérifier l'unicité du nom (exclure la catégorie actuelle)
    const existing = await ForumCategory.findOne({
      where: {
        name,
        id: { [sequelize.Sequelize.Op.ne]: req.params.id },
      },
    });
    if (existing) {
      throw ApiError.conflict('Une catégorie avec ce nom existe déjà');
    }
    updateData.name = name;
    // Régénérer le slug
    category.name = name;
    category.generateSlug();
    updateData.slug = category.slug;
  }

  if (parentId !== undefined) updateData.parentId = parentId;
  if (description !== undefined) updateData.description = description;
  if (icon !== undefined) updateData.icon = icon;
  if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (isRp !== undefined) updateData.isRp = isRp;

  await category.update(updateData);

  res.status(200).json({
    success: true,
    data: { category },
    message: 'Catégorie mise à jour avec succès',
  });
});

/**
 * Réordonne les catégories
 * PATCH /api/forum/categories/reorder
 */
const reorder = asyncHandler(async (req, res) => {
  const { categories } = req.body;

  if (!Array.isArray(categories) || categories.length === 0) {
    throw ApiError.badRequest('Le tableau de catégories est requis');
  }

  await sequelize.transaction(async (t) => {
    for (const cat of categories) {
      await ForumCategory.update(
        { displayOrder: cat.displayOrder },
        { where: { id: cat.id }, transaction: t }
      );
    }
  });

  res.status(200).json({
    success: true,
    message: 'Ordre des catégories mis à jour avec succès',
  });
});

/**
 * Supprime une catégorie (soft delete)
 * DELETE /api/forum/categories/:id
 */
const remove = asyncHandler(async (req, res) => {
  const category = await ForumCategory.findByPk(req.params.id);

  if (!category) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  // Vérifier si la catégorie contient des sujets
  const topicCount = await ForumTopic.count({ where: { categoryId: req.params.id } });
  if (topicCount > 0) {
    throw ApiError.badRequest('Impossible de supprimer une catégorie contenant des sujets');
  }

  // Vérifier si la catégorie contient des sous-catégories
  const childCount = await ForumCategory.count({ where: { parentId: req.params.id } });
  if (childCount > 0) {
    throw ApiError.badRequest('Impossible de supprimer une catégorie contenant des sous-catégories');
  }

  await category.destroy();

  res.status(200).json({
    success: true,
    message: 'Catégorie supprimée avec succès',
  });
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  reorder,
  remove,
};
