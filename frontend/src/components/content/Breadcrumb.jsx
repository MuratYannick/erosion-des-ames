/**
 * Breadcrumb - Fil d'Ariane tribal
 * Navigation hiérarchique avec séparateurs tribaux
 */

import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './Breadcrumb.css'

/**
 * Séparateur tribal entre les éléments
 */
const BreadcrumbSeparator = () => (
  <span className="breadcrumb__separator" aria-hidden="true">
    <svg viewBox="0 0 12 16" width="12" height="16">
      <path
        d="M4 4 L8 8 L4 12"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  </span>
)

/**
 * Icône maison pour l'accueil
 */
const HomeIcon = () => (
  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="breadcrumb__home-icon">
    <path
      d="M8 2 L2 7 L2 14 L6 14 L6 10 L10 10 L10 14 L14 14 L14 7 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
      strokeLinejoin="round"
    />
  </svg>
)

const Breadcrumb = forwardRef(({
  items = [],
  showHome = true,
  homeLabel = 'Accueil',
  homeHref = '/',
  className = '',
  ...props
}, ref) => {
  // Construire la liste complète avec l'accueil
  const allItems = showHome
    ? [{ label: homeLabel, href: homeHref, isHome: true }, ...items]
    : items

  if (allItems.length === 0) return null

  return (
    <nav
      ref={ref}
      className={`breadcrumb ${className}`}
      aria-label="Fil d'Ariane"
      {...props}
    >
      <ol className="breadcrumb__list">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1
          const isClickable = !isLast && item.href

          return (
            <li key={index} className="breadcrumb__item">
              {isClickable ? (
                <Link to={item.href} className="breadcrumb__link">
                  {item.isHome && <HomeIcon />}
                  <span className="breadcrumb__label">{item.label}</span>
                </Link>
              ) : (
                <span
                  className="breadcrumb__current"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.isHome && <HomeIcon />}
                  <span className="breadcrumb__label">{item.label}</span>
                </span>
              )}

              {!isLast && <BreadcrumbSeparator />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
})

Breadcrumb.displayName = 'Breadcrumb'

Breadcrumb.propTypes = {
  /** Liste des éléments du fil d'Ariane */
  items: PropTypes.arrayOf(PropTypes.shape({
    /** Label affiché */
    label: PropTypes.string.isRequired,
    /** Lien (optionnel pour le dernier élément) */
    href: PropTypes.string
  })),
  /** Afficher le lien vers l'accueil */
  showHome: PropTypes.bool,
  /** Label du lien accueil */
  homeLabel: PropTypes.string,
  /** URL de l'accueil */
  homeHref: PropTypes.string,
  /** Classes CSS additionnelles */
  className: PropTypes.string
}

export default Breadcrumb
