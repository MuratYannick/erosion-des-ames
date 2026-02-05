import { forwardRef } from 'react'
import './Checkbox.css'

/**
 * Tribal Radio Dot - Concentric circles with ritual marks
 */
const TribalDot = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="radio-tribal-dot"
  >
    {/* Outer circle */}
    <circle
      cx="6"
      cy="6"
      r="4.5"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
      opacity="0.6"
    />
    {/* Middle circle */}
    <circle
      cx="6"
      cy="6"
      r="3"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.8"
    />
    {/* Solid center */}
    <circle
      cx="6"
      cy="6"
      r="2"
      fill="currentColor"
    />
    {/* Tribal marks - cardinal points */}
    <circle cx="6" cy="1.5" r="0.5" fill="currentColor" opacity="0.5" />
    <circle cx="10.5" cy="6" r="0.5" fill="currentColor" opacity="0.5" />
    <circle cx="6" cy="10.5" r="0.5" fill="currentColor" opacity="0.5" />
    <circle cx="1.5" cy="6" r="0.5" fill="currentColor" opacity="0.5" />
  </svg>
)

/**
 * Radio component with tribal styling
 *
 * @param {Object} props
 * @param {boolean} props.checked - Checked state
 * @param {Function} props.onChange - Change handler
 * @param {string} props.label - Label text
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.name - Input name (required for radio groups)
 * @param {string} props.value - Input value
 * @param {boolean} props.error - Error state
 * @param {string} props.className - Additional classes
 */
const Radio = forwardRef(({
  checked = false,
  onChange,
  label,
  disabled = false,
  name,
  value,
  error = false,
  className = '',
  ...props
}, ref) => {
  const wrapperClasses = [
    'radio-wrapper',
    disabled && 'disabled',
    className
  ].filter(Boolean).join(' ')

  const controlClasses = [
    'radio-control',
    checked && 'checked',
    error && 'error'
  ].filter(Boolean).join(' ')

  const handleChange = (e) => {
    if (!disabled && onChange) {
      onChange(e.target.value, e)
    }
  }

  return (
    <label className={wrapperClasses}>
      <input
        ref={ref}
        type="radio"
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
        <span className="radio-dot">
          <TribalDot />
        </span>
      </span>

      {label && (
        <span className="radio-label">
          {label}
        </span>
      )}
    </label>
  )
})

Radio.displayName = 'Radio'

export default Radio
export { Radio, TribalDot }
