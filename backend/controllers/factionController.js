'use strict';

const { Faction, Ethnicity, Clan, User } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER'];

/**
 * Récupérer toutes les factions
 * GET /api/factions
 * Public : uniquement active + approved
 * Staff : tous avec filtres optionnels (status, isActive, isPlayable)
 */
const getAll = asyncHandler(async (req, res) => {
  const isStaff = req.user && STAFF_ROLES.includes(req.user.role);

  let where = {};

  if (isStaff) {
    // Filtres optionnels pour le staff
    if (req.query.status) {
      where.status = req.query.status;
    }
    if (req.query.isActive !== undefined) {
      where.isActive = req.query.isActive === 'true';
    }
    if (req.query.isPlayable !== undefined) {
      where.isPlayable = req.query.isPlayable === 'true';
    }
    if (req.query.ethnicityId) {
      where.ethnicityId = req.query.ethnicityId;
    }
  } else {
    // Public : uniquement les factions actives et approuvées
    where.isActive = true;
    where.status = 'approved';
  }

  const factions = await Faction.findAll({
    where,
    include: [
      { model: Ethnicity, as: 'ethnicity' },
    ],
    order: [['name', 'ASC']],
  });

  res.status(200).json({
    success: true,
    data: { factions },
  });
});

/**
 * Récupérer une faction par son ID
 * GET /api/factions/:id
 */
const getById = asyncHandler(async (req, res) => {
  const isStaff = req.user && STAFF_ROLES.includes(req.user.role);

  const faction = await Faction.findByPk(req.params.id, {
    include: [
      { model: Ethnicity, as: 'ethnicity' },
      { model: Clan, as: 'clans' },
      { model: User, as: 'approver', attributes: ['id', 'username'] },
    ],
  });

  if (!faction) {
    throw ApiError.notFound('Faction non trouvée');
  }

  // Les non-staff ne peuvent voir que les factions actives et approuvées
  if (!isStaff && (faction.status !== 'approved' || !faction.isActive)) {
    throw ApiError.notFound('Faction non trouvée');
  }

  res.status(200).json({
    success: true,
    data: { faction },
  });
});

/**
 * Créer une faction
 * POST /api/factions
 */
const create = asyncHandler(async (req, res) => {
  const { name, ethnicityId, emblem, isPlayable, background, goals } = req.body;

  // Vérifier que l'ethnie existe
  const ethnicity = await Ethnicity.findByPk(ethnicityId);
  if (!ethnicity) {
    throw ApiError.badRequest('L\'ethnie spécifiée n\'existe pas');
  }

  // Vérifier l'unicité du nom
  const existing = await Faction.findOne({ where: { name } });
  if (existing) {
    throw ApiError.conflict('Une faction avec ce nom existe déjà');
  }

  const faction = await Faction.create({
    name,
    ethnicityId,
    emblem,
    isPlayable: isPlayable || false,
    background,
    goals,
  });

  res.status(201).json({
    success: true,
    data: { faction },
    message: 'Faction créée avec succès',
  });
});

/**
 * Mettre à jour une faction
 * PUT /api/factions/:id
 */
const update = asyncHandler(async (req, res) => {
  const faction = await Faction.findByPk(req.params.id);

  if (!faction) {
    throw ApiError.notFound('Faction non trouvée');
  }

  const { name, ethnicityId, emblem, isPlayable, background, goals } = req.body;

  // Vérifier l'unicité du nom
  if (name) {
    const existing = await Faction.findOne({
      where: {
        name,
        id: { [Op.ne]: faction.id },
      },
    });
    if (existing) {
      throw ApiError.conflict('Une faction avec ce nom existe déjà');
    }
  }

  // Vérifier que l'ethnie existe
  if (ethnicityId) {
    const ethnicity = await Ethnicity.findByPk(ethnicityId);
    if (!ethnicity) {
      throw ApiError.badRequest('L\'ethnie spécifiée n\'existe pas');
    }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (ethnicityId !== undefined) updateData.ethnicityId = ethnicityId;
  if (emblem !== undefined) updateData.emblem = emblem;
  if (isPlayable !== undefined) updateData.isPlayable = isPlayable;
  if (background !== undefined) updateData.background = background;
  if (goals !== undefined) updateData.goals = goals;

  await faction.update(updateData);

  res.status(200).json({
    success: true,
    data: { faction },
    message: 'Faction mise à jour avec succès',
  });
});

/**
 * Soumettre une faction pour approbation (draft/rejected -> pending)
 * PATCH /api/factions/:id/submit
 */
const submit = asyncHandler(async (req, res) => {
  const faction = await Faction.findByPk(req.params.id);

  if (!faction) {
    throw ApiError.notFound('Faction non trouvée');
  }

  if (faction.status !== 'draft' && faction.status !== 'rejected') {
    throw ApiError.badRequest('Seules les factions en brouillon ou rejetées peuvent être soumises');
  }

  await faction.update({ status: 'pending', rejectionReason: null });

  res.status(200).json({
    success: true,
    data: { faction },
    message: 'Faction soumise pour approbation',
  });
});

/**
 * Approuver une faction (pending -> approved)
 * PATCH /api/factions/:id/approve
 */
const approve = asyncHandler(async (req, res) => {
  const faction = await Faction.findByPk(req.params.id);

  if (!faction) {
    throw ApiError.notFound('Faction non trouvée');
  }

  if (faction.status !== 'pending') {
    throw ApiError.badRequest('Seules les factions en attente peuvent être approuvées');
  }

  await faction.approve(req.user.id);

  res.status(200).json({
    success: true,
    data: { faction },
    message: 'Faction approuvée avec succès',
  });
});

/**
 * Rejeter une faction (pending -> rejected)
 * PATCH /api/factions/:id/reject
 */
const reject = asyncHandler(async (req, res) => {
  const faction = await Faction.findByPk(req.params.id);

  if (!faction) {
    throw ApiError.notFound('Faction non trouvée');
  }

  if (faction.status !== 'pending') {
    throw ApiError.badRequest('Seules les factions en attente peuvent être rejetées');
  }

  await faction.reject(req.body.rejectionReason);

  res.status(200).json({
    success: true,
    data: { faction },
    message: 'Faction rejetée',
  });
});

/**
 * Supprimer une faction (soft delete)
 * DELETE /api/factions/:id
 */
const remove = asyncHandler(async (req, res) => {
  const faction = await Faction.findByPk(req.params.id);

  if (!faction) {
    throw ApiError.notFound('Faction non trouvée');
  }

  await faction.destroy();

  res.status(200).json({
    success: true,
    message: 'Faction supprimée avec succès',
  });
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  submit,
  approve,
  reject,
  remove,
};
