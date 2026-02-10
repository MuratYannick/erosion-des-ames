'use strict';

const {
  User,
  Character,
  ForumTopic,
  ForumPost,
  PostReport,
  UserSanction,
} = require('../models');
const { ApiError, asyncHandler } = require('../middlewares/errorHandler');

/**
 * Récupère les statistiques générales du tableau de bord
 * GET /api/admin/dashboard/stats
 */
const getStats = asyncHandler(async (req, res) => {
  // --- Statistiques utilisateurs ---
  const totalUsers = await User.unscoped().count();

  // Compte par rôle
  const usersByRole = await User.unscoped().count({ group: ['role'] });
  // Résultat : [{ role: 'PLAYER', count: 42 }, ...]
  const roleMap = {};
  for (const row of usersByRole) {
    roleMap[row.role] = parseInt(row.count, 10);
  }

  const activeUsers = await User.scope('active').count();

  // --- Statistiques personnages ---
  const totalCharacters = await Character.unscoped().count();

  const charactersByStatus = await Character.unscoped().count({ group: ['status'] });
  const statusMap = {};
  for (const row of charactersByStatus) {
    statusMap[row.status] = parseInt(row.count, 10);
  }

  // --- Statistiques forum ---
  const totalTopics = await ForumTopic.count();
  const totalPosts = await ForumPost.count();

  // --- Signalements en attente ---
  const pendingReports = await PostReport.count({ where: { status: 'pending' } });

  // --- Sanctions actives ---
  const activeSanctions = await UserSanction.scope('active').count();

  // --- Inscriptions récentes (5 derniers comptes créés) ---
  const recentUsers = await User.findAll({
    attributes: ['id', 'username', 'email', 'role', 'createdAt'],
    order: [['createdAt', 'DESC']],
    limit: 5,
  });

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
        byRole: roleMap,
      },
      characters: {
        total: totalCharacters,
        byStatus: {
          draft: statusMap.draft || 0,
          pending: statusMap.pending || 0,
          approved: statusMap.approved || 0,
          rejected: statusMap.rejected || 0,
        },
      },
      forum: {
        totalTopics,
        totalPosts,
      },
      moderation: {
        pendingReports,
        activeSanctions,
      },
      recentUsers,
    },
  });
});

module.exports = {
  getStats,
};
