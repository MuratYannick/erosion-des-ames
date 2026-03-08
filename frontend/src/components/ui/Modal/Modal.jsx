import { forwardRef, useEffect, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

/**
 * Close icon
 */
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 6 L18 18 M18 6 L6 18"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * Corner decoration SVG
 */
const CornerDecoration = ({ className }) => (
  <svg
    className={`modal-corner ${className}`}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M0 0 L24 0 L24 4 L4 4 L4 24 L0 24 Z" opacity="0.4" />
    <circle cx="8" cy="8" r="2" opacity="0.6" />
    <path d="M12 0 L12 2 M0 12 L2 12" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
)

const Modal = forwardRef(({
  isOpen = false,
  onClose,
  title,
  size = 'md',
  showCorners = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  children,
  className = '',
  ...props
}, ref) => {
  const [isExiting, setIsExiting] = useState(false)
  const [shouldRender, setShouldRender] = useState(isOpen)

  // Handle close with animation
  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      onClose?.()
    }, 200)
  }, [onClose])

  // Handle escape key
  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape' && closeOnEscape && onClose) {
      handleClose()
    }
  }, [closeOnEscape, onClose, handleClose])

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlay) {
      handleClose()
    }
  }

  // Manage body scroll and escape listener
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleEscape])

  // Handle render state after close animation
  useEffect(() => {
    if (!isOpen && !isExiting) {
      setShouldRender(false)
    }
  }, [isOpen, isExiting])

  if (!shouldRender) return null

  const modalContent = (
    <div
      className={[
        'modal-overlay',
        isExiting ? 'modal-overlay-exit' : 'modal-overlay-enter'
      ].join(' ')}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={ref}
        className={[
          'modal',
          `modal-${size}`,
          isExiting ? 'modal-exit' : 'modal-enter',
          className
        ].filter(Boolean).join(' ')}
        {...props}
      >
        {/* Corner decorations */}
        {showCorners && (
          <>
            <CornerDecoration className="modal-corner-tl" />
            <CornerDecoration className="modal-corner-tr" />
            <CornerDecoration className="modal-corner-bl" />
            <CornerDecoration className="modal-corner-br" />
          </>
        )}

        {children}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
})

Modal.displayName = 'Modal'

/**
 * Modal Header
 */
const ModalHeader = forwardRef(({
  children,
  onClose,
  className = '',
  ...props
}, ref) => (
  <div ref={ref} className={`modal-header ${className}`} {...props}>
    <h2 id="modal-title" className="modal-title">{children}</h2>
    {onClose && (
      <button
        type="button"
        className="modal-close"
        onClick={onClose}
        aria-label="Fermer"
      >
        <CloseIcon />
      </button>
    )}
  </div>
))

ModalHeader.displayName = 'ModalHeader'

/**
 * Modal Body
 */
const ModalBody = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => (
  <div ref={ref} className={`modal-body ${className}`} {...props}>
    {children}
  </div>
))

ModalBody.displayName = 'ModalBody'

/**
 * Modal Footer
 */
const ModalFooter = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => (
  <div ref={ref} className={`modal-footer ${className}`} {...props}>
    {children}
  </div>
))

ModalFooter.displayName = 'ModalFooter'

export default Modal
export { Modal, ModalHeader, ModalBody, ModalFooter }
