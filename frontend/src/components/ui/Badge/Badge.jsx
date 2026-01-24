import { forwardRef } from 'react'

const badgeVariants = {
  default: [
    'bg-neutral-100 text-neutral-700 border-neutral-300'
  ].join(' '),
  primary: [
    'bg-primary-100 text-primary-700 border-primary-400'
  ].join(' '),
  secondary: [
    'bg-secondary-100 text-secondary-700 border-secondary-400'
  ].join(' '),
  success: [
    'bg-success-light/20 text-success-dark border-success'
  ].join(' '),
  error: [
    'bg-error-light/20 text-error-dark border-error'
  ].join(' '),
  warning: [
    'bg-warning-light/20 text-warning-dark border-warning'
  ].join(' '),
  info: [
    'bg-info-light/20 text-info-dark border-info'
  ].join(' ')
}

const badgeSizes = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-0.5 text-sm'
}

const badgeBase = [
  'inline-flex items-center gap-1',
  'font-ui font-medium',
  'border rounded-md',
  'whitespace-nowrap'
].join(' ')

/**
 * Tribal dot marker - decorative element for badges
 */
const TribalDot = () => (
  <svg
    width="6"
    height="6"
    viewBox="0 0 6 6"
    fill="currentColor"
    aria-hidden="true"
    className="opacity-60"
  >
    <circle cx="3" cy="3" r="2" />
    <circle cx="3" cy="3" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
  </svg>
)

const Badge = forwardRef(({
  variant = 'default',
  size = 'md',
  icon = null,
  dot = false,
  children,
  className = '',
  ...props
}, ref) => {
  const classes = [
    badgeBase,
    badgeVariants[variant] || badgeVariants.default,
    badgeSizes[size] || badgeSizes.md,
    className
  ].filter(Boolean).join(' ')

  return (
    <span ref={ref} className={classes} {...props}>
      {dot && <TribalDot />}
      {icon && <span className="w-3.5 h-3.5 flex items-center justify-center">{icon}</span>}
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

export default Badge
export { Badge, TribalDot }
