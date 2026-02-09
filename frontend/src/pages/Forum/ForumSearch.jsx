import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '@/components/content/PageHeader'
import { TopicRow } from '@/components/forum'
import { Card, CardHeader, CardBody } from '@/components/ui/Card/Card'
import Button from '@/components/ui/Button/Button'
import Loader from '@/components/ui/Loader/Loader'
import { useForumCategories, useForumSearch } from '@/hooks/useForum'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const ForumSearch = () => {
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [page, setPage] = useState(1)

  const { data: categories } = useForumCategories()
  const { data: results, loading, error } = useForumSearch(
    { query: searchQuery, categoryId: categoryId || undefined, page },
    { enabled: searchQuery.length >= 2 }
  )

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim().length >= 2) {
      setSearchQuery(searchInput.trim())
      setPage(1)
    }
  }

  // Flatten categories for the select (parent + children)
  const allCategories = categories
    ? categories.reduce((acc, cat) => {
        acc.push(cat)
        if (cat.children) {
          acc.push(...cat.children)
        }
        return acc
      }, [])
    : []

  const hasResults =
    results && (results.topics?.items?.length > 0 || results.posts?.items?.length > 0)

  return (
    <div className="forum-search">
      <PageHeader
        title="Recherche"
        subtitle="Rechercher dans le forum"
        breadcrumbs={[
          { label: 'Forum', to: '/forum' },
          { label: 'Recherche' },
        ]}
        size="compact"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Search form */}
        <Card variant="bordered" className="mb-8">
          <CardBody>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Rechercher dans le forum..."
                className="flex-1 px-4 py-2 rounded-stone border border-neutral-300 bg-surface-base font-body text-skin-base placeholder:text-skin-muted focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent"
                minLength={2}
              />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="px-4 py-2 rounded-stone border border-neutral-300 bg-surface-base font-ui text-sm text-skin-base focus:outline-none focus:ring-2 focus:ring-secondary-400"
              >
                <option value="">Toutes les catégories</option>
                {allCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Button
                type="submit"
                variant="primary"
                icon={<SearchIcon />}
                disabled={searchInput.trim().length < 2}
              >
                Rechercher
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Empty state */}
        {!searchQuery && (
          <Card variant="bordered" padding="md">
            <p className="font-body text-skin-muted text-center py-8">
              Saisissez un terme de recherche (minimum 2 caractères).
            </p>
          </Card>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}

        {/* Error */}
        {error && (
          <Card variant="bordered" padding="md">
            <p className="font-body text-error text-center">
              Une erreur est survenue lors de la recherche.
            </p>
          </Card>
        )}

        {/* No results */}
        {searchQuery && !loading && !error && !hasResults && (
          <Card variant="bordered" padding="md">
            <p className="font-body text-skin-muted text-center py-8">
              Aucun résultat pour « {searchQuery} ».
            </p>
          </Card>
        )}

        {/* Results */}
        {!loading && hasResults && (
          <div className="space-y-8">
            {/* Topics results */}
            {results.topics?.items?.length > 0 && (
              <div>
                <h2 className="font-heading text-xl text-skin-base mb-4">
                  Sujets ({results.topics.total})
                </h2>
                <Card variant="bordered">
                  <CardBody className="!p-0">
                    {results.topics.items.map((topic) => (
                      <TopicRow key={topic.id} topic={topic} />
                    ))}
                  </CardBody>
                </Card>
              </div>
            )}

            {/* Posts results */}
            {results.posts?.items?.length > 0 && (
              <div>
                <h2 className="font-heading text-xl text-skin-base mb-4">
                  Messages ({results.posts.total})
                </h2>
                <div className="space-y-3">
                  {results.posts.items.map((post) => (
                    <Card key={post.id} variant="bordered" hover>
                      <CardBody>
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            {post.topic && (
                              <Link
                                to={`/forum/${post.topic.category?.slug || 'general'}/${post.topic.id}`}
                                className="font-heading text-sm text-secondary-600 hover:text-secondary-700 transition-colors duration-fast"
                              >
                                {post.topic.title}
                              </Link>
                            )}
                            <p className="font-body text-sm text-skin-secondary mt-1 line-clamp-3">
                              {post.content?.replace(/<[^>]*>/g, '').substring(0, 200)}
                              {post.content?.replace(/<[^>]*>/g, '').length > 200 ? '...' : ''}
                            </p>
                            <div className="font-ui text-xs text-skin-muted mt-2">
                              par {post.character?.name || post.author?.username} ·{' '}
                              {new Date(post.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ForumSearch
