import { useNavigate } from 'react-router-dom'
import ErrorPage from '../../components/errors/ErrorPage'
import { Home, LogIn } from 'lucide-react'

/**
 * GuardianTotemIllustration - Totem gardien (403)
 * Représente le territoire sacré protégé par les Anciens
 */
const GuardianTotemIllustration = () => {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Lueur sacrée en arrière-plan */}
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="url(#totem-glow)"
        opacity="0.3"
        className="totem-glow"
      />

      {/* Définition des gradients */}
      <defs>
        <radialGradient id="totem-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e67315" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#ff9635" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ffd5a3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="wood-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#7a6454" />
          <stop offset="50%" stopColor="#5e4d40" />
          <stop offset="100%" stopColor="#453930" />
        </linearGradient>
      </defs>

      {/* Base du totem - socle de pierre */}
      <rect
        x="70"
        y="170"
        width="60"
        height="20"
        rx="2"
        fill="#64707e"
        opacity="0.7"
      />
      <rect
        x="75"
        y="165"
        width="50"
        height="10"
        rx="1"
        fill="#8f99a5"
        opacity="0.5"
      />

      {/* Corps principal du totem */}
      <rect
        x="80"
        y="60"
        width="40"
        height="110"
        rx="3"
        fill="url(#wood-gradient)"
      />

      {/* Textures du bois - rayures verticales */}
      <g opacity="0.3">
        <line x1="85" y1="65" x2="85" y2="165" stroke="#2f2722" strokeWidth="1" />
        <line x1="92" y1="70" x2="92" y2="160" stroke="#2f2722" strokeWidth="0.5" />
        <line x1="100" y1="65" x2="100" y2="165" stroke="#2f2722" strokeWidth="1" />
        <line x1="108" y1="70" x2="108" y2="160" stroke="#2f2722" strokeWidth="0.5" />
        <line x1="115" y1="65" x2="115" y2="165" stroke="#2f2722" strokeWidth="1" />
      </g>

      {/* Tête du totem - masque gardien */}
      <g>
        {/* Forme principale de la tête */}
        <path
          d="M 70 35 Q 70 25 80 20 L 120 20 Q 130 25 130 35 L 130 70 Q 125 80 100 80 Q 75 80 70 70 Z"
          fill="url(#wood-gradient)"
        />

        {/* Front avec motifs tribaux */}
        <path
          d="M 85 30 L 90 25 L 95 30 M 105 30 L 110 25 L 115 30"
          stroke="#e67315"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Yeux gardiens - avec animation de clignement */}
        <g className="guardian-eyes">
          {/* Oeil gauche */}
          <ellipse cx="88" cy="48" rx="8" ry="12" fill="#1c1714" />
          <ellipse cx="88" cy="48" rx="5" ry="8" fill="#e67315" opacity="0.7" />
          <circle cx="88" cy="45" r="2" fill="#fff8ed" />

          {/* Oeil droit */}
          <ellipse cx="112" cy="48" rx="8" ry="12" fill="#1c1714" />
          <ellipse cx="112" cy="48" rx="5" ry="8" fill="#e67315" opacity="0.7" />
          <circle cx="112" cy="45" r="2" fill="#fff8ed" />
        </g>

        {/* Marque frontale - symbole de protection */}
        <circle cx="100" cy="35" r="4" fill="#c2580d" opacity="0.7" />
        <circle cx="100" cy="35" r="2" fill="#e67315" />

        {/* Nez tribal */}
        <path
          d="M 100 52 L 95 60 L 100 63 L 105 60 Z"
          fill="#5e4d40"
        />

        {/* Bouche gardienne */}
        <path
          d="M 85 68 Q 100 75 115 68"
          stroke="#2f2722"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Dents stylisées */}
        <g opacity="0.5">
          <line x1="90" y1="70" x2="90" y2="73" stroke="#f5f3f0" strokeWidth="2" />
          <line x1="100" y1="72" x2="100" y2="75" stroke="#f5f3f0" strokeWidth="2" />
          <line x1="110" y1="70" x2="110" y2="73" stroke="#f5f3f0" strokeWidth="2" />
        </g>
      </g>

      {/* Bras/ailes protectrices */}
      <g opacity="0.8">
        {/* Bras gauche */}
        <path
          d="M 80 90 Q 50 95 40 105 L 35 100 Q 45 90 80 85"
          fill="#7a6454"
          stroke="#5e4d40"
          strokeWidth="2"
        />
        {/* Griffes gauche */}
        <path d="M 35 100 L 30 105 M 35 100 L 32 108" stroke="#2f2722" strokeWidth="2" strokeLinecap="round" />

        {/* Bras droit */}
        <path
          d="M 120 90 Q 150 95 160 105 L 165 100 Q 155 90 120 85"
          fill="#7a6454"
          stroke="#5e4d40"
          strokeWidth="2"
        />
        {/* Griffes droit */}
        <path d="M 165 100 L 170 105 M 165 100 L 168 108" stroke="#2f2722" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Motifs tribaux sur le corps */}
      <g opacity="0.6">
        {/* Losanges sacrés */}
        <path d="M 100 95 L 105 100 L 100 105 L 95 100 Z" fill="none" stroke="#e67315" strokeWidth="2" />
        <path d="M 100 115 L 105 120 L 100 125 L 95 120 Z" fill="none" stroke="#e67315" strokeWidth="2" />
        <path d="M 100 135 L 105 140 L 100 145 L 95 140 Z" fill="none" stroke="#e67315" strokeWidth="2" />

        {/* Lignes rituelles horizontales */}
        <line x1="85" y1="110" x2="115" y2="110" stroke="#c2580d" strokeWidth="1" />
        <line x1="85" y1="130" x2="115" y2="130" stroke="#c2580d" strokeWidth="1" />
        <line x1="85" y1="150" x2="115" y2="150" stroke="#c2580d" strokeWidth="1" />
      </g>

      {/* Flammes sacrées à la base du totem */}
      <g>
        {/* Flamme gauche */}
        <path
          className="flame-sacred"
          d="M 60 160 Q 58 150 60 145 Q 62 150 65 155 Q 63 158 60 160"
          fill="#e67315"
          opacity="0.7"
        />
        <path
          className="flame-sacred"
          d="M 60 155 Q 59 150 60 147 Q 61 150 62 153"
          fill="#ffd5a3"
          opacity="0.9"
        />

        {/* Flamme centrale gauche */}
        <path
          className="flame-sacred"
          d="M 75 165 Q 73 155 75 148 Q 77 155 80 162 Q 78 165 75 165"
          fill="#ff9635"
          opacity="0.8"
        />

        {/* Flamme centrale droite */}
        <path
          className="flame-sacred"
          d="M 125 165 Q 123 155 125 148 Q 127 155 130 162 Q 128 165 125 165"
          fill="#ff9635"
          opacity="0.8"
        />

        {/* Flamme droite */}
        <path
          className="flame-sacred"
          d="M 140 160 Q 138 150 140 145 Q 142 150 145 155 Q 143 158 140 160"
          fill="#e67315"
          opacity="0.7"
        />
        <path
          className="flame-sacred"
          d="M 140 155 Q 139 150 140 147 Q 141 150 142 153"
          fill="#ffd5a3"
          opacity="0.9"
        />
      </g>

      {/* Runes de protection autour */}
      <g opacity="0.4">
        <text x="30" y="60" fontFamily="serif" fontSize="16" fill="#c2580d">᛫</text>
        <text x="160" y="60" fontFamily="serif" fontSize="16" fill="#c2580d">᛫</text>
        <text x="30" y="120" fontFamily="serif" fontSize="16" fill="#c2580d">⚝</text>
        <text x="160" y="120" fontFamily="serif" fontSize="16" fill="#c2580d">⚝</text>
      </g>
    </svg>
  )
}

/**
 * Forbidden - Page 403
 * "Territoire Interdit" - Zone protégée par les Anciens
 */
const Forbidden = ({ userAuthenticated = false }) => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  const handleLogin = () => {
    navigate('/login', { state: { from: window.location.pathname } })
  }

  // Actions en fonction de l'état d'authentification
  const actions = userAuthenticated
    ? [
        {
          label: 'Retour à l\'accueil',
          onClick: handleGoHome,
          variant: 'primary',
          icon: <Home className="w-5 h-5" />
        }
      ]
    : [
        {
          label: 'Retour à l\'accueil',
          onClick: handleGoHome,
          variant: 'primary',
          icon: <Home className="w-5 h-5" />
        },
        {
          label: 'Se connecter',
          onClick: handleLogin,
          variant: 'secondary',
          icon: <LogIn className="w-5 h-5" />
        }
      ]

  return (
    <ErrorPage
      code="403"
      title="Territoire Interdit"
      message="Ce territoire sacré est gardé par les Anciens. Seuls les initiés peuvent franchir ce seuil."
      secondaryMessage={
        userAuthenticated
          ? "Vos privilèges actuels ne vous permettent pas d'accéder à cette zone protégée."
          : "Vous devez vous identifier auprès des gardiens pour accéder à ce sanctuaire."
      }
      illustration={<GuardianTotemIllustration />}
      actions={actions}
      backgroundGradient="bg-gradient-to-b from-error-light/10 via-neutral-50 to-error-dark/5"
      codeColor="text-error-DEFAULT"
    />
  )
}

export default Forbidden
