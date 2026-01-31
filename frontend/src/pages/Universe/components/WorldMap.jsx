import { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import './WorldMap.css'

/**
 * WorldMap - Carte interactive du monde d'Érosion des Âmes
 * Design: Tablette de pierre gravée avec marqueurs incandescents
 */
const WorldMap = ({
  locations = [],
  selectedLocation = null,
  onLocationSelect,
  showCompass = true,
  showLegend = true
}) => {
  const [hoveredLocation, setHoveredLocation] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const mapRef = useRef(null)

  // Convertir coordonnées géographiques en positions SVG (viewBox 0 0 1000 800)
  const coordsToSVG = (coords) => {
    // Parse coordinates "47°N, 12°E"
    const match = coords.match(/(\d+)°N,\s*(\d+)°([EW])/)
    if (!match) return { x: 500, y: 400 }

    const lat = parseInt(match[1])
    const lon = parseInt(match[2])
    const lonDir = match[3]

    // Mapping: 38°N-52°N => y:650-150 (inversé car SVG y croît vers le bas)
    // Mapping: 20°W-20°E => x:150-850
    const y = 650 - ((lat - 38) / (52 - 38)) * 500
    const x = lonDir === 'E'
      ? 500 + (lon / 20) * 350
      : 500 - (lon / 20) * 350

    return { x, y }
  }

  // Gérer le positionnement du tooltip
  const handleMarkerHover = (location, event) => {
    setHoveredLocation(location)

    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect()
      const svgPoint = mapRef.current.createSVGPoint()
      svgPoint.x = event.clientX - rect.left
      svgPoint.y = event.clientY - rect.top

      setTooltipPosition({
        x: svgPoint.x,
        y: svgPoint.y
      })
    }
  }

  const handleMarkerLeave = () => {
    setHoveredLocation(null)
  }

  const handleMarkerClick = (location) => {
    onLocationSelect?.(location)
  }

  return (
    <div className="world-map">
      {/* Carte SVG principale */}
      <svg
        ref={mapRef}
        className="world-map__svg"
        viewBox="0 0 1000 800"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Carte interactive du monde d'Érosion des Âmes"
      >
        <defs>
          {/* Filtres et gradients */}
          <filter id="map-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="map-stone-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2"/>
            <feColorMatrix type="saturate" values="0"/>
            <feComponentTransfer>
              <feFuncA type="discrete" tableValues="0 0.05 0.1"/>
            </feComponentTransfer>
          </filter>

          <linearGradient id="ember-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff9635" stopOpacity="1"/>
            <stop offset="50%" stopColor="#e67315" stopOpacity="1"/>
            <stop offset="100%" stopColor="#c2580d" stopOpacity="1"/>
          </linearGradient>

          <radialGradient id="marker-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9635" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#e67315" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="transparent" stopOpacity="0"/>
          </radialGradient>

          {/* Pattern de texture pierre */}
          <pattern id="stone-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="#1c1714"/>
            <path d="M0 0 L10 10 M90 10 L100 0 M0 90 L10 100" stroke="#2f2722" strokeWidth="0.5" opacity="0.3"/>
          </pattern>

          {/* Pattern de lignes tribales */}
          <pattern id="tribal-lines" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M0 25 Q12.5 20 25 25 T50 25" stroke="#5e4d40" strokeWidth="0.5" fill="none" opacity="0.2"/>
          </pattern>
        </defs>

        {/* Fond de carte avec texture */}
        <rect
          width="1000"
          height="800"
          fill="url(#stone-pattern)"
          className="world-map__background"
        />
        <rect
          width="1000"
          height="800"
          fill="url(#stone-pattern)"
          filter="url(#map-stone-texture)"
          opacity="0.3"
        />

        {/* Bordure tribale */}
        <MapBorder />

        {/* Grille de latitude/longitude stylisée */}
        <g className="world-map__grid" opacity="0.15">
          {/* Lignes horizontales (latitudes) */}
          <path d="M100 200 L900 200" stroke="#7a6454" strokeWidth="1" strokeDasharray="5 5"/>
          <path d="M100 400 L900 400" stroke="#7a6454" strokeWidth="1" strokeDasharray="5 5"/>
          <path d="M100 600 L900 600" stroke="#7a6454" strokeWidth="1" strokeDasharray="5 5"/>

          {/* Lignes verticales (longitudes) */}
          <path d="M300 100 L300 700" stroke="#7a6454" strokeWidth="1" strokeDasharray="5 5"/>
          <path d="M500 100 L500 700" stroke="#7a6454" strokeWidth="1" strokeDasharray="5 5"/>
          <path d="M700 100 L700 700" stroke="#7a6454" strokeWidth="1" strokeDasharray="5 5"/>
        </g>

        {/* Régions topographiques stylisées */}
        <TopographicRegions />

        {/* Routes entre les lieux (chemins tribaux) */}
        <MapRoutes locations={locations} coordsToSVG={coordsToSVG} />

        {/* Marqueurs des lieux */}
        <g className="world-map__markers">
          {locations.map(location => {
            const pos = coordsToSVG(location.coordinates)
            const isSelected = selectedLocation?.id === location.id
            const isHovered = hoveredLocation?.id === location.id

            return (
              <LocationMarker
                key={location.id}
                location={location}
                x={pos.x}
                y={pos.y}
                isSelected={isSelected}
                isHovered={isHovered}
                onHover={(e) => handleMarkerHover(location, e)}
                onLeave={handleMarkerLeave}
                onClick={() => handleMarkerClick(location)}
              />
            )
          })}
        </g>

        {/* Rose des vents tribale */}
        {showCompass && <CompassRose />}

        {/* Légendes sur la carte */}
        {showLegend && <MapLegendText />}
      </svg>

      {/* Tooltip au survol */}
      {hoveredLocation && (
        <LocationTooltip
          location={hoveredLocation}
          x={tooltipPosition.x}
          y={tooltipPosition.y}
        />
      )}
    </div>
  )
}

/**
 * Bordure tribale décorative
 */
const MapBorder = () => (
  <g className="world-map__border">
    {/* Bordure principale */}
    <rect
      x="50"
      y="50"
      width="900"
      height="700"
      fill="none"
      stroke="#5e4d40"
      strokeWidth="3"
      opacity="0.4"
    />

    {/* Motifs tribaux dans les coins */}
    {[
      { x: 50, y: 50, rotate: 0 },
      { x: 950, y: 50, rotate: 90 },
      { x: 950, y: 750, rotate: 180 },
      { x: 50, y: 750, rotate: 270 }
    ].map((corner, i) => (
      <g key={i} transform={`translate(${corner.x}, ${corner.y}) rotate(${corner.rotate})`}>
        <path
          d="M0 0 L20 0 L15 5 M0 0 L0 20 L5 15"
          stroke="#e67315"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <circle cx="0" cy="0" r="3" fill="#e67315" opacity="0.6"/>
      </g>
    ))}

    {/* Ornements latéraux */}
    <path
      d="M50 400 L40 400 L45 395 M50 400 L40 400 L45 405"
      stroke="#e67315"
      strokeWidth="1.5"
      opacity="0.4"
    />
    <path
      d="M950 400 L960 400 L955 395 M950 400 L960 400 L955 405"
      stroke="#e67315"
      strokeWidth="1.5"
      opacity="0.4"
    />
  </g>
)

/**
 * Régions topographiques stylisées
 */
const TopographicRegions = () => (
  <g className="world-map__regions" opacity="0.3">
    {/* Région centrale (Ruines) */}
    <ellipse
      cx="500"
      cy="400"
      rx="150"
      ry="120"
      fill="#7a6454"
      opacity="0.2"
      className="world-map__region world-map__region--ruins"
    />

    {/* Région nord-ouest (Refuge) */}
    <path
      d="M200 200 Q250 150 320 180 Q300 230 250 250 Q200 240 200 200 Z"
      fill="rgba(107, 142, 111, 0.2)"
      className="world-map__region world-map__region--safe"
    />

    {/* Région sud-est (Plaines) */}
    <path
      d="M650 550 L780 520 L820 620 L700 650 Z"
      fill="rgba(187, 167, 148, 0.2)"
      className="world-map__region world-map__region--desert"
    />

    {/* Région nord-est (Forêt) - forme organique */}
    <ellipse
      cx="720"
      cy="220"
      rx="100"
      ry="80"
      fill="rgba(74, 111, 77, 0.2)"
      className="world-map__region world-map__region--forest"
    />

    {/* Région est (Gouffre) - forme menaçante */}
    <path
      d="M750 380 Q800 350 850 380 Q830 430 800 450 Q770 440 750 380 Z"
      fill="rgba(166, 63, 56, 0.2)"
      className="world-map__region world-map__region--danger"
    />

    {/* Textures de relief */}
    <path
      d="M150 300 Q200 280 250 300 M300 450 Q350 430 400 450 M600 250 Q650 230 700 250"
      stroke="#2f2722"
      strokeWidth="1"
      strokeDasharray="3 3"
      fill="none"
      opacity="0.3"
    />
  </g>
)

/**
 * Routes entre les lieux (chemins tribaux)
 */
const MapRoutes = ({ locations, coordsToSVG }) => {
  // Définir les connexions entre les lieux
  const connections = [
    ['ancient-empire-ruins', 'ember-sanctuary'],
    ['ancient-empire-ruins', 'eroded-refuge'],
    ['ancient-empire-ruins', 'cataclysm-chasm'],
    ['ember-sanctuary', 'desolate-plains'],
    ['whispering-forest', 'eroded-refuge'],
    ['cataclysm-chasm', 'desolate-plains']
  ]

  return (
    <g className="world-map__routes">
      {connections.map(([fromId, toId], index) => {
        const fromLoc = locations.find(l => l.id === fromId)
        const toLoc = locations.find(l => l.id === toId)

        if (!fromLoc || !toLoc) return null

        const from = coordsToSVG(fromLoc.coordinates)
        const to = coordsToSVG(toLoc.coordinates)

        // Point de contrôle pour courbe de Bézier
        const midX = (from.x + to.x) / 2
        const midY = (from.y + to.y) / 2
        const offset = 30 + Math.random() * 20

        return (
          <path
            key={index}
            d={`M${from.x} ${from.y} Q${midX} ${midY - offset} ${to.x} ${to.y}`}
            stroke="#5e4d40"
            strokeWidth="1.5"
            strokeDasharray="5 5"
            fill="none"
            opacity="0.3"
            className="world-map__route"
          />
        )
      })}
    </g>
  )
}

/**
 * Marqueur de lieu avec icône selon le type
 */
const LocationMarker = ({
  location,
  x,
  y,
  isSelected,
  isHovered,
  onHover,
  onLeave,
  onClick
}) => {
  const size = isSelected ? 50 : isHovered ? 45 : 40
  const glowSize = size * 2

  return (
    <g
      className={`world-map__marker ${isSelected ? 'is-selected' : ''} ${isHovered ? 'is-hovered' : ''}`}
      transform={`translate(${x}, ${y})`}
      style={{ cursor: 'pointer' }}
    >
      {/* Zone de détection invisible - ne scale jamais, évite le bug de tremblement */}
      <circle
        r={30}
        fill="transparent"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onClick}
      />

      {/* Lueur de fond */}
      <circle
        r={glowSize}
        fill="url(#marker-glow)"
        opacity={isSelected ? 0.6 : isHovered ? 0.4 : 0.2}
        className="world-map__marker-glow"
        pointerEvents="none"
      />

      {/* Cercle de base */}
      <circle
        r={size / 2}
        fill="#1c1714"
        stroke="url(#ember-gradient)"
        strokeWidth={isSelected ? 3 : 2}
        filter="url(#map-glow)"
        className="world-map__marker-circle"
        pointerEvents="none"
      />

      {/* Icône selon le type */}
      <g transform={`scale(${size / 40})`} style={{ pointerEvents: 'none' }}>
        <MarkerIcon type={location.type} />
      </g>

      {/* Pulse animé pour sélection */}
      {isSelected && (
        <circle
          r={size / 2}
          fill="none"
          stroke="#e67315"
          strokeWidth="2"
          opacity="0"
          className="world-map__marker-pulse"
        >
          <animate
            attributeName="r"
            from={size / 2}
            to={size}
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            from="0.8"
            to="0"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Label du lieu */}
      <text
        y={size / 2 + 20}
        textAnchor="middle"
        className="world-map__marker-label"
        fill="#d4c9ba"
        fontSize="12"
        fontFamily="Patrick Hand, cursive"
      >
        {location.name}
      </text>
    </g>
  )
}

/**
 * Icônes des marqueurs selon le type de lieu
 */
const MarkerIcon = ({ type }) => {
  const iconProps = {
    fill: 'none',
    stroke: '#ff9635',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }

  switch (type) {
    case 'ruins':
      return (
        <g transform="translate(-10, -10)">
          {/* Colonne brisée */}
          <rect x="4" y="8" width="4" height="8" {...iconProps} />
          <rect x="12" y="5" width="4" height="11" {...iconProps} />
          <path d="M2 16 L18 16" {...iconProps} strokeWidth="3" />
        </g>
      )

    case 'sanctuary':
      return (
        <g transform="translate(-10, -10)">
          {/* Flamme */}
          <path d="M10 3 Q7 7 10 12 Q13 7 10 3 Z" fill="#ff9635" stroke="#e67315" strokeWidth="1.5" />
          <path d="M10 6 Q9 8 10 10 Q11 8 10 6 Z" fill="#ffdb99" stroke="none" />
        </g>
      )

    case 'desert':
      return (
        <g transform="translate(-10, -10)">
          {/* Dunes */}
          <path d="M2 14 Q5 8 8 14 Q11 8 14 14 Q17 10 18 14" {...iconProps} />
          <path d="M5 12 Q7 10 9 12" {...iconProps} strokeWidth="1" opacity="0.5" />
        </g>
      )

    case 'forest':
      return (
        <g transform="translate(-10, -10)">
          {/* Arbre pétrifié */}
          <path d="M10 4 L10 16" {...iconProps} strokeWidth="3" />
          <path d="M6 8 L10 4 L14 8" {...iconProps} />
          <path d="M7 11 L10 7 L13 11" {...iconProps} />
        </g>
      )

    case 'chasm':
      return (
        <g transform="translate(-10, -10)">
          {/* Faille */}
          <path d="M3 3 L8 10 L5 16 M17 5 L12 10 L15 17" {...iconProps} />
          <path d="M8 10 L12 10" {...iconProps} strokeDasharray="2 2" />
        </g>
      )

    case 'settlement':
      return (
        <g transform="translate(-10, -10)">
          {/* Tour */}
          <rect x="6" y="6" width="8" height="10" {...iconProps} />
          <path d="M6 6 L10 2 L14 6" {...iconProps} />
          <rect x="9" y="11" width="2" height="5" fill="#ff9635" stroke="none" />
        </g>
      )

    default:
      return <circle cx="0" cy="0" r="8" {...iconProps} />
  }
}

/**
 * Rose des vents tribale
 */
const CompassRose = () => (
  <g className="world-map__compass" transform="translate(900, 700)">
    {/* Cercle extérieur */}
    <circle r="40" fill="none" stroke="#5e4d40" strokeWidth="2" opacity="0.4" />
    <circle r="35" fill="none" stroke="#7a6454" strokeWidth="1" opacity="0.3" />

    {/* Points cardinaux principaux */}
    <g className="world-map__compass-points">
      {/* Nord */}
      <path d="M0 -35 L-5 -25 L0 -40 L5 -25 Z" fill="#e67315" opacity="0.8" />
      <text y="-42" textAnchor="middle" fill="#e67315" fontSize="14" fontWeight="bold" fontFamily="Cinzel Decorative, serif">N</text>

      {/* Sud */}
      <path d="M0 35 L-5 25 L0 40 L5 25 Z" fill="#7a6454" opacity="0.6" />
      <text y="50" textAnchor="middle" fill="#7a6454" fontSize="12" fontFamily="Cinzel Decorative, serif">S</text>

      {/* Est */}
      <path d="M35 0 L25 -5 L40 0 L25 5 Z" fill="#7a6454" opacity="0.6" />
      <text x="45" y="5" textAnchor="start" fill="#7a6454" fontSize="12" fontFamily="Cinzel Decorative, serif">E</text>

      {/* Ouest */}
      <path d="M-35 0 L-25 -5 L-40 0 L-25 5 Z" fill="#7a6454" opacity="0.6" />
      <text x="-45" y="5" textAnchor="end" fill="#7a6454" fontSize="12" fontFamily="Cinzel Decorative, serif">O</text>
    </g>

    {/* Points intercardinaux */}
    <g opacity="0.3">
      <line x1="25" y1="-25" x2="30" y2="-30" stroke="#7a6454" strokeWidth="1" />
      <line x1="25" y1="25" x2="30" y2="30" stroke="#7a6454" strokeWidth="1" />
      <line x1="-25" y1="-25" x2="-30" y2="-30" stroke="#7a6454" strokeWidth="1" />
      <line x1="-25" y1="25" x2="-30" y2="30" stroke="#7a6454" strokeWidth="1" />
    </g>

    {/* Centre décoratif */}
    <circle r="8" fill="#1c1714" stroke="#e67315" strokeWidth="1.5" />
    <circle r="3" fill="#e67315" opacity="0.8" />
  </g>
)

/**
 * Texte de légende sur la carte
 */
const MapLegendText = () => (
  <g className="world-map__legend-text">
    {/* Titre de la carte */}
    <text
      x="500"
      y="80"
      textAnchor="middle"
      fill="#d4c9ba"
      fontSize="24"
      fontFamily="Metal Mania, cursive"
      letterSpacing="2"
      opacity="0.7"
    >
      Terres Maudites
    </text>

    {/* Échelle indicative */}
    <g transform="translate(100, 720)" opacity="0.5">
      <line x1="0" y1="0" x2="100" y2="0" stroke="#7a6454" strokeWidth="2" />
      <line x1="0" y1="-5" x2="0" y2="5" stroke="#7a6454" strokeWidth="2" />
      <line x1="100" y1="-5" x2="100" y2="5" stroke="#7a6454" strokeWidth="2" />
      <text x="50" y="15" textAnchor="middle" fill="#7a6454" fontSize="10" fontFamily="Patrick Hand, cursive">
        100 lieues
      </text>
    </g>
  </g>
)

/**
 * Tooltip au survol d'un lieu
 */
const LocationTooltip = ({ location, x, y }) => {
  return (
    <div
      className="world-map__tooltip"
      style={{
        left: `${x}px`,
        top: `${y}px`
      }}
    >
      <div className="world-map__tooltip-header">
        <h3 className="world-map__tooltip-title">{location.name}</h3>
        <span className="world-map__tooltip-type">
          {location.type}
        </span>
      </div>
      <p className="world-map__tooltip-description">
        {location.shortDescription}
      </p>
      <div className="world-map__tooltip-meta">
        <span className="world-map__tooltip-coords">{location.coordinates}</span>
        <span className={`world-map__tooltip-danger world-map__tooltip-danger--${location.dangerLevel}`}>
          {'🔥'.repeat(location.dangerLevel)}
        </span>
      </div>
    </div>
  )
}

WorldMap.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.object),
  selectedLocation: PropTypes.object,
  onLocationSelect: PropTypes.func,
  showCompass: PropTypes.bool,
  showLegend: PropTypes.bool
}

LocationMarker.propTypes = {
  location: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  isSelected: PropTypes.bool,
  isHovered: PropTypes.bool,
  onHover: PropTypes.func,
  onLeave: PropTypes.func,
  onClick: PropTypes.func
}

MarkerIcon.propTypes = {
  type: PropTypes.string.isRequired
}

MapRoutes.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  coordsToSVG: PropTypes.func.isRequired
}

LocationTooltip.propTypes = {
  location: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
}

export default WorldMap
