import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '@/components/content/PageHeader'
import { TopicForm } from '@/components/forum'
import { Card } from '@/components/ui/Card/Card'
import Loader from '@/components/ui/Loader/Loader'
import { useForumCategories, useCreateTopic } from '@/hooks/useForum'
import { useAuth } from '@/hooks/useAuth'

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER']

const ForumCreateTopic = () => {
  const { categorySlug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const isStaff = user && STAFF_ROLES.includes(user.role)

  // Fetch categories for the selector
  const { data: categories, loading: categoriesLoading } = useForumCategories()

  // Create topic mutation
  const { mutate: createTopic, loading: creating, error: createError } = useCreateTopic({
    onSuccess: (data) => {
      const topic = data?.topic || data?.data?.topic || data
      navigate(`/forum/${categorySlug}/${topic.id}`)
    },
  })

  if (categoriesLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    )
  }

  // Find the current category from slug
  const flatCategories = categories || []
  const currentCategory = flatCategories.find(
    (c) => c.slug === categorySlug || String(c.id) === categorySlug
  )

  // Build errors object from API error
  const errors = {}
  if (createError?.response?.data?.errors) {
    createError.response.data.errors.forEach((err) => {
      errors[err.path || err.param] = err.msg
    })
  }

  return (
    <div className="forum-create-topic">
      <PageHeader
        title="Nouveau sujet"
        breadcrumbs={[
          { label: 'Forum', href: '/forum' },
          ...(currentCategory
            ? [{ label: currentCategory.name, href: `/forum/${categorySlug}` }]
            : []),
          { label: 'Nouveau sujet' },
        ]}
        size="compact"
      />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card variant="bordered" padding="lg">
          <TopicForm
            initialValues={{
              categoryId: currentCategory?.id || '',
            }}
            categories={flatCategories.filter((c) => c.parentId || !c.children?.length)}
            characters={user?.characters || []}
            isRpCategory={currentCategory?.isRp || false}
            isStaff={isStaff}
            loading={creating}
            errors={errors}
            onSubmit={createTopic}
            onCancel={() => navigate(-1)}
          />
        </Card>
      </div>
    </div>
  )
}

export default ForumCreateTopic
