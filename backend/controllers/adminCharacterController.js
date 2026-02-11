'use strict';

const { Character, User, Ethnicity, Faction, Clan, ModerationAction, sequelize } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');

/**
 * Associations communes incluses dans toutes les requêtes de cette section
 */
const CHARACTER_INCLUDES = [
  { model: User, as: 'owner', attributes: ['id', 'username', 'avatar'] },
  { model: Ethnicity, as: 'ethnicity' },
  { model: Faction, as: 'faction' },
  { model: Clan, as: 'clan' },
];

/**
 * Liste paginée de tous les personnages avec filtres
 * GET /api/admin/characters
 * Query params: status, userId, ethnicityId, factionId, page, limit
 */
const getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const where = {};

  if (req.query.status) {
    where.status = req.query.status;
  }
  if (req.query.userId) {
    where.userId = req.query.userId;
  }
  if (req.query.ethnicityId) {
    where.ethnicityId = req.query.ethnicityId;
  }
  if (req.query.factionId) {
    where.factionId = req.query.factionId;
  }

  // unscoped() pour voir également les personnages soft-deletés si besoin
  const { count, rows } = await Character.unscoped().findAndCountAll({
    where,
    include: CHARACTER_INCLUDES,
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
 * File d'attente des personnages en attente d'approbation
 * GET /api/admin/characters/pending
 */
const getPending = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const { count, rows } = await Character.scope('pending').findAndCountAll({
    include: CHARACTER_INCLUDES,
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
 * Approuve un personnage en attente
 * PATCH /api/admin/characters/:id/approve
 */
const approve = asyncHandler(async (req, res) => {
  const character = await Character.findByPk(req.params.id);

  if (!character) {
    throw ApiError.notFound('Personnage non trouvé');
  }

  if (character.status !== 'pending') {
    throw ApiError.badRequest('Seuls les personnages en attente peuvent être approuvés');
  }

  await sequelize.transaction(async (t) => {
    // approve() est une instance method du modèle Character
    await character.approve(req.user.id);

    await ModerationAction.log({
      actionType: 'approve_character',
      moderatorId: req.user.id,
      targetUserId: character.userId,
      targetId: character.id,
      targetType: 'character',
      reason: null,
      details: null,
      transaction: t,
    });
  });

  res.status(200).json({
    success: true,
    data: { character },
    message: 'Personnage approuvé avec succès',
  });
});

/**
 * Rejette un personnage en attente avec une raison
 * PATCH /api/admin/characters/:id/reject
 * Body: { rejectionReason }
 */
const reject = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;

  const character = await Character.findByPk(req.params.id);

  if (!character) {
    throw ApiError.notFound('Personnage non trouvé');
  }

  if (character.status !== 'pending') {
    throw ApiError.badRequest('Seuls les personnages en attente peuvent être rejetés');
  }

  await sequelize.transaction(async (t) => {
    // reject() est une instance method du modèle Character
    await character.reject(rejectionReason);

    await ModerationAction.log({
      actionType: 'reject_character',
      moderatorId: req.user.id,
      targetUserId: character.userId,
      targetId: character.id,
      targetType: 'character',
      reason: rejectionReason || null,
      details: null,
      transaction: t,
    });
  });

  res.status(200).json({
    success: true,
    data: { character },
    message: 'Personnage rejeté',
  });
});

/**
 * Supprime un personnage (soft delete)
 * DELETE /api/admin/characters/:id
 */
const remove = asyncHandler(async (req, res) => {
  const character = await Character.findByPk(req.params.id);

  if (!character) {
    throw ApiError.notFound('Personnage non trouvé');
  }

  await sequelize.transaction(async (t) => {
    await character.destroy({ transaction: t });

    await ModerationAction.log({
      actionType: 'delete_character',
      moderatorId: req.user.id,
      targetUserId: character.userId,
      targetId: character.id,
      targetType: 'character',
      reason: req.body.reason || null,
      details: { characterName: character.name },
      transaction: t,
    });
  });

  res.status(200).json({
    success: true,
    message: 'Personnage supprimé avec succès',
  });
});

module.exports = {
  getAll,
  getPending,
  approve,
  reject,
  remove,
};
