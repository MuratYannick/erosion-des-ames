import { forwardRef, useState, useEffect, useCallback } from 'react'
import './Toast.css'
import { ToastContext } from './toastContext'

/**
 * Compact icons for Toast notifications
 */
const ToastSuccessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 12 L9 17 L20 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ToastErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="3 1" fill="none" />
    <path d="M9 9 L15 15 M15 9 L9 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

const ToastWarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3 L22 20 L2 20 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="none" />
    <path d="M12 9 L12 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="12" cy="16.5" r="1.5" fill="currentColor" />
  </svg>
)

const ToastInfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="1 2" fill="none" />
    <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    <path d="M12 11 L12 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

const ToastCloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
)

const variantIcons = {
  success: ToastSuccessIcon,
  error: ToastErrorIcon,
  warning: ToastWarningIcon,
  info: ToastInfoIcon
}

const defaultDurations = {
  success: 4000,
  error: 0, // No auto-dismiss for errors
  warning: 6000,
  info: 5000
}

/**
 * Single Toast component
 */
const Toast = forwardRef(({
  id,
  variant = 'info',
  message,
  duration,
  dismissible = true,
  onDismiss,
  position = 'top-right',
  className = '',
  ...props
}, ref) => {
  const [isExiting, setIsExiting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const Icon = variantIcons[variant] || variantIcons.info
  const autoDismissDuration = duration ?? defaultDurations[variant]

  const getAnimationDirection = () => {
    if (position.includes('left')) return 'left'
    if (position.includes('center')) return 'center'
    return 'right'
  }

  const direction = getAnimationDirection()

  const handleDismiss = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      onDismiss?.(id)
    }, 400)
  }, [id, onDismiss])

  // Auto-dismiss timer
  useEffect(() => {
    if (autoDismissDuration <= 0 || isPaused) return

    const timer = setTimeout(handleDismiss, autoDismissDuration)
    return () => clearTimeout(timer)
  }, [autoDismissDuration, isPaused, handleDismiss])

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="polite"
      className={[
        'toast',
        `toast-${variant}`,
        isExiting ? `toast-exit-${direction}` : `toast-enter-${direction}`,
        className
      ].filter(Boolean).join(' ')}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      {...props}
    >
      <span className="toast-icon toast-icon-pulse">
        <Icon />
      </span>

      <span className="toast-message">{message}</span>

      {dismissible && (
        <button
          type="button"
          className="toast-close"
          onClick={handleDismiss}
          aria-label="Fermer la notification"
        >
          <ToastCloseIcon />
        </button>
      )}

      {/* Progress bar for auto-dismiss */}
      {autoDismissDuration > 0 && !isPaused && (
        <div
          className="toast-progress"
          style={{
            animation: `toast-progress ${autoDismissDuration}ms linear`
          }}
        />
      )}
    </div>
  )
})

Toast.displayName = 'Toast'

/**
 * Toast Container - manages positioning and stacking
 */
const ToastContainer = forwardRef(({
  position = 'top-right',
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={[
        'toast-container',
        `toast-container-${position}`,
        className
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  )
})

ToastContainer.displayName = 'ToastContainer'

/**
 * Toast Context for managing toasts globally
 */
let toastId = 0

const ToastProvider = ({ children, position = 'top-right' }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((options) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, ...options }])
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const toast = {
    addToast,
    success: (message, options = {}) => addToast({ variant: 'success', message, ...options }),
    error: (message, options = {}) => addToast({ variant: 'error', message, ...options }),
    warning: (message, options = {}) => addToast({ variant: 'warning', message, ...options }),
    info: (message, options = {}) => addToast({ variant: 'info', message, ...options })
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer position={position}>
        {toasts.map(({ id, ...toastProps }) => (
          <Toast
            key={id}
            id={id}
            position={position}
            onDismiss={removeToast}
            {...toastProps}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

export default Toast
export { Toast, ToastContainer, ToastProvider }
