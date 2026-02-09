const ReplyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 17 4 12 9 7" />
    <path d="M20 18v-2a4 4 0 00-4-4H4" />
  </svg>
)

const QuoteActionIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
  </svg>
)

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
)

const FlagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
)

const actionBtnClass = [
  'inline-flex items-center gap-1 px-2 py-1 rounded-md',
  'font-ui text-xs',
  'text-skin-muted hover:text-skin-base',
  'transition-colors duration-fast',
  'focus:outline-none focus:ring-2 focus:ring-primary/30',
].join(' ')

const PostActions = ({ onReply, onQuote, onEdit, onDelete, onReport, className = '' }) => {
  const hasModActions = onEdit || onDelete || onReport

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {onReply && (
        <button type="button" onClick={onReply} className={actionBtnClass}>
          <ReplyIcon /> Répondre
        </button>
      )}
      {onQuote && (
        <button type="button" onClick={onQuote} className={actionBtnClass}>
          <QuoteActionIcon /> Citer
        </button>
      )}

      {hasModActions && (
        <span className="mx-1 h-4 border-r border-neutral-300" aria-hidden="true" />
      )}

      {onEdit && (
        <button type="button" onClick={onEdit} className={actionBtnClass}>
          <EditIcon /> Éditer
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className={`${actionBtnClass} hover:text-error`}
        >
          <DeleteIcon /> Supprimer
        </button>
      )}
      {onReport && (
        <button
          type="button"
          onClick={onReport}
          className={`${actionBtnClass} hover:text-warning`}
        >
          <FlagIcon /> Signaler
        </button>
      )}
    </div>
  )
}

PostActions.displayName = 'PostActions'
export default PostActions
