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
 * @param {boolean} props.showHeader - Whether to show the header (default: true)
 * @param {boolean} props.showFooter - Whether to show the footer (default: true)
 * @param {string} props.className - Additional classes for the main content area
 * @param {React.ReactNode} props.children - Alternative to Outlet for direct children
 */
const MainLayout = ({
  showHeader = true,
  showFooter = true,
  className = '',
  children,
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-surface">
      {/* Header */}
      {showHeader && <Header />}

      {/* Main content area */}
      <main className={`flex-1 w-full ${className}`}>
        {children || <Outlet />}
      </main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  )
}

export default MainLayout
export { MainLayout }
