import { forwardRef, useId } from 'react'
import Radio from './Radio'
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
    className="radio-group-label-underline"
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
 * RadioGroup component - Manages mutually exclusive radio options
 *
 * @param {Object} props
 * @param {Array<{value: string, label: string, disabled?: boolean}>} props.options - Radio options
 * @param {string} props.value - Selected value
 * @param {Function} props.onChange - Change handler receives selected value
 * @param {string} props.name - Group name (required, applied to all radios)
 * @param {string} props.orientation - Layout: "vertical" | "horizontal"
 * @param {string} props.label - Group label
 * @param {string} props.error - Error message
 * @param {string} props.hint - Helper text
 * @param {string} props.className - Additional classes
 */
const RadioGroup = forwardRef(({
  options = [],
  value,
  onChange,
  name,
  orientation = 'vertical',
  label,
  error,
  hint,
  className = '',
  ...props
}, ref) => {
  const generatedId = useId().replace(/:/g, '')
  const groupId = name || `radio-group-${generatedId}`
  const message = error || hint

  const handleRadioChange = (selectedValue) => {
    if (onChange) {
      onChange(selectedValue)
    }
  }

  const optionsContainerClasses = [
    'radio-group-options',
    orientation
  ].filter(Boolean).join(' ')

  const groupClasses = [
    'radio-group',
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={groupClasses}
      role="radiogroup"
      aria-labelledby={label ? `${groupId}-label` : undefined}
      aria-describedby={message ? `${groupId}-message` : undefined}
      aria-invalid={!!error}
      {...props}
    >
      {label && (
        <div
          id={`${groupId}-label`}
          className="radio-group-label"
        >
          {label}
          <LabelUnderline />
        </div>
      )}

      <div className={optionsContainerClasses}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={groupId}
            value={option.value}
            label={option.label}
            checked={value === option.value}
            onChange={handleRadioChange}
            disabled={option.disabled}
            error={!!error}
          />
        ))}
      </div>

      {message && (
        <p
          id={`${groupId}-message`}
          className={[
            'radio-group-message',
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

RadioGroup.displayName = 'RadioGroup'

export default RadioGroup
export { RadioGroup }
