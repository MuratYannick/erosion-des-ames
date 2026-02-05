import { forwardRef } from 'react'
import './Select.css'

const selectStates = {
  default: [
    'border-neutral-300',
    'focus:border-secondary-400'
  ].join(' '),
  error: [
    'border-error select-tribal--error',
    'focus:border-error'
  ].join(' ')
}

const selectBase = [
  'w-full bg-surface border-2 rounded-md',
  'px-3 py-2 pr-10 font-body text-primary-900',
  'transition-colors duration-fast ease-organic',
  'focus:outline-none',
  'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed',
  'appearance-none cursor-pointer',
  'select-tribal'
].join(' ')

/**
 * Tribal Arrow icon for select dropdown
 */
const TribalArrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="select-arrow-tribal pointer-events-none"
  >
    {/* Main arrow shaft */}
    <path
      d="M8 11 L8 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Arrow head with tribal shape */}
    <path
      d="M8 11 L5.5 8.5 M8 11 L10.5 8.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Tribal marks on shaft */}
    <circle cx="8" cy="6.5" r="0.6" fill="currentColor" opacity="0.5" />
    <path d="M6.5 7.5 L6 8" stroke="currentColor" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
    <path d="M9.5 7.5 L10 8" stroke="currentColor" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
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
    {/* Crack effect */}
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
 * Select component with tribal styling
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string, disabled?: boolean, icon?: ReactNode}>} props.options - Select options
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.error - Error message
 * @param {string} props.label - Label text
 * @param {string} props.hint - Helper text
 * @param {string} props.className - Additional classes
 * @param {string} props.id - Input ID
 */
const Select = forwardRef(({
  options = [],
  value,
  onChange,
  placeholder,
  disabled = false,
  error,
  label,
  hint,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`
  const state = error ? 'error' : 'default'
  const message = error || hint

  const selectClasses = [
    selectBase,
    selectStates[state],
    !value && 'text-neutral-400',
    className
  ].filter(Boolean).join(' ')

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value)
    }
  }

  return (
    <div className="w-full select-wrapper">
      {label && (
        <label
          htmlFor={selectId}
          className="block font-ui text-sm text-primary-700 mb-1.5 select-label-tribal"
        >
          {label}
          <LabelUnderline />
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          value={value || ''}
          onChange={handleChange}
          disabled={disabled}
          className={selectClasses}
          aria-invalid={!!error}
          aria-describedby={message ? `${selectId}-message` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
          <TribalArrow />
        </div>
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
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export default Select
export { Select, TribalArrow, WarningIcon }
