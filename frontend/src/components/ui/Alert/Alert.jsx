import { forwardRef, useState } from 'react'
import './Alert.css'

/**
 * Success Icon - Life Sprout (growing vine checkmark)
 */
const SuccessIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M4 12 L9 17 L20 6"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="17" r="1.5" fill="currentColor" opacity="0.6" />
    <circle cx="20" cy="6" r="1" fill="currentColor" opacity="0.4" />
    <path
      d="M7 14.5 L6 13.5 M14 10 L13 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
)

/**
 * Error Icon - Fractured Circle
 */
const ErrorIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 3 A9 9 0 0 1 21 12"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M21 12 A9 9 0 0 1 12 21"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="2 1"
    />
    <path
      d="M12 21 A9 9 0 0 1 3 12"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M3 12 A9 9 0 0 1 12 3"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="3 1"
    />
    <path
      d="M9 9 L15 15 M15 9 L9 15"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * Warning Icon - Ritual Triangle
 */
const WarningIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M12 3 L22 20 L2 20 Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M12 9 L12 13"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="16.5" r="1.5" fill="currentColor" />
    <circle cx="12" cy="5" r="0.8" fill="currentColor" opacity="0.5" />
  </svg>
)

/**
 * Info Icon - Sacred Scroll
 */
const InfoIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeDasharray="1 2"
      fill="none"
    />
    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    <path
      d="M12 11 L12 17"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M10 17 L14 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * Close Icon - Seal Broken
 */
const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M6 6 L18 18 M18 6 L6 18"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="6" cy="6" r="1.5" fill="currentColor" opacity="0.3" />
    <circle cx="18" cy="18" r="1.5" fill="currentColor" opacity="0.3" />
  </svg>
)

const variantIcons = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon
}

const Alert = forwardRef(({
  variant = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}, ref) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  const Icon = variantIcons[variant] || variantIcons.info

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, 200)
  }

  if (!isVisible) return null

  return (
    <div
      ref={ref}
      role="alert"
      className={[
        'alert',
        `alert-${variant}`,
        isExiting ? 'alert-exit' : 'alert-enter',
        className
      ].filter(Boolean).join(' ')}
      {...props}
    >
      <div className="alert-icon-wrapper">
        <Icon />
      </div>

      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-message">{children}</div>
      </div>

      {dismissible && (
        <button
          type="button"
          className="alert-close"
          onClick={handleDismiss}
          aria-label="Fermer l'alerte"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
})

Alert.displayName = 'Alert'

export default Alert
export { Alert, SuccessIcon, ErrorIcon, WarningIcon, InfoIcon, CloseIcon }
