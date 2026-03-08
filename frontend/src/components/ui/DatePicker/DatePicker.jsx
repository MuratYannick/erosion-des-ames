import { forwardRef, useState, useEffect, useRef, useId } from 'react'
import './DatePicker.css'
import {
  MONTHS_FR,
  WEEKDAYS_FR,
  formatDate,
  parseDate,
  isSameDay,
  isToday,
  getCalendarDays,
} from './datePickerUtils'

/**
 * Tribal Calendar Icon
 */
const CalendarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Stone tablet background */}
    <rect
      x="2"
      y="3"
      width="16"
      height="15"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Header section */}
    <path d="M2 7 L18 7" stroke="currentColor" strokeWidth="1.5" />
    {/* Binding rings */}
    <path d="M6 3 L6 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 3 L14 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Tribal marks (simplified grid) */}
    <circle cx="6" cy="10" r="0.5" fill="currentColor" />
    <circle cx="10" cy="10" r="0.5" fill="currentColor" />
    <circle cx="14" cy="10" r="0.5" fill="currentColor" />
    <circle cx="6" cy="13" r="0.5" fill="currentColor" />
    <circle cx="10" cy="13" r="0.5" fill="currentColor" />
    <circle cx="14" cy="13" r="0.5" fill="currentColor" />
    <circle cx="6" cy="16" r="0.5" fill="currentColor" />
    <circle cx="10" cy="16" r="0.5" fill="currentColor" />
  </svg>
)

/**
 * Tribal Chevron Left Icon
 */
const ChevronLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Main arrow */}
    <path
      d="M12 5 L7 10 L12 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Tribal marks */}
    <circle cx="13" cy="7" r="0.8" fill="currentColor" opacity="0.4" />
    <circle cx="13" cy="13" r="0.8" fill="currentColor" opacity="0.4" />
  </svg>
)

/**
 * Tribal Chevron Right Icon
 */
const ChevronRightIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Main arrow */}
    <path
      d="M8 5 L13 10 L8 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Tribal marks */}
    <circle cx="7" cy="7" r="0.8" fill="currentColor" opacity="0.4" />
    <circle cx="7" cy="13" r="0.8" fill="currentColor" opacity="0.4" />
  </svg>
)

/**
 * Label underline decoration (from Input pattern)
 */
const LabelUnderline = () => (
  <svg
    className="datepicker-label-underline"
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
 * DatePicker Component
 */
const DatePicker = forwardRef(({
  value,
  onChange,
  min,
  max,
  disabled = false,
  placeholder = 'Sélectionner une date',
  label,
  hint,
  error,
  format = 'dd/MM/yyyy',
  className = '',
  id,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    if (value instanceof Date) return value
    if (typeof value === 'string') return parseDate(value, format) || new Date()
    return new Date()
  })
  const [inputValue, setInputValue] = useState(() => {
    if (value instanceof Date) return formatDate(value, format)
    if (typeof value === 'string') return value
    return ''
  })

  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const calendarRef = useRef(null)
  const generatedId = useId().replace(/:/g, '')
  const datePickerId = id || `datepicker-${generatedId}`

  // Update input value when value prop changes
  useEffect(() => {
    if (value instanceof Date) {
      setInputValue(formatDate(value, format))
      setViewDate(value)
    } else if (typeof value === 'string') {
      setInputValue(value)
      const parsed = parseDate(value, format)
      if (parsed) setViewDate(parsed)
    } else if (value === null || value === '') {
      setInputValue('')
    }
  }, [value, format])

  // Handle input change (manual typing)
  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Try to parse and validate
    const parsed = parseDate(newValue, format)
    if (parsed && !isNaN(parsed)) {
      setViewDate(parsed)
      onChange?.(parsed)
    }
  }

  // Handle input blur (validation)
  const handleInputBlur = () => {
    if (!inputValue) {
      onChange?.(null)
      return
    }

    const parsed = parseDate(inputValue, format)
    if (parsed && !isNaN(parsed)) {
      // Validate against min/max
      if (isDateDisabled(parsed)) {
        // Reset to last valid value or empty
        if (value instanceof Date) {
          setInputValue(formatDate(value, format))
        } else {
          setInputValue('')
          onChange?.(null)
        }
      } else {
        setInputValue(formatDate(parsed, format))
        onChange?.(parsed)
      }
    } else {
      // Invalid format - reset
      if (value instanceof Date) {
        setInputValue(formatDate(value, format))
      } else {
        setInputValue('')
        onChange?.(null)
      }
    }
  }

  // Check if date is disabled
  const isDateDisabled = (date) => {
    if (min && date < min) return true
    if (max && date > max) return true
    return false
  }

  // Navigate to previous month
  const prevMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  // Select a date
  const selectDate = (date) => {
    if (isDateDisabled(date)) return

    const formattedDate = formatDate(date, format)
    setInputValue(formattedDate)
    setViewDate(date)
    onChange?.(date)

    // Close calendar after selection
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Toggle calendar
  const toggleCalendar = () => {
    if (disabled) return
    setIsOpen(prev => !prev)
  }

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
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
        setIsOpen(false)
        inputRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  // Keyboard navigation in calendar
  const handleCalendarKeyDown = (e, date) => {
    if (!isOpen || !calendarRef.current) return

    let newDate = new Date(date)
    let handled = false

    switch (e.key) {
      case 'ArrowLeft':
        newDate.setDate(newDate.getDate() - 1)
        handled = true
        break
      case 'ArrowRight':
        newDate.setDate(newDate.getDate() + 1)
        handled = true
        break
      case 'ArrowUp':
        newDate.setDate(newDate.getDate() - 7)
        handled = true
        break
      case 'ArrowDown':
        newDate.setDate(newDate.getDate() + 7)
        handled = true
        break
      case 'Enter':
      case ' ':
        selectDate(date)
        handled = true
        break
      case 'Home':
        newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
        handled = true
        break
      case 'End':
        newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
        handled = true
        break
    }

    if (handled) {
      e.preventDefault()

      // Update view if month changed
      if (newDate.getMonth() !== viewDate.getMonth()) {
        setViewDate(newDate)
      }

      // Focus the new date button
      setTimeout(() => {
        const dayButton = calendarRef.current?.querySelector(
          `[data-date="${newDate.toISOString().split('T')[0]}"]`
        )
        dayButton?.focus()
      }, 0)
    }
  }

  // Get calendar days for current view
  const calendarDays = getCalendarDays(viewDate.getFullYear(), viewDate.getMonth())

  // Determine if we can navigate to prev/next month based on min/max
  const canGoPrev = !min || new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1) >= new Date(min.getFullYear(), min.getMonth(), 1)
  const canGoNext = !max || new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0) <= new Date(max.getFullYear(), max.getMonth() + 1, 0)

  const inputClasses = [
    'datepicker-input',
    error && 'datepicker-input--error',
    disabled && 'datepicker-input--disabled',
    className
  ].filter(Boolean).join(' ')

  const selectedDate = value instanceof Date ? value : parseDate(inputValue, format)

  return (
    <div ref={containerRef} className="datepicker-wrapper">
      {label && (
        <label
          htmlFor={datePickerId}
          className="datepicker-label"
        >
          {label}
          <LabelUnderline />
        </label>
      )}

      <div className="datepicker-input-wrapper">
        <input
          ref={(node) => {
            inputRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
          }}
          id={datePickerId}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={inputClasses}
          aria-expanded={isOpen}
          aria-haspopup="grid"
          aria-describedby={hint || error ? `${datePickerId}-message` : undefined}
          aria-invalid={!!error}
          {...props}
        />

        <button
          type="button"
          onClick={toggleCalendar}
          disabled={disabled}
          className="datepicker-icon-button"
          tabIndex={-1}
          aria-label="Ouvrir le calendrier"
        >
          <CalendarIcon />
        </button>

        {isOpen && (
          <div
            ref={calendarRef}
            className="datepicker-calendar"
            role="grid"
            aria-label={`Calendrier ${MONTHS_FR[viewDate.getMonth()]} ${viewDate.getFullYear()}`}
          >
            {/* Header with navigation */}
            <div className="datepicker-header">
              <button
                type="button"
                onClick={prevMonth}
                disabled={!canGoPrev}
                className="datepicker-nav-button"
                aria-label="Mois précédent"
              >
                <ChevronLeftIcon />
              </button>

              <span className="datepicker-month-year">
                {MONTHS_FR[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>

              <button
                type="button"
                onClick={nextMonth}
                disabled={!canGoNext}
                className="datepicker-nav-button"
                aria-label="Mois suivant"
              >
                <ChevronRightIcon />
              </button>
            </div>

            {/* Weekdays header */}
            <div className="datepicker-weekdays" role="row">
              {WEEKDAYS_FR.map(day => (
                <span key={day} className="datepicker-weekday" role="columnheader">
                  {day}
                </span>
              ))}
            </div>

            {/* Days grid */}
            <div className="datepicker-days">
              {calendarDays.map((day, index) => {
                const isSelected = selectedDate && isSameDay(day.date, selectedDate)
                const isTodayDate = isToday(day.date)
                const isDisabled = isDateDisabled(day.date)

                const dayClasses = [
                  'datepicker-day',
                  isTodayDate && 'datepicker-day--today',
                  isSelected && 'datepicker-day--selected',
                  isDisabled && 'datepicker-day--disabled',
                  day.isOtherMonth && 'datepicker-day--other-month'
                ].filter(Boolean).join(' ')

                return (
                  <button
                    key={`${day.date.toISOString()}-${index}`}
                    type="button"
                    className={dayClasses}
                    onClick={() => selectDate(day.date)}
                    onKeyDown={(e) => handleCalendarKeyDown(e, day.date)}
                    disabled={isDisabled}
                    data-date={day.date.toISOString().split('T')[0]}
                    role="gridcell"
                    aria-label={formatDate(day.date, format)}
                    aria-selected={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                  >
                    {day.dayNumber}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {(hint || error) && (
        <p
          id={`${datePickerId}-message`}
          className={[
            'datepicker-message',
            error ? 'datepicker-message--error' : 'datepicker-message--hint'
          ].join(' ')}
        >
          {error || hint}
        </p>
      )}
    </div>
  )
})

DatePicker.displayName = 'DatePicker'

export default DatePicker
export { DatePicker }
