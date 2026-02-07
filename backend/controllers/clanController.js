'use strict';

const { Clan, Ethnicity, Faction, User } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER'];

/**
 * Récupérer tous les clans
 * GET /api/clans
 * Public : uniquement active + approved
 * Staff : tous avec filtres optionnels
 */
const getAll = asyncHandler(async (req, res) => {
  const isStaff = req.user && STAFF_ROLES.includes(req.user.role);

  let where = {};

  if (isStaff) {
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
    if (req.query.factionId) {
      where.factionId = req.query.factionId;
    }
  } else {
    where.isActive = true;
    where.status = 'approved';
  }

  const clans = await Clan.findAll({
    where,
    include: [
      { model: Ethnicity, as: 'ethnicity' },
      { model: Faction, as: 'faction' },
    ],
    order: [['name', 'ASC']],
  });

  res.status(200).json({
    success: true,
    data: { clans },
  });
});

/**
 * Récupérer un clan par son ID
 * GET /api/clans/:id
 */
const getById = asyncHandler(async (req, res) => {
  const isStaff = req.user && STAFF_ROLES.includes(req.user.role);

  const clan = await Clan.findByPk(req.params.id, {
    include: [
      { model: Ethnicity, as: 'ethnicity' },
      { model: Faction, as: 'faction' },
      { model: User, as: 'approver', attributes: ['id', 'username'] },
    ],
  });

  if (!clan) {
    throw ApiError.notFound('Clan non trouvé');
  }

  if (!isStaff && (clan.status !== 'approved' || !clan.isActive)) {
    throw ApiError.notFound('Clan non trouvé');
  }

  res.status(200).json({
    success: true,
    data: { clan },
  });
});

/**
 * Créer un clan
 * POST /api/clans
 */
const create = asyncHandler(async (req, res) => {
  const { name, ethnicityId, factionId, emblem, isPlayable, background, goals } = req.body;

  // Vérifier que l'ethnie existe (si fournie)
  if (ethnicityId) {
    const ethnicity = await Ethnicity.findByPk(ethnicityId);
    if (!ethnicity) {
      throw ApiError.badRequest('L\'ethnie spécifiée n\'existe pas');
    }
  }

  // Vérifier que la faction existe (si fournie)
  if (factionId) {
    const faction = await Faction.findByPk(factionId);
    if (!faction) {
      throw ApiError.badRequest('La faction spécifiée n\'existe pas');
    }
  }

  // Vérifier l'unicité du nom
  const existing = await Clan.findOne({ where: { name } });
  if (existing) {
    throw ApiError.conflict('Un clan avec ce nom existe déjà');
  }

  const clan = await Clan.create({
    name,
    ethnicityId: ethnicityId || null,
    factionId: factionId || null,
    emblem,
    isPlayable: isPlayable || false,
    background,
    goals,
  });

  res.status(201).json({
    success: true,
    data: { clan },
    message: 'Clan créé avec succès',
  });
});

/**
 * Mettre à jour un clan
 * PUT /api/clans/:id
 */
const update = asyncHandler(async (req, res) => {
  const clan = await Clan.findByPk(req.params.id);

  if (!clan) {
    throw ApiError.notFound('Clan non trouvé');
  }

  const { name, ethnicityId, factionId, emblem, isPlayable, background, goals } = req.body;

  // Vérifier l'unicité du nom
  if (name) {
    const existing = await Clan.findOne({
      where: {
        name,
        id: { [Op.ne]: clan.id },
      },
    });
    if (existing) {
      throw ApiError.conflict('Un clan avec ce nom existe déjà');
    }
  }

  // Vérifier que l'ethnie existe (si fournie)
  if (ethnicityId) {
    const ethnicity = await Ethnicity.findByPk(ethnicityId);
    if (!ethnicity) {
      throw ApiError.badRequest('L\'ethnie spécifiée n\'existe pas');
    }
  }

  // Vérifier que la faction existe (si fournie)
  if (factionId) {
    const faction = await Faction.findByPk(factionId);
    if (!faction) {
      throw ApiError.badRequest('La faction spécifiée n\'existe pas');
    }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (ethnicityId !== undefined) updateData.ethnicityId = ethnicityId;
  if (factionId !== undefined) updateData.factionId = factionId;
  if (emblem !== undefined) updateData.emblem = emblem;
  if (isPlayable !== undefined) updateData.isPlayable = isPlayable;
  if (background !== undefined) updateData.background = background;
  if (goals !== undefined) updateData.goals = goals;

  await clan.update(updateData);

  res.status(200).json({
    success: true,
    data: { clan },
    message: 'Clan mis à jour avec succès',
  });
});

/**
 * Soumettre un clan pour approbation (draft/rejected -> pending)
 * PATCH /api/clans/:id/submit
 */
const submit = asyncHandler(async (req, res) => {
  const clan = await Clan.findByPk(req.params.id);

  if (!clan) {
    throw ApiError.notFound('Clan non trouvé');
  }

  if (clan.status !== 'draft' && clan.status !== 'rejected') {
    throw ApiError.badRequest('Seuls les clans en brouillon ou rejetés peuvent être soumis');
  }

  await clan.update({ status: 'pending', rejectionReason: null });

  res.status(200).json({
    success: true,
    data: { clan },
    message: 'Clan soumis pour approbation',
  });
});

/**
 * Approuver un clan (pending -> approved)
 * PATCH /api/clans/:id/approve
 */
const approve = asyncHandler(async (req, res) => {
  const clan = await Clan.findByPk(req.params.id);

  if (!clan) {
    throw ApiError.notFound('Clan non trouvé');
  }

  if (clan.status !== 'pending') {
    throw ApiError.badRequest('Seuls les clans en attente peuvent être approuvés');
  }

  await clan.approve(req.user.id);

  res.status(200).json({
    success: true,
    data: { clan },
    message: 'Clan approuvé avec succès',
  });
});

/**
 * Rejeter un clan (pending -> rejected)
 * PATCH /api/clans/:id/reject
 */
const reject = asyncHandler(async (req, res) => {
  const clan = await Clan.findByPk(req.params.id);

  if (!clan) {
    throw ApiError.notFound('Clan non trouvé');
  }

  if (clan.status !== 'pending') {
    throw ApiError.badRequest('Seuls les clans en attente peuvent être rejetés');
  }

  await clan.reject(req.body.rejectionReason);

  res.status(200).json({
    success: true,
    data: { clan },
    message: 'Clan rejeté',
  });
});

/**
 * Supprimer un clan (soft delete)
 * DELETE /api/clans/:id
 */
const remove = asyncHandler(async (req, res) => {
  const clan = await Clan.findByPk(req.params.id);

  if (!clan) {
    throw ApiError.notFound('Clan non trouvé');
  }

  await clan.destroy();

  res.status(200).json({
    success: true,
    message: 'Clan supprimé avec succès',
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
