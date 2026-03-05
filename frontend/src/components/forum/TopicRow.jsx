import { Link } from 'react-router-dom'
import Avatar from '@/components/ui/Avatar/Avatar'
import TopicStatusBadge from './TopicStatusBadge'

const MessageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const TopicRow = ({ topic, categorySlug: categorySlugProp, className = '' }) => {
  const {
    id,
    title,
    isPinned,
    isLocked,
    isUnread,
    author,
    character,
    category,
    postCount = 0,
    viewCount = 0,
    lastPost,
    createdAt,
  } = topic

  return (
    <div
      className={[
        'flex items-center gap-4 px-4 py-3',
        'border-b border-neutral-200 last:border-b-0',
        'transition-colors duration-fast',
        isPinned ? 'bg-secondary-50/30' : 'hover:bg-primary-50/50',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Author avatar */}
      <div className="flex-shrink-0">
        <Avatar
          src={author?.avatarUrl}
          name={character?.name || author?.username}
          size="md"
        />
      </div>

      {/* Topic info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <TopicStatusBadge isPinned={isPinned} isLocked={isLocked} isUnread={isUnread} />
          <Link
            to={`/forum/${categorySlugProp || category?.slug || 'general'}/${id}`}
            className={[
              'font-body text-base hover:text-secondary-600 transition-colors duration-fast truncate',
              isUnread ? 'font-semibold text-skin-base' : 'text-skin-secondary',
            ].join(' ')}
          >
            {title}
          </Link>
        </div>
        <div className="font-ui text-xs text-skin-muted mt-0.5">
          par{' '}
          <Link to={`/profil/${author?.id}`} className="text-skin-secondary hover:text-secondary-600 transition-colors">
            {character?.name || author?.username}
          </Link>
          {' · '}
          {new Date(createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-4 flex-shrink-0 text-skin-muted">
        <div className="flex items-center gap-1 font-ui text-xs" title="Réponses">
          <MessageIcon />
          <span>{postCount > 0 ? postCount - 1 : 0}</span>
        </div>
        <div className="flex items-center gap-1 font-ui text-xs" title="Vues">
          <EyeIcon />
          <span>{viewCount}</span>
        </div>
      </div>

      {/* Last reply */}
      {lastPost && (
        <div className="hidden md:flex items-center gap-2 flex-shrink-0 max-w-[160px]">
          <Avatar
            src={lastPost.author?.avatarUrl}
            name={lastPost.author?.username}
            size="xs"
          />
          <div className="min-w-0">
            <Link to={`/profil/${lastPost.author?.id}`} className="font-ui text-xs text-skin-secondary hover:text-secondary-600 transition-colors truncate block">
              {lastPost.author?.username}
            </Link>
            <div className="font-ui text-xs text-skin-muted">
              {new Date(lastPost.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

TopicRow.displayName = 'TopicRow'
export default TopicRow
