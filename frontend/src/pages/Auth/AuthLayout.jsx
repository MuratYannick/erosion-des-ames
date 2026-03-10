import PropTypes from 'prop-types';
import { Link } from 'react-router';
import './AuthLayout.css';

/**
 * Layout commun pour toutes les pages d'authentification
 * Fournit le fond thématique, le logo, et la structure de carte
 *
 * @param {Object} props - Props du composant
 * @param {React.ReactNode} props.children - Contenu de la page auth
 */
function AuthLayout({ children }) {
  return (
    <div className="auth-layout min-h-screen flex flex-col items-center justify-center p-5 relative bg-primary-900">
      {/* Texture de bruit (pseudo-element CSS) */}
      {/* Lueur ambiante orangée (pseudo-element CSS) */}

      <div className="auth-container w-full max-w-[480px] relative z-10">
        {/* Logo et titre du site */}
        <div className="auth-logo text-center mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-secondary-500 tracking-wide mb-2">
            Érosion des Âmes
          </h1>
          <p className="font-ui text-sm md:text-base text-primary-300 tracking-wide">
            Survie dans les Cendres du Monde
          </p>
        </div>

        {/* Carte principale avec bordure tribale */}
        <div className="auth-card bg-gradient-to-br from-primary-800/95 to-primary-900/98 rounded-xl p-8 md:p-10 relative shadow-elevated-lg backdrop-blur-md">
          {/* Barre d'accent tribale */}
          <div className="tribal-accent h-1 mb-8 opacity-60"></div>

          {/* Contenu de la page */}
          {children}
        </div>

        {/* Footer - Retour à l'accueil */}
        <div className="auth-footer text-center mt-8">
          <Link
            to="/"
            className="font-ui text-sm text-primary-400 hover:text-secondary-400 transition-colors duration-normal inline-flex items-center gap-2"
          >
            <span>←</span>
            <span>Retour à l&apos;accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
