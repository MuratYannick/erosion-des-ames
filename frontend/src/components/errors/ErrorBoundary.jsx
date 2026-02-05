import React from 'react'

/**
 * ErrorBoundary - Capture les erreurs React et affiche un fallback
 *
 * Props:
 * @param {ReactNode} children - Composants enfants à surveiller
 * @param {ReactNode} fallback - Composant à afficher en cas d'erreur (par défaut: ServerError)
 * @param {Function} onError - Callback appelé quand une erreur est capturée
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    // Mise à jour du state pour afficher le fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log l'erreur pour le debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Mise à jour du state avec les détails de l'erreur
    this.setState({
      error,
      errorInfo
    })

    // Appel du callback onError si fourni
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // En production, vous pourriez envoyer l'erreur à un service de monitoring
    // comme Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Exemple: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
    }
  }

  handleReset = () => {
    // Réinitialise le state pour réessayer le rendu
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      // Si un fallback personnalisé est fourni, l'utiliser
      if (this.props.fallback) {
        // Si c'est un composant fonction, le rendre avec les props d'erreur
        if (typeof this.props.fallback === 'function') {
          const FallbackComponent = this.props.fallback
          return (
            <FallbackComponent
              error={this.state.error}
              errorInfo={this.state.errorInfo}
              resetError={this.handleReset}
            />
          )
        }
        // Sinon rendre le composant tel quel
        return this.props.fallback
      }

      // Fallback par défaut: importer ServerError de manière lazy
      // Pour éviter les dépendances circulaires, on utilise un import dynamique
      const ServerErrorFallback = () => {
        const [ServerError, setServerError] = React.useState(null)

        React.useEffect(() => {
          import('../../pages/errors/ServerError').then(module => {
            setServerError(() => module.default)
          })
        }, [])

        if (!ServerError) {
          // Fallback minimal pendant le chargement
          return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-warning-light/15 via-neutral-50 to-secondary-900/20">
              <div className="text-center space-y-4 px-4">
                <h1 className="font-display text-6xl text-secondary-600">500</h1>
                <h2 className="font-heading text-3xl text-primary-900">Perturbation Spirituelle</h2>
                <p className="font-body text-lg text-primary-700 max-w-xl mx-auto">
                  Les forces primordiales sont en déséquilibre. Une perturbation spirituelle affecte nos systèmes.
                </p>
                <button
                  onClick={this.handleReset}
                  className="font-button px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary-400 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )
        }

        return <ServerError onRetry={this.handleReset} />
      }

      return <ServerErrorFallback />
    }

    // Pas d'erreur, rendre les enfants normalement
    return this.props.children
  }
}

export default ErrorBoundary
