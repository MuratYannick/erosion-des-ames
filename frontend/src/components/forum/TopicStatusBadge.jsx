import Badge from '@/components/ui/Badge/Badge'

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 17v5M9 2h6l-1 7h4l-8 8 1-7H7l2-8z" />
  </svg>
)

const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
)

const TopicStatusBadge = ({ isPinned = false, isLocked = false, isUnread = false, className = '' }) => {
  const badges = []

  if (isPinned) {
    badges.push(
      <Badge key="pinned" variant="secondary" size="sm" icon={<PinIcon />}>
        Épinglé
      </Badge>
    )
  }

  if (isLocked) {
    badges.push(
      <Badge key="locked" variant="default" size="sm" icon={<LockIcon />}>
        Verrouillé
      </Badge>
    )
  }

  if (isUnread) {
    badges.push(
      <span key="unread" className="w-2.5 h-2.5 rounded-full bg-secondary-500 shadow-glow-sm" title="Non lu" />
    )
  }

  if (badges.length === 0) return null

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {badges}
    </div>
  )
}

TopicStatusBadge.displayName = 'TopicStatusBadge'
export default TopicStatusBadge
