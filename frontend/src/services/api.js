import axios from 'axios';

/**
 * Configuration de l'instance Axios avec intercepteurs
 * Gère automatiquement l'authentification et les redirections d'erreur
 */

// URL de base de l'API depuis les variables d'environnement
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Clé de stockage du token (même que authService)
const TOKEN_KEY = 'auth_token';

// Routes d'erreur (synchronisées avec useNavigateToError)
const ERROR_ROUTES = {
  401: '/connexion',
  403: '/interdit',
  404: '/page-non-trouvee',
  500: '/erreur',
  503: '/maintenance',
};

/**
 * Crée une instance Axios configurée
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 secondes
});

/**
 * Configuration du retry automatique pour les erreurs réseau
 */
api.defaults.retry = 3;
api.defaults.retryDelay = 1000; // 1 seconde entre chaque retry

/**
 * INTERCEPTEUR DE REQUÊTE
 * Ajoute automatiquement le token JWT à toutes les requêtes
 */
api.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis localStorage
    const token = localStorage.getItem(TOKEN_KEY);

    // Ajouter le header Authorization si le token existe
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Ajouter un timestamp pour tracking (utile pour debug)
    config.metadata = { startTime: new Date() };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * INTERCEPTEUR DE RÉPONSE
 * Gère automatiquement les erreurs HTTP et redirige vers les pages appropriées
 */
api.interceptors.response.use(
  // Succès: retourner la réponse
  (response) => {
    // Log du temps de réponse en mode développement
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`[API] ${response.config.method.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }

    return response;
  },

  // Erreur: gérer les redirections automatiques
  async (error) => {
    const { config, response } = error;

    // Vérifier si la requête désactive la redirection automatique
    const skipErrorRedirect = config?.skipErrorRedirect || false;

    // Gestion des erreurs réseau (pas de réponse du serveur)
    if (!response) {
      console.error('[API] Erreur réseau:', error.message);

      // Retry automatique pour les erreurs réseau
      if (config && config.retry && !config.__isRetryRequest) {
        config.__retryCount = config.__retryCount || 0;

        if (config.__retryCount < config.retry) {
          config.__retryCount += 1;
          config.__isRetryRequest = true;

          console.log(`[API] Tentative ${config.__retryCount}/${config.retry} de reconnexion...`);

          // Attendre avant de réessayer
          await new Promise((resolve) => setTimeout(resolve, config.retryDelay || 1000));

          return api(config);
        }
      }

      // Si tous les retries ont échoué, créer une erreur réseau
      const networkError = new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
      networkError.code = 'NETWORK_ERROR';
      networkError.isNetworkError = true;

      // Ne pas rediriger pour les erreurs réseau, laisser le composant gérer
      return Promise.reject(networkError);
    }

    // Gestion des erreurs HTTP selon le code de statut
    const status = response.status;

    // 401 Unauthorized - Token invalide ou expiré
    if (status === 401) {
      console.warn('[API] 401 Unauthorized - Déconnexion de l\'utilisateur');

      // Supprimer le token
      localStorage.removeItem(TOKEN_KEY);

      // Dispatcher un événement pour notifier AuthContext
      window.dispatchEvent(
        new CustomEvent('auth:logout', {
          detail: { reason: 'token_expired' },
        })
      );

      // Rediriger vers la page de connexion (sauf si désactivé)
      if (!skipErrorRedirect) {
        const currentPath = window.location.pathname;
        const returnUrl = currentPath !== '/connexion' ? currentPath : '/';

        // Redirection avec URL de retour
        window.location.href = `${ERROR_ROUTES[401]}?returnUrl=${encodeURIComponent(returnUrl)}`;
      }
    }

    // 403 Forbidden - Accès refusé
    else if (status === 403) {
      console.warn('[API] 403 Forbidden - Accès refusé à la ressource');

      if (!skipErrorRedirect) {
        window.location.href = ERROR_ROUTES[403];
      }
    }

    // 404 Not Found - Ressource non trouvée
    else if (status === 404) {
      console.warn('[API] 404 Not Found - Ressource non trouvée:', config.url);

      // Par défaut, on ne redirige pas pour les 404
      // Le composant peut gérer l'erreur ou utiliser skipErrorRedirect: false
      if (config?.redirectOn404 && !skipErrorRedirect) {
        window.location.href = ERROR_ROUTES[404];
      }
    }

    // 500 Internal Server Error
    else if (status >= 500 && status < 503) {
      console.error('[API] 500 Internal Server Error:', response.data);

      if (!skipErrorRedirect) {
        window.location.href = ERROR_ROUTES[500];
      }
    }

    // 503 Service Unavailable - Maintenance
    else if (status === 503) {
      console.warn('[API] 503 Service Unavailable - Le serveur est en maintenance');

      if (!skipErrorRedirect) {
        window.location.href = ERROR_ROUTES[503];
      }
    }

    // Autres erreurs (400, 422, etc.)
    else {
      console.error(`[API] Erreur ${status}:`, response.data);
    }

    // Enrichir l'erreur avec les données de la réponse
    const apiError = new Error(
      response.data?.error?.message ||
      response.data?.message ||
      `Erreur ${status}: ${response.statusText}`
    );
    apiError.status = status;
    apiError.code = response.data?.error?.code || response.data?.code;
    apiError.details = response.data?.error?.details || response.data?.details;
    apiError.response = response;

    return Promise.reject(apiError);
  }
);

/**
 * Helper pour effectuer une requête GET
 * @param {string} url - URL de la requête
 * @param {Object} config - Configuration Axios
 * @returns {Promise} Promesse avec les données de la réponse
 */
export const get = (url, config = {}) => {
  return api.get(url, config);
};

/**
 * Helper pour effectuer une requête POST
 * @param {string} url - URL de la requête
 * @param {Object} data - Données à envoyer
 * @param {Object} config - Configuration Axios
 * @returns {Promise} Promesse avec les données de la réponse
 */
export const post = (url, data, config = {}) => {
  return api.post(url, data, config);
};

/**
 * Helper pour effectuer une requête PUT
 * @param {string} url - URL de la requête
 * @param {Object} data - Données à envoyer
 * @param {Object} config - Configuration Axios
 * @returns {Promise} Promesse avec les données de la réponse
 */
export const put = (url, data, config = {}) => {
  return api.put(url, data, config);
};

/**
 * Helper pour effectuer une requête PATCH
 * @param {string} url - URL de la requête
 * @param {Object} data - Données à envoyer
 * @param {Object} config - Configuration Axios
 * @returns {Promise} Promesse avec les données de la réponse
 */
export const patch = (url, data, config = {}) => {
  return api.patch(url, data, config);
};

/**
 * Helper pour effectuer une requête DELETE
 * @param {string} url - URL de la requête
 * @param {Object} config - Configuration Axios
 * @returns {Promise} Promesse avec les données de la réponse
 */
export const del = (url, config = {}) => {
  return api.delete(url, config);
};

/**
 * Export de l'instance Axios par défaut
 * Permet d'utiliser directement api.get(), api.post(), etc.
 */
export default api;
