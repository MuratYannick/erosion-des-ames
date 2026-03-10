import { forwardRef, useId } from 'react'
import Checkbox from './Checkbox'
import './Checkbox.css'

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
    className="checkbox-group-label-underline"
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
 * CheckboxGroup component - Manages multiple related checkboxes
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string, disabled?: boolean}>} props.options - Checkbox options
 * @param {Array<string>} props.value - Array of selected values
 * @param {Function} props.onChange - Change handler receives array of selected values
 * @param {string} props.orientation - Layout: "vertical" | "horizontal"
 * @param {string} props.label - Group label
 * @param {string} props.error - Error message
 * @param {string} props.hint - Helper text
 * @param {string} props.name - Group name (applied to all checkboxes)
 * @param {string} props.className - Additional classes
 */
const CheckboxGroup = forwardRef(({
  options = [],
  value = [],
  onChange,
  orientation = 'vertical',
  label,
  error,
  hint,
  name,
  className = '',
  ...props
}, ref) => {
  const groupId = `checkbox-group-${useId().replace(/:/g, '')}`
  const message = error || hint

  const handleCheckboxChange = (optionValue, isChecked) => {
    if (!onChange) return

    let newValue
    if (isChecked) {
      // Add value if checked
      newValue = [...value, optionValue]
    } else {
      // Remove value if unchecked
      newValue = value.filter(v => v !== optionValue)
    }

    onChange(newValue)
  }

  const optionsContainerClasses = [
    'checkbox-group-options',
    orientation
  ].filter(Boolean).join(' ')

  const groupClasses = [
    'checkbox-group',
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={groupClasses}
      role="group"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-describedby={message ? `${groupId}-message` : undefined}
      aria-invalid={!!error}
      {...props}
    >
      {label && (
        <div
          id={`${groupId}-label`}
          className="checkbox-group-label"
        >
          {label}
          <LabelUnderline />
        </div>
      )}

      <div className={optionsContainerClasses}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            checked={value.includes(option.value)}
            onChange={(checked) => handleCheckboxChange(option.value, checked)}
            disabled={option.disabled}
            error={!!error}
          />
        ))}
      </div>

      {message && (
        <p
          id={`${groupId}-message`}
          className={[
            'checkbox-group-message',
            error ? 'error' : 'hint'
          ].join(' ')}
        >
          {error && <WarningIcon />}
          {message}
        </p>
      )}
    </div>
  )
})

CheckboxGroup.displayName = 'CheckboxGroup'

export default CheckboxGroup
export { CheckboxGroup }
