import { useEffect, useState, useCallback } from 'react';
import { useMutation } from './useApi';
import * as adminService from '@/services/adminService';

// ============================================================================
// HOOKS DE REQUÊTES (exécution automatique au montage)
// ============================================================================

/**
 * Hook pour récupérer les statistiques du tableau de bord administrateur
 * Exécute automatiquement la requête au montage
 *
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: stats, loading, error, refetch } = useDashboardStats();
 * // stats: { users: {...}, characters: {...}, forum: {...}, moderation: {...} }
 */
export const useDashboardStats = (options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getDashboardStats();
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
 * Hook pour récupérer la liste paginée des utilisateurs avec filtres
 * Exécute automatiquement la requête au montage et quand les params changent
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} params - Paramètres de filtrage et pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre de résultats par page
 * @param {string} params.role - Rôle à filtrer (ADMIN, MODERATOR, GAME_MASTER, PLAYER)
 * @param {boolean} params.isActive - Filtre sur le statut actif/inactif
 * @param {string} params.search - Recherche textuelle (nom, email)
 * @param {string} params.sortBy - Champ de tri
 * @param {string} params.sortOrder - Sens du tri (ASC, DESC)
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: users, loading, error, refetch } = useAdminUsers({
 *   page: 1,
 *   limit: 20,
 *   role: 'PLAYER',
 * });
 */
export const useAdminUsers = (params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getUsers(params);
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
  }, [JSON.stringify(params), enabled, onSuccess, onError]);

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
 * Hook pour récupérer le détail d'un utilisateur par son ID
 * Exécute automatiquement la requête au montage
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {string} id - UUID de l'utilisateur
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: user, loading, error, refetch } = useAdminUser(userId);
 */
export const useAdminUser = (id, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled || !id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getUser(id);
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
 * Hook pour récupérer la liste paginée des personnages avec filtres (vue admin)
 * Exécute automatiquement la requête au montage et quand les params changent
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} params - Paramètres de filtrage et pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre de résultats par page
 * @param {string} params.status - Statut du personnage (DRAFT, SUBMITTED, APPROVED, REJECTED)
 * @param {string} params.userId - UUID de l'utilisateur propriétaire
 * @param {number} params.ethnicityId - ID de l'ethnie
 * @param {number} params.factionId - ID de la faction
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: characters, loading, error, refetch } = useAdminCharacters({
 *   page: 1,
 *   limit: 20,
 *   status: 'APPROVED',
 * });
 */
export const useAdminCharacters = (params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getCharacters(params);
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
  }, [JSON.stringify(params), enabled, onSuccess, onError]);

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
 * Hook pour récupérer la file d'attente des personnages en attente de validation
 * Exécute automatiquement la requête au montage et quand les params changent
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre de résultats par page
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: pending, loading, error, refetch } = usePendingCharacters({
 *   page: 1,
 *   limit: 10,
 * });
 */
export const usePendingCharacters = (params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getPendingCharacters(params);
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
  }, [JSON.stringify(params), enabled, onSuccess, onError]);

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
 * Hook pour récupérer toutes les catégories du forum (vue admin avec données étendues)
 * Exécute automatiquement la requête au montage
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: categories, loading, error, refetch } = useAdminForumCategories();
 */
export const useAdminForumCategories = (options = {}) => {
  const { enabled = true, includeTopics = false, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getAdminCategories({ includeTopics });
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
  }, [enabled, includeTopics, onSuccess, onError]);

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
 * Hook pour récupérer l'historique des actions de modération
 * Exécute automatiquement la requête au montage et quand les params changent
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} params - Paramètres de filtrage et pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre de résultats par page
 * @param {string} params.actionType - Type d'action (BAN, UNBAN, MUTE, UNMUTE, etc.)
 * @param {string} params.moderatorId - UUID du modérateur ayant effectué l'action
 * @param {string} params.targetUserId - UUID de l'utilisateur ciblé par l'action
 * @param {string} params.startDate - Date de début (ISO 8601)
 * @param {string} params.endDate - Date de fin (ISO 8601)
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: actions, loading, error, refetch } = useModerationActions({
 *   page: 1,
 *   limit: 20,
 *   actionType: 'BAN',
 * });
 */
export const useModerationActions = (params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getModerationActions(params);
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
  }, [JSON.stringify(params), enabled, onSuccess, onError]);

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
 * Hook pour récupérer la liste des sanctions actives ou passées
 * Exécute automatiquement la requête au montage et quand les params changent
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} params - Paramètres de filtrage et pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre de résultats par page
 * @param {string} params.type - Type de sanction (BAN, MUTE)
 * @param {boolean} params.isActive - Filtre sur les sanctions actives uniquement
 * @param {string} params.userId - UUID de l'utilisateur sanctionné
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: sanctions, loading, error, refetch } = useUserSanctions({
 *   page: 1,
 *   limit: 20,
 *   isActive: true,
 * });
 */
export const useUserSanctions = (params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getSanctions(params);
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
  }, [JSON.stringify(params), enabled, onSuccess, onError]);

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
 * Hook pour récupérer les signalements soumis par les utilisateurs
 * Exécute automatiquement la requête au montage et quand les params changent
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} params - Paramètres de pagination
 * @param {number} params.page - Numéro de page
 * @param {number} params.limit - Nombre de résultats par page
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: reports, loading, error, refetch } = useAdminReports({
 *   page: 1,
 *   limit: 10,
 * });
 */
export const useAdminReports = (params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getReports(params);
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
  }, [JSON.stringify(params), enabled, onSuccess, onError]);

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

// ============================================================================
// HOOKS DE MUTATIONS — UTILISATEURS (exécution manuelle)
// ============================================================================

/**
 * Hook pour modifier le rôle d'un utilisateur
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: changeRole, loading, error } = useChangeUserRole({
 *   onSuccess: () => {
 *     toast.success('Rôle modifié avec succès');
 *     refetchUser();
 *   },
 *   onError: (err) => toast.error(err.message),
 * });
 *
 * // Dans un handler
 * await changeRole({ id: userId, data: { role: 'MODERATOR' } });
 */
export const useChangeUserRole = (options = {}) => {
  return useMutation(
    ({ id, data }) => adminService.changeUserRole(id, data),
    options
  );
};

/**
 * Hook pour bannir un utilisateur
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: ban, loading, error } = useBanUser({
 *   onSuccess: () => {
 *     toast.success('Utilisateur banni');
 *     refetchUser();
 *   },
 * });
 *
 * // Dans un handler
 * await ban({ id: userId, data: { reason: 'Comportement toxique', durationHours: 48 } });
 */
export const useBanUser = (options = {}) => {
  return useMutation(
    ({ id, data }) => adminService.banUser(id, data),
    options
  );
};

/**
 * Hook pour lever le bannissement d'un utilisateur
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: unban, loading } = useUnbanUser({
 *   onSuccess: () => {
 *     toast.success('Bannissement levé');
 *     refetchUser();
 *   },
 * });
 *
 * // Dans un handler
 * await unban(userId);
 */
export const useUnbanUser = (options = {}) => {
  return useMutation(
    (id) => adminService.unbanUser(id),
    options
  );
};

/**
 * Hook pour mettre en sourdine un utilisateur (empêche de poster)
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: mute, loading } = useMuteUser({
 *   onSuccess: () => {
 *     toast.success('Utilisateur mis en sourdine');
 *     refetchUser();
 *   },
 * });
 *
 * // Dans un handler
 * await mute({ id: userId, data: { reason: 'Spam', durationHours: 24 } });
 */
export const useMuteUser = (options = {}) => {
  return useMutation(
    ({ id, data }) => adminService.muteUser(id, data),
    options
  );
};

/**
 * Hook pour lever la mise en sourdine d'un utilisateur
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: unmute, loading } = useUnmuteUser({
 *   onSuccess: () => {
 *     toast.success('Sourdine levée');
 *     refetchUser();
 *   },
 * });
 *
 * // Dans un handler
 * await unmute(userId);
 */
export const useUnmuteUser = (options = {}) => {
  return useMutation(
    (id) => adminService.unmuteUser(id),
    options
  );
};

/**
 * Hook pour activer ou désactiver un compte utilisateur
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: updateStatus, loading } = useUpdateUserStatus({
 *   onSuccess: () => {
 *     toast.success('Statut du compte mis à jour');
 *     refetchUser();
 *   },
 * });
 *
 * // Dans un handler
 * await updateStatus({ id: userId, data: { isActive: false } });
 */
export const useUpdateUserStatus = (options = {}) => {
  return useMutation(
    ({ id, data }) => adminService.updateUserStatus(id, data),
    options
  );
};

// ============================================================================
// HOOKS DE MUTATIONS — PERSONNAGES (exécution manuelle)
// ============================================================================

/**
 * Hook pour approuver un personnage soumis
 * Change le statut de SUBMITTED à APPROVED
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: approve, loading } = useApproveCharacter({
 *   onSuccess: () => {
 *     toast.success('Personnage approuvé');
 *     refetchPending();
 *   },
 * });
 *
 * // Dans un handler
 * await approve(characterId);
 */
export const useApproveCharacter = (options = {}) => {
  return useMutation(
    (id) => adminService.approveCharacter(id),
    options
  );
};

/**
 * Hook pour rejeter un personnage soumis avec une raison obligatoire
 * Change le statut de SUBMITTED à REJECTED
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: reject, loading } = useRejectCharacter({
 *   onSuccess: () => {
 *     toast.success('Personnage rejeté');
 *     refetchPending();
 *   },
 * });
 *
 * // Dans un handler
 * await reject({ id: characterId, data: { rejectionReason: 'Biographie incomplète' } });
 */
export const useRejectCharacter = (options = {}) => {
  return useMutation(
    ({ id, data }) => adminService.rejectCharacter(id, data),
    options
  );
};

/**
 * Hook pour supprimer définitivement un personnage (soft delete)
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: deleteChar, loading } = useDeleteCharacter({
 *   onSuccess: () => {
 *     toast.success('Personnage supprimé');
 *     refetchCharacters();
 *   },
 * });
 *
 * // Dans un handler
 * await deleteChar(characterId);
 */
export const useDeleteCharacter = (options = {}) => {
  return useMutation(
    (id) => adminService.deleteCharacter(id),
    options
  );
};

// ============================================================================
// HOOKS DE MUTATIONS — FORUM CATÉGORIES (exécution manuelle)
// ============================================================================

/**
 * Hook pour créer une nouvelle catégorie de forum
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: createCategory, loading, error } = useCreateCategory({
 *   onSuccess: (category) => {
 *     toast.success('Catégorie créée avec succès');
 *     refetchCategories();
 *   },
 *   onError: (err) => toast.error(err.message),
 * });
 *
 * // Dans un handler
 * await createCategory({ name: 'Nouvelle catégorie', description: '...' });
 */
export const useCreateCategory = (options = {}) => {
  return useMutation(
    (data) => adminService.createCategory(data),
    options
  );
};

/**
 * Hook pour mettre à jour une catégorie de forum existante
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: updateCategory, loading } = useUpdateCategory({
 *   onSuccess: () => {
 *     toast.success('Catégorie mise à jour');
 *     refetchCategories();
 *   },
 * });
 *
 * // Dans un handler
 * await updateCategory({ id: categoryId, data: { name: 'Nouveau nom' } });
 */
export const useUpdateCategory = (options = {}) => {
  return useMutation(
    ({ id, data }) => adminService.updateCategory(id, data),
    options
  );
};

/**
 * Hook pour supprimer une catégorie de forum
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: deleteCategory, loading } = useDeleteCategory({
 *   onSuccess: () => {
 *     toast.success('Catégorie supprimée');
 *     refetchCategories();
 *   },
 * });
 *
 * // Dans un handler
 * await deleteCategory(categoryId);
 */
export const useDeleteCategory = (options = {}) => {
  return useMutation(
    (id) => adminService.deleteCategory(id),
    options
  );
};

/**
 * Hook pour réordonner les catégories du forum
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: reorder, loading } = useReorderCategories({
 *   onSuccess: () => {
 *     toast.success('Ordre des catégories mis à jour');
 *     refetchCategories();
 *   },
 * });
 *
 * // Dans un handler — passer le tableau avec le nouvel ordre
 * await reorder([{ id: 1, order: 0 }, { id: 3, order: 1 }, { id: 2, order: 2 }]);
 */
export const useReorderCategories = (options = {}) => {
  return useMutation(
    (categories) => adminService.reorderCategories(categories),
    options
  );
};

export const useCategoryPermissions = (categoryId, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled || !categoryId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getCategoryEffectivePermissions(categoryId);
      const responseData = response.data;
      setData(responseData);
      if (onSuccess) onSuccess(responseData);
      return responseData;
    } catch (err) {
      setError(err);
      if (onError) onError(err);
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

  return { data, loading, error, refetch };
};

export const useAddCategoryPermission = (options = {}) => {
  return useMutation(
    ({ categoryId, data }) => adminService.addCategoryPermission(categoryId, data),
    options
  );
};

export const useRemoveCategoryPermission = (options = {}) => {
  return useMutation(
    ({ categoryId, permissionId }) => adminService.removeCategoryPermission(categoryId, permissionId),
    options
  );
};

// ============================================================================
// HOOKS DE MUTATIONS — FORUM TOPICS (exécution manuelle)
// ============================================================================

/**
 * Hook pour déplacer un topic vers une autre catégorie
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: moveTopic, loading } = useMoveTopic({
 *   onSuccess: () => {
 *     toast.success('Sujet déplacé avec succès');
 *     refetchTopics();
 *   },
 * });
 *
 * // Dans un handler
 * await moveTopic({ id: topicId, data: { categoryId: newCategoryId } });
 */
export const useMoveTopic = (options = {}) => {
  return useMutation(
    ({ id, data }) => adminService.moveTopic(id, data),
    options
  );
};

/**
 * Hook pour fusionner deux topics en un seul
 * Les posts du topic source sont déplacés vers le topic cible
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: merge, loading } = useMergeTopics({
 *   onSuccess: (result) => {
 *     toast.success('Sujets fusionnés avec succès');
 *     navigate(`/forum/topics/${result.id}`);
 *   },
 * });
 *
 * // Dans un handler
 * await merge({ sourceTopicId: sourceId, targetTopicId: targetId });
 */
export const useMergeTopics = (options = {}) => {
  return useMutation(
    (data) => adminService.mergeTopics(data),
    options
  );
};

// ============================================================================
// HOOKS DE MUTATIONS — MODÉRATION (exécution manuelle)
// ============================================================================

/**
 * Hook pour traiter un signalement (acceptation ou rejet)
 * Mutation manuelle, ne s'exécute pas automatiquement
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: reviewReport, loading } = useAdminReviewReport({
 *   onSuccess: () => {
 *     toast.success('Signalement traité');
 *     refetchReports();
 *   },
 * });
 *
 * // Dans un handler
 * await reviewReport({
 *   id: reportId,
 *   data: { status: 'RESOLVED', reason: 'Contenu supprimé' },
 * });
 */
export const useAdminReviewReport = (options = {}) => {
  return useMutation(
    ({ id, data }) => adminService.reviewReport(id, data),
    options
  );
};
