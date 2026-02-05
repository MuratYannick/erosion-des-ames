/**
 * ERROR PAGES DEMO
 * Page de démonstration pour visualiser toutes les pages d'erreur
 * Accessible en dev via /demo/errors
 */

import React, { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { NotFound, Forbidden, ServerError, Maintenance } from './index'
import { ErrorBoundary } from '../../components/errors'

const ErrorPagesDemo = () => {
  const [selectedError, setSelectedError] = useState('404')
  const [userAuth, setUserAuth] = useState(false)
  const [showBoundary, setShowBoundary] = useState(false)

  const errorPages = [
    { id: '404', name: '404 - Not Found', component: NotFound },
    { id: '403', name: '403 - Forbidden', component: Forbidden },
    { id: '500', name: '500 - Server Error', component: ServerError },
    { id: 'maintenance', name: 'Maintenance', component: Maintenance },
    { id: 'boundary', name: 'Error Boundary', component: null }
  ]

  const renderSelectedError = () => {
    switch (selectedError) {
      case '404':
        return <NotFound />

      case '403':
        return <Forbidden userAuthenticated={userAuth} />

      case '500':
        return (
          <ServerError
            onRetry={() => {
              console.log('Retry clicked!')
              alert('Retry handler appelé!')
            }}
          />
        )

      case 'maintenance':
        return (
          <Maintenance
            estimatedTime="30 minutes"
            message="Les Anciens effectuent une grande migration des données ancestrales."
          />
        )

      case 'boundary':
        return (
          <ErrorBoundary
            onError={(error, errorInfo) => {
              console.log('Error caught by boundary:', error, errorInfo)
            }}
          >
            {showBoundary ? (
              <ErrorTrigger />
            ) : (
              <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <div className="text-center space-y-6 p-8 bg-white rounded-xl shadow-lg">
                  <h2 className="font-heading text-3xl text-primary-900">
                    ErrorBoundary Demo
                  </h2>
                  <p className="font-body text-lg text-primary-700">
                    Cliquez sur le bouton pour déclencher une erreur React
                  </p>
                  <button
                    onClick={() => setShowBoundary(true)}
                    className="font-button px-6 py-3 bg-error text-white rounded-lg hover:bg-error-light transition-all duration-normal"
                  >
                    Déclencher une erreur
                  </button>
                </div>
              </div>
            )}
          </ErrorBoundary>
        )

      default:
        return <NotFound />
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Barre de navigation demo */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="font-heading text-2xl text-primary-900">
                Pages d'Erreur - Demo
              </h1>
              <div className="flex items-center gap-4">
                <span className="font-ui text-sm text-primary-700">
                  Erosion des Âmes
                </span>
              </div>
            </div>

            {/* Sélecteur de page d'erreur */}
            <div className="flex flex-wrap items-center gap-2">
              {errorPages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => {
                    setSelectedError(page.id)
                    setShowBoundary(false)
                  }}
                  className={`
                    font-button px-4 py-2 rounded-lg transition-all duration-normal
                    ${
                      selectedError === page.id
                        ? 'bg-secondary text-white shadow-glow'
                        : 'bg-neutral-200 text-primary-700 hover:bg-neutral-300'
                    }
                  `}
                >
                  {page.name}
                </button>
              ))}
            </div>

            {/* Options spécifiques */}
            {selectedError === '403' && (
              <div className="flex items-center gap-4 pt-2 border-t border-neutral-200">
                <span className="font-ui text-sm text-primary-700">Options:</span>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userAuth}
                    onChange={(e) => setUserAuth(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="font-body text-sm text-primary-700">
                    Utilisateur authentifié
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Zone d'affichage de la page d'erreur */}
      <div className="relative">
        <BrowserRouter>
          {renderSelectedError()}
        </BrowserRouter>
      </div>

      {/* Infos techniques */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 text-neutral-100 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm font-ui">
          <div>
            Page actuelle: <strong className="text-secondary-300">{selectedError}</strong>
          </div>
          <div className="flex items-center gap-4">
            <span>Responsive: Mobile-first</span>
            <span>|</span>
            <span>Animations: CSS natives</span>
            <span>|</span>
            <a
              href="https://github.com/votre-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-300 hover:text-secondary-200 underline"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Composant qui déclenche volontairement une erreur pour tester ErrorBoundary
 */
const ErrorTrigger = () => {
  throw new Error('Erreur de test déclenchée intentionnellement par ErrorTrigger')
}

export default ErrorPagesDemo

/**
 * USAGE dans votre App.jsx en dev:
 *
 * import ErrorPagesDemo from './pages/errors/ErrorPagesDemo'
 *
 * <Routes>
 *   {process.env.NODE_ENV === 'development' && (
 *     <Route path="/demo/errors" element={<ErrorPagesDemo />} />
 *   )}
 *   // ... autres routes
 * </Routes>
 */
