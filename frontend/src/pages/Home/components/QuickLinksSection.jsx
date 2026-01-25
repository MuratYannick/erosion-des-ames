import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TribalDivider } from '@/components/ui/Card'
import './QuickLinksSection.css'

const QuickLinksSection = ({
  title = "Sentiers des Ruines",
  subtitle = "Choisis ton chemin dans les décombres",
  links = [
    {
      id: 'register',
      label: 'Inscription',
      description: 'Éveille ton âme',
      href: '/register',
      icon: 'portal'
    },
    {
      id: 'rules',
      label: 'Règlement',
      description: 'Lois des ruines',
      href: '/rules',
      icon: 'tablet'
    },
    {
      id: 'universe',
      label: 'Univers',
      description: 'Explore le monde',
      href: '/universe',
      icon: 'map'
    },
    {
      id: 'character',
      label: 'Créer un personnage',
      description: 'Forge ton destin',
      href: '/character/create',
      icon: 'mask'
    },
    {
      id: 'forum',
      label: 'Forum',
      description: 'Cercle des voix',
      href: '/forum',
      icon: 'circle'
    }
  ]
}) => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

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
      className={`quicklinks-section relative py-20 md:py-32 bg-gradient-to-b from-neutral-100 via-neutral-200 to-neutral-800 overflow-hidden ${isVisible ? 'is-visible' : ''}`}
    >
      <QuickLinksPattern />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16 quicklinks-header">
          <h2 className="font-heading text-4xl md:text-5xl text-primary-900 mb-4">
            {title}
          </h2>
          <p className="font-body text-lg text-primary-700 mb-6 max-w-2xl mx-auto">
            {subtitle}
          </p>
          <TribalDivider
            variant="ornate"
            className="max-w-md mx-auto text-primary-400 h-6"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 mb-8">
          {links.map((link, index) => (
            <QuickLinkCard
              key={link.id}
              link={link}
              index={index}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-neutral-900 pointer-events-none z-0" />
    </section>
  )
}

const QuickLinkCard = ({ link, index }) => {
  const { label, description, href, icon } = link

  const iconConfig = {
    portal: {
      component: <PortalIcon />,
      accentColor: 'text-secondary-500',
      glowColor: 'glow-secondary'
    },
    tablet: {
      component: <TabletIcon />,
      accentColor: 'text-primary-600',
      glowColor: 'glow-primary'
    },
    map: {
      component: <MapIcon />,
      accentColor: 'text-info-DEFAULT',
      glowColor: 'glow-info'
    },
    mask: {
      component: <MaskIcon />,
      accentColor: 'text-warning-DEFAULT',
      glowColor: 'glow-warning'
    },
    circle: {
      component: <CircleIcon />,
      accentColor: 'text-success-DEFAULT',
      glowColor: 'glow-success'
    }
  }

  const config = iconConfig[icon] || iconConfig.portal

  return (
    <Link
      to={href}
      className="quicklinks-card block"
      style={{ '--animation-delay': `${index * 100}ms` }}
    >
      <div className="quicklinks-card-inner group relative h-full bg-surface/90 backdrop-blur-sm rounded-lg border-2 border-primary-300 hover:border-primary-500 transition-all duration-normal p-6 flex flex-col items-center text-center shadow-md hover:shadow-glow">
        <div className={`quicklinks-icon w-16 h-16 mb-4 ${config.accentColor} transition-all duration-normal group-hover:scale-110 ${config.glowColor}`}>
          {config.component}
        </div>

        <h3 className="font-accent text-xl md:text-2xl text-primary-900 mb-2 group-hover:text-primary-800 transition-colors">
          {label}
        </h3>

        <p className="font-body text-sm text-primary-600 group-hover:text-primary-700 transition-colors">
          {description}
        </p>

        <div className="quicklinks-arrow absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-normal transform translate-x-0 group-hover:translate-x-1">
          <ArrowIcon className="w-5 h-5 text-primary-500" />
        </div>
      </div>
    </Link>
  )
}

const PortalIcon = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <title>Portail</title>
    <rect x="12" y="8" width="40" height="48" rx="4" />
    <rect x="18" y="14" width="28" height="36" rx="2" opacity="0.3" />
    <circle cx="32" cy="32" r="8" fill="currentColor" opacity="0.2" />
    <circle cx="32" cy="32" r="4" fill="currentColor" opacity="0.4" />
    <path d="M28 32h8M32 28v8" strokeWidth="1.5" />
  </svg>
)

const TabletIcon = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <title>Tablette gravée</title>
    <rect x="14" y="8" width="36" height="48" rx="2" />
    <path d="M22 18h20M22 26h20M22 34h20M22 42h14" strokeWidth="1.5" opacity="0.6" />
    <circle cx="44" cy="44" r="4" fill="currentColor" opacity="0.3" />
    <path d="M42 44l2 2 4-4" strokeWidth="1.5" />
  </svg>
)

const MapIcon = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <title>Carte du monde</title>
    <circle cx="32" cy="32" r="24" />
    <path d="M8 32h48M32 8v48" opacity="0.4" />
    <ellipse cx="32" cy="32" rx="10" ry="24" opacity="0.3" />
    <path d="M20 18l4 4-2 6 6-2 4 4M38 22l-3 5 4 3-2 4" strokeWidth="1.5" opacity="0.5" />
    <circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.4" />
    <circle cx="28" cy="24" r="1.5" fill="currentColor" />
    <circle cx="42" cy="28" r="1.5" fill="currentColor" />
    <circle cx="24" cy="40" r="1.5" fill="currentColor" />
  </svg>
)

const MaskIcon = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <title>Masque rituel</title>
    <path d="M32 8 C18 8 12 18 12 28 C12 38 16 52 32 56 C48 52 52 38 52 28 C52 18 46 8 32 8Z" />
    <ellipse cx="24" cy="26" rx="4" ry="6" fill="currentColor" opacity="0.3" />
    <ellipse cx="40" cy="26" rx="4" ry="6" fill="currentColor" opacity="0.3" />
    <path d="M22 38 Q32 44 42 38" strokeWidth="2.5" opacity="0.6" />
    <path d="M20 18l-4-6M44 18l4-6" strokeWidth="1.5" />
    <circle cx="32" cy="16" r="2" fill="currentColor" opacity="0.4" />
  </svg>
)

const CircleIcon = () => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-full h-full"
  >
    <title>Cercle des voix</title>
    <circle cx="32" cy="32" r="24" />
    <circle cx="32" cy="32" r="18" opacity="0.4" />
    <circle cx="32" cy="32" r="12" opacity="0.3" />
    <circle cx="32" cy="20" r="4" fill="currentColor" opacity="0.3" />
    <circle cx="44" cy="32" r="4" fill="currentColor" opacity="0.3" />
    <circle cx="32" cy="44" r="4" fill="currentColor" opacity="0.3" />
    <circle cx="20" cy="32" r="4" fill="currentColor" opacity="0.3" />
    <path d="M28 28l-4-4M36 28l4-4M28 36l-4 4M36 36l4 4" strokeWidth="1.5" opacity="0.5" />
  </svg>
)

const ArrowIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const QuickLinksPattern = () => (
  <svg
    className="quicklinks-pattern absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="quicklinks-tribal-pattern"
        x="0"
        y="0"
        width="200"
        height="200"
        patternUnits="userSpaceOnUse"
      >
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.15" />
        <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.1" />
        <circle cx="50" cy="50" r="5" fill="currentColor" opacity="0.12" />

        <path
          d="M150 50 L165 65 L150 80 L135 65 Z"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
          opacity="0.12"
        />

        <line x1="100" y1="140" x2="100" y2="165" stroke="currentColor" strokeWidth="1.5" opacity="0.1" />
        <line x1="90" y1="147" x2="90" y2="158" stroke="currentColor" strokeWidth="1" opacity="0.08" />
        <line x1="110" y1="147" x2="110" y2="158" stroke="currentColor" strokeWidth="1" opacity="0.08" />
      </pattern>

      <linearGradient id="quicklinks-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.08" />
        <stop offset="50%" stopColor="currentColor" stopOpacity="0.15" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.25" />
      </linearGradient>
    </defs>

    <rect
      width="100%"
      height="100%"
      fill="url(#quicklinks-tribal-pattern)"
      className="text-primary-500"
    />
    <rect
      width="100%"
      height="100%"
      fill="url(#quicklinks-gradient)"
      className="text-neutral-900"
    />
  </svg>
)

export default QuickLinksSection
