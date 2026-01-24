import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components'
import { TribalCorner } from '@/components/ui/Card'
import './HeroSection.css'

/**
 * HeroSection - Section hero de la page d'accueil
 *
 * Design "L'Eveil du Rituel" avec:
 * - Background parallax
 * - Pattern tribal en overlay
 * - Particules ember flottantes
 * - Titre avec glow pulsant
 * - Coins tribaux décoratifs
 */
const HeroSection = ({
  title = "EROSION DES AMES",
  subtitle = "Là où les pierres murmurent et les braises se souviennent",
  primaryCta = { label: "Découvrir l'univers", href: "/universe" },
  secondaryCta = { label: "Éveiller ton âme", href: "/register" },
  backgroundImage = "/images/hero-bg.jpg",
  showBadge = true,
  badgeText = "Alpha v0.1 - Premiers pas dans les ruines"
}) => {
  const heroRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)

  // Parallax effect - optimisé pour performance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < window.innerHeight) {
        setScrollY(window.scrollY)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={heroRef}
      className="hero-section relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-neutral-900"
    >
      {/* Background image avec parallax */}
      <div
        className="hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      {/* Overlay gradient - brume montante */}
      <div className="hero-overlay absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-neutral-900/40" />

      {/* Pattern tribal de fond */}
      <TribalPattern />

      {/* Particules ember */}
      <EmberParticles />

      {/* Contenu principal */}
      <div className="hero-content relative z-20 max-w-4xl mx-auto px-6 py-20 md:py-32 text-center">
        {/* Conteneur avec coins tribaux */}
        <div className="relative inline-block">
          <TribalCorner
            position="top-left"
            size="lg"
            className="text-secondary/30 hero-corner"
          />
          <TribalCorner
            position="top-right"
            size="lg"
            className="text-secondary/30 hero-corner hero-corner-delay-1"
          />

          <div className="px-8 md:px-16 py-8">
            {/* Titre principal */}
            <h1 className="hero-title font-display text-5xl md:text-7xl lg:text-8xl text-skin-inverse mb-6">
              {title}
            </h1>

            {/* Sous-titre atmosphérique */}
            <p className="hero-subtitle font-body text-xl md:text-2xl text-skin-muted max-w-2xl mx-auto mb-8">
              {subtitle.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < subtitle.split('\n').length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>

          <TribalCorner
            position="bottom-left"
            size="lg"
            className="text-secondary/30 hero-corner hero-corner-delay-2"
          />
          <TribalCorner
            position="bottom-right"
            size="lg"
            className="text-secondary/30 hero-corner hero-corner-delay-3"
          />
        </div>

        {/* Séparateur tribal */}
        <div className="hero-divider my-10" />

        {/* Call-to-actions */}
        <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to={primaryCta.href}>
            <Button
              variant="primary"
              size="lg"
              className="min-w-[200px]"
            >
              {primaryCta.label}
            </Button>
          </Link>
          <Link to={secondaryCta.href}>
            <Button
              variant="secondary"
              size="lg"
              className="min-w-[200px]"
            >
              {secondaryCta.label}
            </Button>
          </Link>
        </div>

        {/* Badge optionnel - version ou statut */}
        {showBadge && (
          <div className="hero-badge mt-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-200 font-ui text-sm backdrop-blur-sm">
              <span className="hero-badge-dot w-2 h-2 rounded-full bg-secondary" />
              {badgeText}
            </span>
          </div>
        )}
      </div>

      {/* Indicateur de scroll */}
      <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="scroll-arrow" />
      </div>
    </section>
  )
}

/**
 * Pattern tribal SVG en arrière-plan
 */
const TribalPattern = () => (
  <svg
    className="hero-pattern absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="tribal-hero-pattern"
        x="0"
        y="0"
        width="120"
        height="120"
        patternUnits="userSpaceOnUse"
      >
        {/* Cercles rituels */}
        <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="30" cy="30" r="12" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
        <circle cx="30" cy="30" r="3" fill="currentColor" opacity="0.4" />

        {/* Losanges géométriques */}
        <path
          d="M90 30 L100 40 L90 50 L80 40 Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />

        {/* Traits rituels */}
        <line x1="60" y1="80" x2="60" y2="100" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        <line x1="50" y1="85" x2="50" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        <line x1="70" y1="85" x2="70" y2="95" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      </pattern>
    </defs>

    <rect
      width="100%"
      height="100%"
      fill="url(#tribal-hero-pattern)"
      className="text-primary-100"
    />
  </svg>
)

/**
 * Particules ember flottantes
 */
const EmberParticles = () => {
  const particles = [
    { delay: 0, left: '15%', duration: 8 },
    { delay: 2, left: '35%', duration: 10 },
    { delay: 1, left: '55%', duration: 9 },
    { delay: 3, left: '75%', duration: 11 },
    { delay: 1.5, left: '85%', duration: 7 },
    { delay: 2.5, left: '25%', duration: 9.5 }
  ]

  return (
    <div className="hero-particles absolute inset-0 pointer-events-none z-10">
      {particles.map((particle, index) => (
        <div
          key={index}
          className="ember-particle absolute bottom-0"
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

export default HeroSection
