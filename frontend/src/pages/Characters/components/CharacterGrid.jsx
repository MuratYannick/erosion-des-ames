/**
 * CharacterGrid - Grille responsive des Soul Shards
 * Affiche les personnages en grille avec animations staggered
 */

import { useMemo } from 'react'
import PropTypes from 'prop-types'
import CharacterCard from './CharacterCard'
import { SoulFlameIcon } from './SoulShardElements'
import './CharacterGrid.css'

const CharacterGrid = ({
  characters,
  filteredIds,
  onCharacterClick,
  emptyMessage = "Aucune âme ne correspond à votre recherche..."
}) => {
  // Calculer l'état filtré de chaque personnage
  const characterStates = useMemo(() => {
    if (!filteredIds) {
      // Pas de filtre actif, tous visibles
      return characters.map(char => ({
        ...char,
        isFiltered: false
      }))
    }

    return characters.map(char => ({
      ...char,
      isFiltered: !filteredIds.includes(char.id)
    }))
  }, [characters, filteredIds])

  // Vérifier si tous sont filtrés
  const allFiltered = filteredIds && filteredIds.length === 0

  return (
    <div className="character-grid-container">
      {/* Particules d'ambiance */}
      <div className="character-grid__ambient" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="character-grid__ambient-ember"
            style={{
              '--delay': `${i * 1.5}s`,
              '--x': `${10 + Math.random() * 80}%`,
              '--duration': `${8 + Math.random() * 6}s`
            }}
          />
        ))}
      </div>

      {allFiltered ? (
        // État vide
        <div className="character-grid__empty">
          <div className="character-grid__empty-icon">
            <SoulFlameIcon size={48} animated={false} />
          </div>
          <p className="character-grid__empty-message">{emptyMessage}</p>
          <p className="character-grid__empty-hint">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      ) : (
        // Grille de personnages
        <div className="character-grid">
          {characterStates.map((character, index) => (
            <CharacterCard
              key={character.id}
              character={character}
              onClick={onCharacterClick}
              animationDelay={index * 0.08}
              isFiltered={character.isFiltered}
            />
          ))}
        </div>
      )}
    </div>
  )
}

CharacterGrid.propTypes = {
  characters: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    race: PropTypes.string.isRequired,
    class: PropTypes.string.isRequired,
    faction: PropTypes.string.isRequired,
    difficulty: PropTypes.number.isRequired,
    shortDescription: PropTypes.string.isRequired
  })).isRequired,
  filteredIds: PropTypes.arrayOf(PropTypes.string),
  onCharacterClick: PropTypes.func,
  emptyMessage: PropTypes.string
}

export default CharacterGrid
