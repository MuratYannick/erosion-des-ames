/**
 * SoulShardElements - Éléments SVG tribaux pour la galerie de personnages
 * Concept: "Les Âmes Marquées - Sanctuaire des Légendes"
 */

import PropTypes from 'prop-types'

/**
 * Bordure cristalline pour les CharacterCards
 */
export const SoulShardBorder = ({ className, glowColor = '#e67315' }) => (
  <svg
    className={`soul-shard-border ${className || ''}`}
    viewBox="0 0 300 400"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="shardEmberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={glowColor} stopOpacity="0.15" />
        <stop offset="50%" stopColor="#c9a227" stopOpacity="0.35" />
        <stop offset="100%" stopColor={glowColor} stopOpacity="0.15" />
      </linearGradient>

      <filter id="fissureGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="shardShadow">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor={glowColor} floodOpacity="0.3" />
      </filter>
    </defs>

    {/* Forme hexagonale irrégulière - contour principal */}
    <path
      d="M 25 8
         L 275 8
         L 292 40
         L 292 360
         L 275 392
         L 25 392
         L 8 360
         L 8 40
         Z"
      fill="none"
      stroke="url(#shardEmberGlow)"
      strokeWidth="2"
      className="shard-outline"
    />

    {/* Fissures lumineuses */}
    <g className="shard-fissures" filter="url(#fissureGlow)">
      <path
        d="M 150 8 L 155 60 L 148 85"
        stroke={glowColor}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M 292 180 L 250 185 L 235 178"
        stroke={glowColor}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M 8 280 L 55 275 L 72 282"
        stroke={glowColor}
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M 180 392 L 175 350 L 182 330"
        stroke="#c9a227"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />
    </g>

    {/* Coins tribaux */}
    <g className="shard-corners">
      {/* Coin supérieur gauche */}
      <path
        d="M 8 40 L 25 8 M 12 35 L 20 20 M 16 30 L 18 25"
        stroke="#c9a227"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      {/* Coin supérieur droit */}
      <path
        d="M 292 40 L 275 8 M 288 35 L 280 20 M 284 30 L 282 25"
        stroke="#c9a227"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      {/* Coin inférieur gauche */}
      <path
        d="M 8 360 L 25 392 M 12 365 L 20 380 M 16 370 L 18 375"
        stroke="#c9a227"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
      {/* Coin inférieur droit */}
      <path
        d="M 292 360 L 275 392 M 288 365 L 280 380 M 284 370 L 282 375"
        stroke="#c9a227"
        strokeWidth="1.5"
        fill="none"
        opacity="0.6"
      />
    </g>

    {/* Runes décoratives aux angles */}
    <g className="shard-runes" opacity="0.4">
      <text x="30" y="30" fontSize="12" fill="#c9a227" fontFamily="serif">◇</text>
      <text x="262" y="30" fontSize="12" fill="#c9a227" fontFamily="serif">◇</text>
      <text x="30" y="385" fontSize="12" fill="#c9a227" fontFamily="serif">◇</text>
      <text x="262" y="385" fontSize="12" fill="#c9a227" fontFamily="serif">◇</text>
    </g>
  </svg>
)

SoulShardBorder.propTypes = {
  className: PropTypes.string,
  glowColor: PropTypes.string
}

/**
 * Icône de flamme d'âme pour les compteurs et indicateurs
 */
export const SoulFlameIcon = ({ className, size = 24, animated = true }) => (
  <svg
    className={`soul-flame-icon ${className || ''} ${animated ? 'animated' : ''}`}
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#e67315" />
        <stop offset="50%" stopColor="#c9a227" />
        <stop offset="100%" stopColor="#ffd5a3" />
      </linearGradient>
      <filter id="flameGlow">
        <feGaussianBlur stdDeviation="1" />
      </filter>
    </defs>

    {/* Flamme principale */}
    <path
      d="M12 2
         C10 5 8 7 8 11
         C8 15.5 10.5 18 14 18
         C17.5 18 20 15.5 20 11
         C20 7 18 5 16 2
         C15 4.5 13.5 5.5 12 2
         Z"
      stroke="#e67315"
      strokeWidth="1.5"
      fill="url(#flameGradient)"
      fillOpacity="0.8"
    />

    {/* Noyau ardent animé */}
    <ellipse
      cx="14"
      cy="12"
      rx="3"
      ry="4"
      fill="#ffd5a3"
      opacity="0.7"
    >
      {animated && (
        <>
          <animate attributeName="ry" values="4;5;4" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
        </>
      )}
    </ellipse>

    {/* Reflet lumineux */}
    <ellipse
      cx="13"
      cy="9"
      rx="1.5"
      ry="2"
      fill="#fff"
      opacity="0.4"
    />
  </svg>
)

SoulFlameIcon.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  animated: PropTypes.bool
}

/**
 * Système de runes de difficulté (1-5)
 */
export const DifficultyRunes = ({ level, maxLevel = 5, size = 12 }) => (
  <div className="difficulty-runes" aria-label={`Difficulté ${level} sur ${maxLevel}`}>
    {[...Array(maxLevel)].map((_, index) => (
      <svg
        key={index}
        className={`difficulty-rune ${index < level ? 'active' : 'inactive'}`}
        viewBox="0 0 12 12"
        width={size}
        height={size}
        aria-hidden="true"
      >
        {index < level ? (
          // Rune pleine (active)
          <path
            d="M6 1 L10 6 L6 11 L2 6 Z"
            fill="#e67315"
            stroke="#c9a227"
            strokeWidth="0.5"
          />
        ) : (
          // Rune vide (inactive)
          <path
            d="M6 1 L10 6 L6 11 L2 6 Z"
            fill="none"
            stroke="#7a6454"
            strokeWidth="0.5"
            opacity="0.4"
          />
        )}
      </svg>
    ))}
  </div>
)

DifficultyRunes.propTypes = {
  level: PropTypes.number.isRequired,
  maxLevel: PropTypes.number,
  size: PropTypes.number
}

/**
 * Cercle de lueur faction derrière l'avatar
 */
export const FactionGlow = ({ color, className, animated = true }) => (
  <svg
    className={`faction-glow ${className || ''}`}
    viewBox="0 0 100 100"
    aria-hidden="true"
  >
    <defs>
      <radialGradient id={`factionGlow-${color.replace('#', '')}`}>
        <stop offset="0%" stopColor={color} stopOpacity="0.6" />
        <stop offset="50%" stopColor={color} stopOpacity="0.2" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle
      cx="50"
      cy="50"
      r="45"
      fill={`url(#factionGlow-${color.replace('#', '')})`}
    >
      {animated && (
        <>
          <animate attributeName="r" values="42;48;42" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
        </>
      )}
    </circle>
  </svg>
)

FactionGlow.propTypes = {
  color: PropTypes.string.isRequired,
  className: PropTypes.string,
  animated: PropTypes.bool
}

/**
 * Symbole de race tribal
 */
export const RaceSymbol = ({ raceId, size = 20, color = '#c9a227' }) => {
  const symbols = {
    human: (
      <path d="M10 3 L10 8 M6 5 L14 5 M10 8 L10 14 M6 14 L10 10 L14 14" strokeLinecap="round" />
    ),
    marked: (
      <path d="M10 2 L18 10 L10 18 L2 10 Z M10 6 L14 10 L10 14 L6 10 Z" />
    ),
    shade: (
      <path d="M10 2 C4 2 2 8 2 10 C2 14 6 18 10 18 C14 18 18 14 18 10 C18 8 16 2 10 2 M7 8 C7 8 6 12 10 12 C14 12 13 8 13 8" />
    ),
    ember: (
      <path d="M10 2 C8 5 6 6 6 9 C6 13 8 16 12 16 C16 16 18 13 18 9 C18 6 16 5 14 2 C13 4 11 4.5 10 2" />
    )
  }

  return (
    <svg
      className="race-symbol"
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {symbols[raceId] || symbols.human}
    </svg>
  )
}

RaceSymbol.propTypes = {
  raceId: PropTypes.oneOf(['human', 'marked', 'shade', 'ember']).isRequired,
  size: PropTypes.number,
  color: PropTypes.string
}

/**
 * Symbole de classe tribal
 */
export const ClassSymbol = ({ classId, size = 20, color = '#7a6454' }) => {
  const symbols = {
    warrior: (
      <>
        <path d="M10 2 L10 14" strokeWidth="2" />
        <path d="M6 5 L14 5" strokeWidth="1.5" />
        <circle cx="10" cy="17" r="2" fill={color} />
      </>
    ),
    shaman: (
      <>
        <circle cx="10" cy="6" r="4" />
        <path d="M10 10 L10 18" />
        <path d="M6 14 L14 14" />
      </>
    ),
    scout: (
      <>
        <circle cx="10" cy="10" r="3" />
        <circle cx="10" cy="10" r="6" strokeDasharray="2 2" />
        <path d="M10 2 L10 4 M10 16 L10 18 M2 10 L4 10 M16 10 L18 10" />
      </>
    ),
    healer: (
      <>
        <path d="M10 4 L10 16 M4 10 L16 10" strokeWidth="2" />
        <circle cx="10" cy="10" r="7" strokeDasharray="3 3" />
      </>
    ),
    mystic: (
      <>
        <path d="M10 2 L4 18 M10 2 L16 18 M6 12 L14 12" />
        <circle cx="10" cy="6" r="2" fill={color} />
      </>
    ),
    artisan: (
      <>
        <path d="M5 5 L5 15 L15 15 L15 5 Z" />
        <path d="M8 8 L12 8 L12 12 L8 12 Z" fill={color} />
        <path d="M10 2 L10 5 M10 15 L10 18" />
      </>
    )
  }

  return (
    <svg
      className="class-symbol"
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {symbols[classId] || symbols.warrior}
    </svg>
  )
}

ClassSymbol.propTypes = {
  classId: PropTypes.oneOf(['warrior', 'shaman', 'scout', 'healer', 'mystic', 'artisan']).isRequired,
  size: PropTypes.number,
  color: PropTypes.string
}

/**
 * Particules de cendres flottantes pour les cards
 */
// Valeurs aléatoires calculées une fois au chargement du module (hors render)
const ASH_PARTICLE_STYLES = [...Array(10)].map((_, i) => ({
  '--delay': `${i * 0.4}s`,
  '--x-offset': `${(Math.random() - 0.5) * 40}px`,
  '--duration': `${2 + Math.random() * 2}s`
}))

export const AshParticles = ({ count = 5, className }) => (
  <div className={`ash-particles ${className || ''}`} aria-hidden="true">
    {ASH_PARTICLE_STYLES.slice(0, count).map((style, i) => (
      <span
        key={i}
        className="ash-particle"
        style={style}
      />
    ))}
  </div>
)

AshParticles.propTypes = {
  count: PropTypes.number,
  className: PropTypes.string
}

/**
 * Ornement décoratif pour la modal
 */
export const ModalOrnament = ({ position = 'top', width = 200 }) => (
  <svg
    className={`modal-ornament modal-ornament--${position}`}
    viewBox="0 0 200 30"
    width={width}
    height={30}
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ornamentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7a6454" stopOpacity="0" />
        <stop offset="30%" stopColor="#c9a227" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#e67315" stopOpacity="1" />
        <stop offset="70%" stopColor="#c9a227" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#7a6454" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* Ligne centrale */}
    <line x1="20" y1="15" x2="180" y2="15" stroke="url(#ornamentGradient)" strokeWidth="1" />

    {/* Diamant central */}
    <path d="M100 8 L107 15 L100 22 L93 15 Z" fill="#e67315" opacity="0.8" />

    {/* Motifs latéraux */}
    <g opacity="0.6">
      <path d="M40 15 L50 10 L50 20 Z" fill="#c9a227" />
      <path d="M160 15 L150 10 L150 20 Z" fill="#c9a227" />
      <circle cx="70" cy="15" r="2" fill="#7a6454" />
      <circle cx="130" cy="15" r="2" fill="#7a6454" />
    </g>
  </svg>
)

ModalOrnament.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom']),
  width: PropTypes.number
}

export default {
  SoulShardBorder,
  SoulFlameIcon,
  DifficultyRunes,
  FactionGlow,
  RaceSymbol,
  ClassSymbol,
  AshParticles,
  ModalOrnament
}
