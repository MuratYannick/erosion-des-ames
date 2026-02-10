import { forwardRef } from 'react'

// ============================================
// VARIANT CONFIG
// ============================================

const variantConfig = {
  users: {
    border: 'border-l-[#5b8fb9]',
    iconColor: 'text-[#5b8fb9]',
  },
  characters: {
    border: 'border-l-[#6b9664]',
    iconColor: 'text-[#6b9664]',
  },
  forum: {
    border: 'border-l-[#ff9635]',
    iconColor: 'text-[#ff9635]',
  },
  moderation: {
    border: 'border-l-[#c95951]',
    iconColor: 'text-[#c95951]',
  },
}

// ============================================
// TREND ICONS
// ============================================

const TrendUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 15l-6-6-6 6" />
  </svg>
)

const TrendDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

// ============================================
// STAT CARD
// ============================================

const StatCard = forwardRef(({
  label,
  value,
  icon,
  variant = 'users',
  trend,
  className = '',
  ...props
}, ref) => {
  const config = variantConfig[variant] || variantConfig.users

  return (
    <div
      ref={ref}
      className={[
        'bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-5',
        'border-l-4',
        config.border,
        'hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.5)]',
        'transition-all duration-200 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        {icon && (
          <div className={[
            'w-12 h-12 rounded-full bg-[#232930] shadow-inner',
            'flex items-center justify-center flex-shrink-0',
            config.iconColor,
          ].join(' ')}>
            <span className="w-6 h-6 flex items-center justify-center">
              {icon}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-[#8f99a5] text-xs uppercase tracking-wider font-ui mb-1 truncate">
            {label}
          </p>
          <p className="text-[#d4c9ba] text-2xl font-subheading tabular-nums">
            {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
          </p>
        </div>

        {/* Trend */}
        {trend && (
          <div className={[
            'flex items-center gap-1 text-xs font-medium tabular-nums flex-shrink-0',
            trend.direction === 'up' ? 'text-[#6b9664]' : 'text-[#c95951]',
          ].join(' ')}>
            {trend.direction === 'up' ? <TrendUpIcon /> : <TrendDownIcon />}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  )
})

StatCard.displayName = 'StatCard'

export default StatCard
export { StatCard }
