import { useState, useEffect, useRef } from 'react'
import { TribalDivider } from '../Card/TribalDivider'
import { TribalCorner } from '../Card/TribalCorner'
import './TableOfContents.css'

const TableOfContents = ({
  sections = [],
  className = '',
  sticky = true,
  collapsible = true,
  defaultOpen = true,
  activeColor = 'text-secondary-500',
  ...props
}) => {
  const [activeId, setActiveId] = useState('')
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const observerRef = useRef(null)
  const headingElementsRef = useRef({})

  useEffect(() => {
    const callback = (entries) => {
      const visibleSections = entries.filter(entry => entry.isIntersecting)

      if (visibleSections.length > 0) {
        const topmost = visibleSections.reduce((prev, current) =>
          current.boundingClientRect.top < prev.boundingClientRect.top ? current : prev
        )
        setActiveId(topmost.target.id)
      }
    }

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: '-80px 0px -80% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1]
    })

    sections.forEach(section => {
      const element = document.getElementById(section.id)
      if (element) {
        headingElementsRef.current[section.id] = element
        observerRef.current.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [sections])

  const handleClick = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })

      setTimeout(() => setActiveId(id), 100)
    }
  }

  const toggleOpen = () => setIsOpen(!isOpen)

  const wrapperClasses = [
    sticky && 'lg:sticky lg:top-24',
    'lg:max-w-xs',
    className
  ].filter(Boolean).join(' ')

  const containerClasses = [
    'relative',
    'bg-gradient-to-br from-surface-elevated to-primary-50/20',
    'border-2 border-primary-300/60',
    'rounded-lg',
    'shadow-md hover:shadow-lg',
    'overflow-hidden',
    'transition-all duration-normal ease-organic',
    'backdrop-blur-sm'
  ].filter(Boolean).join(' ')

  const headerClasses = [
    'relative',
    'flex items-center justify-between',
    'px-5 py-4',
    'bg-gradient-to-r from-primary-100/80 via-primary-50/50 to-primary-100/80',
    'border-b-2 border-primary-300/70',
    collapsible && 'cursor-pointer lg:cursor-default',
    'select-none',
    'group'
  ].filter(Boolean).join(' ')

  const listClasses = [
    'px-4 py-5',
    'space-y-1',
    'scrollbar-tribal overflow-y-auto',
    'max-h-[70vh]',
    !isOpen && collapsible && 'hidden lg:block',
    'transition-all duration-normal'
  ].filter(Boolean).join(' ')

  return (
    <nav className={wrapperClasses} aria-label="Table des matières" {...props}>
      <div className={containerClasses}>
        <TribalCorner position="top-left" size="md" className="text-primary-400/40 z-0" />
        <TribalCorner position="top-right" size="md" className="text-primary-400/40 z-0" />
        <TribalCorner position="bottom-left" size="sm" className="text-primary-300/30 z-0" />
        <TribalCorner position="bottom-right" size="sm" className="text-primary-300/30 z-0" />

        <div className="relative z-10">
          <div
            className={headerClasses}
            onClick={collapsible ? toggleOpen : undefined}
          >
            <div className="flex items-center gap-3">
              <TribalBookIcon className="flex-shrink-0 text-secondary-500" />
              <h2 className="font-heading text-lg text-primary-900 tracking-wide leading-tight">
                Sommaire
              </h2>
            </div>

            {collapsible && (
              <button
                type="button"
                aria-label={isOpen ? 'Fermer le sommaire' : 'Ouvrir le sommaire'}
                className="lg:hidden text-primary-600 hover:text-secondary-500 transition-all duration-fast"
              >
                <svg
                  className={`w-5 h-5 transition-transform duration-normal ease-tribal ${isOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            )}
          </div>

          <div className={listClasses}>
            <ul className="space-y-0.5">
              {sections.map((section, index) => {
                const isActive = activeId === section.id
                const itemClasses = [
                  'block group relative',
                  'font-body text-sm',
                  'px-3 py-2.5',
                  'rounded-md',
                  'transition-all duration-fast ease-organic',
                  isActive
                    ? `${activeColor} bg-secondary-50/60 shadow-sm border-l-[3px] border-secondary-500 -ml-px pl-[11px]`
                    : 'text-primary-700 hover:text-primary-900 hover:bg-primary-50/50 border-l-[3px] border-transparent hover:border-primary-300/50 -ml-px pl-[11px]',
                  section.level === 2 && 'pl-7',
                  section.level === 3 && 'pl-10'
                ].filter(Boolean).join(' ')

                return (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => handleClick(e, section.id)}
                      className={itemClasses}
                    >
                      <span className="flex items-center gap-2.5">
                        {isActive && (
                          <TribalMarker className="flex-shrink-0 animate-pulse" />
                        )}
                        {!isActive && section.level === 1 && (
                          <TribalDot className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-fast" />
                        )}
                        <span className={`${isActive ? 'font-medium tracking-wide' : ''} transition-all duration-fast`}>
                          {section.title}
                        </span>
                      </span>
                    </a>

                    {index < sections.length - 1 && section.level === 1 && sections[index + 1]?.level === 1 && (
                      <div className="px-2 my-3">
                        <TribalDivider className="text-primary-300 opacity-40" variant="simple" />
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          <TribalFooter />
        </div>
      </div>
    </nav>
  )
}

const TribalBookIcon = ({ className = '' }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth={1.5}
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title>Parchemin ancien</title>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M8 7h8M8 11h8M8 15h5" opacity="0.5" />
  </svg>
)

const TribalMarker = ({ className = '' }) => (
  <svg
    className={`w-3 h-3 text-secondary-500 ${className}`}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>Section active</title>
    <path d="M6 1 L11 6 L6 11 L1 6 Z" fill="currentColor" fillOpacity="0.7" />
    <circle cx="6" cy="6" r="2.5" fill="currentColor" fillOpacity="0.9" />
    <circle cx="6" cy="6" r="1" fill="white" fillOpacity="0.8" />
  </svg>
)

const TribalDot = ({ className = '' }) => (
  <svg
    className={`w-2 h-2 text-primary-400 ${className}`}
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="4" cy="4" r="3" fill="currentColor" fillOpacity="0.6" />
  </svg>
)

const TribalFooter = () => (
  <div className="relative px-4 py-3 bg-gradient-to-r from-primary-50/40 via-primary-100/30 to-primary-50/40 border-t-2 border-primary-200/60">
    <svg
      className="w-full h-6 text-primary-400 opacity-30"
      viewBox="0 0 160 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <circle cx="15" cy="12" r="2" fill="currentColor" fillOpacity="0.4" />
      <line x1="20" y1="12" x2="35" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <path d="M40 12 L45 8 L50 12 L45 16 Z" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
      <circle cx="60" cy="12" r="4" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" fill="none" />
      <circle cx="60" cy="12" r="1.5" fill="currentColor" fillOpacity="0.5" />
      <path d="M70 8 L74 12 L70 16 M76 8 L80 12 L76 16" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" />
      <circle cx="90" cy="12" r="4" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" fill="none" />
      <circle cx="90" cy="12" r="1.5" fill="currentColor" fillOpacity="0.5" />
      <path d="M100 12 L105 8 L110 12 L105 16 Z" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.5" fill="none" />
      <line x1="115" y1="12" x2="130" y2="12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="145" cy="12" r="2" fill="currentColor" fillOpacity="0.4" />
    </svg>
  </div>
)

export default TableOfContents
export { TableOfContents }
