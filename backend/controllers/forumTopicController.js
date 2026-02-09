'use strict';

const { ForumTopic, ForumCategory, ForumPost, User, Character, TopicRead, TopicSubscription, sequelize } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER'];

/**
 * Récupère les sujets d'une catégorie (paginés et triés)
 * GET /api/forum/topics/category/:categoryId
 */
const getByCategory = asyncHandler(async (req, res) => {
  const isStaff = req.user && STAFF_ROLES.includes(req.user.role);

  const category = await ForumCategory.findByPk(req.params.categoryId);
  if (!category) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  if (!category.isActive && !isStaff) {
    throw ApiError.notFound('Catégorie non trouvée');
  }

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;
  const sort = req.query.sort || 'recent';

  // Déterminer l'ordre en fonction du tri demandé
  let order = [['isPinned', 'DESC']];
  if (sort === 'popular') {
    order.push(['viewCount', 'DESC']);
  } else if (sort === 'lastReply') {
    order.push([sequelize.literal('COALESCE(`ForumTopic`.`last_post_at`, `ForumTopic`.`created_at`)'), 'DESC']);
  } else {
    // 'recent' par défaut
    order.push(['createdAt', 'DESC']);
  }

  const { count, rows } = await ForumTopic.findAndCountAll({
    where: { categoryId: req.params.categoryId },
    include: [
      { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
      { model: Character, as: 'character', attributes: ['id', 'name'] },
      {
        model: ForumPost,
        as: 'lastPost',
        include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
      },
    ],
    order,
    limit,
    offset,
  });

  // Ajouter isUnread pour les utilisateurs connectés
  let items = rows.map((r) => r.toJSON());
  if (req.user && rows.length > 0) {
    const topicIds = rows.map((t) => t.id);
    const reads = await TopicRead.findAll({
      where: { userId: req.user.id, topicId: { [Op.in]: topicIds } },
    });
    const readMap = new Map(reads.map((r) => [r.topicId, r.lastReadAt]));
    items = items.map((t) => ({
      ...t,
      isUnread: !readMap.has(t.id) || (t.lastPostAt && readMap.get(t.id) < new Date(t.lastPostAt)),
    }));
  }

  res.status(200).json({
    success: true,
    data: {
      items,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      limit,
    },
  });
});

/**
 * Récupère les sujets récents de toutes les catégories
 * GET /api/forum/topics/recent
 */
const getRecent = asyncHandler(async (req, res) => {
  const isStaff = req.user && STAFF_ROLES.includes(req.user.role);

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await ForumTopic.findAndCountAll({
    include: [
      {
        model: ForumCategory,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
        where: isStaff ? {} : { isActive: true },
      },
      { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
      {
        model: ForumPost,
        as: 'lastPost',
        include: [{ model: User, as: 'author', attributes: ['id', 'username', 'avatar'] }],
      },
    ],
    order: [[sequelize.literal('COALESCE(`ForumTopic`.`last_post_at`, `ForumTopic`.`created_at`)'), 'DESC']],
    limit,
    offset,
  });

  // Ajouter isUnread pour les utilisateurs connectés
  let items = rows.map((r) => r.toJSON());
  if (req.user && rows.length > 0) {
    const topicIds = rows.map((t) => t.id);
    const reads = await TopicRead.findAll({
      where: { userId: req.user.id, topicId: { [Op.in]: topicIds } },
    });
    const readMap = new Map(reads.map((r) => [r.topicId, r.lastReadAt]));
    items = items.map((t) => ({
      ...t,
      isUnread: !readMap.has(t.id) || (t.lastPostAt && readMap.get(t.id) < new Date(t.lastPostAt)),
    }));
  }

  res.status(200).json({
    success: true,
    data: {
      items,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      limit,
    },
  });
});

/**
 * Récupère un sujet par son ID avec ses posts paginés
 * GET /api/forum/topics/:id
 */
const getById = asyncHandler(async (req, res) => {
  const isStaff = req.user && STAFF_ROLES.includes(req.user.role);

  const topic = await ForumTopic.findByPk(req.params.id, {
    include: [
      { model: ForumCategory, as: 'category', attributes: ['id', 'name', 'slug', 'isRp'] },
      { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
      { model: Character, as: 'character', attributes: ['id', 'name'] },
    ],
  });

  if (!topic) {
    throw ApiError.notFound('Sujet non trouvé');
  }

  if (!topic.category.isActive && !isStaff) {
    throw ApiError.notFound('Sujet non trouvé');
  }

  // Incrémenter les vues
  await topic.incrementViews();

  // Marquer comme lu si authentifié
  if (req.user) {
    await TopicRead.upsert({
      topicId: topic.id,
      userId: req.user.id,
      lastReadAt: new Date(),
    });
  }

  // Récupérer les posts paginés
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 15;
  const offset = (page - 1) * limit;

  const { count, rows } = await ForumPost.findAndCountAll({
    where: { topicId: req.params.id },
    include: [
      { model: User, as: 'author', attributes: ['id', 'username', 'avatar', 'role'] },
      { model: Character, as: 'character', attributes: ['id', 'name', 'avatar'] },
      {
        model: ForumPost,
        as: 'quotedPost',
        attributes: ['id', 'content'],
        include: [{ model: User, as: 'author', attributes: ['id', 'username'] }],
      },
      { model: User, as: 'editor', attributes: ['id', 'username'] },
    ],
    order: [['createdAt', 'ASC']],
    limit,
    offset,
  });

  // Vérifier l'abonnement si authentifié
  let isSubscribed = false;
  if (req.user) {
    const subscription = await TopicSubscription.findOne({
      where: { topicId: topic.id, userId: req.user.id },
    });
    isSubscribed = !!subscription;
  }

  res.status(200).json({
    success: true,
    data: {
      topic,
      posts: {
        items: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit),
        limit,
      },
      isSubscribed,
    },
  });
});

/**
 * Crée un nouveau sujet avec son premier post
 * POST /api/forum/topics
 */
const create = asyncHandler(async (req, res) => {
  const { categoryId, title, content, characterId } = req.body;

  // Vérifier la catégorie
  const category = await ForumCategory.findByPk(categoryId);
  if (!category || !category.isActive) {
    throw ApiError.badRequest('Catégorie invalide ou inactive');
  }

  // Vérifier si un personnage est requis pour les catégories RP
  if (category.isRp && !characterId) {
    throw ApiError.badRequest('Un personnage est requis pour les catégories RP');
  }

  // Vérifier le personnage si fourni
  if (characterId) {
    const character = await Character.findByPk(characterId);
    if (!character) {
      throw ApiError.badRequest('Personnage non trouvé');
    }
    if (character.userId !== req.user.id) {
      throw ApiError.badRequest('Ce personnage ne vous appartient pas');
    }
    if (character.status !== 'approved') {
      throw ApiError.badRequest('Le personnage doit être approuvé pour poster');
    }
  }

  const result = await sequelize.transaction(async (t) => {
    // Créer le sujet
    const topic = ForumTopic.build({
      categoryId,
      userId: req.user.id,
      title,
      characterId: characterId || null,
    });
    topic.generateSlug();
    await topic.save({ transaction: t });

    // Créer le premier post
    const post = await ForumPost.create(
      {
        topicId: topic.id,
        userId: req.user.id,
        characterId: characterId || null,
        content,
        isFirstPost: true,
      },
      { transaction: t }
    );

    // Mettre à jour les compteurs du sujet
    await topic.update(
      {
        postCount: 1,
        lastPostId: post.id,
        lastPostAt: post.createdAt,
      },
      { transaction: t }
    );

    // Mettre à jour les compteurs de la catégorie
    await category.update(
      {
        topicCount: category.topicCount + 1,
        postCount: category.postCount + 1,
        lastPostId: post.id,
      },
      { transaction: t }
    );

    // Auto-abonnement de l'auteur
    await TopicSubscription.create(
      {
        topicId: topic.id,
        userId: req.user.id,
      },
      { transaction: t }
    );

    return { topic, post };
  });

  res.status(201).json({
    success: true,
    data: {
      topic: result.topic,
      post: result.post,
    },
    message: 'Sujet créé avec succès',
  });
});

/**
 * Met à jour un sujet
 * PUT /api/forum/topics/:id
 */
const update = asyncHandler(async (req, res) => {
  const topic = await ForumTopic.findByPk(req.params.id);

  if (!topic) {
    throw ApiError.notFound('Sujet non trouvé');
  }

  const isStaff = STAFF_ROLES.includes(req.user.role);
  if (topic.userId !== req.user.id && !isStaff) {
    throw ApiError.forbidden('Vous n\'êtes pas autorisé à modifier ce sujet');
  }

  const { title, content, characterId } = req.body;

  const updateData = {};

  if (title !== undefined) {
    updateData.title = title;
    topic.title = title;
    topic.generateSlug();
    updateData.slug = topic.slug;
  }

  if (characterId !== undefined) {
    updateData.characterId = characterId;
  }

  await topic.update(updateData);

  // Mettre à jour le premier post si un contenu est fourni
  if (content !== undefined) {
    const firstPost = await ForumPost.findOne({
      where: { topicId: topic.id, isFirstPost: true },
    });
    if (firstPost) {
      await firstPost.update({
        content,
        editedAt: new Date(),
        editedBy: req.user.id,
      });
    }
  }

  res.status(200).json({
    success: true,
    data: { topic },
    message: 'Sujet mis à jour avec succès',
  });
});

/**
 * Épingle ou désépingle un sujet
 * PATCH /api/forum/topics/:id/pin
 */
const pin = asyncHandler(async (req, res) => {
  const topic = await ForumTopic.findByPk(req.params.id);

  if (!topic) {
    throw ApiError.notFound('Sujet non trouvé');
  }

  if (topic.isPinned) {
    await topic.unpin();
  } else {
    await topic.pin();
  }

  res.status(200).json({
    success: true,
    data: { topic },
    message: topic.isPinned ? 'Sujet épinglé' : 'Sujet désépinglé',
  });
});

/**
 * Verrouille ou déverrouille un sujet
 * PATCH /api/forum/topics/:id/lock
 */
const lock = asyncHandler(async (req, res) => {
  const topic = await ForumTopic.findByPk(req.params.id);

  if (!topic) {
    throw ApiError.notFound('Sujet non trouvé');
  }

  if (topic.isLocked) {
    await topic.unlock();
  } else {
    await topic.lock();
  }

  res.status(200).json({
    success: true,
    data: { topic },
    message: topic.isLocked ? 'Sujet verrouillé' : 'Sujet déverrouillé',
  });
});

/**
 * Supprime un sujet (soft delete)
 * DELETE /api/forum/topics/:id
 */
const remove = asyncHandler(async (req, res) => {
  const topic = await ForumTopic.findByPk(req.params.id, {
    include: [{ model: ForumCategory, as: 'category' }],
  });

  if (!topic) {
    throw ApiError.notFound('Sujet non trouvé');
  }

  const isAdmin = req.user.role === 'ADMIN';
  if (topic.userId !== req.user.id && !isAdmin) {
    throw ApiError.forbidden('Vous n\'êtes pas autorisé à supprimer ce sujet');
  }

  await sequelize.transaction(async (t) => {
    const category = await ForumCategory.findByPk(topic.categoryId, { transaction: t });
    await category.update(
      {
        topicCount: Math.max(0, category.topicCount - 1),
        postCount: Math.max(0, category.postCount - topic.postCount),
      },
      { transaction: t }
    );
    await topic.destroy({ transaction: t });
  });

  res.status(200).json({
    success: true,
    message: 'Sujet supprimé avec succès',
  });
});

/**
 * Marque un sujet comme lu
 * POST /api/forum/topics/:id/read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const topic = await ForumTopic.findByPk(req.params.id);

  if (!topic) {
    throw ApiError.notFound('Sujet non trouvé');
  }

  await TopicRead.upsert({
    topicId: topic.id,
    userId: req.user.id,
    lastReadAt: new Date(),
  });

  res.status(200).json({
    success: true,
    message: 'Sujet marqué comme lu',
  });
});

/**
 * S'abonne ou se désabonne d'un sujet
 * POST /api/forum/topics/:id/subscribe
 */
const toggleSubscription = asyncHandler(async (req, res) => {
  const topic = await ForumTopic.findByPk(req.params.id);

  if (!topic) {
    throw ApiError.notFound('Sujet non trouvé');
  }

  const subscription = await TopicSubscription.findOne({
    where: { topicId: topic.id, userId: req.user.id },
  });

  if (subscription) {
    await subscription.destroy();
    res.status(200).json({
      success: true,
      data: { isSubscribed: false },
      message: 'Désabonné du sujet',
    });
  } else {
    await TopicSubscription.create({
      topicId: topic.id,
      userId: req.user.id,
    });
    res.status(200).json({
      success: true,
      data: { isSubscribed: true },
      message: 'Abonné au sujet',
    });
  }
});

/**
 * Marque tous les sujets comme lus (optionnellement filtrés par catégorie)
 * POST /api/forum/topics/mark-all-read
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  const { categoryId } = req.body;

  const where = {};
  if (categoryId) {
    where.categoryId = categoryId;
  }

  const topics = await ForumTopic.findAll({
    where,
    attributes: ['id'],
  });

  if (topics.length > 0) {
    const now = new Date();
    const records = topics.map((t) => ({
      topicId: t.id,
      userId: req.user.id,
      lastReadAt: now,
    }));

    await TopicRead.bulkCreate(records, {
      updateOnDuplicate: ['last_read_at'],
    });
  }

  res.status(200).json({
    success: true,
    message: categoryId
      ? 'Tous les sujets de la catégorie ont été marqués comme lus'
      : 'Tous les sujets ont été marqués comme lus',
  });
});

module.exports = {
  getByCategory,
  getRecent,
  getById,
  create,
  update,
  pin,
  lock,
  remove,
  markAsRead,
  markAllAsRead,
  toggleSubscription,
};
