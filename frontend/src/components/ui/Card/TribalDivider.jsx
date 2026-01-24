import { forwardRef } from 'react'

/**
 * TribalDivider - Decorative horizontal divider with tribal motifs
 *
 * @param {string} variant - Style variant: 'simple' | 'ornate'
 * @param {string} className - Additional CSS classes
 */
const TribalDivider = forwardRef(({
  variant = 'simple',
  className = '',
  ...props
}, ref) => {
  const classes = [
    'w-full',
    className
  ].filter(Boolean).join(' ')

  if (variant === 'ornate') {
    return (
      <svg
        ref={ref}
        className={classes}
        viewBox="0 0 200 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        {...props}
      >
        {/* Left line */}
        <line
          x1="0"
          y1="12"
          x2="70"
          y2="12"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Left circles */}
        <circle
          cx="20"
          cy="12"
          r="2"
          fill="currentColor"
          fillOpacity="0.2"
        />
        <circle
          cx="50"
          cy="12"
          r="1.5"
          fill="currentColor"
          fillOpacity="0.15"
        />

        {/* Left diamond */}
        <path
          d="M65 12 L70 8 L75 12 L70 16 Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Center diamond cluster */}
        <path
          d="M90 12 L100 4 L110 12 L100 20 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          fill="currentColor"
          fillOpacity="0.1"
        />
        <circle
          cx="100"
          cy="12"
          r="3"
          fill="currentColor"
          fillOpacity="0.3"
        />

        {/* Right diamond */}
        <path
          d="M125 12 L130 8 L135 12 L130 16 Z"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Right circles */}
        <circle
          cx="150"
          cy="12"
          r="1.5"
          fill="currentColor"
          fillOpacity="0.15"
        />
        <circle
          cx="180"
          cy="12"
          r="2"
          fill="currentColor"
          fillOpacity="0.2"
        />

        {/* Right line */}
        <line
          x1="130"
          y1="12"
          x2="200"
          y2="12"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.3"
        />
      </svg>
    )
  }

  // Simple variant (default)
  return (
    <svg
      ref={ref}
      className={classes}
      viewBox="0 0 200 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      {...props}
    >
      {/* Left line */}
      <line
        x1="0"
        y1="8"
        x2="85"
        y2="8"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.25"
      />

      {/* Center diamonds */}
      <path
        d="M92 8 L96 4 L100 8 L96 12 Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M100 8 L104 4 L108 8 L104 12 Z"
        fill="currentColor"
        fillOpacity="0.3"
      />

      {/* Right line */}
      <line
        x1="115"
        y1="8"
        x2="200"
        y2="8"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.25"
      />

      {/* Accent dots */}
      <circle
        cx="30"
        cy="8"
        r="1"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <circle
        cx="170"
        cy="8"
        r="1"
        fill="currentColor"
        fillOpacity="0.2"
      />
    </svg>
  )
})

TribalDivider.displayName = 'TribalDivider'

export { TribalDivider }
export default TribalDivider
