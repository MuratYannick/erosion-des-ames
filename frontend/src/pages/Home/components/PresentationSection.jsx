import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, ImageCard } from '@/components'
import { TribalDivider, TribalCorner } from '@/components/ui/Card'
import './PresentationSection.css'

/**
 * PresentationSection - Section d'immersion dans l'univers
 *
 * Design "Les Murmures des Ruines":
 * - Layout asymétrique en Z-pattern
 * - Transition douce depuis le Hero
 * - Animations scroll-triggered
 * - Texte immersif avec images atmosphériques
 */
const PresentationSection = ({
  title = "Un Monde de Cendres et de Désolation"
}) => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  // Intersection Observer pour animations au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`presentation-section relative w-full py-20 md:py-32 bg-gradient-to-b from-neutral-900 via-neutral-100 to-surface overflow-hidden ${isVisible ? 'is-visible' : ''}`}
    >
      {/* Pattern tribal subtil en arrière-plan */}
      <SubtleTribalPattern />

      {/* Conteneur principal */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Titre de section avec divider */}
        <div className="text-center mb-16 md:mb-24 presentation-header">
          <h2 className="font-heading text-4xl md:text-5xl text-primary-800 mb-6">
            {title}
          </h2>
          <TribalDivider
            variant="simple"
            className="max-w-xs mx-auto text-secondary h-4"
          />
        </div>

        {/* Bloc 1: Image principale + Intro */}
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 mb-16 md:mb-24 items-center">
          {/* Image ruines */}
          <div className="md:col-span-3 presentation-image-1">
            <ImageCard
              src="/images/presentation-ruine-xs.png"
              sources={[
                { media: '(min-width: 1536px)', srcSet: '/images/presentation-ruine-2xl.png' },
                { media: '(min-width: 1280px)', srcSet: '/images/presentation-ruine-xl.png' },
                { media: '(min-width: 1024px)', srcSet: '/images/presentation-ruine-lg.png' },
                { media: '(min-width: 768px)', srcSet: '/images/presentation-ruine-md.png' },
                { media: '(min-width: 640px)', srcSet: '/images/presentation-ruine-sm.png' },
              ]}
              alt="Ruines d'un temple tribal ancien"
              ratio="16/9"
              preset="tribal"
              className="shadow-2xl"
            />
            {/* Coin tribal discret */}
            <TribalCorner
              position="bottom-right"
              size="sm"
              className="text-secondary/20 absolute"
              style={{ bottom: '12px', right: '12px' }}
            />
          </div>

          {/* Texte intro */}
          <div className="md:col-span-2 presentation-text-1">
            <div className="relative">
              {/* Ember dot décoratif */}
              <span className="absolute -left-4 top-2 w-2 h-2 rounded-full bg-secondary shadow-glow-sm ember-pulse" />

              <p className="font-body text-lg md:text-xl text-primary-700 leading-relaxed mb-6">
                Dans un monde où les civilisations se sont effondrées et la nature a repris ses droits,
                seule la survie subsiste à l'humanité.
              </p>

              <p className="font-body text-base md:text-lg text-primary-600 leading-relaxed">
                Tu es l'un des derniers espoirs pour rétablir la supériorité de <span className="text-warning-light font-alert text-lg md:text-xl">l'humanité </span> 
                face à l'hostilité d'une nature décadente.
              </p>
            </div>
          </div>
        </div>

        {/* Divider central ornemental */}
        <div className="my-12 md:my-16 presentation-divider-main">
          <TribalDivider
            variant="ornate"
            className="max-w-md mx-auto text-primary-300 h-6"
          />
        </div>

        {/* Bloc 2: Texte détaillé + Image rituel */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-16 md:mb-24 items-center">
          {/* Texte détaillé */}
          <div className="md:order-1 presentation-text-2">
            <h3 className="font-subheading text-2xl md:text-3xl text-primary-800 mb-6">
              Les Vestiges Murmurent
            </h3>

            <p className="font-body text-base md:text-lg text-primary-700 leading-relaxed mb-4">
              Explore les vestiges d'empires tribaux oubliés, déchiffre les fresques millénaires
              et ravive les feux rituels.
            </p>

            <p className="font-body text-base md:text-lg text-primary-700 leading-relaxed mb-4">
              Chaque pierre murmure une vérité ancienne, chaque braise cache un fragment d'âme perdu.
            </p>

            <p className="font-body text-base text-primary-600 leading-relaxed italic">
              Dans Érosion des Âmes, le monde ne t'attend pas — il t'observe, patient,
              depuis les ruines.
            </p>
          </div>

          {/* Image rituel - responsive */}
          <div className="md:order-2 presentation-image-2">
            <ImageCard
              src="/images/presentation-ritual-xs.png"
              sources={[
                { media: '(min-width: 1536px)', srcSet: '/images/presentation-ritual-2xl.png' },
                { media: '(min-width: 1280px)', srcSet: '/images/presentation-ritual-xl.png' },
                { media: '(min-width: 1024px)', srcSet: '/images/presentation-ritual-lg.png' },
                { media: '(min-width: 768px)', srcSet: '/images/presentation-ritual-md.png' },
                { media: '(min-width: 640px)', srcSet: '/images/presentation-ritual-sm.png' },
              ]}
              alt="Rituel du feu sacré"
              ratio="4/3"
              preset="memory"
              className="shadow-xl"
            />
          </div>
        </div>

        {/* Bloc 3: Image artefact + Call-to-action */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-center presentation-final">
          {/* Image artefact */}
          <div className="md:col-span-1 presentation-image-3">
            <ImageCard
              src="/images/presentation-travel-xs.png"
              sources={[
                { media: '(min-width: 1536px)', srcSet: '/images/presentation-travel-2xl.png' },
                { media: '(min-width: 1280px)', srcSet: '/images/presentation-travel-xl.png' },
                { media: '(min-width: 1024px)', srcSet: '/images/presentation-travel-lg.png' },
                { media: '(min-width: 768px)', srcSet: '/images/presentation-travel-md.png' },
                { media: '(min-width: 640px)', srcSet: '/images/presentation-travel-sm.png' },
              ]}
              alt="Voyage à travers les terres désolées"
              ratio="4/3"
              preset="nostalgia"
              className="shadow-2xl"
            />
            {/* Coin tribal discret */}
            <TribalCorner
              position="top-left"
              size="sm"
              className="text-secondary/20 absolute"
              style={{ top: '12px', left: '12px' }}
            />
          </div>

          {/* Call-to-action émotionnel */}
          <div className="md:col-span-2 presentation-cta">
            <div className="bg-primary/5 border border-primary-200 rounded-stone p-8 md:p-10 relative overflow-hidden">
              {/* Pattern texture subtil */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="cta-texture" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="currentColor" className="text-primary-600" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#cta-texture)" />
                </svg>
              </div>

              <div className="relative z-10">
                <h3 className="font-accent text-2xl md:text-3xl text-primary-900 mb-4">
                  Ton voyage commence au cœur des cendres
                </h3>

                <p className="font-body text-lg text-primary-700 leading-relaxed mb-6">
                  Forgeras-tu ton âme dans les flammes sacrées, ou la laisseras-tu s'éroder
                  jusqu'à l'oubli?
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/universe">
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Explorer l'univers
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full sm:w-auto"
                    >
                      Créer ton personnage
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Effet de transition vers section suivante */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-surface pointer-events-none" />
    </section>
  )
}

/**
 * Pattern tribal très subtil pour texture de fond
 */
const SubtleTribalPattern = () => (
  <svg
    className="presentation-pattern absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="presentation-tribal-pattern"
        x="0"
        y="0"
        width="200"
        height="200"
        patternUnits="userSpaceOnUse"
      >
        {/* Cercles rituels très subtils */}
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
        <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.2" />

        {/* Losanges géométriques */}
        <path
          d="M150 50 L160 60 L150 70 L140 60 Z"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
          opacity="0.2"
        />

        {/* Traits rituels */}
        <line x1="100" y1="140" x2="100" y2="160" stroke="currentColor" strokeWidth="1" opacity="0.15" />
        <line x1="90" y1="145" x2="90" y2="155" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
        <line x1="110" y1="145" x2="110" y2="155" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      </pattern>
    </defs>

    <rect
      width="100%"
      height="100%"
      fill="url(#presentation-tribal-pattern)"
      className="text-primary-200"
    />
  </svg>
)

export default PresentationSection
