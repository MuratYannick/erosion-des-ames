import { Card } from '@/components/ui/Card/Card'
import AuthorSidebar from './AuthorSidebar'
import PostActions from './PostActions'
import QuoteBlock from './QuoteBlock'

const PostCard = ({
  post,
  isFirstPost = false,
  onReply,
  onQuote,
  onEdit,
  onDelete,
  onReport,
  className = '',
}) => {
  if (!post) return null

  const { author, character, content, quotedPost, createdAt, editedAt, editedBy } = post

  const formattedDate = new Date(createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const formattedEditDate = editedAt
    ? new Date(editedAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <Card
      variant="bordered"
      className={[isFirstPost && 'border-secondary-200', className].filter(Boolean).join(' ')}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Author sidebar */}
        <div
          className={[
            'border-b sm:border-b-0 sm:border-r border-neutral-200',
            'bg-primary-50/30',
          ].join(' ')}
        >
          <AuthorSidebar author={author} character={character} />
        </div>

        {/* Post content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Post header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-neutral-50/50">
            <span className="font-ui text-xs text-skin-muted">{formattedDate}</span>
            {isFirstPost && (
              <span className="font-ui text-xs text-secondary-500 font-medium">
                Premier message
              </span>
            )}
          </div>

          {/* Post body */}
          <div className="px-4 py-4 flex-1">
            {/* Quoted post */}
            {quotedPost && (
              <QuoteBlock author={quotedPost.author?.username} date={quotedPost.createdAt}>
                <div dangerouslySetInnerHTML={{ __html: quotedPost.content }} />
              </QuoteBlock>
            )}

            {/* Main content */}
            <div
              className="font-body text-skin-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Edited indicator */}
            {formattedEditDate && (
              <div className="mt-4 font-ui text-xs text-skin-muted italic">
                Modifié le {formattedEditDate}
                {editedBy && editedBy.username && ` par ${editedBy.username}`}
              </div>
            )}
          </div>

          {/* Post footer with actions */}
          <div className="px-4 py-2 border-t border-neutral-200 bg-neutral-50/50">
            <PostActions
              onReply={onReply}
              onQuote={onQuote}
              onEdit={onEdit}
              onDelete={onDelete}
              onReport={onReport}
            />
          </div>
        </div>
      </div>
    </Card>
  )
}

PostCard.displayName = 'PostCard'
export default PostCard
