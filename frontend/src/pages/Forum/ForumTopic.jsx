import { useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import PageHeader from '@/components/content/PageHeader'
import {
  PostCard,
  PostForm,
  TopicStatusBadge,
  ForumPagination,
  ReportModal,
} from '@/components/forum'
import { Card } from '@/components/ui/Card/Card'
import Button from '@/components/ui/Button/Button'
import Loader from '@/components/ui/Loader/Loader'
import {
  useTopic,
  useCreatePost,
  useDeleteTopic,
  useDeletePost,
  useToggleSubscription,
  useReportPost,
} from '@/hooks/useForum'
import { useAuth } from '@/hooks/useAuth'

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER']

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
)

const ForumTopic = () => {
  const { categorySlug, topicId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [quotedPost, setQuotedPost] = useState(null)
  const [reportingPostId, setReportingPostId] = useState(null)

  const isStaff = user && STAFF_ROLES.includes(user.role)

  // Fetch topic with posts
  const {
    data: topicData,
    loading,
    error,
    refetch,
  } = useTopic(topicId, { page, limit: 20 })

  // Mutations
  const { mutate: createPost, loading: postingLoading } = useCreatePost({
    onSuccess: () => {
      setQuotedPost(null)
      refetch()
    },
  })

  const { mutate: deleteTopic } = useDeleteTopic({
    onSuccess: () => navigate(`/forum/${categorySlug}`),
  })

  const { mutate: deletePost } = useDeletePost({
    onSuccess: () => refetch(),
  })

  const { mutate: toggleSubscription } = useToggleSubscription({
    onSuccess: () => refetch(),
  })

  const { mutate: reportPost, loading: reportLoading } = useReportPost({
    onSuccess: () => setReportingPostId(null),
  })

  // Handlers
  const handleReply = useCallback((data) => {
    createPost({ topicId, data })
  }, [createPost, topicId])

  const handleQuote = useCallback((post) => {
    setQuotedPost(post)
    // Scroll to reply form
    document.getElementById('reply-form')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleDeleteTopic = useCallback(() => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce sujet ?')) {
      deleteTopic(topicId)
    }
  }, [deleteTopic, topicId])

  const handleDeletePost = useCallback((postId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      deletePost(postId)
    }
  }, [deletePost])

  const handleReport = useCallback((data) => {
    reportPost({ id: reportingPostId, data })
  }, [reportPost, reportingPostId])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    )
  }

  if (error || !topicData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card variant="bordered" padding="md">
          <p className="font-body text-error text-center">
            Sujet introuvable ou erreur de chargement.
          </p>
        </Card>
      </div>
    )
  }

  const topic = topicData.topic || topicData
  const posts = topicData.posts || topic.posts || []
  const totalPages = topicData.totalPages || 1
  const totalItems = topicData.total || posts.length
  const category = topic.category || {}
  const isRpTopic = category.isRp || false

  return (
    <div className="forum-topic">
      {/* Page header */}
      <PageHeader
        title={topic.title}
        breadcrumbs={[
          { label: 'Forum', href: '/forum' },
          { label: category.name || 'Catégorie', href: `/forum/${categorySlug}` },
          { label: topic.title },
        ]}
        size="compact"
      >
        <div className="flex items-center gap-3 mt-2">
          <TopicStatusBadge
            isPinned={topic.isPinned}
            isLocked={topic.isLocked}
          />
        </div>
      </PageHeader>

      <div className="container mx-auto px-4 py-8">
        {/* Topic toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {/* Left: topic meta */}
          <div className="font-ui text-sm text-skin-muted">
            {topic.viewCount || 0} vues · {(topic.postCount || 1) - 1} réponses
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {user && (
              <Button
                variant={topic.isSubscribed ? 'secondary' : 'outline'}
                size="sm"
                icon={<BellIcon />}
                onClick={() => toggleSubscription(topicId)}
              >
                {topic.isSubscribed ? 'Abonné' : "S'abonner"}
              </Button>
            )}

            {isStaff && (
              <>
                <Link to={`/forum/${categorySlug}/${topicId}/modifier`}>
                  <Button variant="outline" size="sm">Modifier</Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDeleteTopic}
                  className="text-error hover:text-error"
                >
                  Supprimer
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Posts list */}
        <div className="space-y-4">
          {posts.map((post, index) => {
            const isAuthor = user && post.author?.id === user.id
            const canEdit = isAuthor || isStaff
            const canDelete = isAuthor || isStaff
            const canReport = user && !isAuthor

            return (
              <PostCard
                key={post.id}
                post={post}
                isFirstPost={index === 0 && page === 1}
                onReply={!topic.isLocked && user ? () => handleQuote(null) : undefined}
                onQuote={!topic.isLocked && user ? () => handleQuote(post) : undefined}
                onEdit={canEdit ? () => navigate(`/forum/${categorySlug}/${topicId}/modifier-post/${post.id}`) : undefined}
                onDelete={canDelete ? () => handleDeletePost(post.id) : undefined}
                onReport={canReport ? () => setReportingPostId(post.id) : undefined}
              />
            )
          })}
        </div>

        {/* Pagination */}
        <ForumPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          totalItems={totalItems}
          className="mt-6"
        />

        {/* Reply form */}
        {user && !topic.isLocked && (
          <div id="reply-form" className="mt-8">
            <h3 className="font-heading text-lg text-skin-base mb-4">Répondre</h3>
            <Card variant="bordered" padding="md">
              <PostForm
                isRpTopic={isRpTopic}
                characters={user.characters || []}
                quotedPost={quotedPost}
                onClearQuote={() => setQuotedPost(null)}
                onSubmit={handleReply}
                loading={postingLoading}
              />
            </Card>
          </div>
        )}

        {/* Locked topic notice */}
        {topic.isLocked && (
          <div className="mt-8 p-4 bg-neutral-100 border border-neutral-300 rounded-stone text-center">
            <p className="font-ui text-sm text-skin-muted">
              Ce sujet est verrouillé. Vous ne pouvez plus y répondre.
            </p>
          </div>
        )}
      </div>

      {/* Report modal */}
      <ReportModal
        isOpen={!!reportingPostId}
        onClose={() => setReportingPostId(null)}
        onSubmit={handleReport}
        loading={reportLoading}
      />
    </div>
  )
}

export default ForumTopic
