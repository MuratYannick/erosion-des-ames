'use strict';

const { Character, Ethnicity, Faction, Clan, User } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER'];

/**
 * Récupérer tous les personnages
 * GET /api/characters
 * Public : uniquement active + approved
 * Staff : tous avec filtres optionnels (status, isActive, ethnicityId, factionId, clanId, userId)
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
    if (req.query.ethnicityId) {
      where.ethnicityId = req.query.ethnicityId;
    }
    if (req.query.factionId) {
      where.factionId = req.query.factionId;
    }
    if (req.query.clanId) {
      where.clanId = req.query.clanId;
    }
    if (req.query.userId) {
      where.userId = req.query.userId;
    }
  } else {
    // Public : uniquement les personnages actifs et approuvés
    where.isActive = true;
    where.status = 'approved';
  }

  const characters = await Character.findAll({
    where,
    include: [
      { model: Ethnicity, as: 'ethnicity' },
      { model: Faction, as: 'faction' },
      { model: Clan, as: 'clan' },
    ],
    order: [['name', 'ASC']],
  });

  res.status(200).json({
    success: true,
    data: { characters },
  });
});

/**
 * Récupérer un personnage par son ID
 * GET /api/characters/:id
 */
const getById = asyncHandler(async (req, res) => {
  const isStaff = req.user && STAFF_ROLES.includes(req.user.role);

  const character = await Character.findByPk(req.params.id, {
    include: [
      { model: Ethnicity, as: 'ethnicity' },
      { model: Faction, as: 'faction' },
      { model: Clan, as: 'clan' },
      { model: User, as: 'owner', attributes: ['id', 'username'] },
      { model: User, as: 'approver', attributes: ['id', 'username'] },
    ],
  });

  if (!character) {
    throw ApiError.notFound('Personnage non trouvé');
  }

  // Les non-staff ne peuvent voir que les personnages actifs et approuvés
  if (!isStaff && (character.status !== 'approved' || !character.isActive)) {
    throw ApiError.notFound('Personnage non trouvé');
  }

  res.status(200).json({
    success: true,
    data: { character },
  });
});

/**
 * Créer un personnage
 * POST /api/characters
 */
const create = asyncHandler(async (req, res) => {
  const {
    name,
    ethnicityId,
    factionId,
    clanId,
    userId,
    avatar,
    age,
    appearance,
    personality,
    background,
    goals,
  } = req.body;

  // Vérifier que l'ethnie existe (requise)
  const ethnicity = await Ethnicity.findByPk(ethnicityId);
  if (!ethnicity) {
    throw ApiError.badRequest('L\'ethnie spécifiée n\'existe pas');
  }

  // Vérifier que la faction existe (si fournie)
  if (factionId) {
    const faction = await Faction.findByPk(factionId);
    if (!faction) {
      throw ApiError.badRequest('La faction spécifiée n\'existe pas');
    }
  }

  // Vérifier que le clan existe (si fourni)
  if (clanId) {
    const clan = await Clan.findByPk(clanId);
    if (!clan) {
      throw ApiError.badRequest('Le clan spécifié n\'existe pas');
    }
  }

  // Vérifier que l'utilisateur existe (si fourni)
  if (userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw ApiError.badRequest('L\'utilisateur spécifié n\'existe pas');
    }
  }

  // Vérifier l'unicité du nom
  const existing = await Character.findOne({ where: { name } });
  if (existing) {
    throw ApiError.conflict('Un personnage avec ce nom existe déjà');
  }

  const character = await Character.create({
    name,
    ethnicityId,
    factionId: factionId || null,
    clanId: clanId || null,
    userId: userId || null,
    avatar,
    age,
    appearance,
    personality,
    background,
    goals,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    data: { character },
    message: 'Personnage créé avec succès',
  });
});

/**
 * Mettre à jour un personnage
 * PUT /api/characters/:id
 */
const update = asyncHandler(async (req, res) => {
  const character = await Character.findByPk(req.params.id);

  if (!character) {
    throw ApiError.notFound('Personnage non trouvé');
  }

  const {
    name,
    ethnicityId,
    factionId,
    clanId,
    userId,
    avatar,
    age,
    appearance,
    personality,
    background,
    goals,
  } = req.body;

  // Vérifier l'unicité du nom
  if (name) {
    const existing = await Character.findOne({
      where: {
        name,
        id: { [Op.ne]: character.id },
      },
    });
    if (existing) {
      throw ApiError.conflict('Un personnage avec ce nom existe déjà');
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

  // Vérifier que le clan existe (si fourni)
  if (clanId) {
    const clan = await Clan.findByPk(clanId);
    if (!clan) {
      throw ApiError.badRequest('Le clan spécifié n\'existe pas');
    }
  }

  // Vérifier que l'utilisateur existe (si fourni)
  if (userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw ApiError.badRequest('L\'utilisateur spécifié n\'existe pas');
    }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (ethnicityId !== undefined) updateData.ethnicityId = ethnicityId;
  if (factionId !== undefined) updateData.factionId = factionId;
  if (clanId !== undefined) updateData.clanId = clanId;
  if (userId !== undefined) updateData.userId = userId;
  if (avatar !== undefined) updateData.avatar = avatar;
  if (age !== undefined) updateData.age = age;
  if (appearance !== undefined) updateData.appearance = appearance;
  if (personality !== undefined) updateData.personality = personality;
  if (background !== undefined) updateData.background = background;
  if (goals !== undefined) updateData.goals = goals;

  await character.update(updateData);

  res.status(200).json({
    success: true,
    data: { character },
    message: 'Personnage mis à jour avec succès',
  });
});

/**
 * Soumettre un personnage pour approbation (draft/rejected -> pending)
 * PATCH /api/characters/:id/submit
 */
const submit = asyncHandler(async (req, res) => {
  const character = await Character.findByPk(req.params.id);

  if (!character) {
    throw ApiError.notFound('Personnage non trouvé');
  }

  if (character.status !== 'draft' && character.status !== 'rejected') {
    throw ApiError.badRequest('Seuls les personnages en brouillon ou rejetés peuvent être soumis');
  }

  await character.update({ status: 'pending', rejectionReason: null });

  res.status(200).json({
    success: true,
    data: { character },
    message: 'Personnage soumis pour approbation',
  });
});

/**
 * Approuver un personnage (pending -> approved)
 * PATCH /api/characters/:id/approve
 */
const approve = asyncHandler(async (req, res) => {
  const character = await Character.findByPk(req.params.id);

  if (!character) {
    throw ApiError.notFound('Personnage non trouvé');
  }

  if (character.status !== 'pending') {
    throw ApiError.badRequest('Seuls les personnages en attente peuvent être approuvés');
  }

  await character.approve(req.user.id);

  res.status(200).json({
    success: true,
    data: { character },
    message: 'Personnage approuvé avec succès',
  });
});

/**
 * Rejeter un personnage (pending -> rejected)
 * PATCH /api/characters/:id/reject
 */
const reject = asyncHandler(async (req, res) => {
  const character = await Character.findByPk(req.params.id);

  if (!character) {
    throw ApiError.notFound('Personnage non trouvé');
  }

  if (character.status !== 'pending') {
    throw ApiError.badRequest('Seuls les personnages en attente peuvent être rejetés');
  }

  await character.reject(req.body.rejectionReason);

  res.status(200).json({
    success: true,
    data: { character },
    message: 'Personnage rejeté',
  });
});

/**
 * Supprimer un personnage (soft delete)
 * DELETE /api/characters/:id
 */
const remove = asyncHandler(async (req, res) => {
  const character = await Character.findByPk(req.params.id);

  if (!character) {
    throw ApiError.notFound('Personnage non trouvé');
  }

  await character.destroy();

  res.status(200).json({
    success: true,
    message: 'Personnage supprimé avec succès',
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
