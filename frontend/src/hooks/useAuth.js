import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * Hook custom pour accéder au context d'authentification
 * Fournit des helpers pour vérifier les rôles
 *
 * @returns {Object} Context d'authentification avec propriétés dérivées
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }

  const { user, isAuthenticated, isLoading, login, register, logout, updateUser, refreshUser } = context;

  // Propriétés dérivées pour vérifier les rôles
  const isAdmin = user?.role === 'ADMIN';
  const isModerator = user?.role === 'MODERATOR';
  const isGameMaster = user?.role === 'GAME_MASTER';
  const isPlayer = user?.role === 'PLAYER';
  const isStaff = ['ADMIN', 'MODERATOR', 'GAME_MASTER'].includes(user?.role);

  return {
    // État de base
    user,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    register,
    logout,
    updateUser,
    refreshUser,

    // Helpers de rôles
    isAdmin,
    isModerator,
    isGameMaster,
    isPlayer,
    isStaff,
  };
};
