import { Link } from 'react-router-dom'
import PageHeader from '@/components/content/PageHeader'
import { ForumCategoryCard, ForumStats, TopicRow } from '@/components/forum'
import { Card, CardHeader, CardBody } from '@/components/ui/Card/Card'
import Button from '@/components/ui/Button/Button'
import Loader from '@/components/ui/Loader/Loader'
import { useForumCategories, useRecentTopics, useMarkAllAsRead } from '@/hooks/useForum'
import { useAuth } from '@/hooks/useAuth'

const NewTopicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const ForumIndex = () => {
  const { user } = useAuth()
  const { data: categories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useForumCategories()
  const { data: recentTopics, loading: topicsLoading, refetch: refetchRecent } = useRecentTopics({ limit: 5 })
  const { mutate: markAllAsRead, loading: markingRead } = useMarkAllAsRead({
    onSuccess: () => {
      refetchCategories()
      refetchRecent()
    },
  })

  // Compute global stats from categories
  const stats = categories
    ? categories.reduce(
        (acc, cat) => ({
          topicCount: acc.topicCount + (cat.topicCount || 0),
          postCount: acc.postCount + (cat.postCount || 0),
        }),
        { topicCount: 0, postCount: 0 }
      )
    : { topicCount: 0, postCount: 0 }

  return (
    <div className="forum-index">
      {/* Page header */}
      <PageHeader
        title="Forum"
        subtitle="Discussions de la communauté"
        breadcrumbs={[{ label: 'Forum' }]}
        size="compact"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Stats bar */}
        {!categoriesLoading && categories && (
          <ForumStats
            topicCount={stats.topicCount}
            postCount={stats.postCount}
            className="mb-8"
          />
        )}

        {/* Action bar */}
        {user && (
          <div className="flex justify-end gap-3 mb-6">
            <Button
              variant="ghost"
              icon={<CheckIcon />}
              onClick={() => markAllAsRead({})}
              disabled={markingRead}
            >
              Tout marquer comme lu
            </Button>
            <Link to="/forum/nouveau-sujet">
              <Button variant="primary" icon={<NewTopicIcon />}>
                Nouveau sujet
              </Button>
            </Link>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Category list */}
          <div className="flex-1 min-w-0">
            <h2 className="font-heading text-xl text-skin-base mb-4">Catégories</h2>

            {categoriesLoading && (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            )}

            {categoriesError && (
              <Card variant="bordered" padding="md">
                <p className="font-body text-error text-center">
                  Impossible de charger les catégories. Veuillez réessayer.
                </p>
              </Card>
            )}

            {categories && (
              <div className="space-y-3">
                {categories.map((category) => (
                  <ForumCategoryCard key={category.id} category={category} />
                ))}
              </div>
            )}

            {categories && categories.length === 0 && (
              <Card variant="bordered" padding="md">
                <p className="font-body text-skin-muted text-center">
                  Aucune catégorie disponible.
                </p>
              </Card>
            )}
          </div>

          {/* Right: Recent topics sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <Card variant="bordered">
              <CardHeader>
                <h3 className="font-heading text-base text-skin-base">Sujets récents</h3>
              </CardHeader>
              <CardBody className="!p-0">
                {topicsLoading && (
                  <div className="flex justify-center py-8">
                    <Loader />
                  </div>
                )}

                {recentTopics && recentTopics.length > 0 && (
                  <div>
                    {recentTopics.map((topic) => (
                      <TopicRow key={topic.id} topic={topic} />
                    ))}
                  </div>
                )}

                {recentTopics && recentTopics.length === 0 && (
                  <p className="font-body text-sm text-skin-muted text-center py-6">
                    Aucun sujet pour le moment.
                  </p>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForumIndex
