import { Link } from 'react-router-dom'

const ProfileActivityRow = ({ item, type }) => {
  if (type === 'topic') {
    const categorySlug = item.category?.slug || 'general'
    const date = new Date(item.createdAt).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    return (
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200 last:border-b-0 hover:bg-primary-50/50 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {item.category && (
              <span className="inline-block px-2 py-0.5 bg-primary-100 text-primary-700 font-ui text-xs rounded-full flex-shrink-0">
                {item.category.name}
              </span>
            )}
            <Link
              to={`/forum/${categorySlug}/${item.id}`}
              className="font-body text-sm text-skin-base hover:text-secondary-600 transition-colors truncate"
            >
              {item.title}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 text-skin-muted font-ui text-xs">
          {item.postCount !== undefined && (
            <span>{item.postCount > 0 ? item.postCount - 1 : 0} réponses</span>
          )}
          <span>{date}</span>
        </div>
      </div>
    )
  }

  // type === 'post'
  const categorySlug = item.topic?.category?.slug || 'general'
  const topicId = item.topic?.id
  const excerpt = item.content
    ? item.content.replace(/<[^>]*>/g, '').slice(0, 100) + (item.content.length > 100 ? '…' : '')
    : ''
  const date = new Date(item.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-neutral-200 last:border-b-0 hover:bg-primary-50/50 transition-colors">
      <div className="flex-1 min-w-0">
        {item.topic && (
          <Link
            to={`/forum/${categorySlug}/${topicId}`}
            className="font-body text-sm text-skin-base hover:text-secondary-600 transition-colors block truncate"
          >
            {item.topic.title}
          </Link>
        )}
        {excerpt && (
          <p className="font-ui text-xs text-skin-muted mt-0.5 line-clamp-2">
            {excerpt}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 font-ui text-xs text-skin-muted">
        {date}
      </div>
    </div>
  )
}

ProfileActivityRow.displayName = 'ProfileActivityRow'
export default ProfileActivityRow
