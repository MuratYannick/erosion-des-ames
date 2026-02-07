import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCharacter, useSubmitCharacter, useDeleteCharacter } from '@/hooks'
import { useToast, Loader, ScrollToTop } from '@/components'
import { CharacterAvatar, CharacterStatusBadge, CharacterSheet } from '@/components/characters'

const STATUS_BANNER_CONFIG = {
  draft: {
    bg: 'bg-primary-100 border-primary-300',
    text: 'text-primary-800',
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    message: 'Ce personnage est en brouillon. Continuez à le développer et soumettez-le pour validation quand vous serez prêt.',
  },
  pending: {
    bg: 'bg-warning/10 border-warning shadow-glow',
    text: 'text-warning-900',
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    message: 'En cours de validation par les Gardiens. Vous serez notifié dès que votre personnage sera examiné.',
  },
  approved: {
    bg: 'bg-success/10 border-success',
    text: 'text-success-900',
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    message: 'Votre âme a été validée. Bienvenue parmi les Marqués.',
  },
  rejected: {
    bg: 'bg-error/10 border-error',
    text: 'text-error-900',
    icon: (
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    message: 'Votre personnage a été refusé par les Gardiens.',
  },
}

const MyCharacterDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const { data, loading, error, refetch } = useCharacter(id)
  const { mutate: submitCharacter, loading: submitting } = useSubmitCharacter({
    onSuccess: () => {
      addToast({
        variant: 'success',
        title: 'Personnage soumis',
        description: 'Votre personnage a été soumis pour validation.',
      })
      refetch()
    },
    onError: (err) => {
      addToast({
        variant: 'error',
        title: 'Erreur',
        description: err.message || 'Impossible de soumettre le personnage.',
      })
    },
  })

  const { mutate: deleteCharacter, loading: deleting } = useDeleteCharacter({
    onSuccess: () => {
      addToast({
        variant: 'success',
        title: 'Personnage supprimé',
        description: 'Le personnage a été supprimé avec succès.',
      })
      navigate('/mes-personnages')
    },
    onError: (err) => {
      addToast({
        variant: 'error',
        title: 'Erreur',
        description: err.message || 'Impossible de supprimer le personnage.',
      })
      setShowDeleteConfirm(false)
    },
  })

  const handleSubmit = () => {
    if (submitting) return
    submitCharacter(id)
  }

  const handleDelete = () => {
    if (deleting) return
    deleteCharacter(id)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-error/10 border-2 border-error rounded-lg p-6">
          <h2 className="font-heading text-xl text-error mb-2">Erreur de chargement</h2>
          <p className="font-body text-error/80">{error.message || 'Impossible de charger le personnage.'}</p>
          <button
            onClick={() => navigate('/mes-personnages')}
            className="mt-4 px-4 py-2 bg-error text-white rounded-lg font-button hover:bg-error/90 transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    )
  }

  if (!data?.character) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
            <svg className="w-12 h-12 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="font-display text-2xl text-primary-900 mb-4">Personnage introuvable</h2>
          <p className="font-body text-primary-600 mb-6">
            Le personnage que vous recherchez n'existe pas ou vous n'avez pas accès à celui-ci.
          </p>
          <button
            onClick={() => navigate('/mes-personnages')}
            className="px-6 py-3 bg-secondary-500 text-primary-900 font-button rounded-lg shadow-glow hover:bg-secondary-600 transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    )
  }

  const character = data.character
  const statusConfig = STATUS_BANNER_CONFIG[character.status]
  const canEdit = character.status === 'draft' || character.status === 'rejected'
  const canSubmit = character.status === 'draft' || character.status === 'rejected'

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-b from-surface to-primary-50">
        {/* Status Banner */}
        {statusConfig && (
          <div className={`border-b-2 ${statusConfig.bg}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
              <div className="flex items-start gap-3 md:gap-4">
                <div className={`flex-shrink-0 ${statusConfig.text}`}>
                  {statusConfig.icon}
                </div>
                <div className="flex-1">
                  <p className={`font-body text-sm md:text-base ${statusConfig.text}`}>
                    {statusConfig.message}
                  </p>
                  {character.status === 'rejected' && character.rejectionReason && (
                    <div className="mt-3 p-3 md:p-4 bg-surface/50 border border-error/30 rounded-lg">
                      <p className="font-ui text-xs md:text-sm text-error-800 font-semibold mb-1">
                        Raison du refus :
                      </p>
                      <p className="font-body text-sm md:text-base text-error-700">
                        {character.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Character Header */}
        <div className="bg-gradient-to-br from-primary-800 to-primary-900 text-primary-50 py-8 md:py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <CharacterAvatar
                  src={character.avatar}
                  name={character.name}
                  factionColor={character.faction?.primaryColor}
                  size="xl"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl">
                    {character.name}
                  </h1>
                  <CharacterStatusBadge status={character.status} size="lg" showLabel />
                </div>

                <div className="font-body text-base md:text-lg text-primary-200 space-y-1">
                  {character.age && (
                    <p>{character.age} ans</p>
                  )}
                  {character.ethnicity && (
                    <p>{character.ethnicity.name}</p>
                  )}
                  {character.faction && character.clan && (
                    <p>{character.faction.name} → {character.clan.name}</p>
                  )}
                  {character.faction && !character.clan && (
                    <p>{character.faction.name}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-surface border-b-2 border-primary-200 shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/mes-personnages')}
                className="px-4 py-2 bg-primary-200 text-primary-900 font-button text-sm md:text-base rounded-lg hover:bg-primary-300 transition-colors"
              >
                ← Retour à la liste
              </button>

              {canEdit && (
                <button
                  onClick={() => navigate(`/mes-personnages/${id}/modifier`)}
                  className="px-4 py-2 bg-secondary-500 text-primary-900 font-button text-sm md:text-base rounded-lg shadow-glow hover:bg-secondary-600 transition-colors"
                >
                  Éditer
                </button>
              )}

              {canSubmit && (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-success text-white font-button text-sm md:text-base rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Soumission...' : 'Soumettre pour validation'}
                </button>
              )}

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-error/10 text-error border border-error font-button text-sm md:text-base rounded-lg hover:bg-error hover:text-white transition-colors ml-auto"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>

        {/* Character Sheet */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <CharacterSheet character={character} />
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-surface rounded-lg shadow-2xl max-w-md w-full p-6 md:p-8">
              <h3 className="font-heading text-xl md:text-2xl text-primary-900 mb-4">
                Confirmer la suppression
              </h3>
              <p className="font-body text-base text-primary-700 mb-6">
                Êtes-vous sûr de vouloir supprimer <strong>{character.name}</strong> ? Cette action est irréversible.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-6 py-3 bg-primary-200 text-primary-900 font-button rounded-lg hover:bg-primary-300 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-6 py-3 bg-error text-white font-button rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default MyCharacterDetail
