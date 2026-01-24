import { forwardRef } from 'react'

const positionStyles = {
  'top-left': '',
  'top-right': 'scale-x-[-1]',
  'bottom-left': 'scale-y-[-1]',
  'bottom-right': 'scale-[-1]'
}

const positionClasses = {
  'top-left': 'top-0 left-0',
  'top-right': 'top-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'bottom-right': 'bottom-0 right-0'
}

/**
 * TribalCorner - Decorative SVG corner motif
 *
 * @param {string} position - Corner position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
 * @param {string} size - Size preset: 'sm' | 'md' | 'lg'
 * @param {boolean} absolute - Whether to use absolute positioning
 * @param {string} className - Additional CSS classes
 */
const TribalCorner = forwardRef(({
  position = 'top-left',
  size = 'md',
  absolute = true,
  className = '',
  ...props
}, ref) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const classes = [
    sizes[size] || sizes.md,
    absolute && 'absolute',
    absolute && positionClasses[position],
    positionStyles[position],
    'pointer-events-none',
    className
  ].filter(Boolean).join(' ')

  return (
    <svg
      ref={ref}
      className={classes}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      {/* Outer angular frame */}
      <path
        d="M0 0 L48 0 L48 8 L8 8 L8 48 L0 48 Z"
        fill="currentColor"
        fillOpacity="0.1"
      />

      {/* Inner angular line */}
      <path
        d="M4 4 L40 4 L40 6 L6 6 L6 40 L4 40 Z"
        fill="currentColor"
        fillOpacity="0.3"
      />

      {/* Ritual circle - outer */}
      <circle
        cx="16"
        cy="16"
        r="8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        fill="none"
      />

      {/* Ritual circle - inner */}
      <circle
        cx="16"
        cy="16"
        r="4"
        fill="currentColor"
        fillOpacity="0.2"
      />

      {/* Ritual circle - center dot */}
      <circle
        cx="16"
        cy="16"
        r="1.5"
        fill="currentColor"
        fillOpacity="0.5"
      />

      {/* Geometric accent lines */}
      <path
        d="M28 4 L28 12 M32 4 L32 8"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      <path
        d="M4 28 L12 28 M4 32 L8 32"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
      />

      {/* Diamond accent */}
      <path
        d="M36 12 L40 16 L36 20 L32 16 Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.25"
        fill="none"
      />

      {/* Triangular marks */}
      <path
        d="M10 36 L14 40 L10 40 Z"
        fill="currentColor"
        fillOpacity="0.2"
      />
    </svg>
  )
})

TribalCorner.displayName = 'TribalCorner'

export { TribalCorner }
export default TribalCorner
