import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '@/components/content/PageHeader'
import { TopicForm } from '@/components/forum'
import { Card } from '@/components/ui/Card/Card'
import Loader from '@/components/ui/Loader/Loader'
import { useForumCategory, useCreateTopic } from '@/hooks/useForum'
import { useAuth } from '@/hooks/useAuth'

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER']

const ForumCreateTopic = () => {
  const { categorySlug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const isStaff = user && STAFF_ROLES.includes(user.role)

  // Fetch the target category from slug
  const { data: category, loading: categoryLoading, error: categoryError } = useForumCategory(categorySlug)

  // Create topic mutation
  const { mutate: createTopic, loading: creating, error: createError } = useCreateTopic({
    onSuccess: (data) => {
      const topic = data?.topic || data?.data?.topic || data
      navigate(`/forum/${categorySlug}/${topic.id}`)
    },
  })

  if (categoryLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    )
  }

  if (categoryError || !category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card variant="bordered" padding="md">
          <p className="font-body text-error text-center">
            Catégorie introuvable. Veuillez revenir au forum et choisir une catégorie.
          </p>
        </Card>
      </div>
    )
  }

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
          { label: category.name, href: `/forum/${categorySlug}` },
          { label: 'Nouveau sujet' },
        ]}
        size="compact"
      />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card variant="bordered" padding="lg">
          <TopicForm
            categoryId={category.id}
            categoryName={category.name}
            isRpCategory={category.isRp || false}
            characters={user?.characters || []}
            isStaff={isStaff}
            loading={creating}
            errors={errors}
            onSubmit={(data) => createTopic({ ...data, categoryId: category.id })}
            onCancel={() => navigate(-1)}
          />
        </Card>
      </div>
    </div>
  )
}

export default ForumCreateTopic
