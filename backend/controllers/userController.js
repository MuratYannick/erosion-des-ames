'use strict';

const { User, Character, ForumTopic, ForumPost, ForumCategory, Faction, Ethnicity, Clan } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');

/**
 * Récupère le profil public d'un utilisateur
 * GET /api/users/:id
 */
const getPublicProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    attributes: ['id', 'username', 'avatar', 'role', 'createdAt', 'isActive'],
    include: [
      {
        model: Character,
        as: 'selectedCharacter',
        attributes: ['id', 'name', 'avatar'],
        include: [
          {
            model: Faction,
            as: 'faction',
            attributes: ['id', 'name', 'emblem'],
          },
        ],
      },
    ],
  });

  if (!user) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  // Compter les sujets créés par l'utilisateur
  const topicCount = await ForumTopic.count({
    where: { userId: id },
  });

  // Compter les posts créés par l'utilisateur
  const postCount = await ForumPost.count({
    where: { userId: id },
  });

  res.status(200).json({
    success: true,
    data: {
      user,
      stats: {
        topicCount,
        postCount,
      },
    },
  });
});

/**
 * Récupère les personnages d'un utilisateur (approved + active uniquement pour les non-propriétaires)
 * GET /api/users/:id/characters
 */
const getUserCharacters = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  // Vérifier que l'utilisateur existe
  const user = await User.findByPk(id);
  if (!user) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  // Construire la condition where
  const where = { userId: id };

  // Les utilisateurs non-propriétaires ne voient que les personnages approved + active
  const isOwner = req.user && req.user.id === id;
  if (!isOwner) {
    where.status = 'approved';
    where.isActive = true;
  }

  const { count, rows } = await Character.findAndCountAll({
    where,
    include: [
      { model: Ethnicity, as: 'ethnicity', attributes: ['id', 'name'] },
      { model: Faction, as: 'faction', attributes: ['id', 'name', 'emblem'] },
      { model: Clan, as: 'clan', attributes: ['id', 'name'] },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  // ETag basé sur les IDs des personnages retournés + pagination
  const etag = require('crypto')
    .createHash('md5')
    .update(JSON.stringify({ items: rows.map((i) => i.id), total: count, page }))
    .digest('hex');

  res.set('ETag', `"${etag}"`);

  // Réponse 304 si le client possède déjà cette version
  if (req.headers['if-none-match'] === `"${etag}"`) {
    return res.status(304).end();
  }

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
 * Récupère les posts d'un utilisateur
 * GET /api/users/:id/posts
 */
const getUserPosts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  // Vérifier que l'utilisateur existe
  const user = await User.findByPk(id);
  if (!user) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  const { count, rows } = await ForumPost.findAndCountAll({
    where: { userId: id },
    include: [
      {
        model: ForumTopic,
        as: 'topic',
        attributes: ['id', 'title', 'slug', 'categoryId'],
        include: [
          {
            model: ForumCategory,
            as: 'category',
            attributes: ['id', 'name', 'slug'],
          },
        ],
      },
      {
        model: Character,
        as: 'character',
        attributes: ['id', 'name', 'avatar'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  // ETag basé sur les IDs des posts retournés + pagination
  const etagPosts = require('crypto')
    .createHash('md5')
    .update(JSON.stringify({ items: rows.map((i) => i.id), total: count, page }))
    .digest('hex');

  res.set('ETag', `"${etagPosts}"`);

  if (req.headers['if-none-match'] === `"${etagPosts}"`) {
    return res.status(304).end();
  }

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
 * Récupère les sujets créés par un utilisateur
 * GET /api/users/:id/topics
 */
const getUserTopics = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  // Vérifier que l'utilisateur existe
  const user = await User.findByPk(id);
  if (!user) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  const { count, rows } = await ForumTopic.findAndCountAll({
    where: { userId: id },
    include: [
      {
        model: ForumCategory,
        as: 'category',
        attributes: ['id', 'name', 'slug'],
      },
      {
        model: Character,
        as: 'character',
        attributes: ['id', 'name', 'avatar'],
      },
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  // ETag basé sur les IDs des sujets retournés + pagination
  const etagTopics = require('crypto')
    .createHash('md5')
    .update(JSON.stringify({ items: rows.map((i) => i.id), total: count, page }))
    .digest('hex');

  res.set('ETag', `"${etagTopics}"`);

  if (req.headers['if-none-match'] === `"${etagTopics}"`) {
    return res.status(304).end();
  }

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

module.exports = {
  getPublicProfile,
  getUserCharacters,
  getUserPosts,
  getUserTopics,
};
