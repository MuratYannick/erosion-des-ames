import api from './api';

/**
 * Service pour l'administration et la modération
 * Gère le tableau de bord, les utilisateurs, les personnages,
 * les catégories du forum et les actions de modération
 */

// ============================================================================
// DASHBOARD
// ============================================================================

/**
 * Récupère les statistiques du tableau de bord administrateur
 * @returns {Promise<Object>} Statistiques globales (utilisateurs, personnages, forum, modération)
 */
export const getDashboardStats = async () => {
  const response = await api.get('/admin/dashboard/stats', {
    skipErrorRedirect: true,
  });
  return response.data;
};

// ============================================================================
// UTILISATEURS
// ============================================================================

/**
 * Récupère la liste des utilisateurs avec filtres et pagination
 * @param {Object} params - Paramètres de filtrage et pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre de résultats par page
 * @param {string} params.role - Rôle à filtrer (ADMIN, MODERATOR, GAME_MASTER, PLAYER)
 * @param {boolean} params.isActive - Filtre sur le statut actif/inactif
 * @param {string} params.search - Recherche textuelle (nom, email)
 * @param {string} params.sortBy - Champ de tri
 * @param {string} params.sortOrder - Sens du tri (ASC, DESC)
 * @returns {Promise<Object>} Liste paginée des utilisateurs
 */
export const getUsers = async (params = {}) => {
  const response = await api.get('/admin/users', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère un utilisateur par son ID avec le détail de ses sanctions et actions
 * @param {string} id - UUID de l'utilisateur
 * @returns {Promise<Object>} Données complètes de l'utilisateur
 */
export const getUser = async (id) => {
  const response = await api.get(`/admin/users/${id}`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Modifie le rôle d'un utilisateur
 * @param {string} id - UUID de l'utilisateur
 * @param {Object} data - Données de modification
 * @param {string} data.role - Nouveau rôle (ADMIN, MODERATOR, GAME_MASTER, PLAYER)
 * @returns {Promise<Object>} Utilisateur mis à jour
 */
export const changeUserRole = async (id, data) => {
  const response = await api.patch(`/admin/users/${id}/role`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Bannit un utilisateur
 * @param {string} id - UUID de l'utilisateur
 * @param {Object} data - Données du bannissement
 * @param {string} data.reason - Raison du bannissement
 * @param {number} data.durationHours - Durée en heures (0 = permanent)
 * @returns {Promise<Object>} Confirmation du bannissement
 */
export const banUser = async (id, data) => {
  const response = await api.patch(`/admin/users/${id}/ban`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Lève le bannissement d'un utilisateur
 * @param {string} id - UUID de l'utilisateur
 * @returns {Promise<Object>} Confirmation de la levée du bannissement
 */
export const unbanUser = async (id) => {
  const response = await api.patch(`/admin/users/${id}/unban`, {}, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Met en sourdine un utilisateur (empêche de poster)
 * @param {string} id - UUID de l'utilisateur
 * @param {Object} data - Données de la mise en sourdine
 * @param {string} data.reason - Raison de la mise en sourdine
 * @param {number} data.durationHours - Durée en heures (0 = permanent)
 * @returns {Promise<Object>} Confirmation de la mise en sourdine
 */
export const muteUser = async (id, data) => {
  const response = await api.patch(`/admin/users/${id}/mute`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Lève la mise en sourdine d'un utilisateur
 * @param {string} id - UUID de l'utilisateur
 * @returns {Promise<Object>} Confirmation de la levée de la sourdine
 */
export const unmuteUser = async (id) => {
  const response = await api.patch(`/admin/users/${id}/unmute`, {}, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Met à jour le statut actif/inactif d'un utilisateur
 * @param {string} id - UUID de l'utilisateur
 * @param {Object} data - Données de mise à jour
 * @param {boolean} data.isActive - Nouveau statut
 * @returns {Promise<Object>} Utilisateur mis à jour
 */
export const updateUserStatus = async (id, data) => {
  const response = await api.patch(`/admin/users/${id}/status`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

// ============================================================================
// PERSONNAGES
// ============================================================================

/**
 * Récupère la liste des personnages avec filtres et pagination (vue admin)
 * @param {Object} params - Paramètres de filtrage et pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre de résultats par page
 * @param {string} params.status - Statut du personnage (DRAFT, SUBMITTED, APPROVED, REJECTED)
 * @param {string} params.userId - UUID de l'utilisateur propriétaire
 * @param {number} params.ethnicityId - ID de l'ethnie
 * @param {number} params.factionId - ID de la faction
 * @returns {Promise<Object>} Liste paginée des personnages
 */
export const getCharacters = async (params = {}) => {
  const response = await api.get('/admin/characters', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère les personnages en attente de validation
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre de résultats par page
 * @returns {Promise<Object>} Liste paginée des personnages soumis
 */
export const getPendingCharacters = async (params = {}) => {
  const response = await api.get('/admin/characters/pending', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Approuve un personnage soumis
 * Change le statut de SUBMITTED à APPROVED
 * @param {string} id - ID du personnage
 * @returns {Promise<Object>} Personnage approuvé
 */
export const approveCharacter = async (id) => {
  const response = await api.patch(`/admin/characters/${id}/approve`, {}, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Rejette un personnage soumis avec une raison obligatoire
 * Change le statut de SUBMITTED à REJECTED
 * @param {string} id - ID du personnage
 * @param {Object} data - Données du rejet
 * @param {string} data.rejectionReason - Raison du rejet (envoyée au joueur)
 * @returns {Promise<Object>} Personnage rejeté
 */
export const rejectCharacter = async (id, data) => {
  const response = await api.patch(`/admin/characters/${id}/reject`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Supprime définitivement un personnage (soft delete)
 * @param {string} id - ID du personnage
 * @returns {Promise<Object>} Confirmation de suppression
 */
export const deleteCharacter = async (id) => {
  const response = await api.delete(`/admin/characters/${id}`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

// ============================================================================
// FORUM — CATÉGORIES
// ============================================================================

/**
 * Récupère toutes les catégories du forum (vue admin avec données étendues)
 * @returns {Promise<Object>} Liste complète des catégories
 */
export const getAdminCategories = async ({ includeTopics = false } = {}) => {
  const params = includeTopics ? { includeTopics: 'true' } : {};
  const response = await api.get('/admin/forum/categories', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Crée une nouvelle catégorie de forum
 * @param {Object} data - Données de la catégorie
 * @returns {Promise<Object>} Catégorie créée
 */
export const createCategory = async (data) => {
  const response = await api.post('/admin/forum/categories', data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Met à jour une catégorie de forum existante
 * @param {number} id - ID de la catégorie
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>} Catégorie mise à jour
 */
export const updateCategory = async (id, data) => {
  const response = await api.put(`/admin/forum/categories/${id}`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Supprime une catégorie de forum
 * @param {number} id - ID de la catégorie
 * @returns {Promise<Object>} Confirmation de suppression
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(`/admin/forum/categories/${id}`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Réordonne les catégories du forum
 * @param {Array<Object>} categories - Tableau des catégories avec leur nouvel ordre
 * @returns {Promise<Object>} Résultat de la réorganisation
 */
export const reorderCategories = async (categories) => {
  const response = await api.patch('/admin/forum/categories/reorder', { categories }, {
    skipErrorRedirect: true,
  });
  return response.data;
};

// FORUM — PERMISSIONS DES CATÉGORIES

export const getCategoryPermissions = async (categoryId) => {
  const response = await api.get(`/admin/forum/categories/${categoryId}/permissions`, { skipErrorRedirect: true });
  return response.data;
};

export const getCategoryEffectivePermissions = async (categoryId) => {
  const response = await api.get(`/admin/forum/categories/${categoryId}/permissions/effective`, { skipErrorRedirect: true });
  return response.data;
};

export const addCategoryPermission = async (categoryId, data) => {
  const response = await api.post(`/admin/forum/categories/${categoryId}/permissions`, data, { skipErrorRedirect: true });
  return response.data;
};

export const removeCategoryPermission = async (categoryId, permissionId) => {
  const response = await api.delete(`/admin/forum/categories/${categoryId}/permissions/${permissionId}`, { skipErrorRedirect: true });
  return response.data;
};

// ============================================================================
// FORUM — TOPICS
// ============================================================================

/**
 * Déplace un topic vers une autre catégorie
 * @param {number} id - ID du topic
 * @param {Object} data - Données du déplacement
 * @param {number} data.categoryId - ID de la catégorie de destination
 * @returns {Promise<Object>} Topic déplacé
 */
export const moveTopic = async (id, data) => {
  const response = await api.patch(`/admin/forum/topics/${id}/move`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Fusionne deux topics en un seul
 * Les posts du topic source sont déplacés vers le topic cible
 * @param {Object} data - Données de la fusion
 * @param {number} data.sourceTopicId - ID du topic à fusionner (sera supprimé)
 * @param {number} data.targetTopicId - ID du topic de destination
 * @returns {Promise<Object>} Topic résultant de la fusion
 */
export const mergeTopics = async (data) => {
  const response = await api.patch('/admin/forum/topics/merge', data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

// ============================================================================
// MODÉRATION
// ============================================================================

/**
 * Récupère l'historique des actions de modération
 * @param {Object} params - Paramètres de filtrage et pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre de résultats par page
 * @param {string} params.actionType - Type d'action (BAN, UNBAN, MUTE, UNMUTE, etc.)
 * @param {string} params.moderatorId - UUID du modérateur ayant effectué l'action
 * @param {string} params.targetUserId - UUID de l'utilisateur ciblé par l'action
 * @param {string} params.startDate - Date de début (ISO 8601)
 * @param {string} params.endDate - Date de fin (ISO 8601)
 * @returns {Promise<Object>} Liste paginée des actions de modération
 */
export const getModerationActions = async (params = {}) => {
  const response = await api.get('/admin/moderation/actions', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère la liste des sanctions actives ou passées
 * @param {Object} params - Paramètres de filtrage et pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre de résultats par page
 * @param {string} params.type - Type de sanction (BAN, MUTE)
 * @param {boolean} params.isActive - Filtre sur les sanctions actives uniquement
 * @param {string} params.userId - UUID de l'utilisateur sanctionné
 * @returns {Promise<Object>} Liste paginée des sanctions
 */
export const getSanctions = async (params = {}) => {
  const response = await api.get('/admin/moderation/sanctions', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère les signalements soumis par les utilisateurs
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre de résultats par page
 * @returns {Promise<Object>} Liste paginée des signalements
 */
export const getReports = async (params = {}) => {
  const response = await api.get('/admin/moderation/reports', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Traite un signalement (acceptation ou rejet)
 * @param {number} id - ID du signalement
 * @param {Object} data - Données de traitement
 * @param {string} data.status - Nouveau statut (RESOLVED, DISMISSED)
 * @param {string} data.reason - Raison de la décision (optionnel)
 * @returns {Promise<Object>} Signalement traité
 */
export const reviewReport = async (id, data) => {
  const response = await api.patch(`/admin/moderation/reports/${id}/review`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};
