import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import './LoreSection.css'

/**
 * LoreSection - "Le Codex des Anciens"
 *
 * Section présentant l'histoire et le lore du monde sous forme de chapitres navigables.
 * Design inspiré de tablettes de pierre gravées avec runes tribales.
 *
 * @param {Object} props
 * @param {Array} props.chapters - Tableau des chapitres du lore
 * @param {string} props.title - Titre principal de la section
 * @param {string} props.subtitle - Sous-titre descriptif
 */
const LoreSection = ({
  chapters = [],
  title = "Le Codex des Anciens",
  subtitle = "Les fragments d'histoire gravés dans la pierre du temps"
}) => {
  const [activeChapter, setActiveChapter] = useState(chapters.length > 0 ? chapters[0].id : null)
  const [expandedChapters, setExpandedChapters] = useState(new Set([chapters.length > 0 ? chapters[0].id : null]))
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  // Intersection Observer pour révélation au scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Tracking du scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const section = sectionRef.current
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      const start = sectionTop - windowHeight / 2
      const end = sectionTop + sectionHeight - windowHeight / 2

      if (scrollY >= start && scrollY <= end) {
        const progress = ((scrollY - start) / (end - start)) * 100
        setScrollProgress(Math.min(Math.max(progress, 0), 100))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleChapterClick = (chapterId) => {
    setActiveChapter(chapterId)

    // Toggle expand
    setExpandedChapters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId)
      } else {
        newSet.add(chapterId)
      }
      return newSet
    })

    // Scroll to chapter
    const element = document.getElementById(`chapter-${chapterId}`)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    }
  }

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId)
      } else {
        newSet.add(chapterId)
      }
      return newSet
    })
  }

  if (!chapters || chapters.length === 0) {
    return null
  }

  return (
    <section
      ref={sectionRef}
      className={`lore-section ${isVisible ? 'is-visible' : ''}`}
      id="lore"
    >
      {/* Background avec transition depuis le hero */}
      <div className="lore-section__bg" />
      <div className="lore-section__texture" />

      {/* Pattern de cendres continues */}
      <AshTexturePattern />

      <div className="lore-section__container max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">

        {/* Header de section */}
        <header className="lore-section__header text-center mb-16 md:mb-24">
          {/* Ornement supérieur */}
          <TribalOrnament position="top" />

          <h2 className="lore-section__title font-display text-4xl md:text-5xl lg:text-6xl text-lore-accent mb-6">
            {title}
          </h2>

          <p className="lore-section__subtitle font-body text-lg md:text-xl text-lore-text-muted max-w-2xl mx-auto italic">
            {subtitle}
          </p>

          {/* Ornement inférieur */}
          <TribalOrnament position="bottom" />
        </header>

        {/* Navigation par runes - Timeline */}
        <nav className="lore-section__timeline mb-12 md:mb-20">
          <div className="lore-section__timeline-track">
            {chapters.map((chapter, index) => (
              <RuneNavigationItem
                key={chapter.id}
                chapter={chapter}
                isActive={activeChapter === chapter.id}
                isExpanded={expandedChapters.has(chapter.id)}
                onClick={() => handleChapterClick(chapter.id)}
                index={index}
              />
            ))}
          </div>

          {/* Ligne de progression */}
          <div className="lore-section__timeline-line" />
        </nav>

        {/* Chapitres - Tablettes de pierre */}
        <div className="lore-section__chapters space-y-8 md:space-y-12">
          {chapters.map((chapter, index) => (
            <ChapterTablet
              key={chapter.id}
              chapter={chapter}
              isActive={activeChapter === chapter.id}
              isExpanded={expandedChapters.has(chapter.id)}
              onToggle={() => toggleChapter(chapter.id)}
              index={index}
            />
          ))}
        </div>

        {/* Scroll progress indicator (sticky sidebar) */}
        <ScrollProgressIndicator
          chapters={chapters}
          activeChapter={activeChapter}
          progress={scrollProgress}
        />
      </div>
    </section>
  )
}

/**
 * Item de navigation avec rune
 */
const RuneNavigationItem = ({ chapter, isActive, isExpanded, onClick, index }) => {
  return (
    <button
      className={`lore-section__rune-button ${isActive ? 'is-active' : ''} ${isExpanded ? 'is-expanded' : ''}`}
      onClick={onClick}
      aria-label={`Naviguer vers ${chapter.title}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="lore-section__rune-glow" />
      <svg
        className="lore-section__rune-symbol"
        viewBox="0 0 40 40"
        aria-hidden="true"
      >
        <RuneSymbol type={chapter.rune} />
      </svg>

      <div className="lore-section__rune-tooltip">
        <span className="font-ui text-xs">{chapter.title}</span>
        <span className="font-ui text-xs opacity-70">{chapter.timeframe}</span>
      </div>
    </button>
  )
}

/**
 * Tablette de chapitre avec contenu
 */
const ChapterTablet = ({ chapter, isActive, isExpanded, onToggle, index }) => {
  const contentRef = useRef(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    // setState appelé dans le callback ResizeObserver (système externe) — pattern autorisé
    const observer = new ResizeObserver(() => {
      setContentHeight(isExpanded ? el.scrollHeight : 0)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [isExpanded])

  return (
    <article
      id={`chapter-${chapter.id}`}
      className={`lore-section__tablet ${isActive ? 'is-active' : ''} ${isExpanded ? 'is-expanded' : ''}`}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      {/* Coins décoratifs */}
      <StoneCorner position="top-left" />
      <StoneCorner position="top-right" />
      <StoneCorner position="bottom-left" />
      <StoneCorner position="bottom-right" />

      {/* Header de la tablette - toujours visible */}
      <header
        className="lore-section__tablet-header"
        onClick={onToggle}
      >
        <div className="lore-section__tablet-header-content">
          {/* Rune du chapitre */}
          <div className="lore-section__tablet-rune">
            <svg viewBox="0 0 40 40" className="w-12 h-12 md:w-16 md:h-16">
              <RuneSymbol type={chapter.rune} />
            </svg>
          </div>

          <div className="lore-section__tablet-header-text">
            <h3 className="lore-section__tablet-title font-heading text-2xl md:text-3xl lg:text-4xl text-lore-accent">
              {chapter.title}
            </h3>
            {chapter.timeframe && (
              <p className="lore-section__tablet-timeframe font-ui text-sm md:text-base text-lore-text-muted mt-2">
                {chapter.timeframe}
              </p>
            )}
          </div>

          {/* Toggle indicator */}
          <button
            className="lore-section__tablet-toggle"
            aria-label={isExpanded ? "Replier" : "Déplier"}
          >
            <TribalChevron direction={isExpanded ? "up" : "down"} />
          </button>
        </div>

        {/* Résumé court - visible même replié */}
        {chapter.summary && (
          <p className="lore-section__tablet-summary font-body text-base md:text-lg text-lore-text-primary mt-4 italic">
            {chapter.summary}
          </p>
        )}
      </header>

      {/* Séparateur avec fragments */}
      {isExpanded && <TabletDivider />}

      {/* Contenu détaillé - collapsible */}
      <div
        className="lore-section__tablet-content-wrapper"
        style={{
          maxHeight: `${contentHeight}px`,
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div ref={contentRef} className="lore-section__tablet-content">
          {/* Image optionnelle */}
          {chapter.image && (
            <figure className="lore-section__tablet-image">
              <img
                src={chapter.image}
                alt={chapter.title}
                loading="lazy"
              />
              <div className="lore-section__tablet-image-overlay" />
            </figure>
          )}

          {/* Contenu texte avec lettrines */}
          <div className="lore-section__tablet-text prose prose-invert max-w-none">
            {chapter.content ? (
              typeof chapter.content === 'string' ? (
                <LoreContent content={chapter.content} />
              ) : (
                chapter.content
              )
            ) : (
              <p className="text-lore-text-muted italic">Contenu à venir...</p>
            )}
          </div>

          {/* Footnote optionnelle */}
          {chapter.footnote && (
            <footer className="lore-section__tablet-footnote font-body text-sm text-lore-text-muted mt-8 pt-6 border-t border-lore-border">
              {chapter.footnote}
            </footer>
          )}
        </div>
      </div>
    </article>
  )
}

/**
 * Contenu formaté avec première lettre stylisée
 */
const LoreContent = ({ content }) => {
  const paragraphs = content.split('\n\n').filter(p => p.trim())

  return (
    <>
      {paragraphs.map((paragraph, index) => {
        const firstLetter = paragraph.charAt(0)
        const restOfText = paragraph.slice(1)

        return (
          <p key={index} className="lore-section__paragraph">
            {index === 0 ? (
              <>
                <span className="lore-section__drop-cap">{firstLetter}</span>
                {restOfText}
              </>
            ) : (
              paragraph
            )}
          </p>
        )
      })}
    </>
  )
}

/**
 * Symboles de runes basés sur le type
 */
const RuneSymbol = ({ type }) => {
  const symbols = {
    '∆': (
      // Triangle - Genèse
      <g>
        <path d="M20 8 L32 32 L8 32 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </g>
    ),
    '⧖': (
      // Sablier - Cataclysme
      <g>
        <path d="M12 8 L28 8 L20 20 L28 32 L12 32 L20 20 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="20" r="1.5" fill="currentColor" />
      </g>
    ),
    '◇': (
      // Diamant - Survie
      <g>
        <path d="M20 8 L32 20 L20 32 L8 20 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M20 14 L26 20 L20 26 L14 20 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
      </g>
    ),
    '◉': (
      // Cercle avec point - Renaissance
      <g>
        <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="20" r="4" fill="currentColor" />
        <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
      </g>
    ),
    '⚡': (
      // Éclair - Révélation
      <g>
        <path d="M24 8 L12 20 L20 20 L16 32 L28 20 L20 20 Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" opacity="0.3" />
      </g>
    ),
    default: (
      // Cercle simple par défaut
      <g>
        <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </g>
    )
  }

  return symbols[type] || symbols.default
}

/**
 * Ornement tribal pour headers
 */
const TribalOrnament = ({ position }) => {
  return (
    <svg
      className={`lore-section__ornament lore-section__ornament--${position}`}
      viewBox="0 0 200 20"
      aria-hidden="true"
    >
      <line x1="0" y1="10" x2="70" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
      <path
        d="M75 10 L82 6 L89 10 L82 14 Z"
        fill="currentColor"
        opacity="0.2"
      />
      <circle cx="100" cy="10" r="4" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
      <circle cx="100" cy="10" r="1.5" fill="currentColor" opacity="0.4" />
      <path
        d="M111 10 L118 6 L125 10 L118 14 Z"
        fill="currentColor"
        opacity="0.2"
      />
      <line x1="130" y1="10" x2="200" y2="10" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    </svg>
  )
}

/**
 * Divider de tablette avec fragments
 */
const TabletDivider = () => {
  return (
    <div className="lore-section__tablet-divider">
      <svg viewBox="0 0 100 4" preserveAspectRatio="none">
        <line x1="0" y1="2" x2="100" y2="2" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      </svg>
    </div>
  )
}

/**
 * Coins de pierre décoratifs
 */
const StoneCorner = ({ position }) => {
  const transforms = {
    'top-left': '',
    'top-right': 'scale(-1, 1)',
    'bottom-left': 'scale(1, -1)',
    'bottom-right': 'scale(-1, -1)'
  }

  return (
    <svg
      className={`lore-section__stone-corner lore-section__stone-corner--${position}`}
      viewBox="0 0 30 30"
      style={{ transform: transforms[position] }}
      aria-hidden="true"
    >
      <path
        d="M0 0 L20 0 L22 2 L25 0 L30 5 L28 8 L30 10 L25 15 L15 15 L10 12 L5 15 L0 10 Z"
        fill="currentColor"
        opacity="0.1"
      />
      <path
        d="M2 2 L5 4 M8 3 L11 5"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.15"
      />
    </svg>
  )
}

/**
 * Chevron tribal pour toggle
 */
const TribalChevron = ({ direction }) => {
  const rotation = direction === 'up' ? 180 : 0

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s ease' }}
    >
      <path
        d="M6 9 L12 15 L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="12" cy="15" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  )
}

/**
 * Pattern de texture de cendres
 */
const AshTexturePattern = () => (
  <svg className="lore-section__ash-pattern" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern
        id="lore-ash-texture"
        x="0"
        y="0"
        width="150"
        height="150"
        patternUnits="userSpaceOnUse"
      >
        <path d="M0 30 Q40 20 80 30 T150 30" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.04" />
        <path d="M0 80 Q50 70 100 80 T150 80" stroke="currentColor" strokeWidth="0.3" fill="none" opacity="0.03" />
        <circle cx="20" cy="40" r="0.5" fill="currentColor" opacity="0.05" />
        <circle cx="90" cy="60" r="0.5" fill="currentColor" opacity="0.04" />
        <circle cx="130" cy="100" r="0.5" fill="currentColor" opacity="0.06" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#lore-ash-texture)" className="text-neutral-500" />
  </svg>
)

/**
 * Indicateur de progression sticky
 */
const ScrollProgressIndicator = ({ chapters, activeChapter, progress }) => {
  return (
    <aside className="lore-section__progress-indicator">
      <div className="lore-section__progress-track">
        {chapters.map((chapter, index) => (
          <a
            key={chapter.id}
            href={`#chapter-${chapter.id}`}
            className={`lore-section__progress-dot ${activeChapter === chapter.id ? 'is-active' : ''}`}
            aria-label={chapter.title}
            style={{
              opacity: (progress / 100) * chapters.length > index ? 1 : 0.3
            }}
          >
            <div className="lore-section__progress-dot-inner" />
          </a>
        ))}
      </div>
    </aside>
  )
}

// PropTypes
LoreSection.propTypes = {
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      rune: PropTypes.string,
      timeframe: PropTypes.string,
      summary: PropTypes.string,
      content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      image: PropTypes.string,
      footnote: PropTypes.string
    })
  ).isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string
}

RuneNavigationItem.propTypes = {
  chapter: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

ChapterTablet.propTypes = {
  chapter: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

LoreContent.propTypes = {
  content: PropTypes.string.isRequired
}

RuneSymbol.propTypes = {
  type: PropTypes.string
}

TribalOrnament.propTypes = {
  position: PropTypes.oneOf(['top', 'bottom']).isRequired
}

StoneCorner.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']).isRequired
}

TribalChevron.propTypes = {
  direction: PropTypes.oneOf(['up', 'down']).isRequired
}

ScrollProgressIndicator.propTypes = {
  chapters: PropTypes.array.isRequired,
  activeChapter: PropTypes.string,
  progress: PropTypes.number.isRequired
}

export default LoreSection
