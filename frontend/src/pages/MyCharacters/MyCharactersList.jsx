import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, useMyCharacters, useSubmitCharacter, useDeleteCharacter, useSelectCharacter, useDeselectCharacter } from '@/hooks'

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'GAME_MASTER']
import { useToast, Loader, ScrollToTop } from '@/components'
import { CharacterCard } from '@/components/characters'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tous les personnages' },
  { value: 'draft', label: 'Brouillons' },
  { value: 'pending', label: 'En attente' },
  { value: 'approved', label: 'Approuvés' },
  { value: 'rejected', label: 'Rejetés' },
]

const MyCharactersList = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const { addToast } = useToast()
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const isStaff = STAFF_ROLES.includes(user?.role)
  const { data, loading, error, refetch } = useMyCharacters(user?.id, { includeUnowned: isStaff })
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
      setDeleteConfirm(null)
      refetch()
    },
    onError: (err) => {
      addToast({
        variant: 'error',
        title: 'Erreur',
        description: err.message || 'Impossible de supprimer le personnage.',
      })
      setDeleteConfirm(null)
    },
  })

  const { mutate: selectCharacterMutate, loading: selecting } = useSelectCharacter({
    onSuccess: (data) => {
      updateUser(data.user)
      addToast({
        variant: 'success',
        title: 'Personnage sélectionné',
        description: 'Ce personnage est maintenant votre personnage actif.',
      })
    },
    onError: (err) => {
      addToast({
        variant: 'error',
        title: 'Erreur',
        description: err.message || 'Impossible de sélectionner le personnage.',
      })
    },
  })

  const { mutate: deselectCharacterMutate, loading: deselecting } = useDeselectCharacter({
    onSuccess: (data) => {
      updateUser(data.user)
      addToast({
        variant: 'success',
        title: 'Personnage désélectionné',
        description: 'Aucun personnage actif.',
      })
    },
    onError: (err) => {
      addToast({
        variant: 'error',
        title: 'Erreur',
        description: err.message || 'Impossible de désélectionner le personnage.',
      })
    },
  })

  const dataCharacters = data?.characters

  // Filter characters based on status
  const filteredCharacters = useMemo(() => {
    if (!dataCharacters) return []
    if (statusFilter === 'all') return dataCharacters
    return dataCharacters.filter((char) => char.status === statusFilter)
  }, [dataCharacters, statusFilter])

  // Calculate status counts
  const statusCounts = useMemo(() => {
    if (!dataCharacters) return { approved: 0, draft: 0, pending: 0, rejected: 0 }
    return dataCharacters.reduce(
      (acc, char) => {
        acc[char.status] = (acc[char.status] || 0) + 1
        return acc
      },
      { approved: 0, draft: 0, pending: 0, rejected: 0 }
    )
  }, [dataCharacters])

  const handleView = (character) => {
    navigate(`/mes-personnages/${character.id}`)
  }

  const handleEdit = (character) => {
    navigate(`/mes-personnages/${character.id}/modifier`)
  }

  const handleSubmit = async (character) => {
    if (submitting) return
    submitCharacter(character.id)
  }

  const handleDelete = (character) => {
    setDeleteConfirm(character)
  }

  const handleSelect = (character) => {
    if (selecting || deselecting) return
    if (user?.selectedCharacterId === character.id) {
      deselectCharacterMutate()
    } else {
      selectCharacterMutate(character.id)
    }
  }

  const confirmDelete = () => {
    if (deleteConfirm && !deleting) {
      deleteCharacter(deleteConfirm.id)
    }
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
          <p className="font-body text-error/80">{error.message || 'Impossible de charger vos personnages.'}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-error text-white rounded-lg font-button hover:bg-error/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  const characters = data?.characters || []
  const hasCharacters = characters.length > 0

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-gradient-to-b from-surface to-primary-50">
        {/* Header Section */}
        <div className="bg-gradient-to-br from-primary-800 to-primary-900 text-primary-50 py-8 md:py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-3">
              Mes Personnages
            </h1>
            <p className="font-subheading text-lg sm:text-xl md:text-2xl text-primary-200 mb-6 md:mb-8">
              Atelier des Âmes Forgées
            </p>

            {/* Status Summary Pills */}
            {hasCharacters && (
              <div className="flex flex-wrap gap-3 md:gap-4">
                <div className="px-4 py-2 bg-success/20 border border-success/40 rounded-full">
                  <span className="font-ui text-sm md:text-base text-success-200">
                    <span className="font-semibold">{statusCounts.approved}</span> Approuvé{statusCounts.approved > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="px-4 py-2 bg-primary-700/50 border border-primary-500/40 rounded-full">
                  <span className="font-ui text-sm md:text-base text-primary-200">
                    <span className="font-semibold">{statusCounts.draft}</span> Brouillon{statusCounts.draft > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="px-4 py-2 bg-warning/20 border border-warning/40 rounded-full">
                  <span className="font-ui text-sm md:text-base text-warning-200">
                    <span className="font-semibold">{statusCounts.pending}</span> En attente
                  </span>
                </div>
                {statusCounts.rejected > 0 && (
                  <div className="px-4 py-2 bg-error/20 border border-error/40 rounded-full">
                    <span className="font-ui text-sm md:text-base text-error-200">
                      <span className="font-semibold">{statusCounts.rejected}</span> Rejeté{statusCounts.rejected > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Toolbar Section - Sticky */}
        <div className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b-2 border-primary-200 shadow-md">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              {/* CTA Button */}
              <button
                onClick={() => navigate('/mes-personnages/creer')}
                className="w-full sm:w-auto px-6 py-3 bg-secondary-500 text-primary-900 font-button text-base md:text-lg rounded-lg shadow-glow hover:bg-secondary-600 hover:shadow-glow-lg active:scale-95 transition-all"
              >
                + Forger une nouvelle âme
              </button>

              {/* Status Filter */}
              {hasCharacters && (
                <div className="w-full sm:w-auto">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-surface border-2 border-primary-400 rounded-lg font-body text-base cursor-pointer focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 transition-all"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {!hasCharacters ? (
            /* Empty State */
            <div className="max-w-2xl mx-auto text-center py-12 md:py-20">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
                <svg
                  className="w-12 h-12 md:w-16 md:h-16 text-primary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="font-display text-2xl md:text-3xl text-primary-900 mb-4">
                Aucune âme forgée
              </h2>
              <p className="font-body text-base md:text-lg text-primary-600 mb-8">
                Vous n'avez pas encore créé de personnage. Commencez votre aventure en forgeant votre première âme.
              </p>
              <button
                onClick={() => navigate('/mes-personnages/creer')}
                className="px-8 py-4 bg-secondary-500 text-primary-900 font-button text-lg rounded-lg shadow-glow hover:bg-secondary-600 hover:shadow-glow-lg active:scale-95 transition-all"
              >
                Créer mon premier personnage
              </button>
            </div>
          ) : filteredCharacters.length === 0 ? (
            /* No Results for Filter */
            <div className="max-w-2xl mx-auto text-center py-12">
              <p className="font-body text-lg text-primary-600">
                Aucun personnage ne correspond au filtre sélectionné.
              </p>
            </div>
          ) : (
            /* Character Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onView={handleView}
                  onEdit={handleEdit}
                  onSubmit={handleSubmit}
                  onDelete={handleDelete}
                  onSelect={handleSelect}
                  isSelected={user?.selectedCharacterId === character.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-surface rounded-lg shadow-2xl max-w-md w-full p-6 md:p-8">
              <h3 className="font-heading text-xl md:text-2xl text-primary-900 mb-4">
                Confirmer la suppression
              </h3>
              <p className="font-body text-base text-primary-700 mb-6">
                Êtes-vous sûr de vouloir supprimer <strong>{deleteConfirm.name}</strong> ? Cette action est irréversible.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  disabled={deleting}
                  className="px-6 py-3 bg-primary-200 text-primary-900 font-button rounded-lg hover:bg-primary-300 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
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

export default MyCharactersList
