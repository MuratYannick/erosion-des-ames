const QuoteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.5" aria-hidden="true">
    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
  </svg>
)

const QuoteBlock = ({ author, date, children, className = '' }) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <blockquote
      className={[
        'border-l-4 border-secondary-400/50 bg-primary-100/40 rounded-r-stone',
        'px-4 py-3 my-3',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center gap-2 mb-2">
        <QuoteIcon />
        {author && (
          <span className="font-ui text-sm font-medium text-secondary-600">{author}</span>
        )}
        {formattedDate && (
          <span className="font-ui text-xs text-skin-muted">— {formattedDate}</span>
        )}
      </div>
      <div className="text-sm text-skin-secondary italic leading-relaxed">{children}</div>
    </blockquote>
  )
}

QuoteBlock.displayName = 'QuoteBlock'
export default QuoteBlock
