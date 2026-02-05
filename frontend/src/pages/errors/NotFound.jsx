import { useNavigate } from 'react-router-dom'
import ErrorPage from '../../components/errors/ErrorPage'
import { ArrowLeft, Home } from 'lucide-react'

/**
 * BrokenCompassIllustration - Boussole tribale brisée (404)
 * Représente la perte des repères ancestraux
 */
const BrokenCompassIllustration = () => {
  return (
    <svg
      className="w-full h-full illustration-float-lost"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cercle extérieur - cadre de la boussole */}
      <circle
        cx="100"
        cy="100"
        r="85"
        stroke="#7a6454"
        strokeWidth="3"
        fill="none"
        opacity="0.6"
        strokeDasharray="8 4"
      />

      {/* Cercle intermédiaire avec motifs tribaux */}
      <circle
        cx="100"
        cy="100"
        r="70"
        stroke="#9d8570"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />

      {/* Marques cardinales brisées */}
      {/* Nord - cassée */}
      <g opacity="0.7">
        <line x1="100" y1="20" x2="100" y2="35" stroke="#5e4d40" strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="15" r="5" fill="#e67315" opacity="0.3" />
        <path d="M 95 35 L 100 40 L 105 35" stroke="#5e4d40" strokeWidth="2" fill="none" />
      </g>

      {/* Est - fragmentée */}
      <g opacity="0.6">
        <line x1="165" y1="100" x2="180" y2="100" stroke="#5e4d40" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 2" />
        <circle cx="183" cy="100" r="3" fill="#9d8570" />
      </g>

      {/* Sud - effacée */}
      <g opacity="0.5">
        <line x1="100" y1="165" x2="100" y2="180" stroke="#5e4d40" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        <circle cx="100" cy="183" r="2" fill="#7a6454" opacity="0.3" />
      </g>

      {/* Ouest - partiellement visible */}
      <g opacity="0.65">
        <line x1="20" y1="100" x2="35" y2="100" stroke="#5e4d40" strokeWidth="3" strokeLinecap="round" />
        <circle cx="17" cy="100" r="4" fill="#bba794" />
      </g>

      {/* Centre - moyeu de l'aiguille */}
      <circle cx="100" cy="100" r="12" fill="#7a6454" opacity="0.8" />
      <circle cx="100" cy="100" r="8" fill="#e67315" opacity="0.3" />
      <circle cx="100" cy="100" r="4" fill="#5e4d40" />

      {/* Aiguille brisée - partie Nord (rouge) */}
      <g className="compass-needle" opacity="0.8">
        {/* Partie principale de l'aiguille Nord */}
        <path
          d="M 100 100 L 95 45 L 100 35 L 105 45 Z"
          fill="#c95951"
          stroke="#a63f38"
          strokeWidth="1"
        />
        {/* Cassure visible */}
        <line x1="95" y1="45" x2="105" y2="45" stroke="#7a2e28" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Aiguille - partie Sud (grise, inerte) */}
      <g className="compass-needle" opacity="0.6">
        <path
          d="M 100 100 L 95 155 L 100 165 L 105 155 Z"
          fill="#8f99a5"
          stroke="#64707e"
          strokeWidth="1"
        />
      </g>

      {/* Fissures sur le cadre */}
      <path
        d="M 120 30 L 135 25"
        stroke="#a63f38"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M 165 80 L 175 75"
        stroke="#a63f38"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M 40 140 L 30 150"
        stroke="#a63f38"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Symboles tribaux effacés autour */}
      <g opacity="0.3">
        <circle cx="145" cy="55" r="3" fill="#9d8570" />
        <circle cx="55" cy="55" r="2" fill="#9d8570" />
        <circle cx="145" cy="145" r="2.5" fill="#9d8570" />
        <circle cx="55" cy="145" r="2" fill="#9d8570" />
      </g>

      {/* Particules de sable s'échappant */}
      <g opacity="0.4">
        <circle cx="130" cy="70" r="1.5" fill="#d4c9ba" />
        <circle cx="140" cy="75" r="1" fill="#d4c9ba" />
        <circle cx="135" cy="80" r="1.2" fill="#bba794" />
        <circle cx="70" cy="130" r="1.5" fill="#d4c9ba" />
        <circle cx="65" cy="135" r="1" fill="#bba794" />
      </g>

      {/* Rose des vents tribale effacée en arrière-plan */}
      <g opacity="0.15">
        <line x1="100" y1="40" x2="100" y2="160" stroke="#7a6454" strokeWidth="1" />
        <line x1="40" y1="100" x2="160" y2="100" stroke="#7a6454" strokeWidth="1" />
        <line x1="55" y1="55" x2="145" y2="145" stroke="#7a6454" strokeWidth="0.5" />
        <line x1="145" y1="55" x2="55" y2="145" stroke="#7a6454" strokeWidth="0.5" />
      </g>
    </svg>
  )
}

/**
 * NotFound - Page 404
 * "Chemin Perdu" - Les repères ancestraux se sont effacés
 */
const NotFound = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const handleGoHome = () => {
    navigate('/')
  }

  const actions = [
    {
      label: 'Retour à l\'accueil',
      onClick: handleGoHome,
      variant: 'primary',
      icon: <Home className="w-5 h-5" />
    },
    {
      label: 'Page précédente',
      onClick: handleGoBack,
      variant: 'secondary',
      icon: <ArrowLeft className="w-5 h-5" />
    }
  ]

  return (
    <ErrorPage
      code="404"
      title="Chemin Perdu"
      message="Les repères ancestraux se sont effacés. Le chemin que vous cherchez n'existe plus dans nos territoires."
      secondaryMessage="Les vents du temps ont balayé les traces de ce lieu. Peut-être les Anciens peuvent-ils vous guider vers votre destination."
      illustration={<BrokenCompassIllustration />}
      actions={actions}
      backgroundGradient="bg-gradient-to-b from-neutral-50 to-primary-50"
      codeColor="text-secondary-500"
    />
  )
}

export default NotFound
