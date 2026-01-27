/**
 * SectionTitle - Titre de section avec ancre et ornements tribaux
 * Réutilisable dans toutes les pages statiques
 */

import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import './SectionTitle.css'

/**
 * Séparateur tribal sous le titre
 */
const TitleDivider = ({ variant = 'default' }) => (
  <div className={`section-title__divider section-title__divider--${variant}`} aria-hidden="true">
    <svg viewBox="0 0 200 12" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="titleDividerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="30%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="70%" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="10" y1="6" x2="190" y2="6" stroke="url(#titleDividerGrad)" strokeWidth="1" />
      <path d="M100 3 L103 6 L100 9 L97 6 Z" fill="currentColor" opacity="0.8" />
    </svg>
  </div>
)

const SectionTitle = forwardRef(({
  children,
  level = 2,
  id,
  icon,
  subtitle,
  alignment = 'left',
  divider = true,
  dividerVariant = 'default',
  className = '',
  ...props
}, ref) => {
  const Tag = `h${level}`

  // Générer un ID à partir du texte si non fourni
  const anchorId = id || (typeof children === 'string'
    ? children.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : undefined)

  return (
    <div
      ref={ref}
      className={`section-title section-title--${alignment} section-title--h${level} ${className}`}
      {...props}
    >
      <Tag id={anchorId} className="section-title__heading">
        {/* Lien d'ancrage */}
        {anchorId && (
          <a href={`#${anchorId}`} className="section-title__anchor" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path
                d="M7.5 2.5 L4 6 L4 10 L7.5 13.5 M8.5 2.5 L12 6 L12 10 L8.5 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </a>
        )}

        {/* Icône optionnelle */}
        {icon && (
          <span className="section-title__icon">{icon}</span>
        )}

        {/* Texte du titre */}
        <span className="section-title__text">{children}</span>
      </Tag>

      {/* Sous-titre */}
      {subtitle && (
        <p className="section-title__subtitle">{subtitle}</p>
      )}

      {/* Séparateur tribal */}
      {divider && <TitleDivider variant={dividerVariant} />}
    </div>
  )
})

SectionTitle.displayName = 'SectionTitle'

SectionTitle.propTypes = {
  /** Contenu du titre */
  children: PropTypes.node.isRequired,
  /** Niveau du heading (2-6) */
  level: PropTypes.oneOf([2, 3, 4, 5, 6]),
  /** ID pour l'ancre (généré auto si non fourni) */
  id: PropTypes.string,
  /** Icône à afficher avant le titre */
  icon: PropTypes.node,
  /** Sous-titre optionnel */
  subtitle: PropTypes.string,
  /** Alignement du titre */
  alignment: PropTypes.oneOf(['left', 'center', 'right']),
  /** Afficher le séparateur tribal */
  divider: PropTypes.bool,
  /** Variante du séparateur */
  dividerVariant: PropTypes.oneOf(['default', 'accent', 'subtle']),
  /** Classes CSS additionnelles */
  className: PropTypes.string
}

export default SectionTitle
