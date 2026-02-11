'use strict';

const { ModerationAction, UserSanction, PostReport, ForumPost, ForumTopic, User, sequelize } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

/**
 * Attributs partiels pour les références utilisateurs dans les logs
 */
const USER_ATTRIBUTES = ['id', 'username', 'avatar'];

/**
 * Historique paginé des actions de modération avec filtres
 * GET /api/admin/moderation/actions
 * Query params: actionType, moderatorId, targetUserId, startDate, endDate, page, limit
 */
const getActions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 30;
  const offset = (page - 1) * limit;

  const where = {};

  if (req.query.actionType) {
    where.actionType = req.query.actionType;
  }

  if (req.query.moderatorId) {
    where.moderatorId = req.query.moderatorId;
  }

  if (req.query.targetUserId) {
    where.targetUserId = req.query.targetUserId;
  }

  // Plage de dates sur createdAt
  if (req.query.startDate || req.query.endDate) {
    where.createdAt = {};
    if (req.query.startDate) {
      where.createdAt[Op.gte] = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      where.createdAt[Op.lte] = new Date(req.query.endDate);
    }
  }

  const { count, rows } = await ModerationAction.findAndCountAll({
    where,
    include: [
      { model: User, as: 'moderator', attributes: USER_ATTRIBUTES },
      { model: User, as: 'targetUser', attributes: USER_ATTRIBUTES },
    ],
    order: [['createdAt', 'DESC']],
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
 * Liste paginée des sanctions avec filtres
 * GET /api/admin/moderation/sanctions
 * Query params: type, isActive, userId, page, limit
 */
const getSanctions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const where = {};

  if (req.query.type) {
    where.type = req.query.type;
  }

  if (req.query.userId) {
    where.userId = req.query.userId;
  }

  // Filtre booléen sur isActive
  if (req.query.isActive !== undefined) {
    where.isActive = req.query.isActive === 'true';
  }

  const { count, rows } = await UserSanction.findAndCountAll({
    where,
    include: [
      { model: User, as: 'user', attributes: USER_ATTRIBUTES },
      { model: User, as: 'issuer', attributes: USER_ATTRIBUTES },
      { model: User, as: 'revoker', attributes: USER_ATTRIBUTES },
    ],
    order: [['createdAt', 'DESC']],
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
 * Liste des signalements en attente de traitement
 * GET /api/admin/moderation/reports
 * Query params: page, limit
 */
const getReports = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await PostReport.findAndCountAll({
    where: { status: 'pending' },
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
          },
        ],
      },
      {
        model: User,
        as: 'reporter',
        attributes: USER_ATTRIBUTES,
      },
    ],
    // Les plus anciens en premier pour traiter dans l'ordre d'arrivée
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
 * Traite (approuve ou rejette) un signalement
 * PATCH /api/admin/moderation/reports/:id/review
 * Body: { status, reason }
 */
const reviewReport = asyncHandler(async (req, res) => {
  const { status, reason } = req.body;

  if (!['reviewed', 'dismissed'].includes(status)) {
    throw ApiError.badRequest('Le statut doit être "reviewed" ou "dismissed"');
  }

  const report = await PostReport.findByPk(req.params.id);
  if (!report) {
    throw ApiError.notFound('Signalement non trouvé');
  }

  if (report.status !== 'pending') {
    throw ApiError.badRequest('Ce signalement a déjà été traité');
  }

  await sequelize.transaction(async (t) => {
    await report.update(
      {
        status,
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      },
      { transaction: t }
    );

    await ModerationAction.log({
      actionType: 'review_report',
      moderatorId: req.user.id,
      targetId: report.id,
      targetType: 'post_report',
      reason: reason || null,
      details: { status, postId: report.postId },
      transaction: t,
    });
  });

  res.status(200).json({
    success: true,
    data: { report },
    message: status === 'reviewed'
      ? 'Signalement traité : contenu pris en charge'
      : 'Signalement classé sans suite',
  });
});

module.exports = {
  getActions,
  getSanctions,
  getReports,
  reviewReport,
};
