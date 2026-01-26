import { useState } from 'react'
import PropTypes from 'prop-types'
import './FactionCard.css'

/**
 * FactionCard - Carte représentant une faction/tribu
 * Design: Tablette de pierre avec emblème tribal et effet de braises au hover
 */
const FactionCard = ({ faction }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { Emblem } = faction

  // Génère les variables CSS custom pour les couleurs de la faction
  const factionStyle = {
    '--faction-primary': faction.colors.primary,
    '--faction-accent': faction.colors.accent,
    '--faction-glow': faction.colors.glow,
  }

  return (
    <article
      className={`faction-card ${isHovered ? 'faction-card--hovered' : ''}`}
      style={factionStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-faction-id={faction.id}
    >
      {/* Bordure de braises animée */}
      <div className="faction-card__ember-border" aria-hidden="true" />

      {/* Texture de pierre */}
      <div className="faction-card__stone-texture" aria-hidden="true" />

      {/* Contenu principal */}
      <div className="faction-card__content">
        {/* Emblème de la faction */}
        <div className="faction-card__emblem-container">
          <div className="faction-card__emblem-glow" aria-hidden="true" />
          <Emblem className="faction-card__emblem" aria-label={`Emblème ${faction.name}`} />
        </div>

        {/* Nom et tagline */}
        <header className="faction-card__header">
          <h3 className="faction-card__name">{faction.name}</h3>
          <p className="faction-card__tagline">{faction.tagline}</p>
        </header>

        {/* Philosophie (citation gravée) */}
        <blockquote className="faction-card__philosophy">
          {faction.philosophy}
        </blockquote>

        {/* Description */}
        <p className="faction-card__description">{faction.description}</p>

        {/* Valeurs (runes tribales) */}
        <footer className="faction-card__values">
          <div className="faction-card__values-label">Valeurs</div>
          <ul className="faction-card__values-list">
            {faction.values.map((value, index) => (
              <li key={index} className="faction-card__value-item">
                <span className="faction-card__value-rune" aria-hidden="true">
                  ◆
                </span>
                {value}
              </li>
            ))}
          </ul>
        </footer>
      </div>

      {/* Particules de cendre animées au hover */}
      {isHovered && (
        <div className="faction-card__ash-particles" aria-hidden="true">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="faction-card__ash-particle" />
          ))}
        </div>
      )}
    </article>
  )
}

FactionCard.propTypes = {
  faction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tagline: PropTypes.string.isRequired,
    philosophy: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.string).isRequired,
    colors: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      accent: PropTypes.string.isRequired,
      glow: PropTypes.string.isRequired,
    }).isRequired,
    Emblem: PropTypes.elementType.isRequired,
  }).isRequired,
}

export default FactionCard
