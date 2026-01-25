import { useState, useEffect } from 'react'
import './ScrollToTop.css'

/**
 * ScrollToTop - Tribal-themed scroll to top button
 *
 * Features:
 * - Appears after scrolling past threshold
 * - Smooth scroll animation
 * - Tribal arrow icon design
 * - Ember glow on hover
 * - Respects reduced motion preferences
 */
const ScrollToTop = ({
  threshold = 400,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'instant' : 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top ${isVisible ? 'scroll-to-top--visible' : ''} ${className}`}
      aria-label="Retour en haut de page"
      title="Retour en haut"
      {...props}
    >
      <TribalArrowIcon />
      <span className="scroll-to-top__glow" />
    </button>
  )
}

const TribalArrowIcon = () => (
  <svg
    className="scroll-to-top__icon"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Main arrow pointing up */}
    <path
      d="M16 4 L26 18 L20 18 L20 28 L12 28 L12 18 L6 18 Z"
      fill="currentColor"
      className="scroll-to-top__arrow"
    />
    {/* Tribal decorations */}
    <path
      d="M16 8 L19 13 L16 11 L13 13 Z"
      fill="currentColor"
      opacity="0.6"
    />
    <circle cx="16" cy="22" r="2" fill="currentColor" opacity="0.4" />
    {/* Side tribal marks */}
    <path
      d="M4 16 L6 14 L6 18 Z M28 16 L26 14 L26 18 Z"
      fill="currentColor"
      opacity="0.3"
    />
  </svg>
)

export default ScrollToTop
export { ScrollToTop }
