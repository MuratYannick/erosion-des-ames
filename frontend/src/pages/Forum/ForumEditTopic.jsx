import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '@/components/content/PageHeader'
import { TopicForm } from '@/components/forum'
import { Card } from '@/components/ui/Card/Card'
import Loader from '@/components/ui/Loader/Loader'
import { useTopic, useUpdateTopic } from '@/hooks/useForum'
import { useAuth } from '@/hooks/useAuth'

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER']

const ForumEditTopic = () => {
  const { categorySlug, topicId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const isStaff = user && STAFF_ROLES.includes(user.role)

  // Fetch topic data
  const { data: topicData, loading } = useTopic(topicId)

  // Update mutation
  const { mutate: updateTopic, loading: updating, error: updateError } = useUpdateTopic({
    onSuccess: () => {
      navigate(`/forum/${categorySlug}/${topicId}`)
    },
  })

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    )
  }

  const topic = topicData?.topic || topicData
  if (!topic) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card variant="bordered" padding="md">
          <p className="font-body text-error text-center">Sujet introuvable.</p>
        </Card>
      </div>
    )
  }

  const category = topic.category || {}

  // Find first post content
  const firstPost = topic.posts?.find((p) => p.isFirstPost) || topic.posts?.[0]

  // Build errors from API
  const errors = {}
  if (updateError?.response?.data?.errors) {
    updateError.response.data.errors.forEach((err) => {
      errors[err.path || err.param] = err.msg
    })
  }

  const handleSubmit = (data) => {
    updateTopic({ id: topicId, data })
  }

  return (
    <div className="forum-edit-topic">
      <PageHeader
        title="Modifier le sujet"
        breadcrumbs={[
          { label: 'Forum', href: '/forum' },
          { label: category.name || 'Catégorie', href: `/forum/${categorySlug}` },
          { label: topic.title, href: `/forum/${categorySlug}/${topicId}` },
          { label: 'Modifier' },
        ]}
        size="compact"
      />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card variant="bordered" padding="lg">
          <TopicForm
            initialValues={{
              title: topic.title,
              content: firstPost?.content || '',
              categoryId: topic.categoryId || category.id,
              isPinned: topic.isPinned,
              isLocked: topic.isLocked,
            }}
            isEditing
            isStaff={isStaff}
            isRpCategory={category.isRp || false}
            characters={user?.characters || []}
            loading={updating}
            errors={errors}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
          />
        </Card>
      </div>
    </div>
  )
}

export default ForumEditTopic
