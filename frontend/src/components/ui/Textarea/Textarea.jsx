import { forwardRef, useEffect, useRef, useId } from 'react'
import '../Input/Input.css'

const textareaStates = {
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

const textareaBase = [
  'w-full bg-surface border-2 rounded-md',
  'px-3 py-2 font-body text-primary-900',
  'placeholder:text-neutral-400 placeholder:italic placeholder:opacity-60',
  'transition-colors duration-fast ease-organic',
  'focus:outline-none',
  'disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed',
  'input-tribal textarea-tribal'
].join(' ')

/**
 * Rune Tally - Character counter with tribal visual style
 */
const RuneTally = ({ current, max }) => {
  const percentage = (current / max) * 100
  const isWarning = percentage > 80
  const isDanger = percentage >= 100

  const barColor = isDanger
    ? 'text-error'
    : isWarning
      ? 'text-warning'
      : 'text-primary-400'

  return (
    <div className="input-counter-tribal flex items-center gap-2">
      {/* Tally bar */}
      <svg
        width="48"
        height="6"
        viewBox="0 0 48 6"
        className={barColor}
        aria-hidden="true"
      >
        {/* Background notches */}
        <path
          d="M0 3 L8 3 M12 3 L20 3 M24 3 L32 3 M36 3 L44 3 M46 3 L48 3"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.2"
          strokeLinecap="round"
        />
        {/* Progress fill */}
        <path
          d={`M0 3 L${Math.min(percentage * 0.48, 48)} 3`}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-all duration-fast"
        />
      </svg>

      {/* Number display */}
      <span
        className={[
          'font-ui text-xs tabular-nums',
          isDanger ? 'text-error font-medium' : 'text-neutral-500'
        ].join(' ')}
      >
        {current}/{max}
      </span>
    </div>
  )
}

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
    className="input-error-icon flex-shrink-0"
  >
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M8 4.5 L8 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r="0.75" fill="currentColor" />
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
    className="flex-shrink-0"
  >
    <path
      d="M4 9 L6.5 11.5 L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
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

const Textarea = forwardRef(({
  label,
  error,
  success,
  helperText,
  disabled = false,
  className = '',
  id,
  rows = 4,
  maxLength,
  showCount = false,
  autoResize = false,
  value,
  onChange,
  ...props
}, ref) => {
  const generatedId = useId().replace(/:/g, '')
  const textareaId = id || `textarea-${generatedId}`
  const internalRef = useRef(null)
  const textareaRef = ref || internalRef

  const state = error ? 'error' : success ? 'success' : 'default'
  const message = error || success || helperText
  const charCount = typeof value === 'string' ? value.length : 0

  const textareaClasses = [
    textareaBase,
    textareaStates[state],
    autoResize ? 'resize-none textarea-tribal--auto-resize' : 'resize-y',
    className
  ].filter(Boolean).join(' ')

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value, autoResize, textareaRef])

  const handleChange = (e) => {
    if (onChange) {
      onChange(e)
    }
  }

  return (
    <div className="w-full input-wrapper">
      {label && (
        <label
          htmlFor={textareaId}
          className="block font-ui text-sm text-primary-700 mb-1.5 input-label-tribal"
        >
          {label}
          <LabelUnderline />
        </label>
      )}

      <textarea
        ref={textareaRef}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        className={textareaClasses}
        aria-invalid={!!error}
        aria-describedby={message ? `${textareaId}-message` : undefined}
        {...props}
      />

      <div className="flex justify-between items-start mt-1.5 gap-4">
        {message ? (
          <p
            id={`${textareaId}-message`}
            className={[
              'text-sm font-ui flex items-center gap-1.5 input-helper-text',
              error ? 'text-error' : success ? 'text-success' : 'text-neutral-500'
            ].join(' ')}
          >
            {error && <WarningIcon />}
            {success && <SuccessIcon />}
            {message}
          </p>
        ) : (
          <span />
        )}

        {showCount && maxLength && (
          <RuneTally current={charCount} max={maxLength} />
        )}
      </div>
    </div>
  )
})

Textarea.displayName = 'Textarea'

export default Textarea
export { Textarea, RuneTally }
