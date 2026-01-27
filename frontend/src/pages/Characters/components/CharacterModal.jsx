/**
 * CharacterModal - Vue détaillée "Âme Libérée"
 * Affiche le codex complet d'un personnage
 */

import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  ModalOrnament,
  DifficultyRunes,
  RaceSymbol,
  ClassSymbol,
  FactionGlow
} from './SoulShardElements'
import { getRaceById, getClassById, getFactionById, getDifficultyById } from '../data/presetCharacters'
import './CharacterModal.css'

const CharacterModal = ({ character, isOpen, onClose }) => {
  const modalRef = useRef(null)
  const closeButtonRef = useRef(null)

  const race = getRaceById(character?.race)
  const charClass = getClassById(character?.class)
  const faction = getFactionById(character?.faction)
  const difficulty = getDifficultyById(character?.difficulty)

  // Focus trap et gestion clavier
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !character) return null

  const traitIcons = {
    strength: '◆',
    weakness: '◇',
    quirk: '◈'
  }

  const traitLabels = {
    strength: 'Force',
    weakness: 'Faiblesse',
    quirk: 'Particularité'
  }

  return (
    <div className="character-modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="character-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          '--faction-color': faction?.color || '#e67315',
          '--faction-glow': faction?.glowColor || 'rgba(230, 115, 21, 0.4)'
        }}
      >
        {/* Bouton fermer */}
        <button
          ref={closeButtonRef}
          className="character-modal__close"
          onClick={onClose}
          aria-label="Fermer"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path
              d="M6 6 L18 18 M18 6 L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Ornement supérieur */}
        <ModalOrnament position="top" width={250} />

        {/* Contenu scrollable */}
        <div className="character-modal__content">
          {/* Header avec avatar et infos principales */}
          <header className="character-modal__header">
            <div className="character-modal__avatar-section">
              <div className="character-modal__avatar-glow">
                <FactionGlow color={faction?.color || '#e67315'} animated={true} />
              </div>
              <div className="character-modal__avatar-frame">
                {character.avatar ? (
                  <img
                    src={character.avatar}
                    alt={`Portrait de ${character.name}`}
                    className="character-modal__avatar-image"
                  />
                ) : (
                  <div className="character-modal__avatar-placeholder">
                    <RaceSymbol raceId={character.race} size={80} color="#7a6454" />
                  </div>
                )}
              </div>
            </div>

            <div className="character-modal__info-section">
              <h2 id="modal-title" className="character-modal__name">
                {character.name}
              </h2>

              <div className="character-modal__meta">
                <span className="character-modal__race">
                  <RaceSymbol raceId={character.race} size={16} color="#c9a227" />
                  {race?.label}
                </span>
                <span className="character-modal__separator">•</span>
                <span className="character-modal__class">
                  <ClassSymbol classId={character.class} size={16} color="#7a6454" />
                  {charClass?.label}
                </span>
                {character.age && (
                  <>
                    <span className="character-modal__separator">•</span>
                    <span className="character-modal__age">
                      {character.age} {typeof character.age === 'number' ? 'ans' : ''}
                    </span>
                  </>
                )}
              </div>

              <div className="character-modal__faction">
                <span
                  className="character-modal__faction-emblem"
                  style={{ backgroundColor: faction?.color }}
                />
                {faction?.label}
              </div>

              <div className="character-modal__difficulty">
                <span className="character-modal__difficulty-label">
                  Difficulté RP: {difficulty?.label}
                </span>
                <DifficultyRunes level={character.difficulty} size={14} />
              </div>

              {character.quote && (
                <blockquote className="character-modal__quote">
                  {character.quote}
                </blockquote>
              )}
            </div>
          </header>

          {/* Section Histoire */}
          <section className="character-modal__section">
            <h3 className="character-modal__section-title">
              <span className="character-modal__section-rune">◆</span>
              Histoire
            </h3>
            <div className="character-modal__section-content">
              {character.background?.split('\n\n').map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
          </section>

          {/* Section Traits */}
          {character.traits && character.traits.length > 0 && (
            <section className="character-modal__section">
              <h3 className="character-modal__section-title">
                <span className="character-modal__section-rune">◆</span>
                Traits de Personnalité
              </h3>
              <div className="character-modal__traits">
                {character.traits.map((trait, idx) => (
                  <div
                    key={idx}
                    className={`character-modal__trait character-modal__trait--${trait.type}`}
                  >
                    <span className="character-modal__trait-icon">
                      {traitIcons[trait.type]}
                    </span>
                    <span className="character-modal__trait-type">
                      {traitLabels[trait.type]}
                    </span>
                    <span className="character-modal__trait-label">
                      {trait.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section Capacités */}
          {character.abilities && character.abilities.length > 0 && (
            <section className="character-modal__section">
              <h3 className="character-modal__section-title">
                <span className="character-modal__section-rune">◆</span>
                Capacités Signature
              </h3>
              <ul className="character-modal__list">
                {character.abilities.map((ability, idx) => (
                  <li key={idx}>
                    <span className="character-modal__list-bullet">◇</span>
                    {ability}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Section Équipement */}
          {character.equipment && character.equipment.length > 0 && (
            <section className="character-modal__section">
              <h3 className="character-modal__section-title">
                <span className="character-modal__section-rune">◆</span>
                Équipement
              </h3>
              <ul className="character-modal__list character-modal__list--equipment">
                {character.equipment.map((item, idx) => (
                  <li key={idx}>
                    <span className="character-modal__list-bullet">⬡</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Section Notes RP */}
          {character.rpNotes && (
            <section className="character-modal__section character-modal__section--notes">
              <h3 className="character-modal__section-title">
                <span className="character-modal__section-rune">◆</span>
                Notes pour le Roleplay
              </h3>
              <p className="character-modal__rp-notes">{character.rpNotes}</p>
            </section>
          )}
        </div>

        {/* Footer avec CTA */}
        <footer className="character-modal__footer">
          <ModalOrnament position="bottom" width={200} />
          <button className="character-modal__cta">
            <span className="character-modal__cta-icon">◆</span>
            Incarner cette Âme
          </button>
          <p className="character-modal__cta-note">
            Fonctionnalité disponible prochainement
          </p>
        </footer>
      </div>
    </div>
  )
}

CharacterModal.propTypes = {
  character: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    race: PropTypes.string,
    class: PropTypes.string,
    faction: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    difficulty: PropTypes.number,
    shortDescription: PropTypes.string,
    quote: PropTypes.string,
    avatar: PropTypes.string,
    background: PropTypes.string,
    traits: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['strength', 'weakness', 'quirk']),
      label: PropTypes.string
    })),
    abilities: PropTypes.arrayOf(PropTypes.string),
    equipment: PropTypes.arrayOf(PropTypes.string),
    rpNotes: PropTypes.string
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default CharacterModal
