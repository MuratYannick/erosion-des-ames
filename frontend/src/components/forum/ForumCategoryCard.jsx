import { Link } from 'react-router-dom'
import { Card, CardBody } from '@/components/ui/Card/Card'
import Avatar from '@/components/ui/Avatar/Avatar'

const FolderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
)

const FireIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22c-4.97 0-9-2.69-9-6s4.03-6 9-6c4.97 0 9 2.69 9 6s-4.03 6-9 6z" opacity="0.3" fill="currentColor" />
    <path d="M12 2s4 4.5 4 8c0 2.21-1.79 4-4 4S8 12.21 8 10c0-3.5 4-8 4-8z" />
  </svg>
)

const ForumCategoryCard = ({ category, className = '' }) => {
  const {
    id,
    name,
    slug,
    description,
    icon,
    isRp,
    topicCount = 0,
    postCount = 0,
    unreadCount = 0,
    lastPost,
    children: subCategories,
  } = category

  return (
    <Card
      variant="bordered"
      hover
      className={['group', isRp && 'border-secondary-300/50', className]
        .filter(Boolean)
        .join(' ')}
    >
      <CardBody className="!p-0">
        <div className="flex items-start gap-4 p-4">
          {/* Category icon */}
          <div
            className={[
              'flex-shrink-0 w-12 h-12 rounded-stone flex items-center justify-center',
              isRp
                ? 'bg-secondary-100 text-secondary-600 shadow-glow-sm'
                : 'bg-primary-100 text-primary-600',
            ].join(' ')}
          >
            {icon ? (
              <span className="text-xl">{icon}</span>
            ) : isRp ? (
              <FireIcon />
            ) : (
              <FolderIcon />
            )}
          </div>

          {/* Category info */}
          <div className="flex-1 min-w-0">
            <Link
              to={`/forum/${slug}`}
              className="block group-hover:text-secondary-600 transition-colors duration-fast"
            >
              <h3 className="font-heading text-lg text-skin-base truncate">{name}</h3>
            </Link>
            {description && (
              <p className="font-body text-sm text-skin-secondary mt-0.5 line-clamp-2">
                {description}
              </p>
            )}
            {subCategories && subCategories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {subCategories.map((sub) => (
                  <Link
                    key={sub.id}
                    to={`/forum/${sub.slug}`}
                    className="font-ui text-xs text-skin-muted hover:text-secondary-600 transition-colors duration-fast"
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-6 flex-shrink-0 text-center">
            <div>
              <div className="font-heading text-lg text-skin-base">{topicCount}</div>
              <div className="font-ui text-xs text-skin-muted">Sujets</div>
            </div>
            <div>
              <div className="font-heading text-lg text-skin-base">{postCount}</div>
              <div className="font-ui text-xs text-skin-muted">Messages</div>
            </div>
            {unreadCount > 0 && (
              <div>
                <div className="font-heading text-lg text-secondary-600">{unreadCount}</div>
                <div className="font-ui text-xs text-secondary-500">Non lus</div>
              </div>
            )}
          </div>

          {/* Last post info */}
          {lastPost && (
            <div className="hidden md:flex items-center gap-2 flex-shrink-0 max-w-[200px]">
              <Avatar
                src={lastPost.author?.avatarUrl}
                name={lastPost.author?.username}
                size="sm"
              />
              <div className="min-w-0">
                <Link
                  to={`/forum/${slug}/${lastPost.topicId}`}
                  className="font-body text-xs text-skin-base hover:text-secondary-600 truncate block transition-colors duration-fast"
                >
                  {lastPost.topicTitle || 'Dernier message'}
                </Link>
                <div className="font-ui text-xs text-skin-muted">
                  {lastPost.author?.username} ·{' '}
                  {new Date(lastPost.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  )
}

ForumCategoryCard.displayName = 'ForumCategoryCard'
export default ForumCategoryCard
