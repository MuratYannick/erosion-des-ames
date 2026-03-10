import { useState } from 'react'
import PropTypes from 'prop-types'
import { locationTypes, dangerLevels } from '@/data/locationData'
import { locationIcons } from './locationIconsMap'
import './LocationCard.css'

/**
 * LocationCard - Carte représentant un lieu du monde
 * Design: Carte ancienne/parchemin avec bordure irrégulière et effet de vieillissement
 */
const LocationCard = ({ location, onClick }) => {
  const [isHovered, setIsHovered] = useState(false)

  const typeData = locationTypes[location.type]
  const dangerData = dangerLevels[location.dangerLevel]
  const TypeIcon = locationIcons[location.type]

  // Style custom pour l'image de fond
  const backgroundStyle = location.image
    ? { backgroundImage: `url('${location.image}')` }
    : {}

  // Variables CSS pour les couleurs dynamiques
  const cardStyle = {
    '--location-type-color': typeData.color,
    '--location-danger-color': dangerData.color,
  }

  return (
    <article
      className={`location-card ${isHovered ? 'location-card--hovered' : ''}`}
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      {/* Bordure de carte ancienne */}
      <div className="location-card__border" aria-hidden="true" />

      {/* Image de fond avec overlay */}
      <div
        className="location-card__background"
        style={backgroundStyle}
        role="img"
        aria-label={location.imageAlt || `Image de ${location.name}`}
      >
        {/* Placeholder si pas d'image */}
        {!location.image && (
          <div className="location-card__placeholder">
            <TypeIcon className="location-card__placeholder-icon" />
          </div>
        )}

        {/* Overlay gradiant */}
        <div className="location-card__overlay" />

        {/* Texture de vieillissement */}
        <div className="location-card__texture" aria-hidden="true" />
      </div>

      {/* Badge de type (coin supérieur gauche) */}
      <div className="location-card__type-badge">
        <TypeIcon className="location-card__type-icon" aria-hidden="true" />
        <span className="location-card__type-label">{typeData.label}</span>
      </div>

      {/* Badge de danger (coin supérieur droit) */}
      <div className="location-card__danger-badge">
        <div className="location-card__danger-runes" aria-hidden="true">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`location-card__danger-rune ${
                index < location.dangerLevel ? 'location-card__danger-rune--active' : ''
              }`}
            >
              ◆
            </span>
          ))}
        </div>
        <span className="location-card__danger-label">{dangerData.label}</span>
      </div>

      {/* Coordonnées mystérieuses (révélées au hover) */}
      {location.coordinates && (
        <div className="location-card__coordinates" aria-label={`Coordonnées: ${location.coordinates}`}>
          <svg
            className="location-card__compass-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <path d="M12 3 L12 5 M12 19 L12 21 M3 12 L5 12 M19 12 L21 12" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
            <path d="M12 8 L10 14 L16 12 Z" fill="currentColor" opacity="0.7" />
          </svg>
          <span className="location-card__coordinates-text">{location.coordinates}</span>
        </div>
      )}

      {/* Contenu principal (bas de carte) */}
      <div className="location-card__content">
        {/* Nom du lieu */}
        <h3 className="location-card__name">{location.name}</h3>

        {/* Description courte */}
        <p className="location-card__description">
          {location.shortDescription || location.description}
        </p>

        {/* Indicateur d'exploration au hover */}
        <div className="location-card__explore-hint">
          <svg
            className="location-card__explore-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 2 L12 12 M12 12 L16 8 M12 12 L8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            <path d="M12 16 L12 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          </svg>
          <span>Explorer</span>
        </div>
      </div>

      {/* Marques tribales décoratives dans les coins */}
      <TribalCornerMark position="top-left" />
      <TribalCornerMark position="bottom-right" />

      {/* Particules de cendre au hover */}
      {isHovered && (
        <div className="location-card__particles" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="location-card__particle" />
          ))}
        </div>
      )}

      {/* Effet de lueur ember au hover (selon danger) */}
      <div className="location-card__ember-glow" aria-hidden="true" />
    </article>
  )
}

/**
 * Marque tribale décorative dans les coins
 */
const TribalCornerMark = ({ position }) => {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 scale-x-[-1]',
    'bottom-left': 'bottom-0 left-0 scale-y-[-1]',
    'bottom-right': 'bottom-0 right-0 scale-[-1]'
  }

  return (
    <svg
      className={`location-card__corner-mark absolute ${positionClasses[position]} w-8 h-8 md:w-10 md:h-10 pointer-events-none opacity-30`}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Coin décoratif tribal */}
      <path
        d="M0 0 L15 0 L15 2 L2 2 L2 15 L0 15 Z"
        fill="currentColor"
        className="text-secondary-300"
        opacity="0.6"
      />
      {/* Lignes de détail */}
      <path
        d="M4 4 L11 4 M4 7 L9 7 M4 10 L7 10"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-secondary-400"
        opacity="0.5"
      />
      {/* Point tribal */}
      <circle cx="5" cy="5" r="1" fill="currentColor" className="text-secondary-500" opacity="0.7" />
    </svg>
  )
}

LocationCard.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    dangerLevel: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    shortDescription: PropTypes.string,
    coordinates: PropTypes.string,
    image: PropTypes.string,
    imageAlt: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
}

TribalCornerMark.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']).isRequired,
}

export default LocationCard
