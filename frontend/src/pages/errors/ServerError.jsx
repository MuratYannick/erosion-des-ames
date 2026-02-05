import { useNavigate } from 'react-router-dom'
import ErrorPage from '../../components/errors/ErrorPage'
import { RefreshCw, Home } from 'lucide-react'

/**
 * ChaoticVortexIllustration - Vortex chaotique (500)
 * Représente le déséquilibre des forces primordiales
 */
const ChaoticVortexIllustration = () => {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Définition des gradients pour l'énergie chaotique */}
      <defs>
        <radialGradient id="vortex-energy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff9635" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#e67315" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#944210" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6b3212" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="vortex-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd5a3" />
          <stop offset="50%" stopColor="#ffb86a" />
          <stop offset="100%" stopColor="#ff9635" />
        </radialGradient>
      </defs>

      {/* Lueur énergétique de base */}
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="url(#vortex-energy)"
        opacity="0.3"
      />

      {/* Spirale extérieure - rotation lente */}
      <g className="vortex-outer">
        {/* Bras spiraux externes */}
        <path
          d="M 100 20 Q 140 30 160 60 Q 175 90 170 120 Q 160 150 130 170 Q 100 185 70 175 Q 40 160 28 130 Q 18 100 30 70 Q 45 40 75 25 Q 90 20 100 20"
          stroke="#e67315"
          strokeWidth="3"
          fill="none"
          opacity="0.6"
          strokeDasharray="8 4"
        />

        {/* Deuxième couche de spirale */}
        <path
          d="M 100 30 Q 130 38 147 63 Q 158 88 155 113 Q 148 138 125 155 Q 100 167 75 160 Q 50 148 40 123 Q 32 98 40 73 Q 52 48 77 35 Q 90 30 100 30"
          stroke="#ff9635"
          strokeWidth="2.5"
          fill="none"
          opacity="0.5"
          strokeDasharray="6 3"
        />

        {/* Marques d'énergie externes */}
        <circle cx="100" cy="20" r="4" fill="#ffd5a3" opacity="0.7" />
        <circle cx="160" cy="60" r="3" fill="#ffb86a" opacity="0.6" />
        <circle cx="170" cy="120" r="3.5" fill="#ff9635" opacity="0.65" />
        <circle cx="130" cy="170" r="3" fill="#e67315" opacity="0.6" />
        <circle cx="70" cy="175" r="3.5" fill="#ffd5a3" opacity="0.7" />
        <circle cx="28" cy="130" r="3" fill="#ffb86a" opacity="0.6" />
        <circle cx="30" cy="70" r="4" fill="#ff9635" opacity="0.65" />
        <circle cx="75" cy="25" r="3" fill="#e67315" opacity="0.6" />
      </g>

      {/* Spirale intermédiaire - rotation inverse */}
      <g className="vortex-inner">
        <path
          d="M 100 45 Q 120 50 135 68 Q 145 85 143 105 Q 138 125 120 140 Q 100 150 80 143 Q 60 133 52 113 Q 46 93 53 75 Q 63 57 83 48 Q 93 45 100 45"
          stroke="#ff9635"
          strokeWidth="3"
          fill="none"
          opacity="0.7"
        />

        <path
          d="M 100 55 Q 115 58 127 72 Q 135 87 133 103 Q 129 119 115 130 Q 100 138 85 132 Q 70 123 64 108 Q 59 93 65 78 Q 73 63 88 56 Q 95 55 100 55"
          stroke="#ffb86a"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />

        {/* Fragments chaotiques */}
        <circle cx="120" cy="68" r="2.5" fill="#ffd5a3" opacity="0.8" />
        <circle cx="143" cy="105" r="2" fill="#ff9635" opacity="0.7" />
        <circle cx="120" cy="140" r="2.5" fill="#ffb86a" opacity="0.75" />
        <circle cx="80" cy="143" r="2" fill="#ffd5a3" opacity="0.8" />
        <circle cx="52" cy="113" r="2.5" fill="#ff9635" opacity="0.7" />
        <circle cx="65" cy="78" r="2" fill="#ffb86a" opacity="0.75" />
      </g>

      {/* Noyau central - pulsation */}
      <g>
        <circle cx="100" cy="100" r="25" fill="url(#vortex-core)" opacity="0.8" />
        <circle cx="100" cy="100" r="18" fill="#ffd5a3" opacity="0.6" />
        <circle cx="100" cy="100" r="12" fill="#fff8ed" opacity="0.9" />
        <circle cx="100" cy="100" r="6" fill="#e67315" opacity="1" />

        {/* Croix énergétique au centre */}
        <line x1="100" y1="88" x2="100" y2="112" stroke="#fff8ed" strokeWidth="2" opacity="0.7" />
        <line x1="88" y1="100" x2="112" y2="100" stroke="#fff8ed" strokeWidth="2" opacity="0.7" />
      </g>

      {/* Particules énergétiques échappées */}
      <g className="energy-particles">
        <circle className="energy-particle" cx="100" cy="100" r="2.5" fill="#ff9635" opacity="0" />
        <circle className="energy-particle" cx="100" cy="100" r="2" fill="#ffd5a3" opacity="0" />
        <circle className="energy-particle" cx="100" cy="100" r="2.5" fill="#ffb86a" opacity="0" />
        <circle className="energy-particle" cx="100" cy="100" r="2" fill="#ff9635" opacity="0" />
      </g>

      {/* Éclairs/fissures énergétiques */}
      <g opacity="0.5">
        <path
          d="M 100 75 L 95 65 L 98 60 L 93 50"
          stroke="#ffd5a3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 125 100 L 135 98 L 142 100 L 150 95"
          stroke="#ffb86a"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 100 125 L 103 135 L 100 140 L 105 150"
          stroke="#ff9635"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 75 100 L 65 103 L 58 100 L 50 105"
          stroke="#ffd5a3"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Cercles concentriques déformés */}
      <g opacity="0.3">
        <ellipse cx="100" cy="100" rx="40" ry="38" stroke="#e67315" strokeWidth="1" fill="none" />
        <ellipse cx="100" cy="100" rx="60" ry="62" stroke="#944210" strokeWidth="0.8" fill="none" strokeDasharray="4 2" />
        <ellipse cx="100" cy="100" rx="78" ry="75" stroke="#6b3212" strokeWidth="0.6" fill="none" strokeDasharray="3 3" />
      </g>

      {/* Symboles runiques déstabilisés */}
      <g opacity="0.4">
        <text x="100" y="15" fontFamily="serif" fontSize="12" fill="#944210" textAnchor="middle">⚡</text>
        <text x="180" y="100" fontFamily="serif" fontSize="12" fill="#c2580d" textAnchor="middle">✦</text>
        <text x="100" y="192" fontFamily="serif" fontSize="12" fill="#944210" textAnchor="middle">⚡</text>
        <text x="20" y="100" fontFamily="serif" fontSize="12" fill="#c2580d" textAnchor="middle">✦</text>
      </g>

      {/* Fragments flottants */}
      <g opacity="0.5">
        <rect x="145" y="45" width="3" height="8" rx="1" fill="#9d8570" transform="rotate(25 146.5 49)" />
        <rect x="50" y="145" width="2.5" height="6" rx="1" fill="#7a6454" transform="rotate(-15 51.25 148)" />
        <polygon points="160,135 163,140 157,140" fill="#8f99a5" opacity="0.6" />
        <polygon points="40,60 43,65 37,65" fill="#64707e" opacity="0.6" />
      </g>
    </svg>
  )
}

/**
 * ServerError - Page 500
 * "Perturbation Spirituelle" - Déséquilibre des forces primordiales
 */
const ServerError = ({ onRetry }) => {
  const navigate = useNavigate()

  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else {
      // Recharger la page
      window.location.reload()
    }
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const actions = [
    {
      label: 'Réessayer',
      onClick: handleRetry,
      variant: 'primary',
      icon: <RefreshCw className="w-5 h-5" />
    },
    {
      label: 'Retour à l\'accueil',
      onClick: handleGoHome,
      variant: 'secondary',
      icon: <Home className="w-5 h-5" />
    }
  ]

  return (
    <ErrorPage
      code="500"
      title="Perturbation Spirituelle"
      message="Les forces primordiales sont en déséquilibre. Une perturbation spirituelle affecte nos systèmes."
      secondaryMessage="Les Anciens travaillent à rétablir l'harmonie. Veuillez patienter ou réessayer dans quelques instants."
      illustration={<ChaoticVortexIllustration />}
      actions={actions}
      backgroundGradient="bg-gradient-to-b from-warning-light/15 via-neutral-50 to-secondary-900/20"
      codeColor="text-secondary-600"
    />
  )
}

export default ServerError
