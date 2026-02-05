import { forwardRef } from 'react'
import './Checkbox.css'

/**
 * Tribal Checkmark icon - Ritual rune mark
 */
const TribalCheckmark = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="checkbox-tribal-mark"
  >
    {/* Main checkmark with tribal flair */}
    <path
      d="M2.5 7 L5.5 10.5 L11.5 3.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Tribal dots along the path */}
    <circle cx="4" cy="8.5" r="0.8" fill="currentColor" opacity="0.6" />
    <circle cx="8.5" cy="6.5" r="0.8" fill="currentColor" opacity="0.6" />
    {/* Small ritual marks */}
    <path
      d="M5 10 L4.5 11"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.4"
    />
    <path
      d="M11 4 L11.5 3"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.4"
    />
  </svg>
)

/**
 * Checkbox component with tribal styling
 *
 * @param {Object} props
 * @param {boolean} props.checked - Checked state
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Label text
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.error - Error state
 * @param {string} props.name - Input name
 * @param {string} props.value - Input value
 * @param {string} props.className - Additional classes
 */
const Checkbox = forwardRef(({
  checked = false,
  onChange,
  label,
  disabled = false,
  error = false,
  name,
  value,
  className = '',
  ...props
}, ref) => {
  const wrapperClasses = [
    'checkbox-wrapper',
    disabled && 'disabled',
    className
  ].filter(Boolean).join(' ')

  const controlClasses = [
    'checkbox-control',
    checked && 'checked',
    error && 'error'
  ].filter(Boolean).join(' ')

  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.checked, e)
    }
  }

  return (
    <label className={wrapperClasses}>
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        name={name}
        value={value}
        className="sr-only"
        aria-invalid={error}
        {...props}
      />

      <span className={controlClasses}>
        <span className="checkbox-icon">
          <TribalCheckmark />
        </span>
      </span>

      {label && (
        <span className="checkbox-label">
          {label}
        </span>
      )}
    </label>
  )
})

Checkbox.displayName = 'Checkbox'

export default Checkbox
export { Checkbox, TribalCheckmark }
