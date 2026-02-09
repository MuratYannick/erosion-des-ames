'use strict';

const { PostReport, ForumPost, ForumTopic, ForumCategory, User } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER'];

/**
 * Récupère tous les signalements avec pagination
 * GET /api/forum/reports
 */
const getPending = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;
  const status = req.query.status || 'pending';

  const where = { status };

  const { count, rows } = await PostReport.findAndCountAll({
    where,
    include: [
      {
        model: ForumPost,
        as: 'post',
        attributes: ['id', 'content', 'topicId'],
        include: [
          {
            model: ForumTopic,
            as: 'topic',
            attributes: ['id', 'title', 'slug'],
            include: [
              {
                model: ForumCategory,
                as: 'category',
                attributes: ['id', 'slug'],
              },
            ],
          },
        ],
      },
      {
        model: User,
        as: 'reporter',
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
 * Traite un signalement (approuve ou rejette)
 * PATCH /api/forum/reports/:id/review
 */
const review = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Vérifier que le statut est valide
  if (!['reviewed', 'dismissed'].includes(status)) {
    throw ApiError.badRequest('Le statut doit être "reviewed" ou "dismissed"');
  }

  // Trouver le signalement
  const report = await PostReport.findByPk(id);
  if (!report) {
    throw ApiError.notFound('Signalement non trouvé');
  }

  // Vérifier que le signalement n'a pas déjà été traité
  if (report.status !== 'pending') {
    throw ApiError.badRequest('Ce signalement a déjà été traité');
  }

  // Mettre à jour le signalement
  await report.update({
    status,
    reviewedBy: req.user.id,
    reviewedAt: new Date(),
  });

  res.status(200).json({
    success: true,
    data: { report },
    message: 'Signalement traité avec succès',
  });
});

module.exports = {
  getPending,
  review,
};
