import { useState } from 'react'

// ============================================
// ACTION TYPE CONFIG
// ============================================

const ACTION_CONFIG = {
  ban_user: { label: 'Bannissement', category: 'sanction' },
  unban_user: { label: 'Débannissement', category: 'sanction' },
  mute_user: { label: 'Mise en sourdine', category: 'sanction' },
  unmute_user: { label: 'Fin de sourdine', category: 'sanction' },
  warn_user: { label: 'Avertissement', category: 'sanction' },
  change_role: { label: 'Changement de rôle', category: 'user' },
  delete_user: { label: 'Suppression compte', category: 'user' },
  activate_user: { label: 'Activation compte', category: 'user' },
  deactivate_user: { label: 'Désactivation compte', category: 'user' },
  approve_character: { label: 'Approbation perso.', category: 'character' },
  reject_character: { label: 'Rejet perso.', category: 'character' },
  delete_character: { label: 'Suppression perso.', category: 'character' },
  delete_post: { label: 'Suppression message', category: 'forum' },
  delete_topic: { label: 'Suppression sujet', category: 'forum' },
  lock_topic: { label: 'Verrouillage sujet', category: 'forum' },
  unlock_topic: { label: 'Déverrouillage sujet', category: 'forum' },
  pin_topic: { label: 'Épinglage sujet', category: 'forum' },
  unpin_topic: { label: 'Désépinglage sujet', category: 'forum' },
  move_topic: { label: 'Déplacement sujet', category: 'forum' },
  merge_topics: { label: 'Fusion sujets', category: 'forum' },
  review_report: { label: 'Traitement signalement', category: 'report' },
  edit_category: { label: 'Modification catégorie', category: 'forum' },
  delete_category: { label: 'Suppression catégorie', category: 'forum' },
}

const CATEGORY_COLORS = {
  sanction: { border: 'border-l-[#c95951]', icon: 'text-[#c95951]', bg: 'bg-[#a63f38]/15' },
  user: { border: 'border-l-[#5b8fb9]', icon: 'text-[#5b8fb9]', bg: 'bg-[#5b8fb9]/15' },
  character: { border: 'border-l-[#6b9664]', icon: 'text-[#6b9664]', bg: 'bg-[#6b9664]/15' },
  forum: { border: 'border-l-[#ff9635]', icon: 'text-[#ff9635]', bg: 'bg-[#ff9635]/15' },
  report: { border: 'border-l-[#a890c0]', icon: 'text-[#a890c0]', bg: 'bg-[#a890c0]/15' },
}

// ============================================
// INLINE ICONS
// ============================================

const IconBan = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
  </svg>
)

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0112 0v1" />
  </svg>
)

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const IconChat = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

const IconFlag = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
)

const IconChevron = ({ expanded }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className={[
      'w-4 h-4 transition-transform duration-200',
      expanded ? 'rotate-180' : '',
    ].join(' ')} aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
)

const CATEGORY_ICONS = {
  sanction: <IconBan />,
  user: <IconUser />,
  character: <IconShield />,
  forum: <IconChat />,
  report: <IconFlag />,
}

// ============================================
// DATE HELPERS
// ============================================

function formatDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatTime(isoString) {
  const date = new Date(isoString)
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatRelativeTime(isoString) {
  const now = new Date()
  const date = new Date(isoString)
  const diffMs = now - date
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes}m`
  if (hours < 24) return `Il y a ${hours}h`
  if (days < 30) return `Il y a ${days}j`
  return formatDate(isoString)
}

// ============================================
// JSON FORMATTER
// ============================================

function JsonValue({ value, depth = 0 }) {
  if (value === null || value === undefined) {
    return <span className="text-[#64707e] italic">null</span>
  }
  if (typeof value === 'boolean') {
    return <span className="text-[#ff9635]">{value.toString()}</span>
  }
  if (typeof value === 'number') {
    return <span className="text-[#6b9664]">{value}</span>
  }
  if (typeof value === 'string') {
    return <span className="text-[#a890c0]">"{value}"</span>
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-[#64707e]">[]</span>
    const indent = '  '.repeat(depth + 1)
    const closeIndent = '  '.repeat(depth)
    return (
      <span>
        {'[\n'}
        {value.map((item, i) => (
          <span key={i}>
            {indent}<JsonValue value={item} depth={depth + 1} />
            {i < value.length - 1 ? ',\n' : '\n'}
          </span>
        ))}
        {closeIndent}{']'}
      </span>
    )
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value)
    if (entries.length === 0) return <span className="text-[#64707e]">{'{}'}</span>
    const indent = '  '.repeat(depth + 1)
    const closeIndent = '  '.repeat(depth)
    return (
      <span>
        {'{\n'}
        {entries.map(([key, val], i) => (
          <span key={key}>
            {indent}<span className="text-[#7ba5c9]">"{key}"</span>: <JsonValue value={val} depth={depth + 1} />
            {i < entries.length - 1 ? ',\n' : '\n'}
          </span>
        ))}
        {closeIndent}{'}'}
      </span>
    )
  }
  return <span>{String(value)}</span>
}

// ============================================
// AVATAR
// ============================================

const MiniAvatar = ({ user, size = 'w-8 h-8' }) => {
  if (!user) return null

  const initials = (user.username || '?').charAt(0).toUpperCase()

  return user.avatar ? (
    <img
      src={user.avatar}
      alt={user.username}
      className={`${size} rounded-full border border-[#6b3212]/60 object-cover`}
    />
  ) : (
    <div className={`${size} rounded-full border border-[#6b3212]/60 bg-[#232930] flex items-center justify-center text-[#8f99a5] text-xs font-ui font-medium`}>
      {initials}
    </div>
  )
}

// ============================================
// MODERATION ACTION ROW
// ============================================

const ModerationActionRow = ({
  action,
  onUserClick,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false)

  const config = ACTION_CONFIG[action.actionType] || { label: action.actionType, category: 'user' }
  const colors = CATEGORY_COLORS[config.category] || CATEGORY_COLORS.user
  const hasDetails = action.details && Object.keys(action.details).length > 0

  return (
    <div
      className={[
        'bg-[#1a2027] border-l-4 px-4 py-4',
        colors.border,
        'border-b border-[#6b3212]/20',
        'hover:bg-[#1d2229] transition-colors duration-150 motion-reduce:transition-none',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Main row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        {/* Timestamp */}
        <div className="flex flex-col gap-0.5 shrink-0 w-20">
          <span className="text-[#8f99a5] text-xs tabular-nums">{formatDate(action.createdAt)}</span>
          <span className="text-[#64707e] text-xs tabular-nums">{formatTime(action.createdAt)}</span>
        </div>

        {/* Action type */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={[
            'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
            colors.bg,
            colors.icon,
          ].join(' ')}>
            {CATEGORY_ICONS[config.category]}
          </div>
          <span className="text-[#bba794] text-sm font-medium">{config.label}</span>
        </div>

        {/* Moderator + Target user */}
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:shrink-0">
          {action.moderator && (
            <div className="flex items-center gap-2">
              <MiniAvatar user={action.moderator} />
              <button
                type="button"
                onClick={() => onUserClick?.(action.moderator.id)}
                className="text-[#d4c9ba] text-sm hover:text-[#ff9635] transition-colors cursor-pointer"
              >
                {action.moderator.username}
              </button>
            </div>
          )}

          {action.targetUser && (
            <div className="flex items-center gap-2">
              <span className="text-[#64707e] text-xs">→</span>
              <MiniAvatar user={action.targetUser} />
              <button
                type="button"
                onClick={() => onUserClick?.(action.targetUser.id)}
                className="text-[#bba794] text-sm hover:text-[#ff9635] transition-colors cursor-pointer"
              >
                {action.targetUser.username}
              </button>
            </div>
          )}
        </div>

        {/* Reason — desktop only (inline truncated) */}
        <div className="flex-1 min-w-0 hidden lg:block">
          {action.reason ? (
            <p className="text-[#8f99a5] text-sm italic line-clamp-1">{action.reason}</p>
          ) : (
            <span className="text-[#64707e] text-xs">—</span>
          )}
        </div>

        {/* Relative time + expand */}
        <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
          <span className="text-[#64707e] text-xs hidden sm:inline">
            {formatRelativeTime(action.createdAt)}
          </span>

          {hasDetails && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className={[
                'p-2 rounded-md bg-[#232930] border border-[#6b3212]/40',
                'text-[#8f99a5] hover:text-[#ff9635] hover:border-[#ff9635]/60',
                'transition-all duration-150',
              ].join(' ')}
              aria-expanded={expanded}
              aria-label={expanded ? 'Masquer les détails' : 'Afficher les détails'}
            >
              <IconChevron expanded={expanded} />
            </button>
          )}
        </div>
      </div>

      {/* Reason on mobile/tablet (hidden at lg where it shows inline in the row) */}
      {action.reason && (
        <p className="text-[#8f99a5] text-sm italic mt-2 lg:hidden line-clamp-2">
          {action.reason}
        </p>
      )}

      {/* Expanded details */}
      {hasDetails && (
        <div
          className={[
            'overflow-hidden transition-all duration-300 ease-in-out',
            expanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0',
          ].join(' ')}
        >
          <div className="bg-[#232930] rounded-md p-4 border-t border-[#6b3212]/30">
            <pre className="font-mono text-xs text-[#8f99a5] leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
              <JsonValue value={action.details} />
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

ModerationActionRow.displayName = 'ModerationActionRow'

export default ModerationActionRow
export { ModerationActionRow, ACTION_CONFIG, CATEGORY_COLORS }
