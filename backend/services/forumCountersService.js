'use strict';

const { ForumCategory, ForumTopic, ForumPost } = require('../models');

/**
 * Recalcule le lastPostId d'une catégorie en cherchant le post le plus récent
 * parmi tous les topics non supprimés de cette catégorie.
 *
 * @param {number} categoryId
 * @param {import('sequelize').Transaction} transaction
 */
const recalculateCategoryLastPost = async (categoryId, transaction) => {
  const lastPost = await ForumPost.findOne({
    include: [
      {
        model: ForumTopic,
        as: 'topic',
        where: { categoryId },
        attributes: [],
        required: true,
      },
    ],
    order: [['createdAt', 'DESC']],
    transaction,
  });

  await ForumCategory.update(
    { lastPostId: lastPost ? lastPost.id : null },
    { where: { id: categoryId }, transaction }
  );
};

/**
 * Recalcule tous les compteurs d'une catégorie depuis la base de données :
 * topicCount, postCount et lastPostId.
 *
 * A utiliser après des opérations qui peuvent désynchorniser les compteurs
 * (ex: suppression en masse, import, etc.). Pour les opérations unitaires
 * (déplacement, fusion), préférer recalculateCategoryLastPost combiné aux
 * ajustements arithmétiques déjà présents dans le controller.
 *
 * @param {number} categoryId
 * @param {import('sequelize').Transaction} transaction
 */
const recalculateCategoryFullCounters = async (categoryId, transaction) => {
  // Compter les topics non supprimés de la catégorie
  const topicCount = await ForumTopic.count({
    where: { categoryId },
    transaction,
  });

  // Compter les posts non supprimés via JOIN sur les topics de la catégorie
  const postCount = await ForumPost.count({
    include: [
      {
        model: ForumTopic,
        as: 'topic',
        where: { categoryId },
        attributes: [],
        required: true,
      },
    ],
    transaction,
  });

  // Trouver le post le plus récent de la catégorie
  const lastPost = await ForumPost.findOne({
    include: [
      {
        model: ForumTopic,
        as: 'topic',
        where: { categoryId },
        attributes: [],
        required: true,
      },
    ],
    order: [['createdAt', 'DESC']],
    transaction,
  });

  await ForumCategory.update(
    {
      topicCount,
      postCount,
      lastPostId: lastPost ? lastPost.id : null,
    },
    { where: { id: categoryId }, transaction }
  );
};

module.exports = {
  recalculateCategoryLastPost,
  recalculateCategoryFullCounters,
};
