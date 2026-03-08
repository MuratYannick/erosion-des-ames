import { forwardRef, useState, useEffect, useRef, useId } from 'react'
import './Select.css'

/**
 * Tribal Arrow icon for dropdown toggle
 */
const TribalArrow = ({ isOpen }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={[
      'select-arrow-tribal transition-transform duration-200',
      isOpen && 'rotate-180'
    ].filter(Boolean).join(' ')}
  >
    <path
      d="M8 11 L8 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 11 L5.5 8.5 M8 11 L10.5 8.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="6.5" r="0.6" fill="currentColor" opacity="0.5" />
    <path d="M6.5 7.5 L6 8" stroke="currentColor" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
    <path d="M9.5 7.5 L10 8" stroke="currentColor" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
  </svg>
)

/**
 * Close icon for tag removal
 */
const CloseIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 3 L9 9 M9 3 L3 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * Warning icon for error state
 */
const WarningIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="select-error-icon"
  >
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M8 4.5 L8 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    <path d="M5 4 L6.5 8 L5 12" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
  </svg>
)

/**
 * Label underline decoration
 */
const LabelUnderline = () => (
  <svg
    className="select-label-underline"
    viewBox="0 0 100 2"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <path
      d="M0 1 L25 1 M30 1 L45 1 M50 1 L65 1 M70 1 L100 1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.3"
    />
    <circle cx="27.5" cy="1" r="0.8" fill="currentColor" opacity="0.4" />
    <circle cx="47.5" cy="1" r="0.8" fill="currentColor" opacity="0.4" />
    <circle cx="67.5" cy="1" r="0.8" fill="currentColor" opacity="0.4" />
  </svg>
)

/**
 * Checkmark icon for selected items
 */
const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 7 L5.5 9.5 L11 4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * SelectMultiple component with tribal styling and tag display
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string, disabled?: boolean, icon?: ReactNode}>} props.options - Select options
 * @param {Array<string>} props.value - Array of selected values
 * @param {Function} props.onChange - Change handler (receives array of values)
 * @param {number} props.max - Maximum number of selections
 * @param {string} props.placeholder - Placeholder text when empty
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.error - Error message
 * @param {string} props.label - Label text
 * @param {string} props.hint - Helper text
 * @param {string} props.className - Additional classes
 * @param {string} props.id - Component ID
 */
const SelectMultiple = forwardRef(({
  options = [],
  value = [],
  onChange,
  max,
  placeholder = 'Sélectionnez...',
  disabled = false,
  error,
  label,
  hint,
  className = '',
  id,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const dropdownRef = useRef(null)
  const generatedId = useId().replace(/:/g, '')
  const selectId = id || `select-multiple-${generatedId}`
  const message = error || hint

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsExiting(false)
    }, 150)
  }

  const handleToggle = () => {
    if (disabled) return
    if (isOpen) {
      handleClose()
    } else {
      setIsOpen(true)
    }
  }

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

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
  }, [isOpen])

  const handleOptionToggle = (optionValue) => {
    if (disabled) return

    const isSelected = value.includes(optionValue)
    let newValue

    if (isSelected) {
      // Remove value
      newValue = value.filter(v => v !== optionValue)
    } else {
      // Add value if not at max
      if (max && value.length >= max) {
        return
      }
      newValue = [...value, optionValue]
    }

    if (onChange) {
      onChange(newValue)
    }
  }

  const handleRemoveTag = (optionValue, e) => {
    e.stopPropagation()
    if (disabled) return

    const newValue = value.filter(v => v !== optionValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  const selectedOptions = options.filter(opt => value.includes(opt.value))
  const isMaxReached = max && value.length >= max

  const containerClasses = [
    'w-full min-h-[42px] bg-surface border-2 rounded-md',
    'px-3 py-2 font-body text-primary-900',
    'transition-colors duration-fast ease-organic',
    'cursor-pointer select-tribal',
    error ? 'border-error select-tribal--error focus-within:border-error' : 'border-neutral-300 focus-within:border-secondary-400',
    disabled && 'bg-neutral-100 text-neutral-400 cursor-not-allowed opacity-60',
    className
  ].filter(Boolean).join(' ')

  return (
    <div ref={ref} className="w-full select-multiple-wrapper" {...props}>
      {label && (
        <label
          htmlFor={selectId}
          className="block font-ui text-sm text-primary-700 mb-1.5 select-label-tribal"
        >
          {label}
          <LabelUnderline />
        </label>
      )}

      <div
        ref={dropdownRef}
        className="relative"
        id={selectId}
      >
        {/* Select trigger with tags */}
        <div
          onClick={handleToggle}
          className={containerClasses}
          aria-invalid={!!error}
          aria-describedby={message ? `${selectId}-message` : undefined}
          aria-expanded={isOpen}
          role="button"
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleToggle()
            }
          }}
        >
          <div className="flex flex-wrap gap-1.5 items-center pr-8">
            {selectedOptions.length === 0 ? (
              <span className="text-neutral-400 italic opacity-60">{placeholder}</span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="select-tag"
                >
                  {option.icon && <span className="select-tag-icon">{option.icon}</span>}
                  <span className="select-tag-label">{option.label}</span>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={(e) => handleRemoveTag(option.value, e)}
                      className="select-tag-remove"
                      aria-label={`Retirer ${option.label}`}
                      tabIndex={-1}
                    >
                      <CloseIcon />
                    </button>
                  )}
                </span>
              ))
            )}
          </div>

          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
            <TribalArrow isOpen={isOpen} />
          </div>
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            className={[
              'select-multiple-dropdown',
              isExiting ? 'select-dropdown-exit' : 'select-dropdown-enter'
            ].join(' ')}
            role="listbox"
            aria-multiselectable="true"
          >
            {options.map((option) => {
              const isSelected = value.includes(option.value)
              const isDisabled = option.disabled || (isMaxReached && !isSelected)

              return (
                <div
                  key={option.value}
                  onClick={() => !isDisabled && handleOptionToggle(option.value)}
                  className={[
                    'select-multiple-option',
                    isSelected && 'select-multiple-option--selected',
                    isDisabled && 'select-multiple-option--disabled'
                  ].filter(Boolean).join(' ')}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isDisabled}
                >
                  <div className="select-multiple-option-content">
                    {option.icon && (
                      <span className="select-multiple-option-icon">{option.icon}</span>
                    )}
                    <span>{option.label}</span>
                  </div>
                  {isSelected && (
                    <span className="select-multiple-option-check">
                      <CheckIcon />
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {message && (
        <p
          id={`${selectId}-message`}
          className={[
            'mt-1.5 text-sm font-ui flex items-center gap-1.5 select-helper-text',
            error ? 'text-error' : 'text-neutral-500'
          ].join(' ')}
        >
          {error && <WarningIcon />}
          {message}
          {max && !error && (
            <span className="ml-auto text-xs">
              {value.length}/{max}
            </span>
          )}
        </p>
      )}
    </div>
  )
})

SelectMultiple.displayName = 'SelectMultiple'

export default SelectMultiple
export { SelectMultiple }
