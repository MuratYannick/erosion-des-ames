'use strict';

const { ForumPost, ForumTopic, ForumCategory, User, Character, PostReport, TopicSubscription, sequelize } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER'];

/**
 * Récupère tous les posts d'un sujet avec pagination
 * GET /api/forum/posts/topic/:topicId
 */
const getByTopic = asyncHandler(async (req, res) => {
  const { topicId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 15;
  const offset = (page - 1) * limit;

  // Vérifier que le sujet existe
  const topic = await ForumTopic.findByPk(topicId);
  if (!topic) {
    throw ApiError.notFound('Sujet non trouvé');
  }

  const { count, rows } = await ForumPost.findAndCountAll({
    where: { topicId },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'avatar', 'role'],
      },
      {
        model: Character,
        as: 'character',
        attributes: ['id', 'name', 'avatar'],
      },
      {
        model: ForumPost,
        as: 'quotedPost',
        attributes: ['id', 'content'],
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'username'],
          },
        ],
      },
      {
        model: User,
        as: 'editor',
        attributes: ['id', 'username'],
      },
    ],
    order: [['createdAt', 'ASC']],
    limit,
    offset,
  });

  res.status(200).json({
    success: true,
    data: {
      items: rows,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      limit,
    },
  });
});

/**
 * Crée un nouveau post dans un sujet
 * POST /api/forum/posts/topic/:topicId
 */
const create = asyncHandler(async (req, res) => {
  const { topicId } = req.params;
  const { content, characterId, quotedPostId } = req.body;

  // Vérifier que le sujet existe
  const topic = await ForumTopic.findByPk(topicId);
  if (!topic) {
    throw ApiError.notFound('Sujet non trouvé');
  }

  // Vérifier que le sujet n'est pas verrouillé
  if (topic.isLocked) {
    throw ApiError.forbidden('Ce sujet est verrouillé');
  }

  // Récupérer la catégorie pour vérifier si c'est une catégorie RP
  const category = await ForumCategory.findByPk(topic.categoryId);

  // Si catégorie RP, un personnage est requis
  if (category.isRp && !characterId) {
    throw ApiError.badRequest('Un personnage est requis pour les catégories RP');
  }

  // Si un personnage est fourni, vérifier qu'il est valide
  if (characterId) {
    const character = await Character.findByPk(characterId);
    if (!character || character.status !== 'approved' || character.userId !== req.user.id) {
      throw ApiError.badRequest('Personnage invalide ou non approuvé');
    }
  }

  // Si un post est cité, vérifier qu'il existe et appartient au même sujet
  if (quotedPostId) {
    const quotedPost = await ForumPost.findByPk(quotedPostId);
    if (!quotedPost || quotedPost.topicId !== topic.id) {
      throw ApiError.badRequest('Le post cité n\'existe pas dans ce sujet');
    }
  }

  // Créer le post et mettre à jour les compteurs dans une transaction
  const result = await sequelize.transaction(async (t) => {
    const post = await ForumPost.create({
      topicId: topic.id,
      userId: req.user.id,
      characterId: characterId || null,
      content,
      quotedPostId: quotedPostId || null,
    }, { transaction: t });

    // Mettre à jour les compteurs du sujet
    await topic.update({
      postCount: topic.postCount + 1,
      lastPostId: post.id,
      lastPostAt: post.createdAt,
    }, { transaction: t });

    // Mettre à jour les compteurs de la catégorie
    await category.update({
      postCount: category.postCount + 1,
      lastPostId: post.id,
    }, { transaction: t });

    // Auto-abonnement au sujet lors de la réponse
    await TopicSubscription.findOrCreate({
      where: { topicId: topic.id, userId: req.user.id },
      defaults: { topicId: topic.id, userId: req.user.id },
      transaction: t,
    });

    return post;
  });

  // Recharger le post avec les includes
  const fullPost = await ForumPost.findByPk(result.id, {
    include: [
      { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
      { model: Character, as: 'character', attributes: ['id', 'name', 'avatar'] },
    ],
  });

  res.status(201).json({
    success: true,
    data: { post: fullPost },
    message: 'Réponse publiée avec succès',
  });
});

/**
 * Met à jour un post existant
 * PUT /api/forum/posts/:id
 */
const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { content, characterId } = req.body;

  // Trouver le post
  const post = await ForumPost.findByPk(id);
  if (!post) {
    throw ApiError.notFound('Post non trouvé');
  }

  // Vérifier les permissions
  const isStaff = STAFF_ROLES.includes(req.user.role);
  if (req.user.id !== post.userId && !isStaff) {
    throw ApiError.forbidden('Vous n\'êtes pas autorisé à modifier ce post');
  }

  // Le premier post ne peut être modifié que via la modification du sujet
  if (post.isFirstPost) {
    throw ApiError.badRequest('Le premier post ne peut être modifié que via la modification du sujet');
  }

  // Construire les données de mise à jour
  const updateData = {
    content,
    editedAt: new Date(),
    editedBy: req.user.id,
  };

  if (characterId !== undefined) {
    updateData.characterId = characterId;
  }

  await post.update(updateData);

  res.status(200).json({
    success: true,
    data: { post },
    message: 'Post mis à jour avec succès',
  });
});

/**
 * Supprime un post (soft delete)
 * DELETE /api/forum/posts/:id
 */
const remove = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Trouver le post
  const post = await ForumPost.findByPk(id);
  if (!post) {
    throw ApiError.notFound('Post non trouvé');
  }

  // Le premier post ne peut pas être supprimé
  if (post.isFirstPost) {
    throw ApiError.badRequest('Le premier post ne peut pas être supprimé, supprimez le sujet à la place');
  }

  // Vérifier les permissions (propriétaire ou staff)
  const isStaff = STAFF_ROLES.includes(req.user.role);
  if (req.user.id !== post.userId && !isStaff) {
    throw ApiError.forbidden('Vous n\'êtes pas autorisé à supprimer ce post');
  }

  // Supprimer le post et mettre à jour les compteurs dans une transaction
  await sequelize.transaction(async (t) => {
    const topic = await ForumTopic.findByPk(post.topicId, { transaction: t });
    const category = await ForumCategory.findByPk(topic.categoryId, { transaction: t });

    // Décrémenter les compteurs
    await topic.update({
      postCount: Math.max(0, topic.postCount - 1),
    }, { transaction: t });

    await category.update({
      postCount: Math.max(0, category.postCount - 1),
    }, { transaction: t });

    // Si le post supprimé était le dernier post du sujet, trouver le nouveau dernier post
    if (topic.lastPostId === post.id) {
      const newLastPost = await ForumPost.findOne({
        where: { topicId: topic.id, id: { [Op.ne]: post.id } },
        order: [['createdAt', 'DESC']],
        transaction: t,
      });
      await topic.update({
        lastPostId: newLastPost ? newLastPost.id : null,
        lastPostAt: newLastPost ? newLastPost.createdAt : null,
      }, { transaction: t });
    }

    // Mettre à jour le dernier post de la catégorie si nécessaire
    if (category.lastPostId === post.id) {
      const newLastPost = await ForumPost.findOne({
        where: { id: { [Op.ne]: post.id } },
        include: [{
          model: ForumTopic,
          as: 'topic',
          where: { categoryId: category.id },
          attributes: [],
        }],
        order: [['createdAt', 'DESC']],
        transaction: t,
      });
      await category.update({
        lastPostId: newLastPost ? newLastPost.id : null,
      }, { transaction: t });
    }

    // Soft delete du post
    await post.destroy({ transaction: t });
  });

  res.status(200).json({
    success: true,
    message: 'Post supprimé avec succès',
  });
});

/**
 * Signale un post inapproprié
 * POST /api/forum/posts/:id/report
 */
const report = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason, description } = req.body;

  // Vérifier que le post existe
  const post = await ForumPost.findByPk(id);
  if (!post) {
    throw ApiError.notFound('Post non trouvé');
  }

  // Vérifier que l'utilisateur n'a pas déjà signalé ce post
  const existingReport = await PostReport.findOne({
    where: { postId: post.id, userId: req.user.id },
  });
  if (existingReport) {
    throw ApiError.conflict('Vous avez déjà signalé ce post');
  }

  // Créer le signalement
  await PostReport.create({
    postId: post.id,
    userId: req.user.id,
    reason,
    description,
  });

  res.status(201).json({
    success: true,
    message: 'Post signalé avec succès',
  });
});

module.exports = {
  getByTopic,
  create,
  update,
  remove,
  report,
};
