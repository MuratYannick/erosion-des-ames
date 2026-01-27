/**
 * CharacterFilters - Autel de Sélection pour filtrer les personnages
 * Style tablette rituelle avec runes de sélection
 */

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { SoulFlameIcon } from './SoulShardElements'
import { races, classes, factions, difficultyLevels } from '../data/presetCharacters'
import './CharacterFilters.css'

/**
 * Dropdown tribal personnalisé
 */
const TribalDropdown = ({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Tous',
  icon = '◆'
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find(opt => opt.id === value)

  const handleSelect = (optionId) => {
    onChange(optionId)
    setIsOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={`tribal-dropdown ${isOpen ? 'tribal-dropdown--open' : ''}`}>
      <label className="tribal-dropdown__label" htmlFor={id}>
        {label}
      </label>
      <button
        id={id}
        className="tribal-dropdown__trigger"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="tribal-dropdown__rune">{icon}</span>
        <span className="tribal-dropdown__value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="tribal-dropdown__chevron">
          <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true">
            <path
              d="M1 1.5 L6 6.5 L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="tribal-dropdown__backdrop"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <ul
            className="tribal-dropdown__menu"
            role="listbox"
            aria-labelledby={id}
          >
            <li
              className={`tribal-dropdown__option ${!value ? 'tribal-dropdown__option--selected' : ''}`}
              role="option"
              aria-selected={!value}
              onClick={() => handleSelect(null)}
            >
              <span className="tribal-dropdown__option-rune">○</span>
              {placeholder}
            </li>
            {options.map((option) => (
              <li
                key={option.id}
                className={`tribal-dropdown__option ${value === option.id ? 'tribal-dropdown__option--selected' : ''}`}
                role="option"
                aria-selected={value === option.id}
                onClick={() => handleSelect(option.id)}
              >
                <span className="tribal-dropdown__option-rune">
                  {option.rune || option.icon || '◇'}
                </span>
                {option.label}
                {option.color && (
                  <span
                    className="tribal-dropdown__option-color"
                    style={{ backgroundColor: option.color }}
                  />
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

TribalDropdown.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
    rune: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string
  })).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  icon: PropTypes.string
}

/**
 * Composant principal des filtres
 */
const CharacterFilters = ({
  filters,
  onFilterChange,
  totalCount,
  filteredCount
}) => {
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      race: null,
      class: null,
      faction: null,
      difficulty: null
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const hasActiveFilters = Object.values(localFilters).some(v => v !== null)

  // Préparer les options de difficulté
  const difficultyOptions = difficultyLevels.map(d => ({
    ...d,
    id: d.id,
    label: `${d.label} (${'◆'.repeat(d.id)}${'◇'.repeat(5 - d.id)})`
  }))

  return (
    <div className="character-filters">
      <div className="character-filters__tablet">
        {/* Ornement supérieur */}
        <div className="character-filters__ornament character-filters__ornament--top">
          <svg viewBox="0 0 200 20" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <path
              d="M0 10 L60 10 L80 5 L100 10 L120 5 L140 10 L200 10"
              stroke="#7a6454"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
            <circle cx="100" cy="10" r="4" fill="#e67315" opacity="0.7" />
          </svg>
        </div>

        {/* Grille de filtres */}
        <div className="character-filters__grid">
          <TribalDropdown
            id="filter-race"
            label="Race"
            options={races}
            value={localFilters.race}
            onChange={(v) => handleFilterChange('race', v)}
            placeholder="Toutes"
            icon="◇"
          />

          <TribalDropdown
            id="filter-class"
            label="Classe"
            options={classes}
            value={localFilters.class}
            onChange={(v) => handleFilterChange('class', v)}
            placeholder="Toutes"
            icon="⚔"
          />

          <TribalDropdown
            id="filter-faction"
            label="Faction"
            options={factions}
            value={localFilters.faction}
            onChange={(v) => handleFilterChange('faction', v)}
            placeholder="Toutes"
            icon="◎"
          />

          <TribalDropdown
            id="filter-difficulty"
            label="Difficulté RP"
            options={difficultyOptions}
            value={localFilters.difficulty}
            onChange={(v) => handleFilterChange('difficulty', v)}
            placeholder="Toute"
            icon="◆"
          />
        </div>

        {/* Compteur et Reset */}
        <div className="character-filters__footer">
          <div className="character-filters__count">
            <SoulFlameIcon size={20} animated={true} />
            <span className="character-filters__count-number">{filteredCount}</span>
            <span className="character-filters__count-label">
              Âme{filteredCount > 1 ? 's' : ''} disponible{filteredCount > 1 ? 's' : ''}
              {filteredCount !== totalCount && (
                <span className="character-filters__count-total"> sur {totalCount}</span>
              )}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              className="character-filters__reset"
              onClick={handleReset}
              aria-label="Réinitialiser tous les filtres"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path
                  d="M4 4 L12 12 M12 4 L4 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>Réinitialiser les Runes</span>
            </button>
          )}
        </div>

        {/* Ornement inférieur */}
        <div className="character-filters__ornament character-filters__ornament--bottom">
          <svg viewBox="0 0 200 20" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <path
              d="M0 10 L60 10 L80 15 L100 10 L120 15 L140 10 L200 10"
              stroke="#7a6454"
              strokeWidth="1"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

CharacterFilters.propTypes = {
  filters: PropTypes.shape({
    race: PropTypes.string,
    class: PropTypes.string,
    faction: PropTypes.string,
    difficulty: PropTypes.number
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  totalCount: PropTypes.number.isRequired,
  filteredCount: PropTypes.number.isRequired
}

export default CharacterFilters
