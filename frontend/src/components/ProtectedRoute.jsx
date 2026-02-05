import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/ui/Loader';
import { Forbidden } from '@/pages/errors';

/**
 * Composant qui protège les routes nécessitant une authentification
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 * Redirige vers l'accueil si l'utilisateur n'a pas le bon rôle
 *
 * @param {Object} props
 * @param {string[]} props.roles - Liste des rôles autorisés (optionnel)
 * @param {string} props.redirectTo - Chemin de redirection si non authentifié (default: '/connexion')
 * @param {React.ReactNode} props.children - Contenu à afficher si autorisé
 */
const ProtectedRoute = ({ roles = null, redirectTo = '/connexion', children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Pendant le chargement initial, afficher un loader fullscreen
  if (isLoading) {
    return (
      <Loader
        fullscreen
        variant="spinner"
        size="lg"
        text="Vérification de l'authentification"
        showAura
        showAsh
      />
    );
  }

  // Si non authentifié, rediriger vers la page de connexion
  // Sauvegarder la page d'origine dans state.from pour redirection après login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si des rôles sont spécifiés, vérifier que l'utilisateur a l'un d'eux
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.includes(user.role);

    // Si l'utilisateur n'a pas le bon rôle, afficher la page 403
    if (!hasRequiredRole) {
      return <Forbidden userAuthenticated={true} />;
    }
  }

  // L'utilisateur est authentifié et autorisé, afficher le contenu
  return children;
};

ProtectedRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
  redirectTo: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
