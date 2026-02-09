import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '@/components/content/PageHeader'
import { PostForm } from '@/components/forum'
import { Card } from '@/components/ui/Card/Card'
import Loader from '@/components/ui/Loader/Loader'
import { useTopic, useUpdatePost } from '@/hooks/useForum'
import { useAuth } from '@/hooks/useAuth'

const ForumEditPost = () => {
  const { categorySlug, topicId, postId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  // Fetch topic to get post data and category info
  const { data: topicData, loading } = useTopic(topicId)

  // Update mutation
  const { mutate: updatePost, loading: updating, error: updateError } = useUpdatePost({
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
  const posts = topicData?.posts || topic?.posts || []
  const post = posts.find((p) => String(p.id) === String(postId))
  const category = topic?.category || {}

  if (!topic || !post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card variant="bordered" padding="md">
          <p className="font-body text-error text-center">Message introuvable.</p>
        </Card>
      </div>
    )
  }

  // Build errors from API
  const errors = {}
  if (updateError?.response?.data?.errors) {
    updateError.response.data.errors.forEach((err) => {
      errors[err.path || err.param] = err.msg
    })
  }

  const handleSubmit = (data) => {
    updatePost({ id: postId, data })
  }

  return (
    <div className="forum-edit-post">
      <PageHeader
        title="Modifier le message"
        breadcrumbs={[
          { label: 'Forum', href: '/forum' },
          { label: category.name || 'Catégorie', href: `/forum/${categorySlug}` },
          { label: topic.title, href: `/forum/${categorySlug}/${topicId}` },
          { label: 'Modifier le message' },
        ]}
        size="compact"
      />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card variant="bordered" padding="lg">
          <PostForm
            initialContent={post.content}
            isEditing
            isRpTopic={category.isRp || false}
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

export default ForumEditPost
