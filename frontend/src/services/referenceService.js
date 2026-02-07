import api from './api';

/**
 * Service pour la gestion des données de référence
 * Fournit l'accès aux ethnies, factions et clans
 */

/**
 * Récupère la liste de toutes les ethnies
 * @returns {Promise<Object>} Liste des ethnies
 */
export const getEthnicities = async () => {
  const response = await api.get('/ethnicities', {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère une ethnie par son ID
 * @param {string} id - ID de l'ethnie
 * @returns {Promise<Object>} Données de l'ethnie
 */
export const getEthnicity = async (id) => {
  const response = await api.get(`/ethnicities/${id}`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère la liste des factions avec filtres optionnels
 * @param {Object} params - Paramètres de filtrage (optionnels)
 * @returns {Promise<Object>} Liste des factions
 */
export const getFactions = async (params = {}) => {
  const response = await api.get('/factions', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère une faction par son ID
 * @param {string} id - ID de la faction
 * @returns {Promise<Object>} Données de la faction
 */
export const getFaction = async (id) => {
  const response = await api.get(`/factions/${id}`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère la liste des clans avec filtres optionnels
 * @param {Object} params - Paramètres de filtrage (optionnels)
 * @returns {Promise<Object>} Liste des clans
 */
export const getClans = async (params = {}) => {
  const response = await api.get('/clans', {
    params,
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère un clan par son ID
 * @param {string} id - ID du clan
 * @returns {Promise<Object>} Données du clan
 */
export const getClan = async (id) => {
  const response = await api.get(`/clans/${id}`, {
    skipErrorRedirect: true,
  });
  return response.data;
};

/**
 * Récupère toutes les données de référence en une seule fois
 * Utile pour remplir les formulaires de création/édition de personnages
 * @returns {Promise<Object>} Objet contenant ethnicities, factions et clans
 */
export const getAllReferenceData = async () => {
  try {
    const [ethnicitiesRes, factionsRes, clansRes] = await Promise.all([
      getEthnicities(),
      getFactions(),
      getClans(),
    ]);

    return {
      ethnicities: ethnicitiesRes.data?.ethnicities || [],
      factions: factionsRes.data?.factions || [],
      clans: clansRes.data?.clans || [],
    };
  } catch (error) {
    console.error('[ReferenceService] Erreur lors du chargement des données de référence:', error);
    throw error;
  }
};
