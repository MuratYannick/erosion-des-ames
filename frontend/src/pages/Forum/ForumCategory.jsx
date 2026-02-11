import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PageHeader from '@/components/content/PageHeader'
import {
  ForumCategoryCard,
  ForumBreadcrumb,
  TopicRow,
  ForumPagination,
} from '@/components/forum'
import { Card, CardBody } from '@/components/ui/Card/Card'
import Button from '@/components/ui/Button/Button'
import Loader from '@/components/ui/Loader/Loader'
import { useForumCategory, useTopicsByCategory } from '@/hooks/useForum'
import { useAuth } from '@/hooks/useAuth'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus récents' },
  { value: 'popular', label: 'Plus populaires' },
  { value: 'lastReply', label: 'Dernière réponse' },
]

const NewTopicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const NewCategoryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
)

const ForumCategory = () => {
  const { categorySlug } = useParams()
  const { user, isAdmin } = useAuth()
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('recent')

  // Fetch category details
  const {
    data: categoryData,
    loading: categoryLoading,
    error: categoryError,
  } = useForumCategory(categorySlug)

  // Fetch topics for this category
  const {
    data: topicsData,
    loading: topicsLoading,
  } = useTopicsByCategory(categoryData?.id, { page, limit: 20, sort }, {
    enabled: !!categoryData?.id,
  })

  if (categoryLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    )
  }

  if (categoryError || !categoryData) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card variant="bordered" padding="md">
          <p className="font-body text-error text-center">
            Catégorie introuvable ou erreur de chargement.
          </p>
        </Card>
      </div>
    )
  }

  const category = categoryData
  const topics = topicsData?.topics || topicsData || []
  const totalPages = topicsData?.totalPages || 1
  const totalItems = topicsData?.total || topics.length

  return (
    <div className="forum-category">
      {/* Page header */}
      <PageHeader
        title={category.name}
        subtitle={category.description}
        breadcrumbs={[
          { label: 'Forum', href: '/forum' },
          { label: category.name },
        ]}
        size="compact"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Sub-categories */}
        {category.children && category.children.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading text-lg text-skin-base mb-3">Sous-catégories</h2>
            <div className="space-y-3">
              {category.children.map((sub) => (
                <ForumCategoryCard key={sub.id} category={sub} />
              ))}
            </div>
          </div>
        )}

        {/* Topics section */}
        <div>
          {/* Toolbar: sort + new topic */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="font-heading text-lg text-skin-base">Sujets</h2>
            <div className="flex items-center gap-3">
              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span className="font-ui text-xs text-skin-muted">Trier :</span>
                <div className="flex gap-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setSort(opt.value); setPage(1) }}
                      className={[
                        'px-2 py-1 rounded-md font-ui text-xs transition-colors duration-fast',
                        sort === opt.value
                          ? 'bg-primary text-white'
                          : 'text-skin-muted hover:text-skin-base hover:bg-primary-50',
                      ].join(' ')}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* New sub-category button (admin only) */}
              {isAdmin && (
                <Link to={`/admin/forum?parentId=${category.id}`}>
                  <Button variant="ghost" size="sm" icon={<NewCategoryIcon />}>
                    Nouvelle sous-catégorie
                  </Button>
                </Link>
              )}

              {/* New topic button */}
              {user && (
                <Link to={`/forum/${categorySlug}/nouveau-sujet`}>
                  <Button variant="primary" size="sm" icon={<NewTopicIcon />}>
                    Nouveau sujet
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Topics list */}
          {topicsLoading && (
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          )}

          {!topicsLoading && topics.length > 0 && (
            <Card variant="bordered">
              <CardBody className="!p-0">
                {topics.map((topic) => (
                  <TopicRow key={topic.id} topic={topic} categorySlug={categorySlug} />
                ))}
              </CardBody>
            </Card>
          )}

          {!topicsLoading && topics.length === 0 && (
            <Card variant="bordered" padding="md">
              <p className="font-body text-skin-muted text-center py-6">
                Aucun sujet dans cette catégorie.
                {user && ' Soyez le premier à en créer un !'}
              </p>
            </Card>
          )}

          {/* Pagination */}
          <ForumPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={totalItems}
            itemLabel="sujets"
            className="mt-6"
          />
        </div>
      </div>
    </div>
  )
}

export default ForumCategory
