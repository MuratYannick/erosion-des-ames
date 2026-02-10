'use strict';

const { ForumCategory, ForumTopic, ForumPost, User, ModerationAction, sequelize } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');

/**
 * Liste toutes les catégories (actives ET inactives) pour la gestion admin
 * GET /api/admin/forum/categories
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await ForumCategory.findAll({
    // Pas de filtre isActive : le staff voit tout
    include: [
      {
        model: ForumCategory,
        as: 'parent',
        attributes: ['id', 'name', 'slug'],
        required: false,
      },
      {
        model: ForumCategory,
        as: 'children',
        required: false,
      },
    ],
    order: [['displayOrder', 'ASC']],
  });

  res.status(200).json({
    success: true,
    data: { categories },
  });
});

/**
 * Crée une nouvelle catégorie
 * POST /api/admin/forum/categories
 * Body: { name, description, parentId, icon, displayOrder, isActive, isRp }
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, parentId, icon, displayOrder, isActive, isRp } = req.body;

  // Vérifier la catégorie parente si fournie
  if (parentId) {
    const parent = await ForumCategory.findByPk(parentId);
    if (!parent) {
      throw ApiError.badRequest('La catégorie parente n\'existe pas');
    }
  }

  // Unicité du nom
  const existing = await ForumCategory.findOne({ where: { name } });
  if (existing) {
    throw ApiError.conflict('Une catégorie avec ce nom existe déjà');
  }

  let category;

  await sequelize.transaction(async (t) => {
    category = ForumCategory.build({
      name,
      description: description || null,
      parentId: parentId || null,
      icon: icon || null,
      displayOrder: displayOrder !== undefined ? displayOrder : 0,
      isActive: isActive !== undefined ? isActive : true,
      isRp: isRp || false,
    });
    category.generateSlug();
    await category.save({ transaction: t });

    await ModerationAction.log({
      actionType: 'edit_category',
      moderatorId: req.user.id,
      targetId: category.id,
      targetType: 'category',
      reason: null,
      details: { action: 'create', categoryName: name },
    });
  });

  res.status(201).json({
    success: true,
    data: { category },
    message: 'Catégorie créée avec succès',
  });
});

/**
 * Modifie une catégorie
 * PUT /api/admin/forum/categories/:id
 * Body: { name, description, parentId, icon, displayOrder, isActive, isRp }
 */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await ForumCategory.findByPk(req.params.id);

  if (!category) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  const { name, description, parentId, icon, displayOrder, isActive, isRp } = req.body;
  const updateData = {};

  if (name !== undefined) {
    // Unicité du nom (en excluant la catégorie courante)
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
    // Régénérer le slug si le nom change
    category.name = name;
    category.generateSlug();
    updateData.slug = category.slug;
  }

  if (description !== undefined) updateData.description = description;
  if (parentId !== undefined) updateData.parentId = parentId;
  if (icon !== undefined) updateData.icon = icon;
  if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (isRp !== undefined) updateData.isRp = isRp;

  await sequelize.transaction(async (t) => {
    await category.update(updateData, { transaction: t });

    await ModerationAction.log({
      actionType: 'edit_category',
      moderatorId: req.user.id,
      targetId: category.id,
      targetType: 'category',
      reason: null,
      details: { action: 'update', changes: updateData },
    });
  });

  res.status(200).json({
    success: true,
    data: { category },
    message: 'Catégorie mise à jour avec succès',
  });
});

/**
 * Supprime une catégorie (soft delete)
 * DELETE /api/admin/forum/categories/:id
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await ForumCategory.findByPk(req.params.id);

  if (!category) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  // Refuser si des sujets actifs existent dans cette catégorie
  const topicCount = await ForumTopic.count({ where: { categoryId: req.params.id } });
  if (topicCount > 0) {
    throw ApiError.badRequest(
      `Impossible de supprimer une catégorie contenant ${topicCount} sujet(s). Déplacez ou supprimez-les d'abord.`
    );
  }

  // Refuser si des sous-catégories existent
  const childCount = await ForumCategory.count({ where: { parentId: req.params.id } });
  if (childCount > 0) {
    throw ApiError.badRequest(
      `Impossible de supprimer une catégorie contenant ${childCount} sous-catégorie(s).`
    );
  }

  const categoryName = category.name;

  await sequelize.transaction(async (t) => {
    await category.destroy({ transaction: t });

    await ModerationAction.log({
      actionType: 'delete_category',
      moderatorId: req.user.id,
      targetId: category.id,
      targetType: 'category',
      reason: req.body.reason || null,
      details: { categoryName },
    });
  });

  res.status(200).json({
    success: true,
    message: 'Catégorie supprimée avec succès',
  });
});

/**
 * Réordonne les catégories
 * PATCH /api/admin/forum/categories/reorder
 * Body: { categories: [{ id, displayOrder }, ...] }
 */
const reorderCategories = asyncHandler(async (req, res) => {
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
 * Déplace un sujet vers une autre catégorie
 * PATCH /api/admin/forum/topics/:id/move
 * Body: { categoryId }
 */
const moveTopic = asyncHandler(async (req, res) => {
  const { categoryId } = req.body;

  const topic = await ForumTopic.findByPk(req.params.id);
  if (!topic) {
    throw ApiError.notFound('Sujet non trouvé');
  }

  if (topic.categoryId === categoryId) {
    throw ApiError.badRequest('Le sujet est déjà dans cette catégorie');
  }

  const sourceCategory = await ForumCategory.findByPk(topic.categoryId);
  const destCategory = await ForumCategory.findByPk(categoryId);

  if (!destCategory) {
    throw ApiError.badRequest('Catégorie de destination introuvable');
  }

  const fromCategoryId = topic.categoryId;

  await sequelize.transaction(async (t) => {
    // Déplacer le sujet
    await topic.update({ categoryId }, { transaction: t });

    // Mettre à jour les compteurs de la catégorie source
    if (sourceCategory) {
      await sourceCategory.update(
        {
          topicCount: Math.max(0, sourceCategory.topicCount - 1),
          postCount: Math.max(0, sourceCategory.postCount - topic.postCount),
        },
        { transaction: t }
      );
    }

    // Mettre à jour les compteurs de la catégorie destination
    await destCategory.update(
      {
        topicCount: destCategory.topicCount + 1,
        postCount: destCategory.postCount + topic.postCount,
      },
      { transaction: t }
    );

    await ModerationAction.log({
      actionType: 'move_topic',
      moderatorId: req.user.id,
      targetId: topic.id,
      targetType: 'topic',
      reason: req.body.reason || null,
      details: { fromCategoryId, toCategoryId: categoryId },
    });
  });

  res.status(200).json({
    success: true,
    data: { topic },
    message: `Sujet déplacé vers la catégorie "${destCategory.name}"`,
  });
});

/**
 * Fusionne deux sujets (les posts du source vont dans le target, le source est supprimé)
 * POST /api/admin/forum/topics/merge
 * Body: { sourceTopicId, targetTopicId }
 */
const mergeTopics = asyncHandler(async (req, res) => {
  const { sourceTopicId, targetTopicId } = req.body;

  if (sourceTopicId === targetTopicId) {
    throw ApiError.badRequest('Les deux sujets à fusionner doivent être différents');
  }

  const sourceTopic = await ForumTopic.findByPk(sourceTopicId);
  if (!sourceTopic) {
    throw ApiError.notFound('Sujet source introuvable');
  }

  const targetTopic = await ForumTopic.findByPk(targetTopicId);
  if (!targetTopic) {
    throw ApiError.notFound('Sujet cible introuvable');
  }

  await sequelize.transaction(async (t) => {
    // Déplacer tous les posts du sujet source vers le sujet cible
    await ForumPost.update(
      { topicId: targetTopicId },
      { where: { topicId: sourceTopicId }, transaction: t }
    );

    // Recalculer les compteurs du sujet cible
    const newPostCount = targetTopic.postCount + sourceTopic.postCount;

    // Trouver le dernier post du sujet cible après fusion
    const lastPost = await ForumPost.findOne({
      where: { topicId: targetTopicId },
      order: [['createdAt', 'DESC']],
      transaction: t,
    });

    await targetTopic.update(
      {
        postCount: newPostCount,
        lastPostId: lastPost ? lastPost.id : targetTopic.lastPostId,
        lastPostAt: lastPost ? lastPost.createdAt : targetTopic.lastPostAt,
      },
      { transaction: t }
    );

    // Si les sujets sont dans des catégories différentes, ajuster les compteurs
    if (sourceTopic.categoryId !== targetTopic.categoryId) {
      const sourceCategory = await ForumCategory.findByPk(sourceTopic.categoryId, { transaction: t });
      if (sourceCategory) {
        await sourceCategory.update(
          {
            topicCount: Math.max(0, sourceCategory.topicCount - 1),
            postCount: Math.max(0, sourceCategory.postCount - sourceTopic.postCount),
          },
          { transaction: t }
        );
      }
    } else {
      // Même catégorie : juste décrémenter le topicCount (les posts restent)
      const category = await ForumCategory.findByPk(sourceTopic.categoryId, { transaction: t });
      if (category) {
        await category.update(
          { topicCount: Math.max(0, category.topicCount - 1) },
          { transaction: t }
        );
      }
    }

    // Supprimer le sujet source (soft delete)
    await sourceTopic.destroy({ transaction: t });

    await ModerationAction.log({
      actionType: 'merge_topics',
      moderatorId: req.user.id,
      targetId: targetTopicId,
      targetType: 'topic',
      reason: req.body.reason || null,
      details: { sourceTopicId, targetTopicId },
    });
  });

  // Recharger le sujet cible pour retourner les données à jour
  await targetTopic.reload();

  res.status(200).json({
    success: true,
    data: { topic: targetTopic },
    message: `Sujet "${sourceTopic.title}" fusionné dans "${targetTopic.title}"`,
  });
});

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  moveTopic,
  mergeTopics,
};
