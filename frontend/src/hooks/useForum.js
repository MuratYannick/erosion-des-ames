import { useEffect, useState, useCallback } from 'react';
import { useMutation } from './useApi';
import * as forumService from '@/services/forumService';

/**
 * Hook pour récupérer toutes les catégories du forum
 * Exécute automatiquement la requête au montage
 *
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: categories, loading, error, refetch } = useForumCategories();
 */
export const useForumCategories = (options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await forumService.getCategories();
      const responseData = response.data?.categories || response.data;
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
  }, [enabled, onSuccess, onError]);

  useEffect(() => {
    if (enabled) {
      refetch();
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
 * Hook pour récupérer une catégorie par son ID avec ses sujets paginés
 * Exécute automatiquement la requête au montage
 *
 * @param {string} id - ID de la catégorie
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Numéro de la page
 * @param {number} params.limit - Nombre de sujets par page
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: category, loading, error, refetch } = useForumCategory(
 *   categoryId,
 *   { page: 1, limit: 20 }
 * );
 */
export const useForumCategory = (id, params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paramsKey = JSON.stringify(params);

  const refetch = useCallback(async () => {
    if (!enabled || !id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await forumService.getCategory(id, params);
      const responseData = response.data?.category || response.data;
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
  }, [id, paramsKey, enabled, onSuccess, onError]); // eslint-disable-line react-hooks/exhaustive-deps

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
 * Hook pour récupérer les permissions de l'utilisateur connecté sur une catégorie
 * Exécute automatiquement la requête au montage
 *
 * @param {number} categoryId - ID de la catégorie
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: permissions, loading, error, refetch } = useMyPermissions(categoryId, {
 *   enabled: !!categoryId,
 * });
 */
export const useMyPermissions = (categoryId, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled || !categoryId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await forumService.getMyPermissions(categoryId);
      const responseData = response.data?.permissions || [];
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
  }, [categoryId, enabled, onSuccess, onError]);

  useEffect(() => {
    if (enabled && categoryId) {
      refetch();
    }
  }, [refetch, enabled, categoryId]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook pour récupérer les sujets récents
 * Exécute automatiquement la requête au montage
 *
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Numéro de la page
 * @param {number} params.limit - Nombre de sujets par page
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: topics, loading, error, refetch } = useRecentTopics({
 *   page: 1,
 *   limit: 10,
 * });
 */
export const useRecentTopics = (params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paramsKey = JSON.stringify(params);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await forumService.getRecentTopics(params);
      const responseData = response.data?.items || response.data;
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
  }, [paramsKey, enabled, onSuccess, onError]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (enabled) {
      refetch();
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
 * Hook pour récupérer les sujets d'une catégorie
 * Exécute automatiquement la requête au montage
 *
 * @param {string} categoryId - ID de la catégorie
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Numéro de la page
 * @param {number} params.limit - Nombre de sujets par page
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: topics, loading, error, refetch } = useTopicsByCategory(
 *   categoryId,
 *   { page: 1, limit: 20 }
 * );
 */
export const useTopicsByCategory = (categoryId, params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paramsKey = JSON.stringify(params);

  const refetch = useCallback(async () => {
    if (!enabled || !categoryId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await forumService.getTopicsByCategory(categoryId, params);
      const raw = response.data;
      const responseData = {
        topics: raw?.items || [],
        total: raw?.total || 0,
        totalPages: raw?.totalPages || 1,
      };
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
  }, [categoryId, paramsKey, enabled, onSuccess, onError]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (enabled && categoryId) {
      refetch();
    }
  }, [refetch, enabled, categoryId]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook pour récupérer un sujet par son ID avec ses posts paginés
 * Exécute automatiquement la requête au montage
 *
 * @param {string} id - ID du sujet
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Numéro de la page
 * @param {number} params.limit - Nombre de posts par page
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: topic, loading, error, refetch } = useTopic(
 *   topicId,
 *   { page: 1, limit: 20 }
 * );
 */
export const useTopic = (id, params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paramsKey = JSON.stringify(params);

  const refetch = useCallback(async () => {
    if (!enabled || !id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await forumService.getTopic(id, params);
      const raw = response.data;
      const responseData = {
        topic: { ...(raw?.topic || raw), isSubscribed: raw?.isSubscribed },
        posts: raw?.posts?.items || raw?.posts || [],
        totalPages: raw?.posts?.totalPages || 1,
        total: raw?.posts?.total || 0,
      };
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
  }, [id, paramsKey, enabled, onSuccess, onError]); // eslint-disable-line react-hooks/exhaustive-deps

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
 * Hook pour récupérer les signalements en attente
 * Requiert rôle MODERATOR ou ADMIN
 * Exécute automatiquement la requête au montage
 *
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Numéro de la page
 * @param {number} params.limit - Nombre de signalements par page
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: reports, loading, error, refetch } = usePendingReports({
 *   page: 1,
 *   limit: 10,
 * });
 */
export const usePendingReports = (params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const paramsKey = JSON.stringify(params);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await forumService.getPendingReports(params);
      const raw = response.data;
      const responseData = {
        items: raw?.items || [],
        total: raw?.total || 0,
        totalPages: raw?.totalPages || 1,
      };
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
  }, [paramsKey, enabled, onSuccess, onError]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (enabled) {
      refetch();
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
 * Hook pour créer un nouveau sujet
 * Mutation manuelle, ne s'exécute pas automatiquement
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: createTopic, loading, error } = useCreateTopic({
 *   onSuccess: (topic) => {
 *     toast.success('Sujet créé avec succès');
 *     navigate(`/forum/topics/${topic.id}`);
 *   },
 *   onError: (err) => toast.error(err.message),
 * });
 *
 * // Dans un handler
 * await createTopic({
 *   categoryId: '123',
 *   title: 'Mon nouveau sujet',
 *   content: 'Contenu du premier message',
 * });
 */
export const useCreateTopic = (options = {}) => {
  return useMutation(
    (data) => forumService.createTopic(data),
    options
  );
};

/**
 * Hook pour mettre à jour un sujet
 * Mutation manuelle, ne s'exécute pas automatiquement
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: updateTopic, loading } = useUpdateTopic({
 *   onSuccess: () => {
 *     toast.success('Sujet mis à jour');
 *     refetchTopic();
 *   },
 * });
 *
 * // Dans un handler
 * await updateTopic({ id: topicId, data: { title: 'Nouveau titre' } });
 */
export const useUpdateTopic = (options = {}) => {
  return useMutation(
    ({ id, data }) => forumService.updateTopic(id, data),
    options
  );
};

/**
 * Hook pour supprimer un sujet
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle MODERATOR ou ADMIN
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: deleteTopic, loading } = useDeleteTopic({
 *   onSuccess: () => {
 *     toast.success('Sujet supprimé');
 *     navigate('/forum');
 *   },
 * });
 *
 * // Dans un handler
 * await deleteTopic(topicId);
 */
export const useDeleteTopic = (options = {}) => {
  return useMutation(
    (id) => forumService.deleteTopic(id),
    options
  );
};

/**
 * Hook pour créer un nouveau post dans un sujet
 * Mutation manuelle, ne s'exécute pas automatiquement
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: createPost, loading, error } = useCreatePost({
 *   onSuccess: (post) => {
 *     toast.success('Réponse postée avec succès');
 *     refetchTopic();
 *   },
 *   onError: (err) => toast.error(err.message),
 * });
 *
 * // Dans un handler
 * await createPost({
 *   topicId: '123',
 *   data: { content: 'Ma réponse au sujet' },
 * });
 */
export const useCreatePost = (options = {}) => {
  return useMutation(
    ({ topicId, data }) => forumService.createPost(topicId, data),
    options
  );
};

/**
 * Hook pour mettre à jour un post
 * Mutation manuelle, ne s'exécute pas automatiquement
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: updatePost, loading } = useUpdatePost({
 *   onSuccess: () => {
 *     toast.success('Post mis à jour');
 *     refetchTopic();
 *   },
 * });
 *
 * // Dans un handler
 * await updatePost({ id: postId, data: { content: 'Contenu modifié' } });
 */
export const useUpdatePost = (options = {}) => {
  return useMutation(
    ({ id, data }) => forumService.updatePost(id, data),
    options
  );
};

/**
 * Hook pour supprimer un post
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle MODERATOR ou ADMIN
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: deletePost, loading } = useDeletePost({
 *   onSuccess: () => {
 *     toast.success('Post supprimé');
 *     refetchTopic();
 *   },
 * });
 *
 * // Dans un handler
 * await deletePost(postId);
 */
export const useDeletePost = (options = {}) => {
  return useMutation(
    (id) => forumService.deletePost(id),
    options
  );
};

/**
 * Hook pour signaler un post
 * Mutation manuelle, ne s'exécute pas automatiquement
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: reportPost, loading } = useReportPost({
 *   onSuccess: () => {
 *     toast.success('Signalement envoyé');
 *   },
 * });
 *
 * // Dans un handler
 * await reportPost({
 *   id: postId,
 *   data: { reason: 'Contenu inapproprié' },
 * });
 */
export const useReportPost = (options = {}) => {
  return useMutation(
    ({ id, data }) => forumService.reportPost(id, data),
    options
  );
};

/**
 * Hook pour s'abonner/se désabonner d'un sujet
 * Mutation manuelle, ne s'exécute pas automatiquement
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: toggleSubscription, loading } = useToggleSubscription({
 *   onSuccess: () => {
 *     toast.success('Abonnement mis à jour');
 *     refetchTopic();
 *   },
 * });
 *
 * // Dans un handler
 * await toggleSubscription(topicId);
 */
export const useToggleSubscription = (options = {}) => {
  return useMutation(
    (id) => forumService.toggleTopicSubscription(id),
    options
  );
};

/**
 * Hook pour marquer tous les sujets comme lus
 * Mutation manuelle, ne s'exécute pas automatiquement
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 */
export const useMarkAllAsRead = (options = {}) => {
  return useMutation(
    (data) => forumService.markAllTopicsAsRead(data),
    options
  );
};

/**
 * Hook pour rechercher dans le forum
 *
 * @param {Object} params - Paramètres de recherche
 * @param {string} params.query - Terme de recherche
 * @param {number} params.categoryId - ID catégorie (optionnel)
 * @param {number} params.page - Page
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @returns {Object} État de la requête
 */
export const useForumSearch = (params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const shouldFetch = enabled && params.query && params.query.length >= 2;

  const paramsKey = JSON.stringify(params);

  const refetch = useCallback(async () => {
    if (!shouldFetch) return;

    try {
      setLoading(true);
      setError(null);

      const response = await forumService.searchForum(params);
      const raw = response.data;
      const responseData = {
        topics: {
          items: raw?.topics?.items || raw?.topics || [],
          total: raw?.topics?.total || 0,
          totalPages: raw?.topics?.totalPages || 1,
        },
        posts: {
          items: raw?.posts?.items || raw?.posts || [],
          total: raw?.posts?.total || 0,
          totalPages: raw?.posts?.totalPages || 1,
        },
      };
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
  }, [paramsKey, shouldFetch, onSuccess, onError]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (shouldFetch) {
      refetch();
    } else {
      setData(null);
    }
  }, [refetch, shouldFetch]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};

/**
 * Hook pour examiner un signalement
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle MODERATOR ou ADMIN
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: reviewReport, loading } = useReviewReport({
 *   onSuccess: () => {
 *     toast.success('Signalement traité');
 *     refetchReports();
 *   },
 * });
 *
 * // Dans un handler
 * await reviewReport({
 *   id: reportId,
 *   data: { action: 'REJECT', moderatorNote: 'Signalement non fondé' },
 * });
 */
export const useReviewReport = (options = {}) => {
  return useMutation(
    ({ id, data }) => forumService.reviewReport(id, data),
    options
  );
};
