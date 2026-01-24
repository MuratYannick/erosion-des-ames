import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

/**
 * MainLayout Component
 *
 * Main layout wrapper that provides consistent Header and Footer
 * across all pages. Uses React Router's Outlet for nested routes.
 *
 * @param {Object} props
 * @param {Object} props.user - Current user object (null if not logged in)
 * @param {Function} props.onLogin - Callback when login button is clicked
 * @param {Function} props.onRegister - Callback when register button is clicked
 * @param {Function} props.onLogout - Callback when logout is triggered
 * @param {boolean} props.showHeader - Whether to show the header (default: true)
 * @param {boolean} props.showFooter - Whether to show the footer (default: true)
 * @param {string} props.className - Additional classes for the main content area
 * @param {React.ReactNode} props.children - Alternative to Outlet for direct children
 */
const MainLayout = ({
  user = null,
  onLogin,
  onRegister,
  onLogout,
  showHeader = true,
  showFooter = true,
  className = '',
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Header */}
      {showHeader && (
        <Header
          user={user}
          onLogin={onLogin}
          onRegister={onRegister}
          onLogout={onLogout}
        />
      )}

      {/* Main content area */}
      <main className={`flex-1 ${className}`}>
        {children || <Outlet />}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  )
}

export default MainLayout
export { MainLayout }
