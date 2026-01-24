import {
  forwardRef,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { NavLink } from 'react-router-dom'
import { Tooltip } from '@/components'
import './Sidebar.css'

// ============================================
// CONTEXT
// ============================================

const SidebarContext = createContext({
  isCollapsed: false,
  isMobile: false,
  isOpen: false,
  toggleCollapse: () => {},
  toggleOpen: () => {},
})

const useSidebar = () => useContext(SidebarContext)

// ============================================
// SVG COMPONENTS
// ============================================

/**
 * Vertical Carved Border SVG
 */
const SidebarBorder = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 800"
    preserveAspectRatio="xMinYMid slice"
    className={`sidebar-border ${className}`}
    aria-hidden="true"
  >
    {/* Vertical carved line */}
    <line
      x1="8"
      y1="0"
      x2="8"
      y2="800"
      stroke="currentColor"
      strokeOpacity="0.2"
      strokeWidth="2"
    />
    {/* Ritual waypoint markers */}
    {[80, 160, 240, 320, 400, 480, 560, 640, 720].map((y) => (
      <circle
        key={y}
        cx="8"
        cy={y}
        r="4"
        stroke="currentColor"
        strokeOpacity="0.3"
        fill="none"
      />
    ))}
    {/* Direction triangles */}
    {[40, 200, 360, 520, 680].map((y) => (
      <path
        key={`tri-${y}`}
        d={`M12 ${y} L18 ${y + 4} L12 ${y + 8} Z`}
        fill="currentColor"
        fillOpacity="0.15"
      />
    ))}
    {/* Diamond accents */}
    {[120, 280, 440, 600, 760].map((y) => (
      <path
        key={`dia-${y}`}
        d={`M8 ${y} L12 ${y + 4} L8 ${y + 8} L4 ${y + 4} Z`}
        stroke="currentColor"
        strokeOpacity="0.4"
        fill="none"
      />
    ))}
  </svg>
)

/**
 * Section Ritual Mark (small tribal divider)
 */
const SectionRitualMark = ({ className = '' }) => (
  <svg
    viewBox="0 0 32 16"
    width="32"
    height="16"
    className={className}
    aria-hidden="true"
  >
    <line x1="0" y1="2" x2="32" y2="2" stroke="currentColor" strokeOpacity="0.2" />
    <line x1="4" y1="7" x2="28" y2="7" stroke="currentColor" strokeOpacity="0.25" />
    <line x1="8" y1="12" x2="24" y2="12" stroke="currentColor" strokeOpacity="0.3" />
    <circle cx="16" cy="8" r="2" fill="currentColor" fillOpacity="0.2" />
  </svg>
)

/**
 * Collapse Totem Button
 */
const CollapseTotem = ({ collapsed, onClick, className = '' }) => (
  <button
    type="button"
    className={`collapse-totem ${className}`}
    onClick={onClick}
    aria-label={collapsed ? 'Etendre la barre laterale' : 'Reduire la barre laterale'}
  >
    <svg
      viewBox="0 0 40 40"
      width="40"
      height="40"
      className="collapse-totem-icon"
      aria-hidden="true"
    >
      {/* Diamond frame */}
      <path
        d="M20 4 L36 20 L20 36 L4 20 Z"
        stroke="currentColor"
        strokeOpacity="0.4"
        fill="none"
        strokeWidth="1.5"
      />
      {/* Triple chevrons pointing left */}
      <path
        d="M26 14 L20 20 L26 26"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 14 L14 20 L20 26"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
)

/**
 * Tribal Divider for sidebar
 */
const SidebarDivider = ({ className = '' }) => (
  <svg
    viewBox="0 0 200 24"
    preserveAspectRatio="none"
    className={`sidebar-divider w-full ${className}`}
    aria-hidden="true"
  >
    <line
      x1="0"
      y1="12"
      x2="200"
      y2="12"
      stroke="currentColor"
      strokeWidth="1"
      strokeDasharray="4 2"
      opacity="0.4"
    />
    <path
      d="M100 8 L104 12 L100 16 L96 12 Z"
      fill="currentColor"
      opacity="0.6"
    />
    <circle cx="100" cy="12" r="1.5" fill="currentColor" opacity="0.3" />
  </svg>
)

/**
 * Chevron icon for groups
 */
const ChevronIcon = ({ className = '' }) => (
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
 * Close icon for mobile
 */
const CloseIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="6" y1="18" x2="18" y2="6" />
  </svg>
)

// ============================================
// SUB-COMPONENTS
// ============================================

/**
 * Sidebar Header
 */
const SidebarHeader = forwardRef(({ children, className = '', ...props }, ref) => {
  const { isCollapsed } = useSidebar()

  return (
    <div ref={ref} className={`sidebar-header ${className}`} {...props}>
      <div className="sidebar-header-content">
        {children}
      </div>
    </div>
  )
})

SidebarHeader.displayName = 'SidebarHeader'

/**
 * Sidebar Section
 */
const SidebarSection = forwardRef(({ title, children, className = '', ...props }, ref) => {
  const { isCollapsed } = useSidebar()

  return (
    <div ref={ref} className={`sidebar-section ${className}`} {...props}>
      {title && (
        <div className="sidebar-section-title">
          <SectionRitualMark className="text-primary-400" />
          <span className="sidebar-text">{title}</span>
        </div>
      )}
      {children}
    </div>
  )
})

SidebarSection.displayName = 'SidebarSection'

/**
 * Sidebar Navigation Container
 */
const SidebarNav = forwardRef(({ children, className = '', ...props }, ref) => (
  <nav ref={ref} className={`sidebar-nav ${className}`} aria-label="Navigation" {...props}>
    {children}
  </nav>
))

SidebarNav.displayName = 'SidebarNav'

/**
 * Sidebar Navigation Item
 */
const SidebarNavItem = forwardRef(({
  children,
  icon,
  badge,
  active,
  disabled,
  href,
  onClick,
  className = '',
  ...props
}, ref) => {
  const { isCollapsed, isMobile } = useSidebar()

  const itemClasses = [
    'sidebar-nav-item',
    active && 'sidebar-nav-item--active',
    disabled && 'sidebar-nav-item--disabled',
    className,
  ].filter(Boolean).join(' ')

  const content = (
    <>
      {icon && <span className="sidebar-nav-icon">{icon}</span>}
      <span className="sidebar-text">{children}</span>
      {badge && <span className="sidebar-nav-badge">{badge}</span>}
    </>
  )

  // Wrap in tooltip when collapsed (desktop only)
  const renderItem = (itemContent) => {
    if (isCollapsed && !isMobile && children) {
      return (
        <Tooltip content={children} position="right" delay={100}>
          {itemContent}
        </Tooltip>
      )
    }
    return itemContent
  }

  if (href && !disabled) {
    return renderItem(
      <NavLink
        ref={ref}
        to={href}
        className={({ isActive }) =>
          [itemClasses, isActive && 'sidebar-nav-item--active'].filter(Boolean).join(' ')
        }
        {...props}
      >
        {content}
      </NavLink>
    )
  }

  return renderItem(
    <button
      ref={ref}
      type="button"
      className={itemClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      {...props}
    >
      {content}
    </button>
  )
})

SidebarNavItem.displayName = 'SidebarNavItem'

/**
 * Sidebar Navigation Group (Collapsible)
 */
const SidebarNavGroup = forwardRef(({
  title,
  children,
  defaultExpanded = true,
  className = '',
  ...props
}, ref) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div
      ref={ref}
      className={`sidebar-nav-group ${isExpanded ? 'sidebar-nav-group--expanded' : ''} ${className}`}
      {...props}
    >
      <button
        type="button"
        className="sidebar-nav-group-header"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span className="sidebar-nav-group-title">{title}</span>
        <ChevronIcon className="sidebar-nav-group-chevron" />
      </button>
      <div className="sidebar-nav-group-content">
        <SidebarNav>{children}</SidebarNav>
      </div>
    </div>
  )
})

SidebarNavGroup.displayName = 'SidebarNavGroup'

/**
 * Sidebar Stats (Dashboard variant)
 */
const SidebarStats = forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`sidebar-stats ${className}`} {...props}>
    {children}
  </div>
))

SidebarStats.displayName = 'SidebarStats'

/**
 * Sidebar Stat Item
 */
const SidebarStatItem = forwardRef(({ icon, value, label, className = '', ...props }, ref) => (
  <div ref={ref} className={`sidebar-stat-item ${className}`} {...props}>
    {icon && <span className="sidebar-stat-icon">{icon}</span>}
    <span className="sidebar-stat-value">{value}</span>
    <span className="sidebar-stat-label">{label}</span>
  </div>
))

SidebarStatItem.displayName = 'SidebarStatItem'

/**
 * Sidebar User Info (Dashboard variant)
 */
const SidebarUserInfo = forwardRef(({ avatar, name, role, children, className = '', ...props }, ref) => (
  <div ref={ref} className={`sidebar-user-info ${className}`} {...props}>
    {avatar}
    <div className="sidebar-user-details">
      {name && <div className="sidebar-user-name">{name}</div>}
      {role && <div className="sidebar-user-role">{role}</div>}
    </div>
    {children}
  </div>
))

SidebarUserInfo.displayName = 'SidebarUserInfo'

/**
 * Sidebar Filters (Forum variant)
 */
const SidebarFilters = forwardRef(({ children, className = '', ...props }, ref) => (
  <div ref={ref} className={`sidebar-filters ${className}`} {...props}>
    {children}
  </div>
))

SidebarFilters.displayName = 'SidebarFilters'

/**
 * Sidebar Filter Button
 */
const SidebarFilterButton = forwardRef(({
  children,
  active,
  onClick,
  className = '',
  ...props
}, ref) => (
  <button
    ref={ref}
    type="button"
    className={`sidebar-filter-btn ${active ? 'sidebar-filter-btn--active' : ''} ${className}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
))

SidebarFilterButton.displayName = 'SidebarFilterButton'

/**
 * Sidebar Skeleton (Loading state)
 */
const SidebarSkeleton = ({ count = 3, className = '' }) => (
  <div className={`sidebar-skeleton ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="sidebar-skeleton-item" />
    ))}
  </div>
)

/**
 * Sidebar Empty State
 */
const SidebarEmpty = ({ children, className = '' }) => (
  <div className={`sidebar-empty ${className}`}>
    <SectionRitualMark className="text-primary-300 opacity-50" />
    <p className="sidebar-empty-text">
      {children || 'Aucune route tracee...'}
    </p>
  </div>
)

// ============================================
// MAIN SIDEBAR COMPONENT
// ============================================

/**
 * Sidebar Component
 *
 * A tribal-themed navigation sidebar with multiple variants.
 *
 * @param {string} variant - 'navigation' | 'dashboard' | 'forum'
 * @param {string} position - 'left' | 'right'
 * @param {boolean} collapsible - Enable collapse functionality
 * @param {boolean} defaultCollapsed - Initial collapsed state
 * @param {boolean} mobile - Force mobile mode (overlay)
 * @param {boolean} open - Control open state (mobile mode)
 * @param {Function} onToggle - Callback when collapsed state changes
 * @param {Function} onOpenChange - Callback when open state changes (mobile)
 * @param {boolean} showBorder - Show vertical tribal border
 * @param {boolean} showCollapseButton - Show collapse totem button
 * @param {string} storageKey - localStorage key for persisting state
 */
const Sidebar = forwardRef(({
  children,
  variant = 'navigation',
  position = 'left',
  collapsible = true,
  defaultCollapsed = false,
  mobile = false,
  open = false,
  onToggle,
  onOpenChange,
  showBorder = true,
  showCollapseButton = true,
  storageKey = 'sidebar-collapsed',
  className = '',
  ...props
}, ref) => {
  // Initialize collapsed state from localStorage or default
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined' && storageKey) {
      const saved = localStorage.getItem(storageKey)
      if (saved !== null) {
        return JSON.parse(saved)
      }
    }
    return defaultCollapsed
  })

  const [isOpen, setIsOpen] = useState(open)

  // Sync with controlled open prop
  useEffect(() => {
    setIsOpen(open)
  }, [open])

  // Persist collapsed state
  useEffect(() => {
    if (typeof window !== 'undefined' && storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(isCollapsed))
    }
  }, [isCollapsed, storageKey])

  // Handle escape key for mobile
  useEffect(() => {
    if (!mobile) return

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [mobile, isOpen])

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobile, isOpen])

  const toggleCollapse = useCallback(() => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    onToggle?.(newState)
  }, [isCollapsed, onToggle])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    onOpenChange?.(false)
  }, [onOpenChange])

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    onOpenChange?.(true)
  }, [onOpenChange])

  const contextValue = useMemo(() => ({
    isCollapsed: mobile ? false : isCollapsed,
    isMobile: mobile,
    isOpen,
    toggleCollapse,
    toggleOpen: isOpen ? handleClose : handleOpen,
  }), [isCollapsed, mobile, isOpen, toggleCollapse, handleClose, handleOpen])

  const sidebarClasses = [
    'sidebar',
    `sidebar--${variant}`,
    position === 'right' && 'sidebar--right',
    !mobile && isCollapsed && 'sidebar--collapsed',
    mobile && 'sidebar--mobile',
    mobile && isOpen && 'sidebar--open',
    className,
  ].filter(Boolean).join(' ')

  const sidebarContent = (
    <aside
      ref={ref}
      className={sidebarClasses}
      role="navigation"
      aria-label="Barre laterale"
      {...props}
    >
      {/* Vertical tribal border */}
      {showBorder && <SidebarBorder />}

      {/* Mobile close button */}
      {mobile && (
        <button
          type="button"
          className="sidebar-close-btn"
          onClick={handleClose}
          aria-label="Fermer le menu"
        >
          <CloseIcon />
        </button>
      )}

      {/* Main content */}
      <div className="sidebar-content">
        {children}

        {/* Collapse totem (desktop only) */}
        {!mobile && collapsible && showCollapseButton && (
          <>
            <SidebarDivider className="mt-auto" />
            <CollapseTotem
              collapsed={isCollapsed}
              onClick={toggleCollapse}
            />
          </>
        )}
      </div>
    </aside>
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      {/* Mobile backdrop */}
      {mobile && (
        <div
          className={`sidebar-backdrop ${isOpen ? 'sidebar-backdrop--visible' : ''}`}
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
      {sidebarContent}
    </SidebarContext.Provider>
  )
})

Sidebar.displayName = 'Sidebar'

// ============================================
// EXPORTS
// ============================================

export default Sidebar
export {
  Sidebar,
  SidebarHeader,
  SidebarSection,
  SidebarNav,
  SidebarNavItem,
  SidebarNavGroup,
  SidebarStats,
  SidebarStatItem,
  SidebarUserInfo,
  SidebarFilters,
  SidebarFilterButton,
  SidebarDivider,
  SidebarSkeleton,
  SidebarEmpty,
  SidebarBorder,
  SectionRitualMark,
  CollapseTotem,
  useSidebar,
}
