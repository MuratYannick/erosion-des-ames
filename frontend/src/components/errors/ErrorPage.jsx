import { useNavigate } from 'react-router-dom'
import Button from '../ui/Button/Button'
import './ErrorPage.css'

/**
 * ErrorPage - Composant de base réutilisable pour toutes les pages d'erreur
 *
 * Props:
 * @param {string} code - Code d'erreur (404, 403, 500, etc.) - optionnel
 * @param {string} title - Titre principal de l'erreur
 * @param {string} message - Message principal explicatif
 * @param {string} secondaryMessage - Message secondaire optionnel
 * @param {ReactNode} illustration - Composant SVG d'illustration
 * @param {Array} actions - Tableau d'actions avec { label, onClick, variant, icon }
 * @param {boolean} showHomeLink - Afficher le lien retour accueil par défaut
 * @param {string} backgroundGradient - Classes Tailwind pour le fond dégradé
 * @param {string} codeColor - Couleur du code d'erreur (classe Tailwind)
 */
const ErrorPage = ({
  code,
  title,
  message,
  secondaryMessage,
  illustration,
  actions = [],
  showHomeLink = true,
  backgroundGradient = 'bg-gradient-to-b from-neutral-50 to-primary-50',
  codeColor = 'text-secondary-500'
}) => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  // Actions par défaut si aucune n'est fournie
  const defaultActions = showHomeLink ? [
    {
      label: 'Retour à l\'accueil',
      onClick: handleGoHome,
      variant: 'primary'
    }
  ] : []

  const finalActions = actions.length > 0 ? actions : defaultActions

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 ${backgroundGradient}`}>
      <div className="max-w-2xl w-full">
        {/* Container principal avec animation d'entrée */}
        <div className="text-center space-y-6 sm:space-y-8">

          {/* Code d'erreur avec animation pulse */}
          {code && (
            <div className="error-content-enter">
              <h1
                className={`font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold ${codeColor} error-code-pulse`}
                aria-label={`Erreur ${code}`}
              >
                {code}
              </h1>
            </div>
          )}

          {/* Illustration SVG animée */}
          {illustration && (
            <div className="error-content-enter flex justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
                {illustration}
              </div>
            </div>
          )}

          {/* Titre principal */}
          <div className="error-content-enter space-y-3 sm:space-y-4">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-primary-900 tracking-wide">
              {title}
            </h2>

            {/* Message principal */}
            <p className="font-body text-base sm:text-lg md:text-xl text-primary-700 max-w-xl mx-auto leading-relaxed px-4">
              {message}
            </p>

            {/* Message secondaire optionnel */}
            {secondaryMessage && (
              <p className="font-body text-sm sm:text-base text-primary-600 max-w-md mx-auto px-4">
                {secondaryMessage}
              </p>
            )}
          </div>

          {/* Boutons d'action */}
          {finalActions.length > 0 && (
            <div className="error-content-enter flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6">
              {finalActions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant || 'primary'}
                  size="lg"
                  onClick={action.onClick || handleGoHome}
                  icon={action.icon}
                  className="error-action-btn w-full sm:w-auto min-w-[200px]"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Lien retour subtil si showHomeLink et pas dans les actions */}
          {showHomeLink && actions.length > 0 && !actions.some(a => a.onClick === handleGoHome) && (
            <div className="error-content-enter pt-4">
              <button
                onClick={handleGoHome}
                className="font-body text-sm text-primary-600 hover:text-primary-800 underline decoration-dotted underline-offset-4 transition-colors duration-normal"
              >
                Retour à l'accueil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
