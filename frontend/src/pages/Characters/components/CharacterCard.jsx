/**
 * CharacterCard - Carte "Soul Shard" d'un personnage prédéfini
 * Concept: Fragment cristallin contenant une âme légendaire
 */

import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  SoulShardBorder,
  DifficultyRunes,
  FactionGlow,
  RaceSymbol,
  ClassSymbol,
  AshParticles
} from './SoulShardElements'
import { getRaceById, getClassById, getFactionById } from '../data/presetCharacters'
import './CharacterCard.css'

const CharacterCard = ({
  character,
  onClick,
  animationDelay = 0,
  isFiltered = false
}) => {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const race = getRaceById(character.race)
  const charClass = getClassById(character.class)
  const faction = getFactionById(character.faction)

  const handleClick = () => {
    if (onClick) {
      onClick(character)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <article
      className={`character-card ${isFiltered ? 'character-card--filtered' : ''} ${isHovered ? 'character-card--hovered' : ''}`}
      style={{
        '--animation-delay': `${animationDelay}s`,
        '--faction-color': faction?.color || '#e67315',
        '--faction-glow': faction?.glowColor || 'rgba(230, 115, 21, 0.4)'
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`Voir les détails de ${character.name}`}
    >
      {/* Bordure cristalline SVG */}
      <SoulShardBorder glowColor={faction?.color} />

      {/* Lueur de faction en arrière-plan */}
      <div className="character-card__glow-container">
        <FactionGlow color={faction?.color || '#e67315'} animated={isHovered} />
      </div>

      {/* Zone Avatar */}
      <div className="character-card__avatar-zone">
        <div className="character-card__avatar-frame">
          {!imageError && character.avatar ? (
            <img
              src={character.avatar}
              alt={`Portrait de ${character.name}`}
              className="character-card__avatar-image"
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="character-card__avatar-placeholder">
              <RaceSymbol raceId={character.race} size={48} color="#7a6454" />
            </div>
          )}
        </div>

        {/* Overlay de texture cristalline */}
        <div className="character-card__crystal-overlay" />

        {/* Badge de race */}
        <div className="character-card__race-badge" title={race?.label}>
          <RaceSymbol raceId={character.race} size={18} color="#c9a227" />
        </div>
      </div>

      {/* Zone Informations */}
      <div className="character-card__info-zone">
        {/* Nom du personnage */}
        <h3 className="character-card__name">{character.name}</h3>

        {/* Race et Classe */}
        <div className="character-card__meta">
          <span className="character-card__race">
            <span className="character-card__rune">{race?.rune}</span>
            {race?.label}
          </span>
          <span className="character-card__separator">•</span>
          <span className="character-card__class">
            <ClassSymbol classId={character.class} size={14} color="#7a6454" />
            {charClass?.label}
          </span>
        </div>

        {/* Faction */}
        <div
          className="character-card__faction"
          style={{ '--faction-color': faction?.color }}
        >
          <span className="character-card__faction-dot" />
          {faction?.label}
        </div>

        {/* Description courte */}
        <p className="character-card__description">
          {character.shortDescription}
        </p>

        {/* Difficulté RP */}
        <div className="character-card__difficulty">
          <span className="character-card__difficulty-label">Difficulté RP</span>
          <DifficultyRunes level={character.difficulty} />
        </div>
      </div>

      {/* Particules de cendres au hover */}
      {isHovered && <AshParticles count={6} className="character-card__particles" />}

      {/* Indicateur "Cliquez pour détails" */}
      <div className="character-card__cta">
        <span className="character-card__cta-text">Invoquer l'Âme</span>
      </div>
    </article>
  )
}

CharacterCard.propTypes = {
  character: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    race: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    faction: PropTypes.string.isRequired,
    age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    difficulty: PropTypes.number.isRequired,
    shortDescription: PropTypes.string.isRequired,
    quote: PropTypes.string,
    avatar: PropTypes.string,
    background: PropTypes.string,
    traits: PropTypes.array,
    abilities: PropTypes.array,
    equipment: PropTypes.array,
    rpNotes: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func,
  animationDelay: PropTypes.number,
  isFiltered: PropTypes.bool
}

export default CharacterCard
