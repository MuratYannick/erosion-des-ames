const API_URL = import.meta.env.VITE_API_URL;

// Clé de stockage du token
const TOKEN_KEY = 'auth_token';

/**
 * Décode un JWT et retourne le payload (sans vérifier la signature)
 * @param {string} token - Le JWT à décoder
 * @returns {Object|null} Le payload décodé ou null si invalide
 */
const decodeToken = (token) => {
  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch {
    return null;
  }
};

/**
 * Vérifie si un token JWT est expiré
 * @param {string} token - Le JWT à vérifier
 * @returns {boolean} true si expiré ou invalide
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  // exp est en secondes, Date.now() en millisecondes
  return payload.exp * 1000 < Date.now();
};

/**
 * Récupère le token JWT depuis localStorage
 * @returns {string|null} Le token ou null
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Stocke le token JWT dans localStorage
 * @param {string} token - Le token à stocker
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Supprime le token JWT de localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Helper générique pour les requêtes API
 * Gère automatiquement les headers, le parsing JSON et les erreurs HTTP
 *
 * @param {string} endpoint - Le chemin de l'endpoint (ex: '/auth/login')
 * @param {Object} options - Options fetch (method, body, headers, etc.)
 * @returns {Promise<Object>} La réponse parsée en JSON
 * @throws {Error} En cas d'erreur HTTP avec les détails du serveur
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Ajouter le header Authorization si un token existe
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    // Si la réponse n'est pas OK, lancer une erreur avec les détails du serveur
    if (!response.ok) {
      // Si 401 Unauthorized, le token est invalide ou expiré
      if (response.status === 401) {
        removeToken();
        // Dispatcher un événement pour notifier l'app de la déconnexion
        window.dispatchEvent(new CustomEvent('auth:logout', { detail: { reason: 'token_expired' } }));
      }

      const error = new Error(data.error?.message || 'Une erreur est survenue');
      error.code = data.error?.code;
      error.details = data.error?.details;
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (error) {
    // Si l'erreur vient déjà du bloc ci-dessus, la relancer
    if (error.code || error.status) {
      throw error;
    }

    // Erreur réseau ou autre
    const networkError = new Error('Erreur de connexion au serveur');
    networkError.code = 'NETWORK_ERROR';
    throw networkError;
  }
};

/**
 * Connexion de l'utilisateur
 * @param {string} identifier - Email ou nom d'utilisateur
 * @param {string} password - Mot de passe
 * @returns {Promise<Object>} Données de réponse avec user et token
 */
export const login = async (identifier, password) => {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });

  // Stocker le token si présent dans la réponse
  if (response.data?.token) {
    setToken(response.data.token);
  }

  return response;
};

/**
 * Inscription d'un nouvel utilisateur
 * @param {Object} data - Données d'inscription
 * @param {string} data.username - Nom d'utilisateur
 * @param {string} data.email - Email
 * @param {string} data.password - Mot de passe
 * @param {string} data.confirmPassword - Confirmation du mot de passe
 * @param {boolean} data.acceptedCgu - Acceptation des CGU
 * @param {boolean} data.acceptedRules - Acceptation du règlement
 * @returns {Promise<Object>} Données de réponse
 */
export const register = async (data) => {
  return await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Déconnexion de l'utilisateur
 * @returns {Promise<Object>} Données de réponse
 */
export const logout = async () => {
  try {
    const response = await apiRequest('/auth/logout', {
      method: 'POST',
    });
    return response;
  } finally {
    // Toujours supprimer le token, même si la requête échoue
    removeToken();
  }
};

/**
 * Récupère les informations de l'utilisateur connecté
 * @returns {Promise<Object>} Données utilisateur
 */
export const getMe = async () => {
  const response = await apiRequest('/auth/me', {
    method: 'GET',
  });
  return response;
};

/**
 * Vérifie l'email avec un token de vérification
 * @param {string} token - Token de vérification reçu par email
 * @returns {Promise<Object>} Données de réponse
 */
export const verifyEmail = async (token) => {
  return await apiRequest('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
};

/**
 * Renvoie un email de vérification
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>} Données de réponse
 */
export const resendVerification = async (email) => {
  return await apiRequest('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

/**
 * Demande de réinitialisation de mot de passe
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>} Données de réponse
 */
export const forgotPassword = async (email) => {
  return await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

/**
 * Réinitialise le mot de passe avec un token
 * @param {string} token - Token de réinitialisation reçu par email
 * @param {string} password - Nouveau mot de passe
 * @param {string} confirmPassword - Confirmation du nouveau mot de passe
 * @returns {Promise<Object>} Données de réponse
 */
export const resetPassword = async (token, password, confirmPassword) => {
  return await apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password, confirmPassword }),
  });
};

/**
 * Change le mot de passe de l'utilisateur connecté
 * @param {string} currentPassword - Mot de passe actuel
 * @param {string} newPassword - Nouveau mot de passe
 * @param {string} confirmNewPassword - Confirmation du nouveau mot de passe
 * @returns {Promise<Object>} Données de réponse
 */
export const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
  return await apiRequest('/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
  });
};

/**
 * Met à jour le profil de l'utilisateur connecté
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise<Object>} Données de réponse avec user mis à jour
 */
export const updateProfile = async (data) => {
  return await apiRequest('/auth/update-profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};
