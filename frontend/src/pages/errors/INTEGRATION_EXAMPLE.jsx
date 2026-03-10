/**
 * EXEMPLE D'INTÉGRATION - Pages d'Erreur
 * Ce fichier montre comment intégrer les pages d'erreur dans votre application React Router
 */

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ErrorBoundary } from '../../components/errors'
import { NotFound, Forbidden, ServerError, Maintenance } from './index'

// ============================================
// EXEMPLE 1: Configuration basique des routes
// ============================================

const BasicRoutesExample = () => (
  <BrowserRouter>
    <Routes>
      {/* Routes normales de votre app */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Page 404 - doit être la dernière route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

// ============================================
// EXEMPLE 2: Avec ErrorBoundary global
// ============================================

const AppWithErrorBoundary = () => (
  <ErrorBoundary
    onError={(error) => {
      // Envoyer à votre service de monitoring
      console.error('Global error caught:', error)
      // Sentry.captureException(error, { contexts: { react: errorInfo } })
    }}
  >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
)

// ============================================
// EXEMPLE 3: Routes protégées avec 403
// ============================================

const PrivateRoute = ({ children, isAuthenticated, hasPermission }) => {
  if (!isAuthenticated) {
    return <Forbidden userAuthenticated={false} />
  }

  if (!hasPermission) {
    return <Forbidden userAuthenticated={true} />
  }

  return children
}

const AppWithProtectedRoutes = () => {
  const { isAuthenticated, user } = useAuth() // Votre hook d'auth

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Routes protégées */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              hasPermission={user?.role === 'user'}
            >
              <DashboardPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              hasPermission={user?.role === 'admin'}
            >
              <AdminPage />
            </PrivateRoute>
          }
        />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

// ============================================
// EXEMPLE 4: Gestion d'erreur API avec 500
// ============================================

const DataPageWithErrorHandling = () => {
  const [data, setData] = React.useState(null)
  const [hasError, setHasError] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    setHasError(false)

    try {
      const response = await fetch('/api/data')

      if (!response.ok) {
        if (response.status === 500) {
          setHasError(true)
          return
        }
        throw new Error('Network error')
      }

      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Fetch error:', error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  if (hasError) {
    return <ServerError onRetry={fetchData} />
  }

  if (isLoading) {
    return <LoadingPage />
  }

  return <DataDisplay data={data} />
}

// ============================================
// EXEMPLE 5: Mode maintenance conditionnel
// ============================================

const AppWithMaintenanceMode = () => {
  // Cette valeur pourrait venir d'une variable d'environnement ou d'une API
  const isUnderMaintenance = import.meta.env.VITE_MAINTENANCE_MODE === 'true'
  const maintenanceEnd = import.meta.env.VITE_MAINTENANCE_END

  if (isUnderMaintenance) {
    return (
      <Maintenance
        estimatedTime={maintenanceEnd}
        message="Les Anciens effectuent une grande migration des données ancestrales."
      />
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* ... autres routes */}
      </Routes>
    </BrowserRouter>
  )
}

// ============================================
// EXEMPLE 6: ErrorBoundary avec fallback personnalisé
// ============================================

const SectionWithCustomError = () => (
  <ErrorBoundary
    fallback={({ error, resetError }) => (
      <div className="p-8 text-center">
        <h2 className="font-heading text-2xl text-error-DEFAULT mb-4">
          Une erreur est survenue dans cette section
        </h2>
        <p className="font-body text-primary-700 mb-6">
          {error?.message || 'Erreur inconnue'}
        </p>
        <button
          onClick={resetError}
          className="btn-primary"
        >
          Réessayer
        </button>
      </div>
    )}
  >
    <ComplexComponent />
  </ErrorBoundary>
)

// ============================================
// EXEMPLE 7: Routes avec codes d'erreur explicites
// ============================================

const AppWithErrorRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Routes normales */}
      <Route path="/" element={<HomePage />} />

      {/* Routes d'erreur explicites (utile pour les tests) */}
      <Route path="/error/403" element={<Forbidden />} />
      <Route path="/error/404" element={<NotFound />} />
      <Route path="/error/500" element={<ServerError />} />
      <Route path="/maintenance" element={<Maintenance />} />

      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

// ============================================
// EXEMPLE 8: Avec hook personnalisé pour gérer les erreurs
// ============================================

const useErrorHandler = () => {
  const navigate = useNavigate()

  const handleError = React.useCallback((error) => {
    // Log l'erreur
    console.error('Error handled:', error)

    // Router selon le type d'erreur
    if (error.response) {
      switch (error.response.status) {
        case 403:
          navigate('/error/403')
          break
        case 404:
          navigate('/error/404')
          break
        case 500:
        case 502:
        case 503:
          navigate('/error/500')
          break
        default:
          console.error('Unhandled error:', error)
      }
    }
  }, [navigate])

  return handleError
}

// Remplacer par votre client API réel
const api = { getData: () => fetch('/api/data').then(r => r.json()) }

const ComponentWithErrorHandling = () => {
  const handleError = useErrorHandler()

  const fetchData = async () => {
    try {
      await api.getData()
      // Traiter les données...
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div>
      <button onClick={fetchData}>Charger les données</button>
    </div>
  )
}

// ============================================
// EXEMPLE 9: Redirection intelligente depuis 403
// ============================================

const SmartForbidden = () => {
  const { isAuthenticated } = useAuth()

  return <Forbidden userAuthenticated={isAuthenticated} />
}

// ============================================
// EXEMPLE 10: Configuration complète recommandée
// ============================================

const RecommendedAppStructure = () => {
  const { isAuthenticated, user } = useAuth()
  const isUnderMaintenance = useMaintenanceStatus()

  // Mode maintenance prend le dessus
  if (isUnderMaintenance) {
    return <Maintenance estimatedTime="30 minutes" />
  }

  return (
    <ErrorBoundary
      onError={(error, _errorInfo) => {
        // Production: envoyer à Sentry, LogRocket, etc.
        if (!import.meta.env.DEV) {
          // Sentry.captureException(error, { contexts: { react: _errorInfo } })
        }
        console.error('App error:', error, _errorInfo)
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Routes authentifiées */}
          <Route
            path="/dashboard/*"
            element={
              isAuthenticated ? (
                <DashboardLayout />
              ) : (
                <Forbidden userAuthenticated={false} />
              )
            }
          />

          {/* Routes admin */}
          <Route
            path="/admin/*"
            element={
              isAuthenticated && user?.role === 'admin' ? (
                <AdminLayout />
              ) : (
                <Forbidden userAuthenticated={isAuthenticated} />
              )
            }
          />

          {/* Routes d'erreur explicites pour tests/debug */}
          {import.meta.env.DEV && (
            <>
              <Route path="/test/403" element={<Forbidden userAuthenticated={true} />} />
              <Route path="/test/404" element={<NotFound />} />
              <Route path="/test/500" element={<ServerError />} />
              <Route path="/test/maintenance" element={<Maintenance />} />
            </>
          )}

          {/* 404 catch-all - TOUJOURS en dernier */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

// ============================================
// HOOKS UTILITAIRES (à adapter selon votre app)
// ============================================

const useAuth = () => {
  // Votre logique d'authentification
  return {
    isAuthenticated: false,
    user: null
  }
}

const useMaintenanceStatus = () => {
  // Pourrait checker une API ou env var
  const [isUnderMaintenance, setIsUnderMaintenance] = React.useState(false)

  React.useEffect(() => {
    // Check maintenance status
    const checkMaintenance = async () => {
      try {
        const response = await fetch('/api/health')
        const data = await response.json()
        setIsUnderMaintenance(data.maintenance)
      } catch {
        console.error('Could not check maintenance status')
      }
    }

    checkMaintenance()
    const interval = setInterval(checkMaintenance, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  return isUnderMaintenance
}

// ============================================
// COMPOSANTS FACTICES POUR LES EXEMPLES
// ============================================

const HomePage = () => <div>Home Page</div>
const AboutPage = () => <div>About Page</div>
const LoginPage = () => <div>Login Page</div>
const DashboardPage = () => <div>Dashboard Page</div>
const AdminPage = () => <div>Admin Page</div>
const DashboardLayout = () => <div>Dashboard Layout</div>
const AdminLayout = () => <div>Admin Layout</div>
const LoadingPage = () => <div>Loading...</div>
const DataDisplay = ({ data }) => <div>Data: {JSON.stringify(data)}</div>
const ComplexComponent = () => <div>Complex Component</div>

// Export de l'exemple recommandé
export default RecommendedAppStructure
