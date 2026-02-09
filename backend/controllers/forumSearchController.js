'use strict';

const { ForumTopic, ForumPost, ForumCategory, User, Character, sequelize } = require('../models');
const { asyncHandler } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

/**
 * Recherche dans le forum (titres de sujets et contenus de posts)
 * GET /api/forum/search
 */
const search = asyncHandler(async (req, res) => {
  const { query, categoryId } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const isStaff = req.user && ['ADMIN', 'MODERATOR', 'GAME_MASTER'].includes(req.user.role);
  const searchPattern = `%${query}%`;

  // Recherche dans les topics
  const topicWhere = {
    title: { [Op.like]: searchPattern },
  };
  if (categoryId) {
    topicWhere.categoryId = categoryId;
  }

  const topicInclude = [
    { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
    {
      model: ForumCategory,
      as: 'category',
      attributes: ['id', 'name', 'slug'],
      ...(isStaff ? {} : { where: { isActive: true } }),
    },
    { model: Character, as: 'character', attributes: ['id', 'name'] },
  ];

  const { count: topicCount, rows: topicRows } = await ForumTopic.findAndCountAll({
    where: topicWhere,
    include: topicInclude,
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  // Recherche dans les posts
  const postWhere = {
    content: { [Op.like]: searchPattern },
  };

  const postInclude = [
    { model: User, as: 'author', attributes: ['id', 'username', 'avatar'] },
    {
      model: ForumTopic,
      as: 'topic',
      attributes: ['id', 'title', 'slug', 'categoryId'],
      include: [
        {
          model: ForumCategory,
          as: 'category',
          attributes: ['id', 'name', 'slug'],
          ...(isStaff ? {} : { where: { isActive: true } }),
        },
      ],
      ...(categoryId ? { where: { categoryId } } : {}),
    },
    { model: Character, as: 'character', attributes: ['id', 'name'] },
  ];

  const { count: postCount, rows: postRows } = await ForumPost.findAndCountAll({
    where: postWhere,
    include: postInclude,
    order: [['createdAt', 'DESC']],
    limit,
    offset,
  });

  res.status(200).json({
    success: true,
    data: {
      topics: {
        items: topicRows,
        total: topicCount,
        page,
        totalPages: Math.ceil(topicCount / limit),
      },
      posts: {
        items: postRows,
        total: postCount,
      },
    },
  });
});

module.exports = {
  search,
};
