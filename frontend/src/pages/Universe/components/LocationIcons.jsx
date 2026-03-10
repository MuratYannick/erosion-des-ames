/**
 * LocationIcons.jsx
 * Icônes SVG pour les types de lieux
 * Style: Tribal, gravé, simple et reconnaissable
 */

/**
 * Icône Ruines - Architecture brisée
 */
export const RuinsIcon = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <title>Ruines</title>
    {/* Colonnes brisées */}
    <path d="M3 21 L3 12 L5 12 L5 21" />
    <path d="M7 21 L7 8 L9 8 L9 21" />
    <path d="M15 21 L15 10 L17 10 L17 21" />
    <path d="M19 21 L19 6 L21 6 L21 21" />
    {/* Ligne de sol */}
    <line x1="2" y1="21" x2="22" y2="21" strokeWidth="2.5" />
    {/* Fissures */}
    <path d="M4 15 L4 14 M8 12 L8 10 M16 14 L16 13 M20 10 L20 8" strokeWidth="1" opacity="0.6" />
    {/* Débris */}
    <path d="M11 20 L12 19 L13 20 M11 18 L11.5 17.5 L12 18" strokeWidth="1.5" />
  </svg>
)

/**
 * Icône Sanctuaire - Flamme sacrée dans un temple
 */
export const SanctuaryIcon = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <title>Sanctuaire</title>
    {/* Temple structure */}
    <path d="M3 21 L3 11 L12 4 L21 11 L21 21 Z" />
    {/* Flamme centrale */}
    <path d="M12 16 C12 16 10 14.5 10 13 C10 11.5 12 10 12 10 C12 10 14 11.5 14 13 C14 14.5 12 16 12 16 Z" fill="currentColor" opacity="0.3" />
    <path d="M12 14 C12 14 11 13 11 12.5 C11 12 12 11 12 11 C12 11 13 12 13 12.5 C13 13 12 14 12 14 Z" />
    {/* Base d'autel */}
    <rect x="9" y="16" width="6" height="2" />
    {/* Marches */}
    <line x1="6" y1="21" x2="18" y2="21" strokeWidth="1.5" />
    <line x1="7" y1="19" x2="17" y2="19" strokeWidth="1" opacity="0.5" />
  </svg>
)

/**
 * Icône Désert - Dunes et soleil ardent
 */
export const DesertIcon = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <title>Désert</title>
    {/* Soleil ardent */}
    <circle cx="18" cy="6" r="3" opacity="0.6" />
    <path d="M18 2 L18 3.5 M18 8.5 L18 10 M14 6 L15.5 6 M20.5 6 L22 6" strokeWidth="1.5" opacity="0.4" />
    {/* Dunes */}
    <path d="M2 18 Q6 14 10 16 T18 14 T22 18" fill="none" />
    <path d="M2 21 Q7 17 12 19 T20 17 T22 21" fill="none" opacity="0.5" />
    {/* Cactus/plante morte */}
    <path d="M6 21 L6 15 M5 17 L7 17" strokeWidth="1.5" />
    <circle cx="6" cy="14.5" r="0.5" fill="currentColor" />
  </svg>
)

/**
 * Icône Forêt - Arbres pétrifiés
 */
export const ForestIcon = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <title>Forêt</title>
    {/* Arbre gauche - tordu */}
    <path d="M6 21 L6 12 C6 12 5 10 7 8 C9 6 8 5 8 5" strokeWidth="1.8" />
    <path d="M5 10 C5 10 4 9 5 7 L7 9" fill="none" strokeWidth="1" opacity="0.6" />
    {/* Arbre central - grand */}
    <path d="M12 21 L12 9" strokeWidth="2" />
    <path d="M12 9 C12 9 9 8 9 5 C9 2 12 2 12 2 C12 2 15 2 15 5 C15 8 12 9 12 9" opacity="0.4" />
    <path d="M10 12 L14 12 M9 15 L15 15" strokeWidth="1" opacity="0.5" />
    {/* Arbre droit - cassé */}
    <path d="M18 21 L18 13 L19 11 L20 10" strokeWidth="1.8" />
    <path d="M17 15 L19 15" strokeWidth="1" opacity="0.6" />
    {/* Sol */}
    <path d="M2 21 L22 21" strokeWidth="1.5" opacity="0.3" />
  </svg>
)

/**
 * Icône Gouffre - Abîme béant
 */
export const ChasmIcon = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <title>Gouffre</title>
    {/* Bords du gouffre */}
    <path d="M2 8 L8 12 L10 11" />
    <path d="M22 8 L16 12 L14 11" />
    {/* Faille centrale */}
    <path d="M10 11 L10 22 M14 11 L14 22" strokeWidth="1.5" opacity="0.8" />
    <path d="M10 11 Q12 14 14 11" opacity="0.6" />
    {/* Profondeur - lignes internes */}
    <line x1="10" y1="14" x2="11" y2="14" strokeWidth="1" opacity="0.4" />
    <line x1="13" y1="14" x2="14" y2="14" strokeWidth="1" opacity="0.4" />
    <line x1="10" y1="17" x2="11.5" y2="17" strokeWidth="1" opacity="0.3" />
    <line x1="12.5" y1="17" x2="14" y2="17" strokeWidth="1" opacity="0.3" />
    <line x1="10" y1="20" x2="12" y2="20" strokeWidth="1" opacity="0.2" />
    <line x1="12" y1="20" x2="14" y2="20" strokeWidth="1" opacity="0.2" />
    {/* Lueurs des profondeurs */}
    <circle cx="11" cy="19" r="0.5" fill="currentColor" opacity="0.6" />
    <circle cx="13" cy="21" r="0.5" fill="currentColor" opacity="0.5" />
    {/* Fissures sur les bords */}
    <path d="M5 10 L6 11 M18 10 L17 11" strokeWidth="1" opacity="0.5" />
  </svg>
)

/**
 * Icône Refuge - Fortification
 */
export const SettlementIcon = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <title>Refuge</title>
    {/* Murs fortifiés */}
    <path d="M3 21 L3 12 L5 12 L5 10 L7 10 L7 12 L9 12 L9 10 L11 10 L11 12 L21 12 L21 21" />
    {/* Tour de guet */}
    <rect x="15" y="6" width="4" height="15" />
    <path d="M14 6 L14 5 L20 5 L20 6 M15 8 L17 8 M15 10 L17 10" strokeWidth="1.5" />
    {/* Porte */}
    <rect x="8" y="15" width="4" height="6" opacity="0.5" />
    <line x1="10" y1="15" x2="10" y2="21" strokeWidth="1" opacity="0.7" />
    {/* Fenêtres/meurtrières */}
    <line x1="5" y1="15" x2="5" y2="16" strokeWidth="1.5" />
    <line x1="5" y1="18" x2="5" y2="19" strokeWidth="1.5" />
    {/* Bannière */}
    <path d="M17 3 L17 7 M17 3 L19 4 L17 5" strokeWidth="1" opacity="0.6" />
  </svg>
)

