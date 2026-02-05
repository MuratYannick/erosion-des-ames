/**
 * Type definitions for useNavigateToError hook
 */

/**
 * Options de navigation pour les fonctions d'erreur
 */
export interface NavigationOptions {
  /**
   * Utiliser replace au lieu de push dans l'historique de navigation
   * @default false
   */
  replace?: boolean;

  /**
   * State à passer à la page d'erreur
   * Peut contenir n'importe quelle information contextuelle
   * @default {}
   */
  state?: Record<string, any>;
}

/**
 * Codes d'erreur supportés
 */
export type ErrorCode = 404 | 403 | 500 | 'maintenance';

/**
 * Routes des pages d'erreur
 */
export interface ErrorRoutes {
  404: '/page-non-trouvee';
  403: '/interdit';
  500: '/erreur';
  maintenance: '/maintenance';
}

/**
 * Valeur de retour du hook useNavigateToError
 */
export interface UseNavigateToErrorReturn {
  /**
   * Navigue vers la page 404 (Page Non Trouvée)
   *
   * @param options - Options de navigation
   * @example
   * ```jsx
   * navigateTo404();
   * navigateTo404({ replace: true });
   * navigateTo404({ state: { message: 'Ressource non trouvée' } });
   * ```
   */
  navigateTo404: (options?: NavigationOptions) => void;

  /**
   * Navigue vers la page 403 (Accès Interdit)
   *
   * @param options - Options de navigation
   * @example
   * ```jsx
   * navigateTo403();
   * navigateTo403({ replace: true, state: { message: 'Accès refusé' } });
   * ```
   */
  navigateTo403: (options?: NavigationOptions) => void;

  /**
   * Navigue vers la page 500 (Erreur Serveur)
   *
   * @param options - Options de navigation
   * @example
   * ```jsx
   * navigateTo500();
   * navigateTo500({ state: { error: 'Database error', statusCode: 500 } });
   * ```
   */
  navigateTo500: (options?: NavigationOptions) => void;

  /**
   * Navigue vers la page de Maintenance
   *
   * @param options - Options de navigation
   * @example
   * ```jsx
   * navigateToMaintenance();
   * navigateToMaintenance({ state: { reason: 'Mise à jour système' } });
   * ```
   */
  navigateToMaintenance: (options?: NavigationOptions) => void;

  /**
   * Navigue vers une page d'erreur de façon générique
   *
   * @param code - Code d'erreur (404, 403, 500, ou 'maintenance')
   * @param options - Options de navigation
   *
   * @example
   * ```jsx
   * navigateToError(404);
   * navigateToError(403, { replace: true });
   * navigateToError('maintenance', { state: { reason: 'Mise à jour' } });
   * ```
   *
   * @throws {Error} Affiche un warning console si le code est invalide et redirige vers 404
   */
  navigateToError: (code: ErrorCode, options?: NavigationOptions) => void;

  /**
   * Routes des pages d'erreur
   * Utile pour créer des liens avec <Link to={ERROR_ROUTES[404]} />
   */
  ERROR_ROUTES: ErrorRoutes;
}

/**
 * Hook personnalisé pour naviguer vers les pages d'erreur
 *
 * Fournit des fonctions pour naviguer facilement vers les différentes pages d'erreur
 * du site, avec support des options de navigation et du state.
 *
 * @returns {UseNavigateToErrorReturn} Fonctions de navigation et routes
 *
 * @example
 * ```jsx
 * import { useNavigateToError } from '@/hooks';
 *
 * function MyComponent() {
 *   const { navigateTo404, navigateTo403, navigateToError } = useNavigateToError();
 *
 *   const handleNotFound = () => {
 *     navigateTo404({ state: { message: 'Ressource non trouvée' } });
 *   };
 *
 *   const handleAccessDenied = () => {
 *     navigateTo403({ replace: true });
 *   };
 *
 *   const handleApiError = (statusCode) => {
 *     if (statusCode === 403 || statusCode === 404 || statusCode === 500) {
 *       navigateToError(statusCode);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleNotFound}>Not Found</button>
 *       <button onClick={handleAccessDenied}>Access Denied</button>
 *       <button onClick={() => handleApiError(500)}>Server Error</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useNavigateToError(): UseNavigateToErrorReturn;
