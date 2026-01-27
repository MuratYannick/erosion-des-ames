/**
 * PageHeader - En-tête de page réutilisable
 * Titre principal, sous-titre, description et image de fond optionnelle
 */

import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import Breadcrumb from './Breadcrumb'
import './PageHeader.css'

/**
 * Ornement décoratif pour le header
 */
const HeaderOrnament = ({ position = 'bottom' }) => (
  <div className={`page-header__ornament page-header__ornament--${position}`} aria-hidden="true">
    <svg viewBox="0 0 400 30" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="pageHeaderOrnament" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7a6454" stopOpacity="0" />
          <stop offset="20%" stopColor="#7a6454" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#c9a227" stopOpacity="1" />
          <stop offset="80%" stopColor="#7a6454" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#7a6454" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Ligne principale */}
      <line x1="40" y1="15" x2="360" y2="15" stroke="url(#pageHeaderOrnament)" strokeWidth="1" />
      {/* Diamant central */}
      <path d="M200 8 L208 15 L200 22 L192 15 Z" fill="#e67315" opacity="0.8" />
      {/* Points décoratifs */}
      <circle cx="100" cy="15" r="2" fill="#7a6454" opacity="0.5" />
      <circle cx="300" cy="15" r="2" fill="#7a6454" opacity="0.5" />
      {/* Motifs latéraux */}
      <path d="M140 15 L150 10 L150 20 Z" fill="#7a6454" opacity="0.4" />
      <path d="M260 15 L250 10 L250 20 Z" fill="#7a6454" opacity="0.4" />
    </svg>
  </div>
)

const PageHeader = forwardRef(({
  title,
  subtitle,
  description,
  backgroundImage,
  breadcrumbs,
  alignment = 'center',
  size = 'default',
  overlay = true,
  ornament = true,
  className = '',
  children,
  ...props
}, ref) => {
  const hasBackground = !!backgroundImage

  return (
    <header
      ref={ref}
      className={`
        page-header
        page-header--${size}
        page-header--${alignment}
        ${hasBackground ? 'page-header--with-bg' : ''}
        ${className}
      `}
      style={hasBackground ? { '--bg-image': `url(${backgroundImage})` } : undefined}
      {...props}
    >
      {/* Overlay gradient si image de fond */}
      {hasBackground && overlay && <div className="page-header__overlay" />}

      {/* Contenu */}
      <div className="page-header__content">
        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} className="page-header__breadcrumb" />
        )}

        {/* Titre principal */}
        <h1 className="page-header__title">{title}</h1>

        {/* Sous-titre */}
        {subtitle && (
          <p className="page-header__subtitle">{subtitle}</p>
        )}

        {/* Description */}
        {description && (
          <p className="page-header__description">{description}</p>
        )}

        {/* Contenu additionnel (CTA, etc.) */}
        {children && (
          <div className="page-header__extra">
            {children}
          </div>
        )}
      </div>

      {/* Ornement bas */}
      {ornament && <HeaderOrnament position="bottom" />}
    </header>
  )
})

PageHeader.displayName = 'PageHeader'

PageHeader.propTypes = {
  /** Titre principal de la page (h1) */
  title: PropTypes.string.isRequired,
  /** Sous-titre affiché sous le titre */
  subtitle: PropTypes.string,
  /** Description plus longue */
  description: PropTypes.string,
  /** URL de l'image de fond */
  backgroundImage: PropTypes.string,
  /** Items du fil d'Ariane */
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    href: PropTypes.string
  })),
  /** Alignement du contenu */
  alignment: PropTypes.oneOf(['left', 'center', 'right']),
  /** Taille du header */
  size: PropTypes.oneOf(['compact', 'default', 'large', 'hero']),
  /** Afficher l'overlay sur l'image de fond */
  overlay: PropTypes.bool,
  /** Afficher l'ornement décoratif */
  ornament: PropTypes.bool,
  /** Classes CSS additionnelles */
  className: PropTypes.string,
  /** Contenu additionnel (boutons CTA, etc.) */
  children: PropTypes.node
}

export default PageHeader
