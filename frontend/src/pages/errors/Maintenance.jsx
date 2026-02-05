import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ErrorPage from '../../components/errors/ErrorPage'
import { RefreshCw, Clock } from 'lucide-react'

/**
 * RitualAltarIllustration - Autel rituel (Maintenance)
 * Représente le rituel de restauration effectué par les Anciens
 */
const RitualAltarIllustration = () => {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Définition des gradients */}
      <defs>
        <radialGradient id="altar-glow" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#ffd5a3" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ff9635" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e67315" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="stone-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8f99a5" />
          <stop offset="50%" stopColor="#64707e" />
          <stop offset="100%" stopColor="#4a5563" />
        </linearGradient>
        <linearGradient id="flame-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#e67315" />
          <stop offset="50%" stopColor="#ff9635" />
          <stop offset="100%" stopColor="#ffd5a3" />
        </linearGradient>
      </defs>

      {/* Lueur sacrée de l'autel */}
      <ellipse
        cx="100"
        cy="120"
        rx="80"
        ry="60"
        fill="url(#altar-glow)"
        className="altar-glow"
      />

      {/* Sol/base en pierre */}
      <ellipse
        cx="100"
        cy="175"
        rx="90"
        ry="15"
        fill="#64707e"
        opacity="0.4"
      />
      <ellipse
        cx="100"
        cy="173"
        rx="85"
        ry="12"
        fill="#8f99a5"
        opacity="0.3"
      />

      {/* Structure de l'autel - base */}
      <g>
        {/* Base large */}
        <rect
          x="50"
          y="155"
          width="100"
          height="20"
          rx="2"
          fill="url(#stone-gradient)"
        />

        {/* Étage intermédiaire */}
        <rect
          x="60"
          y="140"
          width="80"
          height="18"
          rx="1.5"
          fill="url(#stone-gradient)"
        />

        {/* Plateforme supérieure */}
        <rect
          x="70"
          y="127"
          width="60"
          height="15"
          rx="1"
          fill="url(#stone-gradient)"
        />

        {/* Textures de pierre */}
        <g opacity="0.3">
          <line x1="55" y1="157" x2="145" y2="157" stroke="#2f2722" strokeWidth="0.5" />
          <line x1="55" y1="165" x2="145" y2="165" stroke="#2f2722" strokeWidth="0.5" />
          <line x1="65" y1="145" x2="135" y2="145" stroke="#2f2722" strokeWidth="0.5" />
          <line x1="75" y1="133" x2="125" y2="133" stroke="#2f2722" strokeWidth="0.5" />
        </g>
      </g>

      {/* Vasques de feu rituelles */}
      <g>
        {/* Vasque gauche */}
        <ellipse cx="75" cy="125" rx="8" ry="4" fill="#5e4d40" />
        <ellipse cx="75" cy="124" rx="7" ry="3" fill="#7a6454" />

        {/* Vasque droite */}
        <ellipse cx="125" cy="125" rx="8" ry="4" fill="#5e4d40" />
        <ellipse cx="125" cy="124" rx="7" ry="3" fill="#7a6454" />
      </g>

      {/* Flammes rituelles - vasque gauche */}
      <g>
        {/* Flamme principale gauche */}
        <path
          className="ritual-flame"
          d="M 75 120 Q 72 108 74 98 Q 76 105 79 115 Q 77 120 75 120"
          fill="url(#flame-gradient)"
          opacity="0.85"
        />
        <path
          className="ritual-flame"
          d="M 75 112 Q 74 106 75 102 Q 76 106 77 110"
          fill="#ffd5a3"
          opacity="0.9"
        />

        {/* Petite flamme secondaire */}
        <path
          className="ritual-flame"
          d="M 70 118 Q 69 112 70 108 Q 71 112 72 116"
          fill="#ff9635"
          opacity="0.7"
        />
      </g>

      {/* Flammes rituelles - vasque droite */}
      <g>
        {/* Flamme principale droite */}
        <path
          className="ritual-flame"
          d="M 125 120 Q 122 108 124 98 Q 126 105 129 115 Q 127 120 125 120"
          fill="url(#flame-gradient)"
          opacity="0.85"
        />
        <path
          className="ritual-flame"
          d="M 125 112 Q 124 106 125 102 Q 126 106 127 110"
          fill="#ffd5a3"
          opacity="0.9"
        />

        {/* Petite flamme secondaire */}
        <path
          className="ritual-flame"
          d="M 130 118 Q 129 112 130 108 Q 131 112 132 116"
          fill="#ff9635"
          opacity="0.7"
        />
      </g>

      {/* Flamme centrale principale de l'autel */}
      <g>
        <path
          className="ritual-flame"
          d="M 100 125 Q 95 105 97 85 Q 100 100 105 120 Q 102 125 100 125"
          fill="url(#flame-gradient)"
          opacity="0.9"
        />
        <path
          className="ritual-flame"
          d="M 100 110 Q 98 100 99 92 Q 100 100 102 108"
          fill="#fff8ed"
          opacity="0.85"
        />
        <path
          className="ritual-flame"
          d="M 100 95 Q 99 90 100 86 Q 101 90 101 93"
          fill="#ffd5a3"
        />
      </g>

      {/* Fumée mystique */}
      <g>
        <ellipse
          className="ritual-smoke"
          cx="100"
          cy="80"
          rx="8"
          ry="12"
          fill="#d4d8dd"
          opacity="0"
        />
        <ellipse
          className="ritual-smoke"
          cx="75"
          cy="95"
          rx="6"
          ry="10"
          fill="#e9ecef"
          opacity="0"
        />
        <ellipse
          className="ritual-smoke"
          cx="125"
          cy="95"
          rx="6"
          ry="10"
          fill="#e9ecef"
          opacity="0"
        />
      </g>

      {/* Cercle rituel au sol */}
      <g opacity="0.4">
        <circle cx="100" cy="140" r="45" stroke="#e67315" strokeWidth="2" fill="none" strokeDasharray="6 4" />
        <circle cx="100" cy="140" r="50" stroke="#c2580d" strokeWidth="1" fill="none" strokeDasharray="4 3" />
        <circle cx="100" cy="140" r="55" stroke="#944210" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
      </g>

      {/* Symboles runiques autour de l'autel */}
      <g opacity="0.5">
        {/* Points cardinaux */}
        <g>
          {/* Nord */}
          <circle cx="100" cy="85" r="3" fill="#e67315" />
          <path d="M 100 82 L 98 77 L 100 75 L 102 77 Z" fill="#ff9635" />

          {/* Est */}
          <circle cx="155" cy="140" r="3" fill="#e67315" />
          <path d="M 158 140 L 163 138 L 165 140 L 163 142 Z" fill="#ff9635" />

          {/* Sud */}
          <circle cx="100" cy="195" r="3" fill="#e67315" />
          <path d="M 100 198 L 98 203 L 100 205 L 102 203 Z" fill="#ff9635" />

          {/* Ouest */}
          <circle cx="45" cy="140" r="3" fill="#e67315" />
          <path d="M 42 140 L 37 138 L 35 140 L 37 142 Z" fill="#ff9635" />
        </g>
      </g>

      {/* Motifs tribaux sur l'autel */}
      <g opacity="0.6">
        {/* Losange sacré */}
        <path d="M 100 140 L 105 145 L 100 150 L 95 145 Z" fill="none" stroke="#ff9635" strokeWidth="2" />
        <circle cx="100" cy="145" r="2" fill="#ffd5a3" />

        {/* Lignes rituelles */}
        <line x1="85" y1="145" x2="93" y2="145" stroke="#e67315" strokeWidth="1.5" />
        <line x1="107" y1="145" x2="115" y2="145" stroke="#e67315" strokeWidth="1.5" />
      </g>

      {/* Offrandes rituelles sur l'autel */}
      <g>
        {/* Coupe gauche */}
        <ellipse cx="85" cy="128" rx="3" ry="2" fill="#7a6454" />
        <rect x="83" y="128" width="4" height="5" rx="0.5" fill="#9d8570" />

        {/* Coupe droite */}
        <ellipse cx="115" cy="128" rx="3" ry="2" fill="#7a6454" />
        <rect x="113" y="128" width="4" height="5" rx="0.5" fill="#9d8570" />

        {/* Cristaux/gemmes */}
        <polygon points="90,132 91,129 92,132" fill="#6d8fa3" opacity="0.7" />
        <polygon points="110,132 111,129 112,132" fill="#4d6f82" opacity="0.7" />
      </g>

      {/* Particules de lumière mystique */}
      <g opacity="0.6">
        <circle cx="80" cy="100" r="1.5" fill="#ffd5a3" />
        <circle cx="120" cy="105" r="1" fill="#ffb86a" />
        <circle cx="95" cy="90" r="1.2" fill="#fff8ed" />
        <circle cx="108" cy="95" r="1" fill="#ffd5a3" />
        <circle cx="88" cy="110" r="1.3" fill="#ffb86a" />
        <circle cx="115" cy="108" r="1.1" fill="#fff8ed" />
      </g>

      {/* Texte runique ancien autour */}
      <g opacity="0.35" fontFamily="serif" fontSize="10" fill="#944210">
        <text x="100" y="68" textAnchor="middle">⚝</text>
        <text x="165" y="140" textAnchor="middle">☥</text>
        <text x="100" y="210" textAnchor="middle">⚝</text>
        <text x="35" y="140" textAnchor="middle">☥</text>
      </g>
    </svg>
  )
}

/**
 * Maintenance - Page de maintenance
 * "Rituel en Cours" - Restauration temporaire du système
 */
const Maintenance = ({ estimatedTime, message: customMessage }) => {
  const navigate = useNavigate()
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [countdown, setCountdown] = useState(60)

  // Auto-refresh toutes les 60 secondes si activé
  useEffect(() => {
    if (!autoRefresh) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          window.location.reload()
          return 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [autoRefresh])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleToggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev)
    setCountdown(60)
  }

  const actions = [
    {
      label: autoRefresh ? `Rafraîchir (${countdown}s)` : 'Rafraîchir',
      onClick: handleRefresh,
      variant: 'primary',
      icon: <RefreshCw className="w-5 h-5" />
    }
  ]

  const defaultMessage = customMessage ||
    "Les Anciens effectuent un rituel de restauration. Les territoires sont temporairement inaccessibles."

  const secondaryMessage = estimatedTime
    ? `Durée estimée du rituel : ${estimatedTime}. Les forces seront bientôt rétablies.`
    : "Le rituel prendra le temps nécessaire pour restaurer l'équilibre. Votre patience est appréciée."

  return (
    <div className="relative">
      <ErrorPage
        title="Rituel en Cours"
        message={defaultMessage}
        secondaryMessage={secondaryMessage}
        illustration={<RitualAltarIllustration />}
        actions={actions}
        backgroundGradient="bg-gradient-to-b from-secondary-50 via-neutral-50 to-primary-100"
        showHomeLink={false}
      />

      {/* Toggle auto-refresh */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleToggleAutoRefresh}
          className="font-body text-sm px-4 py-2 bg-white/80 hover:bg-white border-2 border-primary-300 rounded-lg shadow-md transition-all duration-normal flex items-center gap-2"
          title={autoRefresh ? "Désactiver le rafraîchissement automatique" : "Activer le rafraîchissement automatique"}
        >
          <Clock className="w-4 h-4" />
          <span>{autoRefresh ? 'Auto-refresh activé' : 'Auto-refresh désactivé'}</span>
        </button>
      </div>
    </div>
  )
}

export default Maintenance
