import { useMutation } from './useApi';
import * as userService from '@/services/userService';
import * as authService from '@/services/authService';
import { useEffect, useState, useCallback } from 'react';

/**
 * Hook pour récupérer le profil public d'un utilisateur par son ID
 * Exécute automatiquement la requête au montage et quand l'ID change
 *
 * @param {string} id - ID de l'utilisateur
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: profile, loading, error, refetch } = useUserProfile(userId);
 */
export const useUserProfile = (id, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled || !id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await userService.getUserProfile(id);
      const responseData = response.data;
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
  }, [id, enabled, onSuccess, onError]);

  useEffect(() => {
    if (enabled && id) {
      refetch();
    }
  }, [refetch, enabled, id]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook pour récupérer les personnages d'un utilisateur
 * Exécute automatiquement la requête au montage et quand l'ID ou les params changent
 *
 * @param {string} id - ID de l'utilisateur
 * @param {Object} params - Paramètres de filtrage et pagination
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: characters, loading, error, refetch } = useUserCharacters(userId, { page: 1 });
 */
export const useUserCharacters = (id, params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled || !id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await userService.getUserCharacters(id, params);
      const responseData = response.data;
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
  }, [id, JSON.stringify(params), enabled, onSuccess, onError]);

  useEffect(() => {
    if (enabled && id) {
      refetch();
    }
  }, [refetch, enabled, id]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook pour récupérer les messages d'un utilisateur
 * Exécute automatiquement la requête au montage et quand l'ID ou les params changent
 *
 * @param {string} id - ID de l'utilisateur
 * @param {Object} params - Paramètres de filtrage et pagination
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: posts, loading, error, refetch } = useUserPosts(userId, { page: 1 });
 */
export const useUserPosts = (id, params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled || !id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await userService.getUserPosts(id, params);
      const responseData = response.data;
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
  }, [id, JSON.stringify(params), enabled, onSuccess, onError]);

  useEffect(() => {
    if (enabled && id) {
      refetch();
    }
  }, [refetch, enabled, id]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook pour récupérer les sujets créés par un utilisateur
 * Exécute automatiquement la requête au montage et quand l'ID ou les params changent
 *
 * @param {string} id - ID de l'utilisateur
 * @param {Object} params - Paramètres de filtrage et pagination
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: topics, loading, error, refetch } = useUserTopics(userId, { page: 1 });
 */
export const useUserTopics = (id, params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled || !id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await userService.getUserTopics(id, params);
      const responseData = response.data;
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
  }, [id, JSON.stringify(params), enabled, onSuccess, onError]);

  useEffect(() => {
    if (enabled && id) {
      refetch();
    }
  }, [refetch, enabled, id]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook pour mettre à jour le profil de l'utilisateur connecté
 * Mutation manuelle, ne s'exécute pas automatiquement
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: updateProfile, loading, error } = useUpdateProfile({
 *   onSuccess: (profile) => {
 *     toast.success('Profil mis à jour');
 *   },
 *   onError: (err) => toast.error(err.message),
 * });
 *
 * // Dans un handler
 * await updateProfile({ username: 'nouveauNom' });
 */
export const useUpdateProfile = (options = {}) => {
  return useMutation(
    (data) => authService.updateProfile(data),
    options
  );
};
