import { forwardRef, useState, useRef, useEffect } from 'react'

const tooltipPositions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2'
}

const arrowPositions = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-primary-700 border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-primary-700 border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-primary-700 border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-primary-700 border-y-transparent border-l-transparent'
}

const Tooltip = forwardRef(({
  content,
  position = 'top',
  trigger = 'hover',
  delay = 200,
  children,
  className = '',
  ...props
}, ref) => {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef(null)
  const triggerRef = useRef(null)

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  const toggleTooltip = () => {
    setIsVisible(prev => !prev)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Close on outside click for click trigger
  useEffect(() => {
    if (trigger !== 'click' || !isVisible) return

    const handleClickOutside = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) {
        setIsVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [trigger, isVisible])

  const triggerProps = trigger === 'hover'
    ? {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip
      }
    : {
        onClick: toggleTooltip
      }

  return (
    <div
      ref={(node) => {
        triggerRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      className={`relative inline-block ${className}`}
      {...triggerProps}
      {...props}
    >
      {children}

      {isVisible && content && (
        <div
          role="tooltip"
          className={[
            'absolute z-50 px-3 py-1.5',
            'bg-primary-700 text-primary-50',
            'text-sm font-ui whitespace-nowrap',
            'rounded-md shadow-lg',
            'animate-in fade-in duration-150',
            tooltipPositions[position]
          ].join(' ')}
        >
          {content}
          {/* Arrow */}
          <span
            className={[
              'absolute w-0 h-0',
              'border-4',
              arrowPositions[position]
            ].join(' ')}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  )
})

Tooltip.displayName = 'Tooltip'

export default Tooltip
export { Tooltip }
