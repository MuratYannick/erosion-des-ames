import { forwardRef, useState } from 'react'
import './Input.css'

const inputStates = {
  default: [
    'border-neutral-300',
    'focus:border-secondary-400'
  ].join(' '),
  error: [
    'border-error input-tribal--error',
    'focus:border-error'
  ].join(' '),
  success: [
    'border-success input-tribal--success',
    'focus:border-success'
  ].join(' ')
}

const inputBase = [
  'w-full bg-surface border-2 rounded-md',
  'px-3 py-2 font-body text-primary-900',
  'placeholder:text-neutral-400 placeholder:italic placeholder:opacity-60',
  'transition-colors duration-fast ease-organic',
  'focus:outline-none',
  'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed',
  'input-tribal'
].join(' ')

/**
 * Tribal Eye icon for password visibility toggle
 */
const TribalEye = ({ visible }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="transition-opacity duration-fast"
  >
    {visible ? (
      <>
        {/* Open eye - almond shape */}
        <path
          d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Iris with tribal pattern */}
        <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <circle cx="10" cy="10" r="1" fill="currentColor" />
        {/* Tribal marks around eye */}
        <path d="M5.5 8 L4.5 7" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
        <path d="M14.5 8 L15.5 7" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
      </>
    ) : (
      <>
        {/* Closed eye - curved line */}
        <path
          d="M1 10s3-6 9-6 9 6 9 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.4"
          fill="none"
        />
        {/* Slash with ritual marks */}
        <path
          d="M3 16 L17 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="6" cy="13" r="0.8" fill="currentColor" opacity="0.5" />
        <circle cx="14" cy="7" r="0.8" fill="currentColor" opacity="0.5" />
      </>
    )}
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
    className="input-error-icon"
  >
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M8 4.5 L8 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    {/* Crack effect */}
    <path d="M5 4 L6.5 8 L5 12" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
  </svg>
)

/**
 * Checkmark icon for success state
 */
const SuccessIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Growing plant checkmark */}
    <path
      d="M4 9 L6.5 11.5 L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Small leaves */}
    <path d="M5.5 10 Q4 9.5 4.5 8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
    <path d="M10 6.5 Q11.5 6 11 4.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
  </svg>
)

/**
 * Label underline decoration
 */
const LabelUnderline = () => (
  <svg
    className="input-label-underline"
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

const Input = forwardRef(({
  type = 'text',
  label,
  error,
  success,
  helperText,
  icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`

  const state = error ? 'error' : success ? 'success' : 'default'
  const message = error || success || helperText

  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  const hasLeftIcon = icon && iconPosition === 'left'
  const hasRightIcon = (icon && iconPosition === 'right') || isPassword

  const inputClasses = [
    inputBase,
    inputStates[state],
    hasLeftIcon && 'pl-10',
    hasRightIcon && 'pr-10',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="w-full input-wrapper">
      {label && (
        <label
          htmlFor={inputId}
          className="block font-ui text-sm text-primary-700 mb-1.5 input-label-tribal"
        >
          {label}
          <LabelUnderline />
        </label>
      )}

      <div className="relative">
        {hasLeftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={message ? `${inputId}-message` : undefined}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary transition-colors p-1"
            tabIndex={-1}
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            <TribalEye visible={!showPassword} />
          </button>
        )}

        {hasRightIcon && !isPassword && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {icon}
          </span>
        )}
      </div>

      {message && (
        <p
          id={`${inputId}-message`}
          className={[
            'mt-1.5 text-sm font-ui flex items-center gap-1.5 input-helper-text',
            error ? 'text-error' : success ? 'text-success' : 'text-neutral-500'
          ].join(' ')}
        >
          {error && <WarningIcon />}
          {success && <SuccessIcon />}
          {message}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
export { Input, TribalEye, WarningIcon, SuccessIcon }
