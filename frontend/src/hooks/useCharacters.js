import { useMutation } from './useApi';
import * as characterService from '@/services/characterService';
import { getAllReferenceData } from '@/services/referenceService';
import { useEffect, useState, useCallback } from 'react';

/**
 * Hook pour récupérer la liste des personnages avec filtres
 * Exécute automatiquement la requête au montage et quand les params changent
 *
 * @param {Object} params - Paramètres de filtrage
 * @param {string} params.status - Statut du personnage
 * @param {boolean} params.isActive - Personnage actif
 * @param {string} params.ethnicityId - ID de l'ethnie
 * @param {string} params.factionId - ID de la faction
 * @param {string} params.clanId - ID du clan
 * @param {string} params.userId - ID de l'utilisateur
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: characters, loading, error, refetch } = useCharacters({
 *   status: 'APPROVED',
 *   isActive: true,
 * });
 */
export const useCharacters = (params = {}, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const response = await characterService.getCharacters(params);
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
 * Hook pour récupérer un personnage par son ID
 * Exécute automatiquement la requête au montage
 *
 * @param {string} id - ID du personnage
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la requête
 *
 * @example
 * const { data: character, loading, error, refetch } = useCharacter(characterId);
 */
export const useCharacter = (id, options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled || !id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await characterService.getCharacter(id);
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
 * Hook pour récupérer les personnages de l'utilisateur connecté
 * @param {string} userId - ID de l'utilisateur connecté
 * @param {Object} options - Options du hook (même que useCharacters)
 * @returns {Object} État de la requête
 *
 * @example
 * const { user } = useAuth();
 * const { data: myCharacters, loading, refetch } = useMyCharacters(user?.id);
 */
export const useMyCharacters = (userId, { includeUnowned = false, ...options } = {}) => {
  const params = userId ? { userId } : {};
  if (includeUnowned) {
    params.includeUnowned = 'true';
  }
  return useCharacters(
    params,
    { ...options, enabled: options.enabled !== false && !!userId }
  );
};

/**
 * Hook pour créer un personnage
 * Mutation manuelle, ne s'exécute pas automatiquement
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: createCharacter, loading, error } = useCreateCharacter({
 *   onSuccess: (character) => {
 *     toast.success('Personnage créé avec succès');
 *     navigate(`/characters/${character.id}`);
 *   },
 *   onError: (err) => toast.error(err.message),
 * });
 *
 * // Dans un handler
 * await createCharacter(formData);
 */
export const useCreateCharacter = (options = {}) => {
  return useMutation(
    (data) => characterService.createCharacter(data),
    options
  );
};

/**
 * Hook pour mettre à jour un personnage
 * Mutation manuelle, ne s'exécute pas automatiquement
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: updateCharacter, loading } = useUpdateCharacter({
 *   onSuccess: () => {
 *     toast.success('Personnage mis à jour');
 *     refetchCharacter();
 *   },
 * });
 *
 * // Dans un handler
 * await updateCharacter({ id: characterId, data: formData });
 */
export const useUpdateCharacter = (options = {}) => {
  return useMutation(
    ({ id, data }) => characterService.updateCharacter(id, data),
    options
  );
};

/**
 * Hook pour soumettre un personnage pour approbation
 * Change le statut de DRAFT à SUBMITTED
 *
 * @param {Object} options - Options du hook
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: submitCharacter, loading } = useSubmitCharacter({
 *   onSuccess: () => {
 *     toast.success('Personnage soumis pour approbation');
 *     refetchCharacter();
 *   },
 * });
 *
 * // Dans un handler
 * await submitCharacter(characterId);
 */
export const useSubmitCharacter = (options = {}) => {
  return useMutation(
    (id) => characterService.submitCharacter(id),
    options
  );
};

/**
 * Hook pour approuver un personnage
 * Change le statut de SUBMITTED à APPROVED
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} options - Options du hook
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: approveCharacter, loading } = useApproveCharacter({
 *   onSuccess: () => {
 *     toast.success('Personnage approuvé');
 *     refetchCharacters();
 *   },
 * });
 */
export const useApproveCharacter = (options = {}) => {
  return useMutation(
    (id) => characterService.approveCharacter(id),
    options
  );
};

/**
 * Hook pour rejeter un personnage avec une raison
 * Change le statut de SUBMITTED à REJECTED
 * Requiert rôle ADMIN ou MODERATOR
 *
 * @param {Object} options - Options du hook
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: rejectCharacter, loading } = useRejectCharacter({
 *   onSuccess: () => {
 *     toast.success('Personnage rejeté');
 *     refetchCharacters();
 *   },
 * });
 *
 * // Dans un handler
 * await rejectCharacter({ id: characterId, reason: 'Biographie incomplète' });
 */
export const useRejectCharacter = (options = {}) => {
  return useMutation(
    ({ id, reason }) => characterService.rejectCharacter(id, reason),
    options
  );
};

/**
 * Hook pour supprimer un personnage (soft delete)
 * Requiert rôle ADMIN
 *
 * @param {Object} options - Options du hook
 * @returns {Object} État de la mutation
 *
 * @example
 * const { mutate: deleteCharacter, loading } = useDeleteCharacter({
 *   onSuccess: () => {
 *     toast.success('Personnage supprimé');
 *     navigate('/characters');
 *   },
 * });
 *
 * // Dans un handler
 * await deleteCharacter(characterId);
 */
export const useDeleteCharacter = (options = {}) => {
  return useMutation(
    (id) => characterService.deleteCharacter(id),
    options
  );
};

/**
 * Hook pour sélectionner un personnage actif
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 */
export const useSelectCharacter = (options = {}) => {
  return useMutation(
    (characterId) => characterService.selectCharacter(characterId),
    options
  );
};

/**
 * Hook pour désélectionner le personnage actif
 *
 * @param {Object} options - Options du hook
 * @param {Function} options.onSuccess - Callback de succès
 * @param {Function} options.onError - Callback d'erreur
 * @returns {Object} État de la mutation
 */
export const useDeselectCharacter = (options = {}) => {
  return useMutation(
    () => characterService.deselectCharacter(),
    options
  );
};

/**
 * Hook pour récupérer toutes les données de référence
 * Utile pour remplir les formulaires de création/édition
 * Charge ethnicities, factions et clans en parallèle
 *
 * @param {Object} options - Options du hook
 * @param {boolean} options.enabled - Activer la requête automatique (défaut: true)
 * @returns {Object} État de la requête avec ethnicities, factions et clans
 *
 * @example
 * const { data, loading, error } = useReferenceData();
 * // data: { ethnicities: [...], factions: [...], clans: [...] }
 */
export const useReferenceData = (options = {}) => {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      setError(null);

      const responseData = await getAllReferenceData();
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
