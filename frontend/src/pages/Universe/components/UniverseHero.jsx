import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components'
import './UniverseHero.css'

/**
 * UniverseHero - Section hero de la page Univers
 *
 * Design "L'Éveil des Murmures" avec:
 * - Fond sombre immersif (crépuscule des ruines)
 * - Grand cercle rituel animé en arrière-plan
 * - Fragments de pierre comme éléments décoratifs
 * - Particules de cendre flottantes
 * - Typographie impactante avec effet de gravure
 */
const UniverseHero = ({
  title = "UNIVERS D'EROSION DES AMES",
  subtitle = "Là où les ruines murmurent les secrets d'un monde oublié",
  description = "Explorez un univers de dark fantasy tribale où les vestiges du passé côtoient les lueurs d'espoir d'un futur incertain. Découvrez les mystères des artefacts anciens, les rituels sacrés des tribus survivantes, et les ombres qui rôdent dans les décombres du monde ancien.",
  ctaLabel = "Explorer le Lore",
  ctaHref = "#lore",
  backgroundImage = "/images/universe-bg.jpg"
}) => {
  const heroRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < window.innerHeight * 1.5) {
        setScrollY(window.scrollY)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Reveal animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      ref={heroRef}
      className={`universe-hero relative min-h-screen flex items-center justify-center overflow-hidden ${isVisible ? 'is-visible' : ''}`}
    >
      {/* Background layer - Deep shadow avec texture */}
      <div className="universe-hero__bg absolute inset-0 bg-universe-deep" />

      {/* Background image avec forte opacity pour garder l'ambiance sombre */}
      {backgroundImage && (
        <div
          className="universe-hero__bg-image absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
            transform: `translateY(${scrollY * 0.25}px) scale(1.1)`
          }}
        />
      )}

      {/* Texture overlay - Stone whispers */}
      <div className="universe-hero__texture absolute inset-0" />

      {/* Grand cercle rituel animé */}
      <RuneCircle />

      {/* Pattern de cendres flottantes */}
      <AshFlowPattern />

      {/* Particules de cendre */}
      <AshParticles />

      {/* Contenu principal */}
      <div className="universe-hero__content relative z-20 max-w-5xl mx-auto px-6 py-24 md:py-32">
        {/* Fragments de pierre décoratifs */}
        <StoneFragment position="top-left" />
        <StoneFragment position="top-right" />

        {/* Container principal avec apparition progressive */}
        <div className="universe-hero__main text-center">
          {/* Titre principal - gravé dans la pierre */}
          <div className="universe-hero__title-wrapper relative mb-8">
            <h1 className="universe-hero__title font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-universe-rune leading-tight tracking-wider">
              {title.split('\n').map((line, i) => (
                <span key={i} className="block universe-hero__title-line" style={{ animationDelay: `${i * 0.15}s` }}>
                  {line}
                </span>
              ))}
            </h1>

            {/* Effet de lueur derrière le titre */}
            <div className="universe-hero__title-glow" aria-hidden="true" />
          </div>

          {/* Séparateur avec fragments */}
          <StoneFragmentDivider />

          {/* Sous-titre atmosphérique */}
          <p className="universe-hero__subtitle font-body text-xl md:text-2xl lg:text-3xl text-universe-ash-text mb-6 max-w-3xl mx-auto italic">
            {subtitle}
          </p>

          {/* Description immersive */}
          <div className="universe-hero__description-wrapper max-w-2xl mx-auto mb-10">
            <p className="universe-hero__description font-body text-base md:text-lg text-neutral-300 leading-relaxed">
              {description}
            </p>
          </div>

          {/* CTA avec effet de braise */}
          <div className="universe-hero__cta">
            <Link to={ctaHref}>
              <Button
                variant="primary"
                size="lg"
                className="universe-hero__cta-button min-w-[240px] group"
              >
                <span className="relative z-10">{ctaLabel}</span>
                <span className="universe-hero__cta-glow" aria-hidden="true" />
              </Button>
            </Link>
          </div>

          {/* Indicateur de contenu en-dessous */}
          <div className="universe-hero__hint mt-12 flex flex-col items-center gap-3">
            <span className="font-ui text-sm text-neutral-400 tracking-wide">
              Descendez dans les profondeurs
            </span>
            <RuneScrollIndicator />
          </div>
        </div>

        {/* Fragments de pierre décoratifs bas */}
        <StoneFragment position="bottom-left" />
        <StoneFragment position="bottom-right" />
      </div>
    </section>
  )
}

/**
 * Grand cercle rituel en arrière-plan
 * Rotation lente pour effet hypnotique
 */
const RuneCircle = () => (
  <div className="universe-hero__rune-circle absolute inset-0 flex items-center justify-center pointer-events-none z-10">
    <svg
      className="universe-hero__rune-circle-svg"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cercle extérieur principal */}
      <circle
        cx="200"
        cy="200"
        r="180"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.15"
        className="text-secondary-400"
      />

      {/* Cercle intermédiaire */}
      <circle
        cx="200"
        cy="200"
        r="150"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.1"
        strokeDasharray="4 8"
        className="text-secondary-300"
      />

      {/* Cercle intérieur */}
      <circle
        cx="200"
        cy="200"
        r="120"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.08"
        className="text-primary-300"
      />

      {/* Runes cardinales - Nord */}
      <g className="universe-hero__rune" transform="translate(200, 20)">
        <path
          d="M-8 0 L0 12 L8 0 M0 12 L0 20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.2"
          className="text-secondary-400"
        />
      </g>

      {/* Runes cardinales - Est */}
      <g className="universe-hero__rune" transform="translate(380, 200)">
        <path
          d="M0 -8 L-12 0 L0 8 M-12 0 L-20 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.2"
          className="text-secondary-400"
        />
      </g>

      {/* Runes cardinales - Sud */}
      <g className="universe-hero__rune" transform="translate(200, 380)">
        <path
          d="M-8 0 L0 -12 L8 0 M0 -12 L0 -20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.2"
          className="text-secondary-400"
        />
      </g>

      {/* Runes cardinales - Ouest */}
      <g className="universe-hero__rune" transform="translate(20, 200)">
        <path
          d="M0 -8 L12 0 L0 8 M12 0 L20 0"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.2"
          className="text-secondary-400"
        />
      </g>

      {/* Marques tribales intermédiaires */}
      {[45, 135, 225, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const x = 200 + Math.cos(rad) * 165
        const y = 200 + Math.sin(rad) * 165
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="currentColor"
            fillOpacity="0.15"
            className="text-secondary-500"
          />
        )
      })}

      {/* Lignes de connexion subtiles */}
      <path
        d="M200 20 L200 50 M380 200 L350 200 M200 380 L200 350 M20 200 L50 200"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.08"
        className="text-primary-400"
      />
    </svg>
  </div>
)

/**
 * Pattern de flux de cendres en arrière-plan
 */
const AshFlowPattern = () => (
  <svg
    className="universe-hero__ash-pattern absolute inset-0 w-full h-full pointer-events-none z-5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="ash-flow"
        x="0"
        y="0"
        width="200"
        height="200"
        patternUnits="userSpaceOnUse"
      >
        {/* Flux organiques de cendres */}
        <path
          d="M0 50 Q50 30 100 50 T200 50"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.05"
        />
        <path
          d="M0 120 Q60 100 120 120 T200 120"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.04"
        />
        <path
          d="M0 180 Q40 160 80 180 T200 180"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.03"
        />

        {/* Micro-particules */}
        <circle cx="30" cy="60" r="0.5" fill="currentColor" opacity="0.08" />
        <circle cx="150" cy="90" r="0.5" fill="currentColor" opacity="0.06" />
        <circle cx="80" cy="140" r="0.5" fill="currentColor" opacity="0.07" />
        <circle cx="170" cy="30" r="0.5" fill="currentColor" opacity="0.05" />
      </pattern>
    </defs>

    <rect
      width="100%"
      height="100%"
      fill="url(#ash-flow)"
      className="text-neutral-400"
    />
  </svg>
)

/**
 * Particules de cendre flottantes
 * Plus lentes et espacées que les embers
 */
const AshParticles = () => {
  const particles = [
    { delay: 0, left: '10%', duration: 12 },
    { delay: 3, left: '25%', duration: 15 },
    { delay: 1.5, left: '45%', duration: 13 },
    { delay: 4, left: '60%', duration: 14 },
    { delay: 2, left: '75%', duration: 16 },
    { delay: 5, left: '90%', duration: 11 },
    { delay: 2.5, left: '35%', duration: 13.5 },
    { delay: 4.5, left: '55%', duration: 14.5 }
  ]

  return (
    <div className="universe-hero__particles absolute inset-0 pointer-events-none z-15">
      {particles.map((particle, index) => (
        <div
          key={index}
          className="ash-particle absolute bottom-0"
          style={{
            left: particle.left,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  )
}

/**
 * Fragment de pierre décoratif positionné dans les coins
 */
const StoneFragment = ({ position = 'top-left' }) => {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0'
  }

  const transforms = {
    'top-left': '',
    'top-right': 'scale-x-[-1]',
    'bottom-left': 'scale-y-[-1]',
    'bottom-right': 'scale-[-1]'
  }

  return (
    <svg
      className={`universe-hero__stone-fragment absolute ${positionClasses[position]} w-24 h-24 md:w-32 md:h-32 pointer-events-none opacity-20`}
      style={{ transform: transforms[position] }}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Forme irrégulière de pierre brisée */}
      <path
        d="M0 0 L60 0 L65 5 L70 0 L80 10 L75 15 L80 20 L70 30 L65 28 L60 35 L15 35 L10 30 L5 32 L0 25 Z"
        fill="currentColor"
        fillOpacity="0.15"
        className="text-primary-700"
      />

      {/* Fissures */}
      <path
        d="M10 5 L15 12 M25 8 L30 15 M45 6 L48 14"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.3"
        className="text-primary-800"
      />

      {/* Inscriptions anciennes partielles */}
      <path
        d="M20 18 L25 18 M22 21 L27 21 M20 24 L24 24"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.25"
        strokeLinecap="round"
        className="text-secondary-600"
      />

      {/* Symbole tribal fragmenté */}
      <circle
        cx="45"
        cy="20"
        r="5"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.2"
        fill="none"
        className="text-secondary-500"
      />
      <path
        d="M45 15 L45 18 M45 22 L45 25"
        stroke="currentColor"
        strokeWidth="0.5"
        strokeOpacity="0.2"
        className="text-secondary-500"
      />
    </svg>
  )
}

/**
 * Divider avec fragments de pierre
 */
const StoneFragmentDivider = () => (
  <div className="universe-hero__divider relative w-full max-w-md mx-auto my-8 h-8 flex items-center justify-center">
    <svg
      className="w-full h-full"
      viewBox="0 0 300 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Ligne gauche */}
      <line
        x1="0"
        y1="16"
        x2="110"
        y2="16"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.2"
        className="text-secondary-400"
      />

      {/* Fragments gauche */}
      <path
        d="M100 16 L108 12 L115 16 L108 20 Z"
        fill="currentColor"
        fillOpacity="0.25"
        className="text-secondary-500"
      />
      <circle cx="70" cy="16" r="1.5" fill="currentColor" fillOpacity="0.15" className="text-secondary-400" />

      {/* Centre - Pierre sacrée */}
      <g transform="translate(150, 16)">
        <circle r="8" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" fill="none" className="text-secondary-500" />
        <circle r="4" fill="currentColor" fillOpacity="0.2" className="text-secondary-600" />
        <circle r="1.5" fill="currentColor" fillOpacity="0.4" className="text-secondary-400" />
        {/* Croix rituelle */}
        <path
          d="M0 -6 L0 6 M-6 0 L6 0"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeOpacity="0.25"
          className="text-secondary-300"
        />
      </g>

      {/* Fragments droite */}
      <path
        d="M185 16 L192 12 L200 16 L192 20 Z"
        fill="currentColor"
        fillOpacity="0.25"
        className="text-secondary-500"
      />
      <circle cx="230" cy="16" r="1.5" fill="currentColor" fillOpacity="0.15" className="text-secondary-400" />

      {/* Ligne droite */}
      <line
        x1="190"
        y1="16"
        x2="300"
        y2="16"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.2"
        className="text-secondary-400"
      />
    </svg>
  </div>
)

/**
 * Indicateur de scroll avec rune
 */
const RuneScrollIndicator = () => (
  <div className="universe-hero__scroll-indicator animate-bounce-slow">
    <svg
      width="32"
      height="40"
      viewBox="0 0 32 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Contour de la rune */}
      <path
        d="M16 5 L16 28 M10 22 L16 28 L22 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity="0.4"
        className="text-secondary-400"
      />

      {/* Points rituels */}
      <circle cx="16" cy="8" r="1.5" fill="currentColor" fillOpacity="0.3" className="text-secondary-400" />
      <circle cx="16" cy="15" r="1.5" fill="currentColor" fillOpacity="0.25" className="text-secondary-400" />

      {/* Lueur */}
      <circle cx="16" cy="28" r="2" fill="currentColor" fillOpacity="0.5" className="text-secondary-500 animate-pulse" />
    </svg>
  </div>
)

export default UniverseHero
