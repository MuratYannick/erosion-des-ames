import { useState, useEffect, useCallback } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Avatar, Dropdown, Button } from '@/components'
import './Header.css'

/**
 * Logo Emblem - Sacred Mark SVG
 */
const LogoEmblem = ({ className = '' }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    className={`logo-emblem ${className}`}
    aria-hidden="true"
  >
    {/* Outer ritual circle - weathered */}
    <circle
      cx="32"
      cy="32"
      r="30"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="3 2"
      opacity="0.6"
      className="text-primary-700"
    />
    {/* Inner circle - stronger */}
    <circle
      cx="32"
      cy="32"
      r="24"
      stroke="currentColor"
      strokeWidth="2"
      className="text-primary-600"
    />
    {/* Erosion symbol - cracks radiating from center */}
    <path
      d="M32 16 L32 8 M32 48 L32 56 M16 32 L8 32 M48 32 L56 32"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="text-secondary-500"
    />
    {/* Diagonal cracks */}
    <path
      d="M22 22 L14 14 M42 42 L50 50 M42 22 L50 14 M22 42 L14 50"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.7"
      className="text-secondary-400"
    />
    {/* Soul flame in center - abstract */}
    <path
      d="M32 28 Q28 32 32 38 Q36 32 32 28 Z"
      fill="currentColor"
      opacity="0.8"
      className="text-secondary-500"
    />
    {/* Inner soul spark */}
    <circle cx="32" cy="33" r="2" fill="currentColor" className="text-secondary-300" />
    {/* Tribal corner marks at cardinal points */}
    <path d="M32 6 L32 4 L34 4" stroke="currentColor" strokeWidth="1.5" className="text-primary-800" />
    <path d="M32 60 L32 62 L30 62" stroke="currentColor" strokeWidth="1.5" className="text-primary-800" />
    <path d="M6 32 L4 32 L4 34" stroke="currentColor" strokeWidth="1.5" className="text-primary-800" />
    <path d="M60 32 L62 32 L62 30" stroke="currentColor" strokeWidth="1.5" className="text-primary-800" />
  </svg>
)

/**
 * Navigation Divider - Tribal Diamond
 */
const NavDivider = () => (
  <span className="nav-divider" aria-hidden="true">
    <svg viewBox="0 0 8 24" fill="currentColor" width="8" height="24">
      <path d="M4 8 L6 12 L4 16 L2 12 Z" opacity="0.6" />
      <circle cx="4" cy="12" r="1" className="text-secondary-500" />
    </svg>
  </span>
)

/**
 * Header Border - Carved Edge
 */
const HeaderBorder = ({ className = '' }) => (
  <svg
    viewBox="0 0 1200 8"
    preserveAspectRatio="none"
    className={`header-border ${className}`}
    aria-hidden="true"
  >
    <path
      d="M0 4 Q50 2, 100 4 T200 4 T300 4 T400 4 T500 4 T600 4 T700 4 T800 4 T900 4 T1000 4 T1100 4 L1200 4"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
    />
    {/* Ritual markings at intervals */}
    <circle cx="200" cy="4" r="1.5" fill="currentColor" className="text-secondary-500" />
    <circle cx="400" cy="4" r="1.5" fill="currentColor" className="text-secondary-500" />
    <circle cx="600" cy="4" r="1.5" fill="currentColor" className="text-secondary-500" />
    <circle cx="800" cy="4" r="1.5" fill="currentColor" className="text-secondary-500" />
    <circle cx="1000" cy="4" r="1.5" fill="currentColor" className="text-secondary-500" />
  </svg>
)

/**
 * Burger Menu Icon
 */
const BurgerIcon = ({ isOpen }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    width="24"
    height="24"
    aria-hidden="true"
  >
    {isOpen ? (
      <>
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="6" y1="18" x2="18" y2="6" />
      </>
    ) : (
      <>
        <line x1="3" y1="6" x2="21" y2="6" />
        <circle cx="12" cy="6" r="1.5" fill="currentColor" opacity="0.6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.6" />
        <line x1="3" y1="18" x2="21" y2="18" />
        <circle cx="12" cy="18" r="1.5" fill="currentColor" opacity="0.6" />
      </>
    )}
  </svg>
)

/**
 * Chevron Down Icon
 */
const ChevronDownIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M6 9 L12 15 L18 9" />
  </svg>
)

/**
 * Navigation Items Configuration
 */
const navItems = [
  { label: 'Accueil', href: '/' },
  { label: 'Avant-propos', href: '/avant-propos' },
  { label: 'Univers', href: '/univers' },
  { label: 'Personnages', href: '/personnages' },
  { label: 'Forum', href: '/forum' },
]

/**
 * User Dropdown Items
 */
const userDropdownItems = [
  { label: 'Mon profil', href: '/profil', icon: 'profile' },
  { label: 'Mes personnages', href: '/mes-personnages', icon: 'characters' },
  { divider: true },
  { label: 'Deconnexion', onClick: () => console.log('Logout'), icon: 'logout', danger: true },
]

/**
 * Header Component
 */
const Header = ({
  user = null,
  onLogin,
  onRegister,
  onLogout,
  className = '',
  ...props
}) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const location = useLocation()

  // Handle scroll for header compression
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const isActiveLink = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <>
      <header
        className={`header-tribal sticky top-0 z-fixed ${isScrolled ? 'scrolled' : ''} ${className}`}
        {...props}
      >
        {/* Main navigation bar */}
        <div className="container mx-auto px-4 h-[70px] flex items-center justify-between relative z-10">
          {/* Logo zone */}
          <Link to="/" className="logo-container">
            <LogoEmblem className="w-12 h-12" />
            <span className="logo-text hidden sm:inline">
              Erosion des Ames
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="nav-tribal hidden lg:flex" aria-label="Navigation principale">
            {navItems.map((item, index) => (
              <span key={item.href} className="contents">
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
                {index < navItems.length - 1 && <NavDivider />}
              </span>
            ))}
          </nav>

          {/* User zone - Desktop */}
          <div className="user-zone hidden lg:flex">
            {user ? (
              <Dropdown
                trigger={
                  <button
                    className="user-dropdown-trigger"
                    aria-expanded={isUserDropdownOpen}
                    aria-haspopup="true"
                    aria-label="Menu utilisateur"
                  >
                    <Avatar
                      src={user.avatar}
                      name={user.name}
                      size="sm"
                      className="user-avatar-header"
                    />
                    <ChevronDownIcon className="user-dropdown-chevron" />
                  </button>
                }
                items={[
                  { label: 'Mon profil', onClick: () => {} },
                  { label: 'Mes personnages', onClick: () => {} },
                  { divider: true },
                  { label: 'Deconnexion', onClick: onLogout, danger: true },
                ]}
                position="bottom-right"
              />
            ) : (
              <>
                <button
                  type="button"
                  className="btn-auth btn-auth-secondary"
                  onClick={onLogin}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  className="btn-auth btn-auth-primary"
                  onClick={onRegister}
                >
                  Inscription
                </button>
              </>
            )}
          </div>

          {/* Mobile burger menu button */}
          <button
            type="button"
            className="burger-btn lg:hidden"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            <BurgerIcon isOpen={isMobileMenuOpen} />
          </button>
        </div>

        {/* Tribal border bottom */}
        <HeaderBorder />
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsMobileMenuOpen(false)
          }
        }}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="mobile-menu-content">
          {/* Mobile menu header */}
          <div className="mobile-menu-header">
            <Link to="/" className="logo-container" onClick={() => setIsMobileMenuOpen(false)}>
              <LogoEmblem className="w-10 h-10" />
              <span className="logo-text text-xl">Erosion des Ames</span>
            </Link>
            <button
              type="button"
              className="mobile-menu-close"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              <BurgerIcon isOpen={true} />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="mobile-nav" aria-label="Navigation mobile">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `mobile-nav-item ${isActive ? 'active' : ''}`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Mobile divider */}
          <div className="mobile-nav-divider" />

          {/* Mobile auth zone */}
          <div className="mobile-auth-zone">
            {user ? (
              <>
                <div className="flex items-center gap-3 mb-4 px-1">
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="md"
                  />
                  <div>
                    <p className="font-button text-skin-base">{user.name}</p>
                    <p className="text-sm text-skin-muted">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/profil"
                  className="mobile-nav-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mon profil
                </Link>
                <Link
                  to="/mes-personnages"
                  className="mobile-nav-item"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mes personnages
                </Link>
                <button
                  type="button"
                  className="btn-auth btn-auth-secondary"
                  onClick={() => {
                    onLogout?.()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Deconnexion
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-auth btn-auth-secondary"
                  onClick={() => {
                    onLogin?.()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  className="btn-auth btn-auth-primary"
                  onClick={() => {
                    onRegister?.()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  Inscription
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
export { Header, LogoEmblem, HeaderBorder, NavDivider }
