import { useState } from 'react'
import PropTypes from 'prop-types'
import WorldMap from './WorldMap'
import LocationCard from './LocationCard'
import { locationsData } from '@/data/locationData'
import './GeographySection.css'

/**
 * GeographySection - Section géographie avec carte interactive
 * Design: Carte du monde interactive + détails du lieu sélectionné
 */
const GeographySection = ({
  title = "Géographie des Terres Maudites",
  subtitle = "Explorez les territoires brisés par le Cataclysme",
  locations = locationsData,
  initialSelectedLocation = null
}) => {
  const [selectedLocation, setSelectedLocation] = useState(initialSelectedLocation)

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)

    // Scroll smooth vers la carte de détail si sur mobile
    if (window.innerWidth < 768) {
      const detailSection = document.getElementById('location-detail')
      if (detailSection) {
        detailSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }

  const handleCloseDetail = () => {
    setSelectedLocation(null)
  }

  return (
    <section className="geography-section" id="geography">
      {/* En-tête de section */}
      <div className="geography-section__header">
        <div className="geography-section__header-ornament geography-section__header-ornament--left">
          <MapOrnament />
        </div>

        <div className="geography-section__header-content">
          <h2 className="geography-section__title">{title}</h2>
          <p className="geography-section__subtitle">{subtitle}</p>
        </div>

        <div className="geography-section__header-ornament geography-section__header-ornament--right">
          <MapOrnament />
        </div>
      </div>

      {/* Instructions d'interaction */}
      <div className="geography-section__instructions">
        <div className="geography-section__instruction">
          <svg className="geography-section__instruction-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 18 L6 22 L7 15 L2 10 L9 9 Z" stroke="currentColor" strokeWidth="2" fill="currentColor" opacity="0.3"/>
          </svg>
          <span>Survolez les marqueurs pour voir les informations</span>
        </div>
        <div className="geography-section__instruction">
          <svg className="geography-section__instruction-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8 L12 12 L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Cliquez pour afficher les détails complets</span>
        </div>
      </div>

      {/* Carte interactive du monde */}
      <div className="geography-section__map-container">
        <WorldMap
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          showCompass={true}
          showLegend={true}
        />
      </div>

      {/* Divider avec fragments de carte */}
      <MapDivider />

      {/* Détail du lieu sélectionné */}
      {selectedLocation && (
        <div className="geography-section__detail" id="location-detail">
          <div className="geography-section__detail-header">
            <h3 className="geography-section__detail-title">
              Lieu sélectionné
            </h3>
            <button
              className="geography-section__detail-close"
              onClick={handleCloseDetail}
              aria-label="Fermer les détails"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6 L6 18 M6 6 L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <LocationCard
            location={selectedLocation}
            expanded={true}
            showFullDetails={true}
          />
        </div>
      )}

      {/* Liste compacte des lieux si aucun n'est sélectionné */}
      {!selectedLocation && (
        <div className="geography-section__list">
          <h3 className="geography-section__list-title">
            Tous les lieux découverts
          </h3>
          <div className="geography-section__list-grid">
            {locations.map(location => (
              <LocationCard
                key={location.id}
                location={location}
                onClick={() => handleLocationSelect(location)}
                compact={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Légende de la carte */}
      <MapLegendFooter />
    </section>
  )
}

/**
 * Ornement décoratif de carte
 */
const MapOrnament = () => (
  <svg
    className="geography-section__ornament-svg"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Cercle extérieur */}
    <circle cx="40" cy="40" r="35" stroke="#5e4d40" strokeWidth="1.5" opacity="0.3"/>
    <circle cx="40" cy="40" r="30" stroke="#7a6454" strokeWidth="1" opacity="0.2"/>

    {/* Croix cardinale */}
    <path d="M40 10 L40 70 M10 40 L70 40" stroke="#e67315" strokeWidth="2" opacity="0.4"/>

    {/* Points cardinaux */}
    <circle cx="40" cy="10" r="4" fill="#e67315" opacity="0.6"/>
    <circle cx="40" cy="70" r="3" fill="#7a6454" opacity="0.4"/>
    <circle cx="10" cy="40" r="3" fill="#7a6454" opacity="0.4"/>
    <circle cx="70" cy="40" r="3" fill="#7a6454" opacity="0.4"/>

    {/* Runes décoratives */}
    <path d="M40 25 L35 30 L40 35 L45 30 Z" stroke="#e67315" strokeWidth="1" fill="none" opacity="0.5"/>
    <path d="M40 45 L35 50 L40 55 L45 50 Z" stroke="#e67315" strokeWidth="1" fill="none" opacity="0.5"/>
    <path d="M25 40 L30 35 L35 40 L30 45 Z" stroke="#e67315" strokeWidth="1" fill="none" opacity="0.5"/>
    <path d="M45 40 L50 35 L55 40 L50 45 Z" stroke="#e67315" strokeWidth="1" fill="none" opacity="0.5"/>

    {/* Centre */}
    <circle cx="40" cy="40" r="8" stroke="#e67315" strokeWidth="1.5" fill="#1c1714" opacity="0.6"/>
    <circle cx="40" cy="40" r="3" fill="#e67315" opacity="0.8"/>
  </svg>
)

/**
 * Divider avec fragments de carte
 */
const MapDivider = () => (
  <div className="geography-section__divider">
    <div className="geography-section__divider-line" />
    <svg
      className="geography-section__divider-icon"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Fragment de parchemin */}
      <rect x="8" y="8" width="32" height="32" rx="2" stroke="#7a6454" strokeWidth="2" fill="#2f2722" opacity="0.5"/>

      {/* Lignes de carte */}
      <path d="M12 16 L36 16 M12 24 L36 24 M12 32 L36 32" stroke="#5e4d40" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
      <path d="M16 12 L16 36 M24 12 L24 36 M32 12 L32 36" stroke="#5e4d40" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>

      {/* Marqueur central */}
      <circle cx="24" cy="24" r="4" stroke="#e67315" strokeWidth="2" fill="#1c1714"/>
      <circle cx="24" cy="24" r="2" fill="#e67315" opacity="0.8"/>
    </svg>
    <div className="geography-section__divider-line" />
  </div>
)

/**
 * Légende de pied de section
 */
const MapLegendFooter = () => (
  <div className="geography-section__legend">
    <div className="geography-section__legend-header">
      <svg
        className="geography-section__legend-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M3 3 L3 21 L21 21 L21 3 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M8 3 L8 21 M16 3 L16 21 M3 8 L21 8 M3 16 L21 16" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5"/>
      </svg>
      <h3 className="geography-section__legend-title">Cartographie des Terres Maudites</h3>
    </div>

    <div className="geography-section__legend-content">
      <div className="geography-section__legend-section">
        <h4 className="geography-section__legend-subtitle">Symboles de la carte</h4>
        <ul className="geography-section__legend-list">
          <li>
            <span className="geography-section__legend-marker geography-section__legend-marker--ruins">◆</span>
            <span>Ruines de l'Ancien Empire</span>
          </li>
          <li>
            <span className="geography-section__legend-marker geography-section__legend-marker--sanctuary">◆</span>
            <span>Sanctuaires et lieux sacrés</span>
          </li>
          <li>
            <span className="geography-section__legend-marker geography-section__legend-marker--danger">◆</span>
            <span>Zones extrêmement dangereuses</span>
          </li>
          <li>
            <span className="geography-section__legend-marker geography-section__legend-marker--safe">◆</span>
            <span>Refuges et établissements sûrs</span>
          </li>
        </ul>
      </div>

      <div className="geography-section__legend-section">
        <h4 className="geography-section__legend-subtitle">Niveaux de danger</h4>
        <ul className="geography-section__legend-list">
          <li>
            <span className="geography-section__legend-danger">🔥</span>
            <span>Sûr - Peu ou pas de menaces</span>
          </li>
          <li>
            <span className="geography-section__legend-danger">🔥🔥</span>
            <span>Faible - Dangers mineurs</span>
          </li>
          <li>
            <span className="geography-section__legend-danger">🔥🔥🔥</span>
            <span>Modéré - Précautions nécessaires</span>
          </li>
          <li>
            <span className="geography-section__legend-danger">🔥🔥🔥🔥</span>
            <span>Élevé - Très dangereux</span>
          </li>
          <li>
            <span className="geography-section__legend-danger">🔥🔥🔥🔥🔥</span>
            <span>Extrême - Mortel, à éviter</span>
          </li>
        </ul>
      </div>

      <div className="geography-section__legend-section geography-section__legend-section--full">
        <h4 className="geography-section__legend-subtitle">Note du Cartographe</h4>
        <p className="geography-section__legend-note">
          <em>
            "Ces cartes ont été tracées au péril de nombreuses vies.
            Les territoires au-delà des zones connues restent inexplorés,
            perdus dans les brumes du Cataclysme. Que les Braises guident vos pas."
          </em>
        </p>
        <span className="geography-section__legend-signature">
          — Maître Cartographe Theron, Gardien de la Flamme
        </span>
      </div>
    </div>
  </div>
)

GeographySection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  locations: PropTypes.arrayOf(PropTypes.object),
  initialSelectedLocation: PropTypes.object
}

export default GeographySection
