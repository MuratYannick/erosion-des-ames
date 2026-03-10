import { useState, useEffect, useRef, Fragment } from 'react'

// Valeurs aléatoires pour les braises, calculées une fois au chargement du module (hors render)
const EMBER_STYLES = [...Array(12)].map(() => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 15}s`,
  animationDuration: `${12 + Math.random() * 8}s`,
}))
import PropTypes from 'prop-types'
import './TimelineSection.css'

/**
 * TimelineSection - "Le Fleuve des Âges"
 *
 * Section présentant la chronologie du monde sous forme de strates géologiques.
 * Chaque ère est une couche de roche avec sa propre température visuelle.
 */
const TimelineSection = ({
  eras = [],
  title = 'Le Fleuve des Âges',
  subtitle = "L'histoire de notre monde gravée dans la pierre du temps"
}) => {
  const [activeEra, setActiveEra] = useState(null)
  const [expandedEras, setExpandedEras] = useState(new Set())
  const [visibleEras, setVisibleEras] = useState(new Set())
  const [flowingConnectors, setFlowingConnectors] = useState(new Set())
  const sectionRef = useRef(null)
  const eraRefs = useRef({})

  // Intersection Observer pour révélation au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const eraId = entry.target.dataset.eraId
          if (entry.isIntersecting) {
            setVisibleEras(prev => new Set([...prev, eraId]))
            // Activer le connecteur précédent
            const index = eras.findIndex(e => e.id === eraId)
            if (index > 0) {
              setTimeout(() => {
                setFlowingConnectors(prev => new Set([...prev, `connector-${index - 1}`]))
              }, 300)
            }
          }
        })
      },
      { threshold: 0.2, rootMargin: '-50px' }
    )

    Object.values(eraRefs.current).forEach(ref => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [eras])

  const handleEraClick = (eraId) => {
    setActiveEra(activeEra === eraId ? null : eraId)
    setExpandedEras(prev => {
      const newSet = new Set(prev)
      if (newSet.has(eraId)) {
        newSet.delete(eraId)
      } else {
        newSet.add(eraId)
      }
      return newSet
    })
  }

  const scrollToEra = (eraId) => {
    const element = eraRefs.current[eraId]
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
    setActiveEra(eraId)
    setExpandedEras(prev => new Set([...prev, eraId]))
  }

  if (!eras || eras.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} className="timeline-section" id="timeline">
      {/* Background avec texture */}
      <div className="timeline-section__bg" />

      {/* Braises flottantes (ère actuelle) */}
      <EmbersOverlay />

      <div className="timeline-section__container">
        {/* Header */}
        <header className="timeline-section__header">
          <TimelineOrnament position="top" />

          <h2 className="timeline-section__title">{title}</h2>
          <p className="timeline-section__subtitle">{subtitle}</p>

          <TimelineOrnament position="bottom" />
        </header>

        {/* Sidebar Navigation (desktop) */}
        <TimelineSidebar
          eras={eras}
          activeEra={activeEra}
          onEraClick={scrollToEra}
        />

        {/* Timeline principale */}
        <div className="timeline-section__flow">
          {eras.map((era, index) => (
            <Fragment key={era.id}>
              {/* Strate d'Ère */}
              <TimelineEra
                ref={el => eraRefs.current[era.id] = el}
                era={era}
                isActive={activeEra === era.id}
                isExpanded={expandedEras.has(era.id)}
                isVisible={visibleEras.has(era.id)}
                onClick={() => handleEraClick(era.id)}
                index={index}
              />

              {/* Connecteur */}
              {index < eras.length - 1 && (
                <TimelineConnector
                  isFlowing={flowingConnectors.has(`connector-${index}`)}
                  fromTemperature={era.temperature}
                  toTemperature={eras[index + 1].temperature}
                />
              )}
            </Fragment>
          ))}
        </div>

        {/* Footer avec citation finale */}
        <footer className="timeline-section__footer">
          <blockquote className="timeline-section__final-quote">
            <p>"Le temps est un fleuve de lave : il brûle tout sur son passage, mais de ses cendres naissent les fondations de demain."</p>
            <cite>— Les Chroniqueurs des Âges</cite>
          </blockquote>
        </footer>
      </div>
    </section>
  )
}

/**
 * Sidebar de navigation rapide
 */
const TimelineSidebar = ({ eras, activeEra, onEraClick }) => {
  return (
    <aside className="timeline-sidebar">
      <div className="timeline-sidebar__track">
        {eras.map((era) => (
          <button
            key={era.id}
            className={`timeline-sidebar__rune ${activeEra === era.id ? 'is-active' : ''} ${era.isCurrent ? 'is-current' : ''}`}
            onClick={() => onEraClick(era.id)}
            aria-label={`Naviguer vers ${era.title}`}
            title={era.title}
          >
            <RuneSymbol type={era.rune} />
            <span className="timeline-sidebar__tooltip">{era.title}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}

/**
 * Strate d'une ère
 */
const TimelineEra = ({ era, isActive, isExpanded, isVisible, onClick, index, ref }) => {
  const contentRef = useRef(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      setContentHeight(isExpanded ? el.scrollHeight : 0)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [isExpanded])

  return (
    <article
      ref={ref}
      data-era-id={era.id}
      className={`timeline-era timeline-era--${era.temperature} ${isActive ? 'is-active' : ''} ${isExpanded ? 'is-expanded' : ''} ${isVisible ? 'is-visible' : ''} ${era.isCurrent ? 'is-current' : ''}`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Bordures décoratives */}
      <StrataCorner position="top-left" />
      <StrataCorner position="top-right" />
      <StrataCorner position="bottom-left" />
      <StrataCorner position="bottom-right" />

      {/* Header cliquable */}
      <header className="timeline-era__header" onClick={onClick}>
        <div className="timeline-era__rune-container">
          <div className="timeline-era__rune-glow" />
          <svg className="timeline-era__rune" viewBox="0 0 40 40">
            <RuneSymbol type={era.rune} />
          </svg>
        </div>

        <div className="timeline-era__header-content">
          <h3 className="timeline-era__title">{era.title}</h3>
          <span className="timeline-era__timeline">{era.timeline}</span>
        </div>

        <button
          className="timeline-era__toggle"
          aria-label={isExpanded ? 'Replier' : 'Déplier'}
          aria-expanded={isExpanded}
        >
          <ChevronIcon direction={isExpanded ? 'up' : 'down'} />
        </button>
      </header>

      {/* Résumé toujours visible */}
      <p className="timeline-era__summary">{era.summary}</p>

      {/* Contenu détaillé (expandable) */}
      <div
        className="timeline-era__content-wrapper"
        style={{ maxHeight: `${contentHeight}px` }}
      >
        <div ref={contentRef} className="timeline-era__content">
          {/* Séparateur */}
          <StrataDivider />

          {/* Description */}
          {era.description && (
            <div className="timeline-era__description">
              {era.description.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          )}

          {/* Événements */}
          {era.events && era.events.length > 0 && (
            <div className="timeline-era__events">
              <h4 className="timeline-era__events-title">Événements Majeurs</h4>
              <ul className="timeline-era__events-list">
                {era.events.map((event, i) => (
                  <TimelineEvent key={event.id} event={event} index={i} />
                ))}
              </ul>
            </div>
          )}

          {/* Citation */}
          {era.quote && (
            <blockquote className="timeline-era__quote">
              <p>"{era.quote}"</p>
              {era.quoteAuthor && <cite>— {era.quoteAuthor}</cite>}
            </blockquote>
          )}
        </div>
      </div>
    </article>
  )
}

/**
 * Événement dans une ère
 */
const TimelineEvent = ({ event, index }) => {
  return (
    <li
      className="timeline-event"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="timeline-event__marker">
        <EventIcon type={event.icon} />
      </div>
      <div className="timeline-event__content">
        <span className="timeline-event__year">{event.year}</span>
        <h5 className="timeline-event__title">{event.title}</h5>
        <p className="timeline-event__description">{event.description}</p>
      </div>
    </li>
  )
}

/**
 * Connecteur entre ères (flux de lave)
 */
const TimelineConnector = ({ isFlowing }) => {
  return (
    <div className={`timeline-connector ${isFlowing ? 'is-flowing' : ''}`}>
      <svg
        className="timeline-connector__svg"
        viewBox="0 0 100 120"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="lava-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7a6454" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#e67315" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7a6454" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Chemin principal */}
        <path
          className="timeline-connector__path"
          d="M50 0 Q45 30 50 50 Q55 80 50 100 Q45 110 50 120"
          stroke="url(#lava-gradient)"
          strokeWidth="4"
          fill="none"
        />

        {/* Flux animé */}
        <path
          className="timeline-connector__flow"
          d="M50 0 Q45 30 50 50 Q55 80 50 100 Q45 110 50 120"
          stroke="#e67315"
          strokeWidth="2"
          fill="none"
          strokeDasharray="200"
          strokeDashoffset="200"
        />

        {/* Particules */}
        <circle className="timeline-connector__particle timeline-connector__particle--1" cx="45" cy="30" r="2" fill="#ff9635" />
        <circle className="timeline-connector__particle timeline-connector__particle--2" cx="55" cy="60" r="1.5" fill="#e67315" />
        <circle className="timeline-connector__particle timeline-connector__particle--3" cx="48" cy="90" r="2" fill="#ffd5a3" />
      </svg>
    </div>
  )
}

/**
 * Symboles de runes
 */
const RuneSymbol = ({ type }) => {
  const symbols = {
    '∆': (
      <g>
        <path d="M20 8 L32 32 L8 32 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="20" cy="20" r="3" fill="currentColor" opacity="0.6" />
        <line x1="20" y1="14" x2="20" y2="20" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      </g>
    ),
    '⧖': (
      <g>
        <path d="M12 8 L28 8 L20 20 L28 32 L12 32 L20 20 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M20 12 L22 16 L18 20 L20 24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.5" />
        <circle cx="16" cy="16" r="1" fill="currentColor" opacity="0.3" />
        <circle cx="24" cy="24" r="1" fill="currentColor" opacity="0.3" />
      </g>
    ),
    '◇': (
      <g>
        <path d="M20 8 L32 20 L20 32 L8 20 Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M20 14 L26 20 L20 26 L14 20 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
        <rect x="18" y="18" width="4" height="4" fill="currentColor" opacity="0.3" />
      </g>
    ),
    '◉': (
      <g>
        <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" className="rune-pulse-ring" />
        <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.8" />
      </g>
    )
  }

  return symbols[type] || symbols['◉']
}

/**
 * Icône d'événement
 */
const EventIcon = ({ type }) => {
  const icons = {
    flame: (
      <path d="M12 2C10 6 8 8 8 11C8 14.87 10.13 17 14 17C17.87 17 20 14.87 20 11C20 8 18 6 16 2C14 6 12 6 12 2Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    ),
    tribe: (
      <g>
        <circle cx="14" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M8 20V18C8 15.79 9.79 14 12 14H16C18.21 14 20 15.79 20 18V20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </g>
    ),
    pact: (
      <g>
        <path d="M7 11L12 6L17 11" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M7 17L12 12L17 17" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </g>
    ),
    crack: (
      <path d="M12 2L14 8L18 10L14 12L16 20L12 14L8 20L10 12L6 10L10 8L8 2L12 6L16 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    ),
    ruins: (
      <g>
        <rect x="6" y="10" width="4" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="18" y="10" width="4" height="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M4 10H24" stroke="currentColor" strokeWidth="1.5" />
        <path d="M6 4L14 2L22 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </g>
    ),
    guardian: (
      <g>
        <circle cx="14" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M14 12V22" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 16H18" stroke="currentColor" strokeWidth="1.5" />
      </g>
    ),
    faction: (
      <g>
        <path d="M14 4L18 8L14 12L10 8Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M6 12L10 16L6 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M22 12L18 16L22 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </g>
    ),
    nexus: (
      <g>
        <circle cx="14" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="14" cy="14" r="2" fill="currentColor" />
        <path d="M14 4V8M14 20V24M4 14H8M20 14H24" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </g>
    ),
    war: (
      <g>
        <path d="M6 6L14 14L22 6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M6 22L14 14L22 22" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </g>
    ),
    star: (
      <path d="M14 2L16.5 9.5L24 10L18.5 15L20 22L14 18L8 22L9.5 15L4 10L11.5 9.5Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
    )
  }

  return (
    <svg className="timeline-event__icon" viewBox="0 0 28 28">
      {icons[type] || icons.star}
    </svg>
  )
}

/**
 * Chevron pour toggle
 */
const ChevronIcon = ({ direction }) => {
  const rotation = direction === 'up' ? 180 : 0
  return (
    <svg
      className="timeline-era__chevron"
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

/**
 * Ornement de section
 */
const TimelineOrnament = ({ position }) => {
  return (
    <svg
      className={`timeline-section__ornament timeline-section__ornament--${position}`}
      viewBox="0 0 200 20"
      aria-hidden="true"
    >
      <line x1="0" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path d="M65 10 L75 5 L85 10 L75 15 Z" fill="currentColor" opacity="0.2" />
      <circle cx="100" cy="10" r="5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="100" cy="10" r="2" fill="currentColor" opacity="0.5" />
      <path d="M115 10 L125 5 L135 10 L125 15 Z" fill="currentColor" opacity="0.2" />
      <line x1="140" y1="10" x2="200" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  )
}

/**
 * Coins de strate
 */
const StrataCorner = ({ position }) => {
  const transforms = {
    'top-left': '',
    'top-right': 'scaleX(-1)',
    'bottom-left': 'scaleY(-1)',
    'bottom-right': 'scale(-1, -1)'
  }

  return (
    <svg
      className={`timeline-era__corner timeline-era__corner--${position}`}
      viewBox="0 0 40 40"
      style={{ transform: transforms[position] }}
      aria-hidden="true"
    >
      <path
        d="M0 0 L25 0 L28 3 L32 0 L40 8 L37 12 L40 15 L30 20 L20 20 L15 18 L10 20 L0 15 Z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M3 3 L8 6 M12 4 L17 7"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.15"
      />
    </svg>
  )
}

/**
 * Séparateur de strate
 */
const StrataDivider = () => {
  return (
    <div className="timeline-era__divider">
      <span className="timeline-era__divider-line" />
      <svg className="timeline-era__divider-icon" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
      <span className="timeline-era__divider-line" />
    </div>
  )
}

/**
 * Overlay de braises flottantes
 */
const EmbersOverlay = () => {
  return (
    <div className="timeline-embers" aria-hidden="true">
      {EMBER_STYLES.map((style, i) => (
        <span
          key={i}
          className="timeline-embers__particle"
          style={style}
        />
      ))}
    </div>
  )
}

// PropTypes
TimelineSection.propTypes = {
  eras: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      rune: PropTypes.string.isRequired,
      timeline: PropTypes.string.isRequired,
      temperature: PropTypes.oneOf(['cold', 'warm', 'hot', 'incandescent']).isRequired,
      isCurrent: PropTypes.bool,
      summary: PropTypes.string,
      description: PropTypes.string,
      events: PropTypes.array,
      quote: PropTypes.string,
      quoteAuthor: PropTypes.string
    })
  ).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string
}

TimelineSidebar.propTypes = {
  eras: PropTypes.array.isRequired,
  activeEra: PropTypes.string,
  onEraClick: PropTypes.func.isRequired
}

TimelineEvent.propTypes = {
  event: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
}

TimelineConnector.propTypes = {
  isFlowing: PropTypes.bool.isRequired
}

RuneSymbol.propTypes = {
  type: PropTypes.string.isRequired
}

EventIcon.propTypes = {
  type: PropTypes.string
}

ChevronIcon.propTypes = {
  direction: PropTypes.oneOf(['up', 'down']).isRequired
}

TimelineOrnament.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom']).isRequired
}

StrataCorner.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']).isRequired
}

export default TimelineSection
