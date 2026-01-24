import { forwardRef, useState, useEffect, useRef, useCallback } from 'react'
import './Dropdown.css'

/**
 * Dropdown container with trigger and menu
 */
const Dropdown = forwardRef(({
  trigger,
  children,
  position = 'bottom-left',
  closeOnSelect = true,
  closeOnOutside = true,
  className = '',
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const dropdownRef = useRef(null)
  const menuRef = useRef(null)

  const handleClose = useCallback(() => {
    setIsExiting(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsExiting(false)
    }, 150)
  }, [])

  const handleToggle = () => {
    if (isOpen) {
      handleClose()
    } else {
      setIsOpen(true)
    }
  }

  // Close on outside click
  useEffect(() => {
    if (!isOpen || !closeOnOutside) return

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, closeOnOutside, handleClose])

  // Close on escape
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleClose])

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || !menuRef.current) return

    const items = menuRef.current.querySelectorAll('[role="menuitem"]:not([disabled])')
    const currentIndex = Array.from(items).indexOf(document.activeElement)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
        items[nextIndex]?.focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
        items[prevIndex]?.focus()
        break
      case 'Home':
        e.preventDefault()
        items[0]?.focus()
        break
      case 'End':
        e.preventDefault()
        items[items.length - 1]?.focus()
        break
    }
  }

  const [vertical, horizontal] = position.split('-')
  const menuClasses = [
    'dropdown-menu',
    `dropdown-menu-${vertical}`,
    `dropdown-menu-${horizontal}`,
    isExiting ? 'dropdown-menu-exit' : 'dropdown-menu-enter'
  ].join(' ')

  return (
    <div
      ref={(node) => {
        dropdownRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      className={`dropdown ${className}`}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {/* Trigger */}
      <div onClick={handleToggle} aria-expanded={isOpen} aria-haspopup="menu">
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={menuClasses}
          role="menu"
          aria-orientation="vertical"
        >
          {typeof children === 'function'
            ? children({ close: handleClose, closeOnSelect })
            : children
          }
        </div>
      )}
    </div>
  )
})

Dropdown.displayName = 'Dropdown'

/**
 * Dropdown Item
 */
const DropdownItem = forwardRef(({
  children,
  icon,
  disabled = false,
  onClick,
  closeOnSelect = true,
  onClose,
  className = '',
  ...props
}, ref) => {
  const handleClick = (e) => {
    if (disabled) return
    onClick?.(e)
    if (closeOnSelect && onClose) {
      onClose()
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      disabled={disabled}
      className={[
        'dropdown-item',
        disabled && 'dropdown-item-disabled',
        className
      ].filter(Boolean).join(' ')}
      onClick={handleClick}
      {...props}
    >
      {icon && <span className="dropdown-item-icon">{icon}</span>}
      {children}
    </button>
  )
})

DropdownItem.displayName = 'DropdownItem'

/**
 * Dropdown Divider
 */
const DropdownDivider = () => (
  <div className="dropdown-divider" role="separator" />
)

DropdownDivider.displayName = 'DropdownDivider'

/**
 * Dropdown Header (for grouping)
 */
const DropdownHeader = forwardRef(({
  children,
  className = '',
  ...props
}, ref) => (
  <div ref={ref} className={`dropdown-header ${className}`} {...props}>
    {children}
  </div>
))

DropdownHeader.displayName = 'DropdownHeader'

export default Dropdown
export { Dropdown, DropdownItem, DropdownDivider, DropdownHeader }
