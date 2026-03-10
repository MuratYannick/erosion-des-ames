import { cloneElement, isValidElement, Children } from 'react'
import { useField } from './formContext'
import { WarningIcon } from '@/components/ui/Input'
import './Form.css'

/**
 * Label underline decoration (tribal theme)
 */
const LabelUnderline = () => (
  <svg
    className="form-field-label-underline"
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
 * FormField component
 * Connects a form input to form state and displays label, error, and hint
 *
 * @component
 * @example
 * <FormField name="email" label="Email" required hint="Format: nom@domaine.com">
 *   <Input type="email" placeholder="..." />
 * </FormField>
 */
const FormField = ({
  name,
  label,
  required = false,
  error: externalError,
  hint,
  children,
  className = '',
  ...props
}) => {
  // Get field state from form context
  const field = useField(name)

  // Use external error if provided, otherwise use field error from context
  const displayError = externalError || field.error
  const hasError = !!displayError

  // Generate unique ID for accessibility
  const fieldId = `field-${name}`
  const errorId = `${fieldId}-error`
  const hintId = `${fieldId}-hint`

  // Clone child input and inject props
  const childInput = Children.only(children)

  if (!isValidElement(childInput)) {
    console.error('FormField: children must be a valid React element')
    return null
  }

  const enhancedInput = cloneElement(childInput, {
    id: fieldId,
    name: field.name,
    value: field.value,
    onChange: field.onChange,
    onBlur: field.onBlur,
    error: hasError ? displayError : undefined,
    'aria-invalid': hasError,
    'aria-describedby': [
      hasError && errorId,
      !hasError && hint && hintId
    ].filter(Boolean).join(' ') || undefined,
    'aria-required': required,
    ...props
  })

  // Compute helper message (error takes precedence over hint)
  const helperMessage = hasError ? displayError : hint
  const helperType = hasError ? 'error' : 'hint'

  const wrapperClasses = [
    'form-field',
    hasError && 'form-field--error',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={wrapperClasses}>
      {label && (
        <label
          htmlFor={fieldId}
          className="form-field-label"
        >
          {label}
          {required && (
            <span className="form-field-required" aria-label="requis">
              {' '}*
            </span>
          )}
          <LabelUnderline />
        </label>
      )}

      <div className="form-field-input-wrapper">
        {enhancedInput}
      </div>

      {helperMessage && (
        <p
          id={hasError ? errorId : hintId}
          className={[
            'form-field-helper',
            helperType === 'error' ? 'form-field-helper--error' : 'form-field-helper--hint'
          ].join(' ')}
          role={helperType === 'error' ? 'alert' : undefined}
        >
          {helperType === 'error' && <WarningIcon />}
          {helperMessage}
        </p>
      )}
    </div>
  )
}

FormField.displayName = 'FormField'

export default FormField
export { FormField }
