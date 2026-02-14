import api from './api';

/**
 * Service pour la gestion du forum
 * Gère les catégories, topics, posts et signalements
 */

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Récupère toutes les catégories du forum
 * @returns {Promise<Object>} Liste des catégories
 */
export const getCategories = async () => {
  const response = await api.get('/forum/categories', {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère une catégorie par son ID
 * @param {number} id - ID de la catégorie
 * @param {Object} params - Paramètres de pagination (page, limit)
 * @returns {Promise<Object>} Détails de la catégorie
 */
export const getCategory = async (id, params = {}) => {
  const response = await api.get(`/forum/categories/${id}`, {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Crée une nouvelle catégorie
 * @param {Object} data - Données de la catégorie
 * @returns {Promise<Object>} Catégorie créée
 */
export const createCategory = async (data) => {
  const response = await api.post('/forum/categories', data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Met à jour une catégorie
 * @param {number} id - ID de la catégorie
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>} Catégorie mise à jour
 */
export const updateCategory = async (id, data) => {
  const response = await api.put(`/forum/categories/${id}`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Réordonne les catégories
 * @param {Array} categories - Tableau des catégories avec leur nouvel ordre
 * @returns {Promise<Object>} Résultat de la réorganisation
 */
export const reorderCategories = async (categories) => {
  const response = await api.patch('/forum/categories/reorder', { categories }, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Supprime une catégorie
 * @param {number} id - ID de la catégorie
 * @returns {Promise<Object>} Résultat de la suppression
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(`/forum/categories/${id}`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère les permissions de l'utilisateur connecté sur une catégorie
 * @param {number} categoryId - ID de la catégorie
 * @returns {Promise<Object>} Permissions de l'utilisateur
 */
export const getMyPermissions = async (categoryId) => {
  const response = await api.get(`/forum/categories/${categoryId}/my-permissions`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

// ============================================================================
// TOPICS
// ============================================================================

/**
 * Récupère les topics récents
 * @param {Object} params - Paramètres de pagination (page, limit)
 * @returns {Promise<Object>} Liste des topics récents
 */
export const getRecentTopics = async (params = {}) => {
  const response = await api.get('/forum/topics/recent', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère les topics d'une catégorie
 * @param {number} categoryId - ID de la catégorie
 * @param {Object} params - Paramètres de pagination et tri (page, limit, sort)
 * @returns {Promise<Object>} Liste des topics de la catégorie
 */
export const getTopicsByCategory = async (categoryId, params = {}) => {
  const response = await api.get(`/forum/topics/category/${categoryId}`, {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère un topic par son ID
 * @param {number} id - ID du topic
 * @param {Object} params - Paramètres de pagination pour les posts (page, limit)
 * @returns {Promise<Object>} Détails du topic
 */
export const getTopic = async (id, params = {}) => {
  const response = await api.get(`/forum/topics/${id}`, {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Crée un nouveau topic
 * @param {Object} data - Données du topic (categoryId, title, content, characterId)
 * @returns {Promise<Object>} Topic créé
 */
export const createTopic = async (data) => {
  const response = await api.post('/forum/topics', data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Met à jour un topic
 * @param {number} id - ID du topic
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>} Topic mis à jour
 */
export const updateTopic = async (id, data) => {
  const response = await api.put(`/forum/topics/${id}`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Supprime un topic
 * @param {number} id - ID du topic
 * @returns {Promise<Object>} Résultat de la suppression
 */
export const deleteTopic = async (id) => {
  const response = await api.delete(`/forum/topics/${id}`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Épingle ou désépingle un topic
 * @param {number} id - ID du topic
 * @returns {Promise<Object>} Topic mis à jour
 */
export const pinTopic = async (id) => {
  const response = await api.patch(`/forum/topics/${id}/pin`, {}, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Verrouille ou déverrouille un topic
 * @param {number} id - ID du topic
 * @returns {Promise<Object>} Topic mis à jour
 */
export const lockTopic = async (id) => {
  const response = await api.patch(`/forum/topics/${id}/lock`, {}, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Marque un topic comme lu
 * @param {number} id - ID du topic
 * @returns {Promise<Object>} Résultat de l'opération
 */
export const markTopicAsRead = async (id) => {
  const response = await api.post(`/forum/topics/${id}/read`, {}, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Active ou désactive l'abonnement à un topic
 * @param {number} id - ID du topic
 * @returns {Promise<Object>} Résultat de l'opération
 */
export const toggleTopicSubscription = async (id) => {
  const response = await api.post(`/forum/topics/${id}/subscribe`, {}, {
    skipErrorRedirect: true,
  });
  return response.data;
};

// ============================================================================
// POSTS
// ============================================================================

/**
 * Récupère les posts d'un topic
 * @param {number} topicId - ID du topic
 * @param {Object} params - Paramètres de pagination (page, limit)
 * @returns {Promise<Object>} Liste des posts du topic
 */
export const getPostsByTopic = async (topicId, params = {}) => {
  const response = await api.get(`/forum/posts/topic/${topicId}`, {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Crée un nouveau post dans un topic
 * @param {number} topicId - ID du topic
 * @param {Object} data - Données du post (content, characterId, quotedPostId)
 * @returns {Promise<Object>} Post créé
 */
export const createPost = async (topicId, data) => {
  const response = await api.post(`/forum/posts/topic/${topicId}`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Met à jour un post
 * @param {number} id - ID du post
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>} Post mis à jour
 */
export const updatePost = async (id, data) => {
  const response = await api.put(`/forum/posts/${id}`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Supprime un post
 * @param {number} id - ID du post
 * @returns {Promise<Object>} Résultat de la suppression
 */
export const deletePost = async (id) => {
  const response = await api.delete(`/forum/posts/${id}`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Signale un post
 * @param {number} id - ID du post
 * @param {Object} data - Données du signalement (reason, description)
 * @returns {Promise<Object>} Signalement créé
 */
export const reportPost = async (id, data) => {
  const response = await api.post(`/forum/posts/${id}/report`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

// ============================================================================
// MARK ALL AS READ
// ============================================================================

/**
 * Marque tous les sujets comme lus
 * @param {Object} data - Données optionnelles (categoryId)
 * @returns {Promise<Object>} Résultat de l'opération
 */
export const markAllTopicsAsRead = async (data = {}) => {
  const response = await api.post('/forum/topics/mark-all-read', data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

// ============================================================================
// SEARCH
// ============================================================================

/**
 * Recherche dans le forum
 * @param {Object} params - Paramètres de recherche (query, categoryId, page, limit)
 * @returns {Promise<Object>} Résultats de recherche
 */
export const searchForum = async (params = {}) => {
  const response = await api.get('/forum/search', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

// ============================================================================
// REPORTS (STAFF)
// ============================================================================

/**
 * Récupère les signalements en attente
 * @param {Object} params - Paramètres de pagination et filtrage (page, limit, status)
 * @returns {Promise<Object>} Liste des signalements
 */
export const getPendingReports = async (params = {}) => {
  const response = await api.get('/forum/reports', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Traite un signalement
 * @param {number} id - ID du signalement
 * @param {Object} data - Données de traitement (status)
 * @returns {Promise<Object>} Signalement traité
 */
export const reviewReport = async (id, data) => {
  const response = await api.patch(`/forum/reports/${id}/review`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};
