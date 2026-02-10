import { forwardRef, useMemo } from 'react'

// ============================================
// ICONS
// ============================================

const BanIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M4.93 4.93l14.14 14.14" />
  </svg>
)

const MuteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
)

// ============================================
// VARIANT CONFIG
// ============================================

const sanctionConfig = {
  ban: {
    label: 'Banni',
    icon: <BanIcon />,
    classes: 'bg-[#a63f38]/20 border-[#a63f38]/50 text-[#c95951] shadow-[0_0_8px_rgba(166,63,56,0.3)]',
  },
  mute: {
    label: 'Muet',
    icon: <MuteIcon />,
    classes: 'bg-[#c2580d]/20 border-[#e67315]/50 text-[#ff9635] shadow-[0_0_8px_rgba(255,150,53,0.25)]',
  },
}

// ============================================
// DURATION HELPER
// ============================================

function formatRemainingTime(expiresAt) {
  if (!expiresAt) return null

  const now = new Date()
  const expires = new Date(expiresAt)
  const diffMs = expires - now

  if (diffMs <= 0) return null

  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    const remainingHours = hours % 24
    return remainingHours > 0 ? `${days}j ${remainingHours}h` : `${days}j`
  }
  if (hours > 0) {
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }
  return `${minutes}m`
}

// ============================================
// USER SANCTION BADGE
// ============================================

const UserSanctionBadge = forwardRef(({
  type = 'ban',
  expiresAt = null,
  reason,
  className = '',
  ...props
}, ref) => {
  const config = sanctionConfig[type] || sanctionConfig.ban

  const remaining = useMemo(
    () => formatRemainingTime(expiresAt),
    [expiresAt]
  )

  const isPermanent = !expiresAt
  const isExpired = expiresAt && !remaining

  if (isExpired) return null

  return (
    <span
      ref={ref}
      className={[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border',
        'text-xs font-medium uppercase tracking-wide font-ui',
        config.classes,
        className,
      ].filter(Boolean).join(' ')}
      title={reason || undefined}
      role="status"
      aria-label={`${config.label}${isPermanent ? ' permanent' : ` — ${remaining} restant`}`}
      {...props}
    >
      {config.icon}
      <span>{config.label}</span>
      <span className="opacity-70 tabular-nums">
        {isPermanent ? '∞' : remaining}
      </span>
    </span>
  )
})

UserSanctionBadge.displayName = 'UserSanctionBadge'

export default UserSanctionBadge
export { UserSanctionBadge, formatRemainingTime }
