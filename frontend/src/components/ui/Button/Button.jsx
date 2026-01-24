import { forwardRef } from 'react'
import './Button.css'

const buttonVariants = {
  primary: [
    'bg-secondary text-white border-2 border-secondary-600 shadow-glow',
    'btn-texture-fire btn-fire-particles',
    'hover:bg-secondary-400 hover:border-secondary-500 hover:shadow-glow-lg hover:scale-[1.02]',
    'active:bg-secondary-600 active:shadow-glow-sm active:scale-[0.98]',
    'focus:ring-secondary/50',
    'disabled:bg-secondary/50 disabled:border-secondary/50 disabled:shadow-none'
  ].join(' '),

  secondary: [
    'bg-primary text-white border-2 border-primary-600 shadow-inner',
    'btn-texture-stone',
    'hover:bg-primary-400 hover:border-primary-500 hover:shadow-md hover:-translate-y-px',
    'active:bg-primary-600 active:shadow-inner active:translate-y-px',
    'focus:ring-primary/50',
    'disabled:bg-primary/50 disabled:border-primary/50'
  ].join(' '),

  outline: [
    'bg-transparent text-primary border-[3px] border-primary',
    'btn-border-ritual',
    'hover:bg-primary/10 hover:border-primary-400 hover:text-primary-400',
    'hover:shadow-[0_0_0_4px_rgba(122,100,84,0.1)]',
    'active:bg-primary/20',
    'focus:ring-primary/30',
    'disabled:text-primary/50 disabled:border-primary/50 disabled:bg-transparent'
  ].join(' '),

  danger: [
    'bg-error text-white border-2 border-error-dark',
    'btn-texture-rust btn-danger-shadow',
    'hover:bg-error-light hover:border-error hover:scale-[1.02]',
    'active:bg-error-dark active:scale-[0.98] active:shadow-inner',
    'focus:ring-error/50',
    'disabled:bg-error/50 disabled:border-error/50'
  ].join(' '),

  ghost: [
    'bg-transparent text-primary border-2 border-transparent',
    'btn-ghost-ash',
    'hover:bg-primary/8 hover:text-primary-400',
    'active:bg-primary/15 active:text-primary-600',
    'focus:ring-primary/30',
    'disabled:text-primary/40 disabled:bg-transparent'
  ].join(' ')
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm min-h-[32px] rounded-md',
  md: 'px-4 py-2 text-base min-h-[40px] rounded-md',
  lg: 'px-6 py-3 text-lg min-h-[48px] rounded-lg'
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
}

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6'
}

const buttonBase = [
  'inline-flex items-center justify-center gap-2',
  'font-button font-medium',
  'transition-all duration-normal ease-organic',
  'focus:outline-none focus:ring-2 focus:ring-offset-2',
  'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
].join(' ')

/**
 * Tribal-themed spinner with rotating ritual symbols
 */
const TribalSpinner = ({ size = 'md', className = '' }) => {
  const sizeClass = spinnerSizes[size] || spinnerSizes.md

  return (
    <svg
      className={`${sizeClass} ${className}`}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer ritual circle - rotates */}
      <g className="tribal-spinner-outer">
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity="0.3"
          strokeDasharray="8 4"
          fill="none"
        />
        {/* Tribal marks at cardinal points */}
        <circle cx="24" cy="4" r="2" fill="currentColor" fillOpacity="0.5" />
        <circle cx="44" cy="24" r="2" fill="currentColor" fillOpacity="0.5" />
        <circle cx="24" cy="44" r="2" fill="currentColor" fillOpacity="0.5" />
        <circle cx="4" cy="24" r="2" fill="currentColor" fillOpacity="0.5" />
      </g>

      {/* Inner element - counter-rotates */}
      <g className="tribal-spinner-inner">
        <path
          d="M24 14 L28 20 L24 26 L20 20 Z"
          fill="currentColor"
          fillOpacity="0.5"
        />
        <path
          d="M14 24 L20 20 L26 24 L20 28 Z"
          fill="currentColor"
          fillOpacity="0.5"
        />
      </g>

      {/* Center dot - pulses */}
      <circle
        cx="24"
        cy="24"
        r="3"
        fill="currentColor"
        className="tribal-spinner-center"
      />
    </svg>
  )
}

/**
 * Corner mark decoration for large buttons
 */
const CornerMark = ({ position }) => (
  <svg
    className={`btn-corner-mark btn-corner-mark--${position}`}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M0 0 L12 0 L12 2 L2 2 L2 12 L0 12 Z"
      fill="currentColor"
    />
    <circle cx="5" cy="5" r="1.5" fill="currentColor" />
  </svg>
)

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  showCorners = false,
  type = 'button',
  className = '',
  onClick,
  ...props
}, ref) => {
  const isDisabled = disabled || loading
  const shouldShowCorners = showCorners || (size === 'lg' && variant === 'primary')

  const classes = [
    buttonBase,
    buttonVariants[variant] || buttonVariants.primary,
    buttonSizes[size] || buttonSizes.md,
    loading && 'relative',
    shouldShowCorners && 'btn-with-corners relative',
    className
  ].filter(Boolean).join(' ')

  const iconClass = iconSizes[size] || iconSizes.md

  const renderIcon = (iconElement) => {
    if (!iconElement) return null
    return (
      <span className={`inline-flex items-center justify-center ${iconClass}`}>
        {iconElement}
      </span>
    )
  }

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className="opacity-0 flex items-center gap-2">
            {icon && iconPosition === 'left' && renderIcon(icon)}
            {children}
            {icon && iconPosition === 'right' && renderIcon(icon)}
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <TribalSpinner size={size} className="text-current" />
          </span>
        </>
      )
    }

    return (
      <>
        {icon && iconPosition === 'left' && renderIcon(icon)}
        {children}
        {icon && iconPosition === 'right' && renderIcon(icon)}
      </>
    )
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {shouldShowCorners && (
        <>
          <CornerMark position="top-left" />
          <CornerMark position="top-right" />
          <CornerMark position="bottom-left" />
          <CornerMark position="bottom-right" />
        </>
      )}
      {renderContent()}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
export { Button, TribalSpinner }
