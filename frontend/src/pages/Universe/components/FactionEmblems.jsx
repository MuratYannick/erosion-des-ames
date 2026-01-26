/**
 * Emblèmes SVG des factions - Composants React inline
 * Chaque emblème utilise currentColor pour s'adapter aux couleurs de la faction
 */

const svgProps = {
  viewBox: "0 0 100 100",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}

export const StoneGuardianEmblem = ({ className, ...props }) => (
  <svg {...svgProps} className={className} {...props}>
    <title>Gardiens de Pierre</title>
    {/* Bouclier de protection */}
    <path d="M50 10 L70 20 L75 45 Q75 70 50 90 Q25 70 25 45 L30 20 Z" fill="none"/>
    {/* Rune centrale de stabilité */}
    <path d="M50 30 L50 70 M35 40 L65 40 M35 60 L65 60"/>
    {/* Angles de fondation */}
    <path d="M40 35 L35 40 L40 45 M60 35 L65 40 L60 45"/>
    <path d="M40 55 L35 60 L40 65 M60 55 L65 60 L60 65"/>
    {/* Cercle de mémoire */}
    <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.3"/>
  </svg>
)

export const FlameBearerEmblem = ({ className, ...props }) => (
  <svg {...svgProps} className={className} {...props}>
    <title>Porteurs de Flamme</title>
    {/* Flamme principale */}
    <path d="M50 85 Q45 70 45 60 Q45 45 50 30 Q55 45 55 60 Q55 70 50 85 Z" fill="currentColor" opacity="0.2"/>
    {/* Langues de feu */}
    <path d="M40 70 Q35 60 38 50 Q40 58 45 60"/>
    <path d="M60 70 Q65 60 62 50 Q60 58 55 60"/>
    {/* Braise sacrée (coeur) */}
    <circle cx="50" cy="55" r="6" fill="currentColor"/>
    {/* Rayons tribaux */}
    <path d="M50 25 L50 15 M42 28 L36 22 M58 28 L64 22"/>
    <path d="M35 45 L25 45 M65 45 L75 45"/>
    {/* Socle rituel */}
    <path d="M35 85 L65 85 M38 88 L62 88"/>
  </svg>
)

export const ShadowHunterEmblem = ({ className, ...props }) => (
  <svg {...svgProps} className={className} {...props}>
    <title>Chasseurs d'Ombres</title>
    {/* Croissant de lune (vision nocturne) */}
    <path d="M50 15 Q60 15 65 25 Q68 35 65 45 Q60 55 50 55 Q55 45 55 30 Q55 20 50 15 Z" fill="currentColor" opacity="0.2"/>
    {/* Griffe de prédateur */}
    <path d="M35 45 L30 65 M40 42 L35 62 M45 40 L42 60"/>
    <path d="M65 45 L70 65 M60 42 L65 62 M55 40 L58 60"/>
    {/* Oeil du chasseur */}
    <ellipse cx="50" cy="50" rx="12" ry="8"/>
    <circle cx="50" cy="50" r="4" fill="currentColor"/>
    {/* Traces de proie */}
    <path d="M30 75 L33 72 M35 80 L38 77 M40 85 L43 82"/>
    <path d="M70 75 L67 72 M65 80 L62 77 M60 85 L57 82"/>
  </svg>
)

export const AshWeaverEmblem = ({ className, ...props }) => (
  <svg {...svgProps} className={className} {...props}>
    <title>Tisserands de Cendres</title>
    {/* Spirale de vie (cycle éternel) */}
    <path d="M50 50 Q55 48 58 50 Q60 55 58 58 Q53 60 50 58 Q47 53 50 50 M58 50 Q65 45 70 50 Q75 60 70 68 Q60 73 50 68 Q40 60 43 50 Q48 40 58 40" fill="none"/>
    {/* Pousse végétale (renaissance) */}
    <path d="M50 50 L50 25 M45 35 Q45 30 50 28 M55 35 Q55 30 50 28"/>
    <path d="M50 30 Q42 28 40 35 M50 35 Q58 33 60 40"/>
    {/* Racines (connexion) */}
    <path d="M50 50 L45 65 Q42 70 38 72 M50 50 L50 70 M50 50 L55 65 Q58 70 62 72"/>
    {/* Cercles de cendre */}
    <circle cx="35" cy="45" r="3" opacity="0.4"/>
    <circle cx="65" cy="45" r="3" opacity="0.4"/>
    <circle cx="50" cy="78" r="3" opacity="0.4"/>
  </svg>
)

export const RuinExplorerEmblem = ({ className, ...props }) => (
  <svg {...svgProps} className={className} {...props}>
    <title>Éclaireurs des Ruines</title>
    {/* Boussole ancienne */}
    <circle cx="50" cy="50" r="30"/>
    <circle cx="50" cy="50" r="25"/>
    {/* Points cardinaux */}
    <path d="M50 20 L50 27 L48 25 L50 20 L52 25 Z" fill="currentColor"/>
    <path d="M80 50 L73 50 L75 48 L80 50 L75 52 Z" fill="currentColor"/>
    <path d="M50 80 L50 73 M48 75 L50 80 L52 75"/>
    <path d="M20 50 L27 50 M25 48 L20 50 L25 52"/>
    {/* Runes de direction */}
    <path d="M50 40 L50 50 L58 46"/>
    {/* Cercle central (savoir) */}
    <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.3"/>
    {/* Étoiles de navigation */}
    <path d="M35 30 L36 33 L35 30 L32 31 M65 30 L64 33 L65 30 L68 31"/>
    <path d="M35 70 L36 67 L35 70 L32 69 M65 70 L64 67 L65 70 L68 69"/>
  </svg>
)
