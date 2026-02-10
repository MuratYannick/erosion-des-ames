import { useState, useEffect, useCallback, useMemo } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import './AdminLayout.css'

// ============================================
// CONSTANTS
// ============================================

const SIDEBAR_WIDTH = 264
const ADMIN_ROLES = ['ADMIN', 'MODERATOR']

// ============================================
// INLINE SVG ICONS
// ============================================

const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <circle cx="9" cy="7" r="3" />
    <path d="M3 21v-1a6 6 0 0 1 12 0v1" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeOpacity="0.7" />
    <path d="M21 21v-1a4 4 0 0 0-3-3.85" strokeOpacity="0.7" />
  </svg>
)

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" strokeOpacity="0.8" />
  </svg>
)

const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="9" y1="10" x2="15" y2="10" strokeOpacity="0.7" />
    <line x1="9" y1="14" x2="13" y2="14" strokeOpacity="0.5" />
  </svg>
)

const IconGavel = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <path d="M14 13l-8.5 8.5a2.12 2.12 0 0 1-3-3L11 10" />
    <path d="M16 16l6-6" />
    <path d="M8 8l6-6" />
    <path d="M20 9l-7.5-7.5" />
    <path d="M3.5 14.5l7.5 7.5" strokeOpacity="0.5" />
  </svg>
)

const IconScroll = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" strokeOpacity="0.8" />
    <line x1="9" y1="17" x2="12" y2="17" strokeOpacity="0.6" />
  </svg>
)

const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
)

const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
)

const IconDiamond = () => (
  <svg viewBox="0 0 12 12" fill="currentColor" width="8" height="8" aria-hidden="true">
    <path d="M6 1L11 6L6 11L1 6Z" />
  </svg>
)

// ============================================
// HEADER SIGIL — Crossed swords with rune ring
// ============================================

const AdminSigil = () => (
  <svg
    viewBox="0 0 48 48"
    width="40"
    height="40"
    className="admin-sigil"
    aria-hidden="true"
  >
    {/* Outer rune ring */}
    <circle
      cx="24"
      cy="24"
      r="21"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.25"
      strokeWidth="1"
      strokeDasharray="3 4"
    />
    {/* Inner rune ring */}
    <circle
      cx="24"
      cy="24"
      r="16"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.18"
      strokeWidth="1"
    />
    {/* Diamond center mark */}
    <path
      d="M24 20L27 24L24 28L21 24Z"
      fill="currentColor"
      fillOpacity="0.5"
    />
    {/* Sword left (diagonal ↗) */}
    <g stroke="currentColor" strokeLinecap="round">
      {/* Blade */}
      <line x1="12" y1="36" x2="30" y2="14" strokeWidth="2.5" />
      {/* Guard */}
      <line x1="17" y1="30" x2="22" y2="34" strokeWidth="1.75" strokeOpacity="0.8" />
      {/* Pommel */}
      <circle cx="11" cy="37" r="2" fill="currentColor" stroke="none" fillOpacity="0.7" />
    </g>
    {/* Sword right (diagonal ↖) */}
    <g stroke="currentColor" strokeLinecap="round">
      {/* Blade */}
      <line x1="36" y1="36" x2="18" y2="14" strokeWidth="2.5" />
      {/* Guard */}
      <line x1="31" y1="30" x2="26" y2="34" strokeWidth="1.75" strokeOpacity="0.8" />
      {/* Pommel */}
      <circle cx="37" cy="37" r="2" fill="currentColor" stroke="none" fillOpacity="0.7" />
    </g>
    {/* Corner rune ticks */}
    {[0, 90, 180, 270].map((angle) => {
      const rad = (angle * Math.PI) / 180
      const cx = 24 + 21 * Math.cos(rad - Math.PI / 2)
      const cy = 24 + 21 * Math.sin(rad - Math.PI / 2)
      return (
        <circle
          key={angle}
          cx={cx}
          cy={cy}
          r="1.5"
          fill="currentColor"
          fillOpacity="0.5"
        />
      )
    })}
  </svg>
)

// ============================================
// RUNE BORDER SVG (right edge of sidebar)
// ============================================

const AdminSidebarRuneBorder = () => (
  <svg
    viewBox="0 0 20 900"
    preserveAspectRatio="xMidYMid slice"
    className="admin-sidebar-rune-border"
    aria-hidden="true"
  >
    {/* Main carved line */}
    <line
      x1="6"
      y1="0"
      x2="6"
      y2="900"
      stroke="currentColor"
      strokeOpacity="0.3"
      strokeWidth="1.5"
    />
    {/* Circuit ticks */}
    {[60, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840].map((y) => (
      <line
        key={`tick-${y}`}
        x1="6"
        y1={y}
        x2="14"
        y2={y}
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
    ))}
    {/* Diamond marks at intervals */}
    {[150, 300, 450, 600, 750].map((y) => (
      <path
        key={`dia-${y}`}
        d={`M6 ${y - 5} L11 ${y} L6 ${y + 5} L1 ${y} Z`}
        stroke="currentColor"
        strokeOpacity="0.45"
        fill="none"
        strokeWidth="1"
      />
    ))}
    {/* Subtle circuit branches */}
    {[90, 210, 330, 450, 570, 690, 810].map((y) => (
      <path
        key={`branch-${y}`}
        d={`M6 ${y} L14 ${y - 6} L14 ${y + 6} L6 ${y}`}
        stroke="currentColor"
        strokeOpacity="0.15"
        fill="none"
        strokeWidth="1"
      />
    ))}
  </svg>
)

// ============================================
// TRIBAL DIVIDER (dark variant)
// ============================================

const AdminDivider = ({ className = '' }) => (
  <svg
    viewBox="0 0 220 20"
    preserveAspectRatio="none"
    className={`admin-divider ${className}`}
    aria-hidden="true"
    height="20"
  >
    <line
      x1="0"
      y1="10"
      x2="220"
      y2="10"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="5 3"
      opacity="0.3"
    />
    {/* Center diamond */}
    <path
      d="M110 6 L114 10 L110 14 L106 10 Z"
      fill="currentColor"
      opacity="0.5"
    />
    {/* Flanking marks */}
    <path d="M90 10 L93 8 L93 12 Z" fill="currentColor" opacity="0.25" />
    <path d="M130 10 L127 8 L127 12 Z" fill="currentColor" opacity="0.25" />
  </svg>
)

// ============================================
// BADGE COMPONENTS
// ============================================

const AdminBadge = ({ count, variant = 'standard' }) => {
  if (!count || count <= 0) return null
  return (
    <span
      className={`admin-badge admin-badge--${variant}`}
      aria-label={`${count} en attente`}
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}

// ============================================
// ADMIN SIDEBAR
// ============================================

const AdminSidebar = ({ isOpen, onClose, badgeCounts = {} }) => {
  const { user } = useAuth()
  const location = useLocation()

  // Close on route change (mobile)
  useEffect(() => {
    onClose()
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  const navItems = useMemo(() => [
    {
      to: '/admin',
      end: true,
      label: 'Tableau de bord',
      icon: <IconGrid />,
    },
    {
      to: '/admin/utilisateurs',
      label: 'Utilisateurs',
      icon: <IconUsers />,
    },
    {
      to: '/admin/personnages',
      label: 'Personnages',
      icon: <IconShield />,
      badge: badgeCounts.pendingCharacters,
      badgeVariant: 'standard',
    },
    {
      to: '/admin/forum',
      label: 'Forum',
      icon: <IconChat />,
    },
    {
      to: '/admin/moderation',
      label: 'Modération',
      icon: <IconGavel />,
      badge: badgeCounts.pendingReports,
      badgeVariant: 'urgent',
    },
    {
      to: '/admin/journal',
      label: 'Journal',
      icon: <IconScroll />,
    },
  ], [badgeCounts.pendingCharacters, badgeCounts.pendingReports])

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`admin-backdrop ${isOpen ? 'admin-backdrop--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={`admin-sidebar ${isOpen ? 'admin-sidebar--open' : ''}`}
        role="navigation"
        aria-label="Navigation administration"
      >
        {/* Rune border on right edge */}
        <AdminSidebarRuneBorder />

        {/* Scrollable content */}
        <div className="admin-sidebar-inner">

          {/* Mobile close */}
          <button
            type="button"
            className="admin-sidebar-close md:hidden"
            onClick={onClose}
            aria-label="Fermer le menu"
          >
            <IconClose />
          </button>

          {/* HEADER */}
          <div className="admin-sidebar-header">
            <div className="admin-sidebar-sigil-wrap">
              <AdminSigil />
            </div>
            <div className="admin-sidebar-header-text">
              <span className="admin-sidebar-title">COMMANDEMENT</span>
              <span className="admin-sidebar-subtitle">Erosion des Ames</span>
            </div>
          </div>

          {/* Divider */}
          <AdminDivider className="text-secondary-700 mb-4" />

          {/* NAVIGATION */}
          <nav aria-label="Menu administration">
            <ul className="admin-nav-list" role="list">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`
                    }
                  >
                    {/* Active left bar */}
                    <span className="admin-nav-bar" aria-hidden="true" />
                    {/* Icon */}
                    <span className="admin-nav-icon">{item.icon}</span>
                    {/* Label */}
                    <span className="admin-nav-label">{item.label}</span>
                    {/* Badge */}
                    {item.badge > 0 && (
                      <AdminBadge count={item.badge} variant={item.badgeVariant} />
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom divider */}
          <AdminDivider className="text-secondary-800 mt-4 mb-3" />

          {/* User role chip */}
          {user && (
            <div className="admin-sidebar-user">
              <span className="admin-sidebar-user-name">{user.username || user.email}</span>
              <span className="admin-sidebar-user-role">{user.role}</span>
            </div>
          )}

          {/* Return to site */}
          <Link to="/" className="admin-return-link">
            <IconArrowLeft />
            <span>Retour au site</span>
          </Link>

        </div>
      </aside>
    </>
  )
}

// ============================================
// BREADCRUMB BUILDER
// ============================================

const SEGMENT_LABELS = {
  admin: 'Administration',
  utilisateurs: 'Utilisateurs',
  personnages: 'Personnages',
  forum: 'Forum',
  moderation: 'Modération',
  journal: 'Journal',
  nouveau: 'Nouveau',
  modifier: 'Modifier',
  detail: 'Détail',
}

const buildBreadcrumb = (pathname) => {
  const segments = pathname.split('/').filter(Boolean)
  const crumbs = []
  let accumulated = ''

  for (const seg of segments) {
    accumulated += `/${seg}`
    crumbs.push({
      path: accumulated,
      label: SEGMENT_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1),
      isLast: false,
    })
  }

  if (crumbs.length > 0) {
    crumbs[crumbs.length - 1].isLast = true
  }

  return crumbs
}

// ============================================
// TOP BAR
// ============================================

const AdminTopBar = ({ onMenuClick, isMobileOpen }) => {
  const location = useLocation()
  const crumbs = useMemo(() => buildBreadcrumb(location.pathname), [location.pathname])
  const currentSection = crumbs[crumbs.length - 1]?.label ?? 'Administration'

  return (
    <header className="admin-topbar">
      {/* Mobile burger */}
      <button
        type="button"
        className="admin-topbar-burger md:hidden"
        onClick={onMenuClick}
        aria-label={isMobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? <IconClose /> : <IconMenu />}
      </button>

      {/* Breadcrumb */}
      <nav className="admin-breadcrumb" aria-label="Fil d'Ariane">
        <ol className="admin-breadcrumb-list">
          {crumbs.map((crumb, index) => (
            <li key={crumb.path} className="admin-breadcrumb-item">
              {index > 0 && (
                <span className="admin-breadcrumb-sep" aria-hidden="true">
                  <IconDiamond />
                </span>
              )}
              {crumb.isLast ? (
                <span className="admin-breadcrumb-current" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.path} className="admin-breadcrumb-link">
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Section title — desktop only */}
      <div className="admin-topbar-section hidden md:block">
        <h1 className="admin-topbar-section-title">{currentSection}</h1>
      </div>
    </header>
  )
}

// ============================================
// ADMIN LAYOUT INNER (rendered inside ProtectedRoute)
// ============================================

const AdminLayoutInner = ({ badgeCounts = {} }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const openSidebar = useCallback(() => setSidebarOpen(true), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  // Lock body scroll on mobile when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className="admin-layout">
      {/* Fixed sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        badgeCounts={badgeCounts}
      />

      {/* Main column */}
      <div className="admin-main">
        {/* Sticky top bar */}
        <AdminTopBar
          onMenuClick={openSidebar}
          isMobileOpen={sidebarOpen}
        />

        {/* Page content */}
        <main className="admin-content" id="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ============================================
// ADMIN LAYOUT (public export — wraps ProtectedRoute)
// ============================================

/**
 * AdminLayout
 *
 * War room command center layout for Phase 8 administration.
 * Wraps all /admin routes with ProtectedRoute (ADMIN + MODERATOR).
 *
 * @param {Object} props
 * @param {Object} props.badgeCounts - { pendingReports: number, pendingCharacters: number }
 */
const AdminLayout = ({ badgeCounts = {} }) => {
  return (
    <ProtectedRoute roles={ADMIN_ROLES}>
      <AdminLayoutInner badgeCounts={badgeCounts} />
    </ProtectedRoute>
  )
}

export default AdminLayout
export { AdminLayout }
