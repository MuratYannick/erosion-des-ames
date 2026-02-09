import { Link } from 'react-router-dom'
import PageHeader from '@/components/content/PageHeader'
import { Card, CardBody } from '@/components/ui/Card/Card'
import Button from '@/components/ui/Button/Button'
import Loader from '@/components/ui/Loader/Loader'
import Badge from '@/components/ui/Badge/Badge'
import { usePendingReports, useReviewReport, useDeletePost } from '@/hooks/useForum'
import { useAuth } from '@/hooks/useAuth'

const REASON_LABELS = {
  spam: 'Spam',
  offensive: 'Offensant',
  off_topic: 'Hors-sujet',
  other: 'Autre',
}

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
)

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const ForumModeration = () => {
  const { user } = useAuth()
  const { data: reports, loading, error, refetch } = usePendingReports()
  const { mutate: reviewReport, loading: reviewing } = useReviewReport({
    onSuccess: () => refetch(),
  })
  const { mutate: deletePost, loading: deleting } = useDeletePost({
    onSuccess: () => refetch(),
  })

  const isStaff = user && ['ADMIN', 'MODERATOR'].includes(user.role)

  if (!isStaff) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="font-body text-skin-muted">
          Vous n'avez pas accès à cette page.
        </p>
      </div>
    )
  }

  const handleDismiss = async (reportId) => {
    await reviewReport({ id: reportId, data: { status: 'dismissed' } })
  }

  const handleDeletePost = async (report) => {
    await deletePost(report.post.id)
    await reviewReport({ id: report.id, data: { status: 'reviewed' } })
  }

  return (
    <div className="forum-moderation">
      <PageHeader
        title="Modération"
        subtitle="Gestion des signalements"
        breadcrumbs={[
          { label: 'Forum', to: '/forum' },
          { label: 'Modération' },
        ]}
        size="compact"
      />

      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        )}

        {error && (
          <Card variant="bordered" padding="md">
            <p className="font-body text-error text-center">
              Impossible de charger les signalements.
            </p>
          </Card>
        )}

        {reports && reports.items?.length === 0 && (
          <Card variant="bordered" padding="md">
            <p className="font-body text-skin-muted text-center py-8">
              Aucun signalement en attente.
            </p>
          </Card>
        )}

        {reports && reports.items?.length > 0 && (
          <div className="space-y-4">
            <p className="font-ui text-sm text-skin-muted">
              {reports.total} signalement{reports.total > 1 ? 's' : ''} en attente
            </p>

            {reports.items.map((report) => (
              <Card key={report.id} variant="bordered">
                <CardBody>
                  <div className="flex flex-col gap-3">
                    {/* Report header */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="warning" size="sm">
                        {REASON_LABELS[report.reason] || report.reason}
                      </Badge>
                      <span className="font-ui text-xs text-skin-muted">
                        Signalé par {report.reporter?.username} ·{' '}
                        {new Date(report.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Report description */}
                    {report.description && (
                      <p className="font-body text-sm text-skin-secondary italic">
                        « {report.description} »
                      </p>
                    )}

                    {/* Post excerpt */}
                    {report.post && (
                      <div className="bg-surface-sunken rounded-stone p-3 border border-neutral-200">
                        <p className="font-body text-sm text-skin-secondary line-clamp-3">
                          {report.post.content?.replace(/<[^>]*>/g, '').substring(0, 300)}
                          {report.post.content?.replace(/<[^>]*>/g, '').length > 300 ? '...' : ''}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<XIcon />}
                        onClick={() => handleDismiss(report.id)}
                        disabled={reviewing || deleting}
                      >
                        Rejeter
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<TrashIcon />}
                        onClick={() => handleDeletePost(report)}
                        disabled={reviewing || deleting}
                      >
                        Supprimer le post
                      </Button>
                      {report.post && (
                        <Link
                          to={`/forum/${report.post.topic?.category?.slug || 'general'}/${report.post.topicId}`}
                          className="font-ui text-xs text-secondary-600 hover:text-secondary-700 transition-colors duration-fast ml-auto"
                        >
                          Voir le sujet →
                        </Link>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ForumModeration
