'use strict';

const { Ethnicity, Faction, Clan } = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');
const { Op } = require('sequelize');

/**
 * Récupérer toutes les ethnies
 * GET /api/ethnicities
 */
const getAll = asyncHandler(async (req, res) => {
  const ethnicities = await Ethnicity.findAll({
    order: [['name', 'ASC']],
  });

  res.status(200).json({
    success: true,
    data: { ethnicities },
  });
});

/**
 * Récupérer une ethnie par son ID
 * GET /api/ethnicities/:id
 */
const getById = asyncHandler(async (req, res) => {
  const ethnicity = await Ethnicity.findByPk(req.params.id, {
    include: [
      { model: Faction, as: 'factions' },
      { model: Clan, as: 'clans' },
    ],
  });

  if (!ethnicity) {
    throw ApiError.notFound('Ethnie non trouvée');
  }

  res.status(200).json({
    success: true,
    data: { ethnicity },
  });
});

/**
 * Créer une ethnie
 * POST /api/ethnicities
 */
const create = asyncHandler(async (req, res) => {
  const { name } = req.body;

  // Vérifier l'unicité du nom
  const existing = await Ethnicity.findOne({ where: { name } });
  if (existing) {
    throw ApiError.conflict('Une ethnie avec ce nom existe déjà');
  }

  const ethnicity = await Ethnicity.create({ name });

  res.status(201).json({
    success: true,
    data: { ethnicity },
    message: 'Ethnie créée avec succès',
  });
});

/**
 * Mettre à jour une ethnie
 * PUT /api/ethnicities/:id
 */
const update = asyncHandler(async (req, res) => {
  const ethnicity = await Ethnicity.findByPk(req.params.id);

  if (!ethnicity) {
    throw ApiError.notFound('Ethnie non trouvée');
  }

  const { name } = req.body;

  // Vérifier l'unicité du nom (exclure l'ethnie courante)
  if (name) {
    const existing = await Ethnicity.findOne({
      where: {
        name,
        id: { [Op.ne]: ethnicity.id },
      },
    });
    if (existing) {
      throw ApiError.conflict('Une ethnie avec ce nom existe déjà');
    }
  }

  await ethnicity.update({ name: name || ethnicity.name });

  res.status(200).json({
    success: true,
    data: { ethnicity },
    message: 'Ethnie mise à jour avec succès',
  });
});

/**
 * Supprimer une ethnie (soft delete)
 * DELETE /api/ethnicities/:id
 */
const remove = asyncHandler(async (req, res) => {
  const ethnicity = await Ethnicity.findByPk(req.params.id);

  if (!ethnicity) {
    throw ApiError.notFound('Ethnie non trouvée');
  }

  await ethnicity.destroy();

  res.status(200).json({
    success: true,
    message: 'Ethnie supprimée avec succès',
  });
});

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
