import './DawnTransition.css'

/**
 * DawnTransition - Transition visuelle entre sections sombres et claires
 *
 * Crée un effet de "lever de jour" entre GeographySection (sombre)
 * et LocationSection (plus clair) avec une citation des Cartographes
 */
const DawnTransition = () => {
  return (
    <div className="dawn-transition">
      {/* Rayons de lumière SVG */}
      <svg
        className="dawn-transition__rays"
        viewBox="0 0 1200 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ray-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(230, 115, 21, 0.3)" />
            <stop offset="50%" stopColor="rgba(255, 213, 163, 0.15)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="ray-gradient-alt" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 213, 163, 0.2)" />
            <stop offset="60%" stopColor="rgba(230, 115, 21, 0.1)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Rayons principaux */}
        <polygon
          className="dawn-transition__ray dawn-transition__ray--1"
          points="600,0 550,200 650,200"
          fill="url(#ray-gradient)"
        />
        <polygon
          className="dawn-transition__ray dawn-transition__ray--2"
          points="400,0 320,200 480,200"
          fill="url(#ray-gradient-alt)"
        />
        <polygon
          className="dawn-transition__ray dawn-transition__ray--3"
          points="800,0 720,200 880,200"
          fill="url(#ray-gradient-alt)"
        />
        <polygon
          className="dawn-transition__ray dawn-transition__ray--4"
          points="200,0 100,200 300,200"
          fill="url(#ray-gradient)"
        />
        <polygon
          className="dawn-transition__ray dawn-transition__ray--5"
          points="1000,0 900,200 1100,200"
          fill="url(#ray-gradient)"
        />
      </svg>

      {/* Contenu central */}
      <div className="dawn-transition__content">
        <div className="dawn-transition__ornament dawn-transition__ornament--left">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="3" fill="#e67315" opacity="0.6" />
            <circle cx="20" cy="20" r="8" fill="none" stroke="#e67315" strokeWidth="1" opacity="0.4" />
            <circle cx="20" cy="20" r="15" fill="none" stroke="#7a6454" strokeWidth="0.5" opacity="0.3" />
          </svg>
        </div>

        <blockquote className="dawn-transition__quote">
          <p className="dawn-transition__quote-text">
            "Là où l'obscurité se retire, la connaissance s'éveille.
            <br />
            Chaque lieu révélé est une victoire sur l'oubli."
          </p>
          <cite className="dawn-transition__quote-author">
            — Les Cartographes des Cendres
          </cite>
        </blockquote>

        <div className="dawn-transition__ornament dawn-transition__ornament--right">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle cx="20" cy="20" r="3" fill="#e67315" opacity="0.6" />
            <circle cx="20" cy="20" r="8" fill="none" stroke="#e67315" strokeWidth="1" opacity="0.4" />
            <circle cx="20" cy="20" r="15" fill="none" stroke="#7a6454" strokeWidth="0.5" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* Ligne de séparation décorative */}
      <div className="dawn-transition__divider">
        <span className="dawn-transition__divider-line" />
        <span className="dawn-transition__divider-dot" />
        <span className="dawn-transition__divider-line" />
      </div>
    </div>
  )
}

export default DawnTransition
