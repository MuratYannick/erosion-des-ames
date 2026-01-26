import { useState } from 'react'
import PropTypes from 'prop-types'
import LocationCard from './LocationCard'
import { locationsData } from '@/data/locationData'
import './LocationSection.css'

/**
 * LocationSection - Section présentant les lieux du monde
 * Design: Carte du monde fragmentée avec lieux disposés en grid
 */
const LocationSection = ({
  title = "Territoires Maudits",
  subtitle = "Explorez les terres brisées où rôdent ombres et mystères",
  locations = locationsData,
  onLocationClick,
  showFilters = true
}) => {
  const [filterType, setFilterType] = useState('all')
  const [filterDanger, setFilterDanger] = useState('all')

  // Filtrage des lieux
  const filteredLocations = locations.filter(loc => {
    const typeMatch = filterType === 'all' || loc.type === filterType
    const dangerMatch = filterDanger === 'all' || loc.dangerLevel === parseInt(filterDanger)
    return typeMatch && dangerMatch
  })

  // Types uniques pour les filtres
  const uniqueTypes = [...new Set(locations.map(loc => loc.type))]

  return (
    <section className="location-section" id="locations">
      {/* En-tête de section avec carte décorative */}
      <div className="location-section__header">
        <MapFragmentDecoration />

        <div className="location-section__header-content">
          <h2 className="location-section__title">{title}</h2>
          <p className="location-section__subtitle">{subtitle}</p>
        </div>

        <MapFragmentDecoration position="right" />
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="location-section__filters">
          <div className="location-section__filter-group">
            <label htmlFor="type-filter" className="location-section__filter-label">
              <svg
                className="location-section__filter-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 6 L3 9 L9 9 L9 6 M15 6 L15 9 L21 9 L21 6 M3 15 L3 18 L9 18 L9 15 M15 15 L15 18 L21 18 L21 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              Type de lieu
            </label>
            <select
              id="type-filter"
              className="location-section__filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">Tous les types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="location-section__filter-group">
            <label htmlFor="danger-filter" className="location-section__filter-label">
              <svg
                className="location-section__filter-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 18 L6 22 L7 15 L2 10 L9 9 Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              Niveau de danger
            </label>
            <select
              id="danger-filter"
              className="location-section__filter-select"
              value={filterDanger}
              onChange={(e) => setFilterDanger(e.target.value)}
            >
              <option value="all">Tous les niveaux</option>
              <option value="1">Sûr</option>
              <option value="2">Faible</option>
              <option value="3">Modéré</option>
              <option value="4">Élevé</option>
              <option value="5">Extrême</option>
            </select>
          </div>

          <div className="location-section__filter-results">
            <span className="location-section__filter-count">{filteredLocations.length}</span>
            <span className="location-section__filter-text">
              {filteredLocations.length === 1 ? 'lieu découvert' : 'lieux découverts'}
            </span>
          </div>
        </div>
      )}

      {/* Divider avec boussole */}
      <CompassDivider />

      {/* Grid de cartes */}
      <div className="location-section__grid">
        {filteredLocations.length > 0 ? (
          filteredLocations.map(location => (
            <LocationCard
              key={location.id}
              location={location}
              onClick={() => onLocationClick?.(location)}
            />
          ))
        ) : (
          <div className="location-section__empty">
            <svg
              className="location-section__empty-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <path d="M8 8 L16 16 M16 8 L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            </svg>
            <p className="location-section__empty-text">
              Aucun lieu ne correspond aux critères sélectionnés.
            </p>
            <p className="location-section__empty-hint">
              Ajustez les filtres pour explorer d'autres territoires.
            </p>
          </div>
        )}
      </div>

      {/* Légende de carte au bas */}
      <MapLegend />
    </section>
  )
}

/**
 * Décoration de fragment de carte ancienne
 */
const MapFragmentDecoration = ({ position = 'left' }) => {
  return (
    <svg
      className={`location-section__map-fragment location-section__map-fragment--${position}`}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Bordure de carte */}
      <path
        d="M10 10 L110 10 L110 110 L10 110 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.2"
        className="text-secondary-300"
      />

      {/* Lignes de latitude/longitude */}
      <path
        d="M10 40 L110 40 M10 70 L110 70 M40 10 L40 110 M70 10 L70 110"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.15"
        className="text-primary-400"
      />

      {/* Symboles de lieu */}
      <circle cx="35" cy="35" r="3" fill="currentColor" opacity="0.25" className="text-secondary-500" />
      <circle cx="85" cy="55" r="3" fill="currentColor" opacity="0.25" className="text-secondary-500" />
      <circle cx="50" cy="80" r="3" fill="currentColor" opacity="0.25" className="text-secondary-500" />

      {/* Lignes de route */}
      <path
        d="M35 35 Q50 45 85 55 M85 55 Q70 65 50 80"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        opacity="0.2"
        className="text-secondary-400"
      />

      {/* Rose des vents stylisée */}
      <g transform="translate(95, 25)" opacity="0.3">
        <circle r="8" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-secondary-300" />
        <path d="M0 -6 L0 6 M-6 0 L6 0" stroke="currentColor" strokeWidth="1" className="text-secondary-400" />
        <path d="M0 -8 L-1 -6 L1 -6 Z" fill="currentColor" className="text-secondary-500" />
      </g>
    </svg>
  )
}

/**
 * Divider avec boussole centrale
 */
const CompassDivider = () => (
  <div className="location-section__compass-divider">
    <div className="location-section__divider-line" />
    <svg
      className="location-section__compass"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cercle extérieur */}
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" className="text-secondary-300" />
      <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="1" opacity="0.2" className="text-primary-400" />

      {/* Points cardinaux */}
      <path d="M24 4 L24 8 M24 40 L24 44 M4 24 L8 24 M40 24 L44 24" stroke="currentColor" strokeWidth="2" opacity="0.4" className="text-secondary-400" />

      {/* Aiguille de boussole */}
      <path d="M24 10 L20 24 L24 38 L28 24 Z" fill="currentColor" opacity="0.5" className="text-secondary-500" />
      <path d="M24 10 L24 38" stroke="currentColor" strokeWidth="1" className="text-secondary-600" />

      {/* Point central */}
      <circle cx="24" cy="24" r="3" fill="currentColor" opacity="0.6" className="text-secondary-500" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" className="text-secondary-700" />
    </svg>
    <div className="location-section__divider-line" />
  </div>
)

/**
 * Légende de carte
 */
const MapLegend = () => (
  <div className="location-section__legend">
    <div className="location-section__legend-header">
      <svg
        className="location-section__legend-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" stroke="currentColor" strokeWidth="2" rx="2" />
        <path d="M8 3 L8 21 M16 3 L16 21" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.4" />
      </svg>
      <span className="location-section__legend-title">Carte des Territoires</span>
    </div>
    <p className="location-section__legend-text">
      Les lieux marqués ont été découverts et cartographiés par les Éclaireurs.
      De nombreux territoires restent inexplorés, perdus dans les brumes du Cataclysme.
    </p>
  </div>
)

LocationSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  locations: PropTypes.arrayOf(PropTypes.object),
  onLocationClick: PropTypes.func,
  showFilters: PropTypes.bool,
}

MapFragmentDecoration.propTypes = {
  position: PropTypes.oneOf(['left', 'right']),
}

export default LocationSection
