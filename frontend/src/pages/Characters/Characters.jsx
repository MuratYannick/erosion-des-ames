/**
 * Characters - Page "Les Âmes Marquées - Sanctuaire des Légendes"
 * Galerie de personnages prédéfinis adoptables par les joueurs
 */

import { useState, useMemo, useEffect, useRef } from 'react'
import { CharacterGrid, CharacterFilters, CharacterModal, SoulFlameIcon } from './components'
import { presetCharacters } from './data/presetCharacters'
import { ScrollToTop } from '@/components'
import './Characters.css'

const Characters = () => {
  // État des filtres
  const [filters, setFilters] = useState({
    race: null,
    class: null,
    faction: null,
    difficulty: null
  })

  // Modal
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Révélation au scroll
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)
  const headerRef = useRef(null)

  // Observer pour la révélation du header
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeaderVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (headerRef.current) {
      observer.observe(headerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Filtrer les personnages
  const filteredCharacters = useMemo(() => {
    return presetCharacters.filter(char => {
      if (filters.race && char.race !== filters.race) return false
      if (filters.class && char.class !== filters.class) return false
      if (filters.faction && char.faction !== filters.faction) return false
      if (filters.difficulty && char.difficulty !== filters.difficulty) return false
      return true
    })
  }, [filters])

  const filteredIds = useMemo(() => {
    return filteredCharacters.map(c => c.id)
  }, [filteredCharacters])

  // Handlers
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Petit délai avant de nettoyer le personnage pour l'animation
    setTimeout(() => setSelectedCharacter(null), 300)
  }

  return (
    <div className="characters-page">
      {/* Effet de fond */}
      <div className="characters-page__background" aria-hidden="true">
        <div className="characters-page__bg-gradient" />
        <div className="characters-page__bg-pattern" />
      </div>

      {/* Header avec titre */}
      <header
        ref={headerRef}
        className={`characters-page__header ${isHeaderVisible ? 'is-visible' : ''}`}
      >
        <div className="characters-page__header-content">
          {/* Ornement supérieur */}
          <div className="characters-page__ornament" aria-hidden="true">
            <svg viewBox="0 0 300 40" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="ornamentHeaderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7a6454" stopOpacity="0" />
                  <stop offset="30%" stopColor="#c9a227" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#e67315" stopOpacity="1" />
                  <stop offset="70%" stopColor="#c9a227" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#7a6454" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="20" y1="20" x2="280" y2="20" stroke="url(#ornamentHeaderGrad)" strokeWidth="1" />
              <path d="M150 12 L158 20 L150 28 L142 20 Z" fill="#e67315" opacity="0.8" />
              <circle cx="100" cy="20" r="3" fill="#c9a227" opacity="0.5" />
              <circle cx="200" cy="20" r="3" fill="#c9a227" opacity="0.5" />
            </svg>
          </div>

          {/* Icône centrale */}
          <div className="characters-page__header-icon">
            <SoulFlameIcon size={48} animated={true} />
          </div>

          {/* Titre */}
          <h1 className="characters-page__title">
            Les Âmes Marquées
          </h1>

          {/* Sous-titre */}
          <p className="characters-page__subtitle">
            Sanctuaire des Légendes
          </p>

          {/* Description */}
          <p className="characters-page__description">
            Dans ce sanctuaire reposent les fragments d'âmes légendaires, prêtes à être invoquées
            par ceux qui cherchent une incarnation. Choisissez votre destin parmi ces héros
            du passé, ces survivants marqués par l'Érosion.
          </p>

          {/* Ornement inférieur */}
          <div className="characters-page__ornament characters-page__ornament--bottom" aria-hidden="true">
            <svg viewBox="0 0 300 40" preserveAspectRatio="xMidYMid meet">
              <line x1="20" y1="20" x2="280" y2="20" stroke="url(#ornamentHeaderGrad)" strokeWidth="1" />
              <path d="M140 20 L150 12 L160 20 L150 28 Z" fill="none" stroke="#c9a227" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
        </div>
      </header>

      {/* Section principale */}
      <main className="characters-page__main">
        {/* Filtres */}
        <CharacterFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          totalCount={presetCharacters.length}
          filteredCount={filteredCharacters.length}
        />

        {/* Grille des personnages */}
        <CharacterGrid
          characters={presetCharacters}
          filteredIds={filteredIds}
          onCharacterClick={handleCharacterClick}
          emptyMessage="Aucune âme ne correspond à vos critères..."
        />
      </main>

      {/* Modal de détail */}
      <CharacterModal
        character={selectedCharacter}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Scroll to top */}
      <ScrollToTop />
    </div>
  )
}

export default Characters
