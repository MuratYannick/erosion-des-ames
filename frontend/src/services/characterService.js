import api from './api';

/**
 * Service pour la gestion des personnages
 * Fournit toutes les méthodes pour interagir avec l'API des personnages
 */

/**
 * Récupère la liste des personnages avec filtres optionnels
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.status - Statut du personnage (DRAFT, SUBMITTED, APPROVED, REJECTED)
 * @param {boolean} params.isActive - Personnage actif ou non
 * @param {string} params.ethnicityId - ID de l'ethnie
 * @param {string} params.factionId - ID de la faction
 * @param {string} params.clanId - ID du clan
 * @param {string} params.userId - ID de l'utilisateur créateur
 * @returns {Promise<Object>} Liste des personnages
 */
export const getCharacters = async (params = {}) => {
  const response = await api.get('/characters', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère un personnage par son ID
 * @param {string} id - ID du personnage
 * @returns {Promise<Object>} Données du personnage
 */
export const getCharacter = async (id) => {
  const response = await api.get(`/characters/${id}`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Crée un nouveau personnage
 * Requiert l'authentification avec rôle ADMIN, MODERATOR ou GAME_MASTER
 * @param {Object} data - Données du personnage
 * @param {string} data.name - Nom du personnage (max 50 chars)
 * @param {number} data.ethnicityId - ID de l'ethnie (requis)
 * @param {number} data.factionId - ID de la faction (optionnel)
 * @param {number} data.clanId - ID du clan (optionnel)
 * @param {string} data.userId - UUID de l'utilisateur propriétaire (optionnel)
 * @param {string} data.avatar - Chemin vers l'image avatar (optionnel)
 * @param {number} data.age - Âge du personnage (optionnel)
 * @param {string} data.appearance - Description physique (optionnel)
 * @param {string} data.personality - Traits de personnalité (optionnel)
 * @param {string} data.background - Histoire/passé du personnage (optionnel)
 * @param {string} data.goals - Objectifs et motivations (optionnel)
 * @returns {Promise<Object>} Personnage créé
 */
export const createCharacter = async (data) => {
  const response = await api.post('/characters', data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Met à jour un personnage existant
 * Requiert l'authentification avec rôle ADMIN, MODERATOR ou GAME_MASTER
 * @param {string} id - ID du personnage
 * @param {Object} data - Données à mettre à jour (mêmes champs que createCharacter)
 * @returns {Promise<Object>} Personnage mis à jour
 */
export const updateCharacter = async (id, data) => {
  const response = await api.put(`/characters/${id}`, data, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Soumet un personnage pour approbation
 * Change le statut de DRAFT à SUBMITTED
 * Requiert l'authentification avec rôle ADMIN, MODERATOR ou GAME_MASTER
 * @param {string} id - ID du personnage
 * @returns {Promise<Object>} Personnage soumis
 */
export const submitCharacter = async (id) => {
  const response = await api.patch(`/characters/${id}/submit`, {}, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Approuve un personnage
 * Change le statut de SUBMITTED à APPROVED
 * Requiert l'authentification avec rôle ADMIN ou MODERATOR
 * @param {string} id - ID du personnage
 * @returns {Promise<Object>} Personnage approuvé
 */
export const approveCharacter = async (id) => {
  const response = await api.patch(`/characters/${id}/approve`, {}, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Rejette un personnage avec une raison
 * Change le statut de SUBMITTED à REJECTED
 * Requiert l'authentification avec rôle ADMIN ou MODERATOR
 * @param {string} id - ID du personnage
 * @param {string} rejectionReason - Raison du rejet
 * @returns {Promise<Object>} Personnage rejeté
 */
export const rejectCharacter = async (id, rejectionReason) => {
  const response = await api.patch(`/characters/${id}/reject`, { rejectionReason }, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Supprime un personnage (soft delete)
 * Requiert l'authentification avec rôle ADMIN
 * @param {string} id - ID du personnage
 * @returns {Promise<Object>} Confirmation de suppression
 */
export const deleteCharacter = async (id) => {
  const response = await api.delete(`/characters/${id}`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère les personnages de l'utilisateur connecté
 * Helper qui appelle getCharacters avec le userId actuel
 * @param {string} userId - ID de l'utilisateur connecté
 * @returns {Promise<Object>} Liste des personnages de l'utilisateur
 */
export const getMyCharacters = async (userId, { includeUnowned = false } = {}) => {
  if (!userId) {
    throw new Error('User ID est requis pour récupérer les personnages');
  }
  const params = { userId };
  if (includeUnowned) {
    params.includeUnowned = 'true';
  }
  return getCharacters(params);
};

/**
 * Sélectionne un personnage actif pour l'utilisateur connecté
 * @param {number} characterId - ID du personnage à sélectionner
 * @returns {Promise<Object>} Utilisateur mis à jour avec le personnage sélectionné
 */
export const selectCharacter = async (characterId) => {
  const response = await api.put('/auth/select-character', { characterId }, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Désélectionne le personnage actif de l'utilisateur connecté
 * @returns {Promise<Object>} Utilisateur mis à jour
 */
export const deselectCharacter = async () => {
  const response = await api.delete('/auth/select-character', {
    skipErrorRedirect: true,
  });
  return response.data;
};
