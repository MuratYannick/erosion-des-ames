import { useState, useCallback, useEffect } from 'react';
import api from '@/services/api';

// ---------------------------------------------------------------------------
// Cache mémoire module-level — partagé entre tous les composants
// Structure : clé (url + params sérialisés) → { data, timestamp }
// ---------------------------------------------------------------------------
const queryCache = new Map()

/**
 * Invalide toutes les entrées du cache dont la clé contient le pattern fourni.
 *
 * @param {string} pattern - Sous-chaîne à rechercher dans les clés
 *
 * @example
 * invalidateCache('/forum/categories') // invalide toutes les clés qui contiennent cette URL
 */
export const invalidateCache = (pattern) => {
  for (const key of queryCache.keys()) {
    if (key.includes(pattern)) queryCache.delete(key)
  }
}

/**
 * Hook personnalisé pour simplifier les appels API
 * Gère automatiquement les états de chargement et d'erreur
 *
 * @param {Function} apiFunc - Fonction qui fait l'appel API
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback appelé en cas de succès
 * @param {Function} options.onError - Callback appelé en cas d'erreur
 * @returns {Object} État et fonction d'exécution
 *
 * @example
 * const { data, loading, error, execute } = useApi(
 *   () => api.get('/users'),
 *   {
 *     onSuccess: (data) => console.log('Succès:', data),
 *     onError: (error) => console.error('Erreur:', error),
 *   }
 * );
 */
export const useApi = (apiFunc, options = {}) => {
  const { onSuccess, onError } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Exécute la fonction API
   * @param {...any} args - Arguments à passer à la fonction API
   * @returns {Promise} Promesse avec les données de la réponse
   */
  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        // Exécuter la fonction API avec les arguments fournis
        const response = await apiFunc(...args);

        // Extraire les données de la réponse
        const responseData = response.data?.data || response.data;
        setData(responseData);

        // Appeler le callback de succès si défini
        if (onSuccess) {
          onSuccess(responseData);
        }

        return responseData;
      } catch (err) {
        setError(err);

        // Appeler le callback d'erreur si défini
        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, onSuccess, onError]
  );

  /**
   * Réinitialise l'état du hook
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

/**
 * Hook pour les requêtes GET
 * Exécute automatiquement la requête au montage du composant
 *
 * @param {string} url - URL de la requête
 * @param {Object} config - Configuration Axios
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {boolean} options.cache - Activer le cache mémoire (défaut: false)
 * @param {number} options.cacheTTL - Durée de vie du cache en ms (défaut: 60000)
 * @returns {Object} État de la requête
 *
 * @example
 * const { data, loading, error, refetch } = useGet('/users', {
 *   params: { page: 1, limit: 10 }
 * });
 *
 * // Avec cache activé
 * const { data } = useGet('/forum/categories', {}, { cache: true, cacheTTL: 120000 });
 */
export const useGet = (url, config = {}, options = {}) => {
  const { enabled = true, onSuccess, onError, cache = false, cacheTTL = 60000 } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fonction pour exécuter ou ré-exécuter la requête
   */
  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      // --- Lecture du cache ---
      if (cache) {
        const cacheKey = url + JSON.stringify(config.params || {})
        const cached = queryCache.get(cacheKey)
        if (cached && Date.now() - cached.timestamp < cacheTTL) {
          setData(cached.data)
          if (onSuccess) onSuccess(cached.data)
          setLoading(false)
          return cached.data
        }
      }

      const response = await api.get(url, {
        skipErrorRedirect: true,
        ...config,
      });

      const responseData = response.data?.data || response.data;
      setData(responseData);

      // --- Écriture dans le cache ---
      if (cache) {
        const cacheKey = url + JSON.stringify(config.params || {})
        queryCache.set(cacheKey, { data: responseData, timestamp: Date.now() })
      }

      if (onSuccess) {
        onSuccess(responseData);
      }

      return responseData;
    } catch (err) {
      setError(err);

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, enabled, config, onSuccess, onError, cache, cacheTTL]);

  // Exécuter automatiquement au montage et quand les dépendances changent
  useEffect(() => {
    if (enabled) {
      refetch().catch(() => {}); // l'erreur est déjà stockée dans state via setError
    }
  }, [refetch, enabled]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook pour les mutations (POST, PUT, PATCH, DELETE)
 * Ne s'exécute pas automatiquement, doit être appelé manuellement
 *
 * @param {Function} apiFunc - Fonction qui fait l'appel API
 * @param {Object} options - Options du hook
 * @returns {Object} État et fonction de mutation
 *
 * @example
 * const { mutate, loading, error } = useMutation(
 *   (data) => api.post('/users', data),
 *   {
 *     onSuccess: () => toast.success('Utilisateur créé'),
 *     onError: (err) => toast.error(err.message),
 *   }
 * );
 *
 * // Dans un handler
 * await mutate({ username: 'john', email: 'john@example.com' });
 */
export const useMutation = (apiFunc, options = {}) => {
  const { onSuccess, onError } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Exécute la mutation
   */
  const mutate = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunc(...args);
        const responseData = response.data?.data || response.data;

        setData(responseData);

        if (onSuccess) {
          onSuccess(responseData);
        }

        return responseData;
      } catch (err) {
        setError(err);

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc, onSuccess, onError]
  );

  /**
   * Réinitialise l'état
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
};

/**
 * EXEMPLES D'UTILISATION:
 *
 * 1. Hook générique useApi:
 * ```jsx
 * const { data, loading, error, execute } = useApi(
 *   () => api.get('/users')
 * );
 *
 * // Dans un useEffect ou handler
 * useEffect(() => {
 *   execute();
 * }, []);
 * ```
 *
 * 2. Hook GET automatique:
 * ```jsx
 * const { data: users, loading, error, refetch } = useGet('/users', {
 *   params: { page: 1, limit: 10 }
 * });
 * ```
 *
 * 3. Hook de mutation:
 * ```jsx
 * const { mutate: createUser, loading, error } = useMutation(
 *   (userData) => api.post('/users', userData),
 *   {
 *     onSuccess: () => {
 *       toast.success('Utilisateur créé');
 *       refetchUsers();
 *     },
 *   }
 * );
 *
 * const handleSubmit = async (formData) => {
 *   await createUser(formData);
 * };
 * ```
 *
 * 4. Mutation avec gestion d'erreur:
 * ```jsx
 * const { mutate: deleteUser, loading: deleting } = useMutation(
 *   (userId) => api.delete(`/users/${userId}`),
 *   {
 *     onSuccess: () => {
 *       toast.success('Utilisateur supprimé');
 *       refetchUsers();
 *     },
 *     onError: (error) => {
 *       if (error.status === 403) {
 *         toast.error('Vous n\'avez pas la permission');
 *       } else {
 *         toast.error(error.message);
 *       }
 *     },
 *   }
 * );
 * ```
 */
