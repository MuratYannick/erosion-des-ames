import { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as authService from '@/services/authService';
import { isTokenExpired } from '@/services/authService';

// Création du context
export const AuthContext = createContext(null);

/**
 * Provider pour l'authentification
 * Gère l'état global de l'utilisateur connecté
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Calculer isAuthenticated basé sur user
  const isAuthenticated = !!user;

  /**
   * Récupère les informations de l'utilisateur depuis l'API
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getMe();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      // Si le token est invalide ou expiré, supprimer le token et déconnecter
      authService.removeToken();
      setUser(null);
      throw error;
    }
  }, []);

  /**
   * Initialisation : vérifier si un token existe au montage
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const token = authService.getToken();

      if (token) {
        try {
          await refreshUser();
        } catch (error) {
          // L'erreur a déjà été gérée dans refreshUser
          console.error('Échec de la vérification du token:', error);
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, [refreshUser]);

  /**
   * Écouter les événements de déconnexion forcée (token expiré, 401, etc.)
   */
  useEffect(() => {
    const handleForcedLogout = (event) => {
      console.log('Déconnexion forcée:', event.detail?.reason);
      setUser(null);
    };

    window.addEventListener('auth:logout', handleForcedLogout);
    return () => window.removeEventListener('auth:logout', handleForcedLogout);
  }, []);

  /**
   * Vérification périodique de l'expiration du token
   * Vérifie toutes les 5 secondes si le token est expiré
   */
  useEffect(() => {
    if (!user) return;

    const checkTokenExpiration = () => {
      const token = authService.getToken();
      if (!token) return;
      if (isTokenExpired(token)) {
        console.warn('[Auth] Token expiré, déconnexion automatique', {
          path: window.location.pathname,
          tokenPrefix: token.substring(0, 20) + '...',
        });
        authService.removeToken();
        setUser(null);
      }
    };

    // Vérifier immédiatement
    checkTokenExpiration();

    // Puis toutes les 5 secondes
    const interval = setInterval(checkTokenExpiration, 5000);
    return () => clearInterval(interval);
  }, [user]);

  /**
   * Connexion de l'utilisateur
   * @param {string} identifier - Email ou nom d'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} Réponse de l'API
   */
  const login = useCallback(async (identifier, password) => {
    const response = await authService.login(identifier, password);

    if (response.success && response.data?.user) {
      setUser(response.data.user);
    }

    return response;
  }, []);

  /**
   * Inscription d'un nouvel utilisateur
   * Note: Ne connecte PAS l'utilisateur automatiquement car l'email doit être vérifié
   * @param {Object} data - Données d'inscription
   * @returns {Promise<Object>} Réponse de l'API
   */
  const register = useCallback(async (data) => {
    const response = await authService.register(data);
    // Ne pas mettre à jour l'état user ici car l'email n'est pas vérifié
    return response;
  }, []);

  /**
   * Déconnexion de l'utilisateur
   * @returns {Promise<Object>} Réponse de l'API
   */
  const logout = useCallback(async () => {
    try {
      const response = await authService.logout();
      return response;
    } finally {
      // Toujours nettoyer l'état, même si la requête échoue
      setUser(null);
    }
  }, []);

  /**
   * Met à jour les données utilisateur localement
   * Utile après une mise à jour de profil
   * @param {Object} userData - Nouvelles données utilisateur
   */
  const updateUser = useCallback((userData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
    }));
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
