'use strict';

const { User, Character, UserSanction, ForumTopic, ForumPost, ModerationAction, sequelize } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

/**
 * Liste paginée des utilisateurs avec filtres
 * GET /api/admin/users
 * Query params: role, isActive, search, sortBy, sortOrder, page, limit
 */
const getAll = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const offset = (page - 1) * limit;

  const where = {};

  // Filtre par rôle
  if (req.query.role) {
    where.role = req.query.role;
  }

  // Filtre par statut actif
  if (req.query.isActive !== undefined) {
    where.isActive = req.query.isActive === 'true';
  }

  // Recherche par username ou email (LIKE)
  if (req.query.search) {
    where[Op.or] = [
      { username: { [Op.like]: `%${req.query.search}%` } },
      { email: { [Op.like]: `%${req.query.search}%` } },
    ];
  }

  // Tri
  const ALLOWED_SORT_FIELDS = ['createdAt', 'lastLoginAt', 'username'];
  const sortBy = ALLOWED_SORT_FIELDS.includes(req.query.sortBy) ? req.query.sortBy : 'createdAt';
  const sortOrder = req.query.sortOrder === 'ASC' ? 'ASC' : 'DESC';

  // unscoped() pour inclure les utilisateurs soft-deletés et voir le password est exclu
  // par le defaultScope du modèle — on ne le surcharge pas ici
  const { count, rows } = await User.findAndCountAll({
    where,
    order: [[sortBy, sortOrder]],
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
 * Détail d'un utilisateur avec ses personnages, sanctions actives et stats forum
 * GET /api/admin/users/:id
 */
const getById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  // Personnages de l'utilisateur
  const characters = await Character.unscoped().findAll({
    where: { userId: user.id },
    attributes: ['id', 'name', 'status', 'isActive', 'createdAt'],
    order: [['createdAt', 'DESC']],
  });

  // Sanctions actives
  const activeSanctions = await UserSanction.scope('active').findAll({
    where: { userId: user.id },
    include: [
      { model: User, as: 'issuer', attributes: ['id', 'username', 'avatar'] },
    ],
    order: [['createdAt', 'DESC']],
  });

  // Statistiques forum
  const topicCount = await ForumTopic.count({ where: { userId: user.id } });
  const postCount = await ForumPost.count({ where: { userId: user.id } });

  res.status(200).json({
    success: true,
    data: {
      user,
      characters,
      activeSanctions,
      forumStats: {
        topicCount,
        postCount,
      },
    },
  });
});

/**
 * Change le rôle d'un utilisateur
 * PATCH /api/admin/users/:id/role
 * Body: { role }
 */
const changeRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const VALID_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER', 'PLAYER'];

  if (!VALID_ROLES.includes(role)) {
    throw ApiError.badRequest('Rôle invalide');
  }

  const target = await User.findByPk(req.params.id);
  if (!target) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  // Un utilisateur ne peut pas changer son propre rôle
  if (target.id === req.user.id) {
    throw ApiError.badRequest('Vous ne pouvez pas modifier votre propre rôle');
  }

  // Hiérarchie des rôles : seul un rôle supérieur peut modifier un rôle inférieur
  const ROLE_HIERARCHY = { ADMIN: 3, MODERATOR: 2, GAME_MASTER: 1, PLAYER: 0 };
  const issuerLevel = ROLE_HIERARCHY[req.user.role] ?? 0;
  const targetLevel = ROLE_HIERARCHY[target.role] ?? 0;

  if (issuerLevel <= targetLevel) {
    throw ApiError.forbidden('Vous n\'êtes pas autorisé à modifier le rôle de cet utilisateur');
  }

  // On peut attribuer un rôle jusqu'à son propre niveau (inclus)
  const newRoleLevel = ROLE_HIERARCHY[role] ?? 0;
  if (newRoleLevel > issuerLevel) {
    throw ApiError.forbidden('Vous ne pouvez pas attribuer un rôle supérieur au vôtre');
  }

  const oldRole = target.role;

  await sequelize.transaction(async (t) => {
    await target.update({ role }, { transaction: t });

    await ModerationAction.log({
      actionType: 'change_role',
      moderatorId: req.user.id,
      targetUserId: target.id,
      targetType: 'user',
      reason: req.body.reason || null,
      details: { oldRole, newRole: role },
      transaction: t,
    });
  });

  res.status(200).json({
    success: true,
    data: { user: target },
    message: `Rôle mis à jour : ${oldRole} → ${role}`,
  });
});

/**
 * Bannit un utilisateur
 * POST /api/admin/users/:id/ban
 * Body: { reason, durationHours (null = permanent) }
 */
const ban = asyncHandler(async (req, res) => {
  const { reason, durationHours } = req.body;

  const target = await User.findByPk(req.params.id);
  if (!target) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  // Protection : ne peut pas se bannir soi-même
  if (target.id === req.user.id) {
    throw ApiError.badRequest('Vous ne pouvez pas vous bannir vous-même');
  }

  // Un MODERATOR ne peut pas bannir un ADMIN
  if (req.user.role === 'MODERATOR' && target.role === 'ADMIN') {
    throw ApiError.forbidden('Vous n\'êtes pas autorisé à bannir un administrateur');
  }

  const startsAt = new Date();
  const expiresAt = durationHours ? new Date(Date.now() + durationHours * 60 * 60 * 1000) : null;

  const sanction = await sequelize.transaction(async (t) => {
    const newSanction = await UserSanction.create(
      {
        userId: target.id,
        type: 'ban',
        reason,
        issuedBy: req.user.id,
        startsAt,
        expiresAt,
      },
      { transaction: t }
    );

    // Désactiver le compte de l'utilisateur
    await target.update({ isActive: false }, { transaction: t });

    await ModerationAction.log({
      actionType: 'ban_user',
      moderatorId: req.user.id,
      targetUserId: target.id,
      targetId: newSanction.id,
      targetType: 'user_sanction',
      reason,
      details: { durationHours: durationHours || null, expiresAt },
      transaction: t,
    });

    return newSanction;
  });

  res.status(200).json({
    success: true,
    data: { sanction },
    message: expiresAt
      ? `Utilisateur banni jusqu'au ${expiresAt.toISOString()}`
      : 'Utilisateur banni définitivement',
  });
});

/**
 * Lève le bannissement d'un utilisateur
 * POST /api/admin/users/:id/unban
 */
const unban = asyncHandler(async (req, res) => {
  const target = await User.findByPk(req.params.id);
  if (!target) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  // Trouver le ban actif
  const activeBan = await UserSanction.scope(['active', 'bans']).findOne({
    where: { userId: target.id },
  });

  if (!activeBan) {
    throw ApiError.badRequest('Aucun bannissement actif pour cet utilisateur');
  }

  await sequelize.transaction(async (t) => {
    await activeBan.revoke(req.user.id, { transaction: t });
    await target.update({ isActive: true }, { transaction: t });

    await ModerationAction.log({
      actionType: 'unban_user',
      moderatorId: req.user.id,
      targetUserId: target.id,
      targetId: activeBan.id,
      targetType: 'user_sanction',
      reason: req.body.reason || null,
      details: null,
      transaction: t,
    });
  });

  res.status(200).json({
    success: true,
    data: { sanction: activeBan },
    message: 'Bannissement levé avec succès',
  });
});

/**
 * Réduit au silence (mute) un utilisateur
 * POST /api/admin/users/:id/mute
 * Body: { reason, durationHours (null = permanent) }
 */
const mute = asyncHandler(async (req, res) => {
  const { reason, durationHours } = req.body;

  const target = await User.findByPk(req.params.id);
  if (!target) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  // Protection : ne peut pas se muter soi-même
  if (target.id === req.user.id) {
    throw ApiError.badRequest('Vous ne pouvez pas vous muter vous-même');
  }

  // Un MODERATOR ne peut pas muter un ADMIN
  if (req.user.role === 'MODERATOR' && target.role === 'ADMIN') {
    throw ApiError.forbidden('Vous n\'êtes pas autorisé à muter un administrateur');
  }

  const startsAt = new Date();
  const expiresAt = durationHours ? new Date(Date.now() + durationHours * 60 * 60 * 1000) : null;

  const sanction = await sequelize.transaction(async (t) => {
    const newSanction = await UserSanction.create(
      {
        userId: target.id,
        type: 'mute',
        reason,
        issuedBy: req.user.id,
        startsAt,
        expiresAt,
      },
      { transaction: t }
    );

    await ModerationAction.log({
      actionType: 'mute_user',
      moderatorId: req.user.id,
      targetUserId: target.id,
      targetId: newSanction.id,
      targetType: 'user_sanction',
      reason,
      details: { durationHours: durationHours || null, expiresAt },
      transaction: t,
    });

    return newSanction;
  });

  res.status(200).json({
    success: true,
    data: { sanction },
    message: expiresAt
      ? `Utilisateur réduit au silence jusqu'au ${expiresAt.toISOString()}`
      : 'Utilisateur réduit au silence définitivement',
  });
});

/**
 * Lève le mute d'un utilisateur
 * POST /api/admin/users/:id/unmute
 */
const unmute = asyncHandler(async (req, res) => {
  const target = await User.findByPk(req.params.id);
  if (!target) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  // Trouver le mute actif
  const activeMute = await UserSanction.scope(['active', 'mutes']).findOne({
    where: { userId: target.id },
  });

  if (!activeMute) {
    throw ApiError.badRequest('Aucun mute actif pour cet utilisateur');
  }

  await sequelize.transaction(async (t) => {
    await activeMute.revoke(req.user.id, { transaction: t });

    await ModerationAction.log({
      actionType: 'unmute_user',
      moderatorId: req.user.id,
      targetUserId: target.id,
      targetId: activeMute.id,
      targetType: 'user_sanction',
      reason: req.body.reason || null,
      details: null,
      transaction: t,
    });
  });

  res.status(200).json({
    success: true,
    data: { sanction: activeMute },
    message: 'Mute levé avec succès',
  });
});

/**
 * Active ou désactive un compte utilisateur
 * PATCH /api/admin/users/:id/status
 * Body: { isActive }
 */
const updateStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  if (typeof isActive !== 'boolean') {
    throw ApiError.badRequest('Le champ isActive doit être un booléen');
  }

  const target = await User.findByPk(req.params.id);
  if (!target) {
    throw ApiError.notFound('Utilisateur non trouvé');
  }

  // Protection : ne peut pas se désactiver soi-même
  if (target.id === req.user.id) {
    throw ApiError.badRequest('Vous ne pouvez pas modifier le statut de votre propre compte');
  }

  // Un MODERATOR ne peut pas désactiver un ADMIN
  if (req.user.role === 'MODERATOR' && target.role === 'ADMIN') {
    throw ApiError.forbidden('Vous n\'êtes pas autorisé à modifier le statut d\'un administrateur');
  }

  await sequelize.transaction(async (t) => {
    await target.update({ isActive }, { transaction: t });

    await ModerationAction.log({
      actionType: isActive ? 'activate_user' : 'deactivate_user',
      moderatorId: req.user.id,
      targetUserId: target.id,
      targetType: 'user',
      reason: req.body.reason || null,
      details: { isActive },
      transaction: t,
    });
  });

  res.status(200).json({
    success: true,
    data: { user: target },
    message: isActive ? 'Compte activé avec succès' : 'Compte désactivé avec succès',
  });
});

module.exports = {
  getAll,
  getById,
  changeRole,
  ban,
  unban,
  mute,
  unmute,
  updateStatus,
};
