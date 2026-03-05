import api from './api';

/**
 * Service pour la consultation des profils utilisateurs publics
 * Fournit les méthodes pour accéder aux données publiques d'un utilisateur
 */

/**
 * Récupère le profil public d'un utilisateur
 * @param {string} id - UUID de l'utilisateur
 * @returns {Promise<Object>} Données du profil public
 */
export const getUserProfile = async (id) => {
  const response = await api.get(`/users/${id}`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère les personnages d'un utilisateur (paginé)
 * @param {string} id - UUID de l'utilisateur
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Liste paginée des personnages
 */
export const getUserCharacters = async (id, params = {}) => {
  const response = await api.get(`/users/${id}/characters`, {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère les messages d'un utilisateur (paginé)
 * @param {string} id - UUID de l'utilisateur
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Liste paginée des messages
 */
export const getUserPosts = async (id, params = {}) => {
  const response = await api.get(`/users/${id}/posts`, {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère les sujets créés par un utilisateur (paginé)
 * @param {string} id - UUID de l'utilisateur
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre d'éléments par page
 * @returns {Promise<Object>} Liste paginée des sujets
 */
export const getUserTopics = async (id, params = {}) => {
  const response = await api.get(`/users/${id}/topics`, {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};
