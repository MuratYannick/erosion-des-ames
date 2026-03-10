import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook custom pour naviguer vers les pages d'erreur
 * Fournit des helpers pour naviguer facilement vers les différentes pages d'erreur
 *
 * @returns {Object} Fonctions de navigation vers les pages d'erreur
 *
 * @example
 * const { navigateTo404, navigateTo403, navigateToError } = useNavigateToError();
 *
 * // Navigation simple
 * navigateTo404();
 *
 * // Avec options
 * navigateTo403({ replace: true, state: { message: 'Accès refusé à cette ressource' } });
 *
 * // Fonction générique
 * navigateToError(500);
 */
/**
 * Routes des pages d'erreur
 */
const ERROR_ROUTES = {
  404: '/page-non-trouvee',
  403: '/interdit',
  500: '/erreur',
  maintenance: '/maintenance',
};

export const useNavigateToError = () => {
  const navigate = useNavigate();

  /**
   * Navigue vers une page d'erreur
   * @param {string} route - Route de la page d'erreur
   * @param {Object} options - Options de navigation
   * @param {boolean} options.replace - Utiliser replace au lieu de push
   * @param {Object} options.state - State à passer à la page d'erreur
   */
  const navigateToErrorRoute = useCallback((route, options = {}) => {
    const { replace = false, state = {} } = options;

    navigate(route, {
      replace,
      state,
    });
  }, [navigate]);

  /**
   * Navigue vers la page 404 (Page Non Trouvée)
   * @param {Object} options - Options de navigation
   * @param {boolean} options.replace - Utiliser replace au lieu de push
   * @param {Object} options.state - State à passer à la page d'erreur
   */
  const navigateTo404 = useCallback((options = {}) => {
    navigateToErrorRoute(ERROR_ROUTES[404], options);
  }, [navigateToErrorRoute]);

  /**
   * Navigue vers la page 403 (Interdit)
   * @param {Object} options - Options de navigation
   * @param {boolean} options.replace - Utiliser replace au lieu de push
   * @param {Object} options.state - State à passer à la page d'erreur
   */
  const navigateTo403 = useCallback((options = {}) => {
    navigateToErrorRoute(ERROR_ROUTES[403], options);
  }, [navigateToErrorRoute]);

  /**
   * Navigue vers la page 500 (Erreur Serveur)
   * @param {Object} options - Options de navigation
   * @param {boolean} options.replace - Utiliser replace au lieu de push
   * @param {Object} options.state - State à passer à la page d'erreur
   */
  const navigateTo500 = useCallback((options = {}) => {
    navigateToErrorRoute(ERROR_ROUTES[500], options);
  }, [navigateToErrorRoute]);

  /**
   * Navigue vers la page de Maintenance
   * @param {Object} options - Options de navigation
   * @param {boolean} options.replace - Utiliser replace au lieu de push
   * @param {Object} options.state - State à passer à la page d'erreur
   */
  const navigateToMaintenance = useCallback((options = {}) => {
    navigateToErrorRoute(ERROR_ROUTES.maintenance, options);
  }, [navigateToErrorRoute]);

  /**
   * Navigue vers une page d'erreur de façon générique
   * @param {number|string} code - Code d'erreur (404, 403, 500, 'maintenance')
   * @param {Object} options - Options de navigation
   * @param {boolean} options.replace - Utiliser replace au lieu de push
   * @param {Object} options.state - State à passer à la page d'erreur
   *
   * @example
   * navigateToError(404);
   * navigateToError(403, { replace: true });
   * navigateToError('maintenance', { state: { reason: 'Mise à jour' } });
   */
  const navigateToError = useCallback((code, options = {}) => {
    const route = ERROR_ROUTES[code];

    if (!route) {
      console.error(`Code d'erreur invalide: ${code}. Codes valides: 404, 403, 500, 'maintenance'`);
      // Fallback vers 404 en cas de code invalide
      navigateTo404(options);
      return;
    }

    navigateToErrorRoute(route, options);
  }, [navigateToErrorRoute, navigateTo404]);

  return {
    // Fonctions spécifiques
    navigateTo404,
    navigateTo403,
    navigateTo500,
    navigateToMaintenance,

    // Fonction générique
    navigateToError,

    // Routes exposées (utile pour les liens)
    ERROR_ROUTES,
  };
};
