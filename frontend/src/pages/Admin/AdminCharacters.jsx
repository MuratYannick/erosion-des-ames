import { useState, useCallback } from 'react'
import { useAdminCharacters, usePendingCharacters, useApproveCharacter, useRejectCharacter, useDeleteCharacter } from '@/hooks/useAdmin'
import { CharacterApprovalCard } from '@/components/admin'
import { Pagination } from '@/components/ui/Pagination/Pagination'

// ============================================
// CONSTANTS
// ============================================

const TABS = [
  { key: 'all', label: 'Tous' },
  { key: 'pending', label: 'En attente' },
  { key: 'approved', label: 'Approuvés' },
  { key: 'rejected', label: 'Rejetés' },
]

const STATUS_MAP = {
  all: undefined,
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
}

const STATUS_CONFIG = {
  draft:    { label: 'Brouillon',  color: '#8f99a5' },
  pending:  { label: 'En attente', color: '#ff9635' },
  approved: { label: 'Approuvé',   color: '#6b9664' },
  rejected: { label: 'Rejeté',     color: '#c95951' },
}

// ============================================
// INLINE SVG ICONS
// ============================================

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
)

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    className="w-8 h-8 text-[#64707e]" aria-hidden="true">
    <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0112 0v1" />
  </svg>
)

// ============================================
// HELPERS
// ============================================

function formatDate(isoString) {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

// ============================================
// SECTION HEADER
// ============================================

const SectionHeader = ({ title, color = '#ff9635' }) => (
  <div className="mb-1">
    <div className="flex items-center gap-3 mb-1">
      <div className="w-1 h-8 rounded-full" style={{ background: `linear-gradient(to bottom, ${color}, ${color}80)` }} />
      <h1 className="text-2xl lg:text-3xl font-subheading text-[#d4c9ba] uppercase tracking-wide">{title}</h1>
    </div>
  </div>
)

// ============================================
// CHARACTER TABLE ROW
// ============================================

const CharacterRow = ({ character, index, onDelete, deleteLoading }) => {
  const status = STATUS_CONFIG[character.status] || STATUS_CONFIG.draft

  return (
    <tr className={[
      index % 2 === 0 ? 'bg-[#1a2027]' : 'bg-[#1d2229]',
      'border-b border-[#6b3212]/20',
      'hover:bg-[#232930] transition-colors duration-150',
    ].join(' ')}>
      {/* Avatar + Name */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#232930] to-[#1a2027] border border-[#6b3212]/60 flex-shrink-0 overflow-hidden flex items-center justify-center">
            {character.avatar ? (
              <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <IconUser />
            )}
          </div>
          <span className="text-[#d4c9ba] text-sm font-medium">{character.name}</span>
        </div>
      </td>

      {/* Owner */}
      <td className="px-4 py-4 text-[#8f99a5] text-sm">
        {character.owner?.username || character.user?.username || '—'}
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: status.color }} />
          <span className="text-sm font-medium" style={{ color: status.color }}>{status.label}</span>
        </div>
      </td>

      {/* Ethnicity */}
      <td className="px-4 py-4 text-[#8f99a5] text-sm hidden lg:table-cell">
        {character.ethnicity?.name || '—'}
      </td>

      {/* Faction */}
      <td className="px-4 py-4 hidden lg:table-cell">
        {character.faction ? (
          <div className="flex items-center gap-1.5">
            {character.faction.color && (
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: character.faction.color }} />
            )}
            <span className="text-[#8f99a5] text-sm">{character.faction.name}</span>
          </div>
        ) : (
          <span className="text-[#64707e] text-sm">—</span>
        )}
      </td>

      {/* Date */}
      <td className="px-4 py-4 text-[#8f99a5] text-sm tabular-nums hidden md:table-cell">
        {formatDate(character.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex gap-1 justify-end">
          <button
            type="button"
            onClick={() => onDelete?.(character.id)}
            disabled={deleteLoading}
            className="p-2 rounded-md bg-[#232930] border border-[#6b3212]/40 text-[#c95951] hover:border-[#c95951]/60 hover:shadow-[0_0_8px_rgba(201,89,81,0.2)] transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none"
            aria-label={`Supprimer ${character.name}`}
            title="Supprimer"
          >
            <IconTrash />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ============================================
// CHARACTER MOBILE CARD (table view)
// ============================================

const CharacterMobileCard = ({ character, onDelete, deleteLoading }) => {
  const status = STATUS_CONFIG[character.status] || STATUS_CONFIG.draft

  return (
    <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#232930] to-[#1a2027] border border-[#6b3212]/60 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {character.avatar ? (
            <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
          ) : (
            <IconUser />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[#d4c9ba] text-sm font-medium truncate">{character.name}</p>
          <p className="text-[#8f99a5] text-xs">
            {character.owner?.username || character.user?.username || '—'}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }} />
          <span className="text-xs font-medium" style={{ color: status.color }}>{status.label}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#6b3212]/20">
        <div className="flex gap-3 text-xs text-[#64707e]">
          {character.ethnicity && <span>{character.ethnicity.name}</span>}
          {character.faction && (
            <span className="flex items-center gap-1">
              {character.faction.color && (
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: character.faction.color }} />
              )}
              {character.faction.name}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDelete?.(character.id)}
          disabled={deleteLoading}
          className="p-2 rounded-md bg-[#232930] border border-[#6b3212]/40 text-[#c95951] hover:border-[#c95951]/60 transition-all duration-150 disabled:opacity-40 disabled:pointer-events-none"
          aria-label={`Supprimer ${character.name}`}
        >
          <IconTrash />
        </button>
      </div>
    </div>
  )
}

// ============================================
// SKELETON
// ============================================

const TableSkeleton = () => (
  <div className="animate-pulse space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#232930] rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-[#232930] rounded" />
          <div className="h-3 w-20 bg-[#232930] rounded" />
        </div>
        <div className="h-4 w-16 bg-[#232930] rounded" />
      </div>
    ))}
  </div>
)

const CardsSkeleton = () => (
  <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-6 space-y-4">
        <div className="flex gap-4">
          <div className="w-20 h-20 bg-[#232930] rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-40 bg-[#232930] rounded" />
            <div className="h-4 w-24 bg-[#232930] rounded" />
            <div className="h-3 w-20 bg-[#232930] rounded" />
          </div>
        </div>
        <div className="h-16 bg-[#232930] rounded" />
        <div className="flex gap-3">
          <div className="h-10 flex-1 bg-[#232930] rounded" />
          <div className="h-10 flex-1 bg-[#232930] rounded" />
          <div className="h-10 w-16 bg-[#232930] rounded" />
        </div>
      </div>
    ))}
  </div>
)

// ============================================
// ERROR STATE
// ============================================

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-full bg-[#c95951]/20 flex items-center justify-center mb-4">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-[#c95951]" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <p className="text-[#d4c9ba] text-lg font-medium mb-2">Erreur de chargement</p>
    <p className="text-[#8f99a5] text-sm mb-6">{message || 'Impossible de charger les personnages.'}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="px-5 py-2 rounded-md text-sm font-medium bg-[#ff9635]/20 border border-[#ff9635]/50 text-[#ff9635] hover:bg-[#ff9635]/30 transition-colors"
      >
        Réessayer
      </button>
    )}
  </div>
)

// ============================================
// EMPTY STATE
// ============================================

const EmptyState = ({ tab }) => {
  const messages = {
    all: 'Aucun personnage trouvé',
    pending: 'Aucun personnage en attente de validation',
    approved: 'Aucun personnage approuvé',
    rejected: 'Aucun personnage rejeté',
  }

  return (
    <div className="py-12 text-center">
      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#6b9664]/20 flex items-center justify-center text-[#6b9664]">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      </div>
      <p className="text-[#8f99a5] text-sm">{messages[tab] || messages.all}</p>
    </div>
  )
}

// ============================================
// ADMIN CHARACTERS PAGE
// ============================================

const AdminCharacters = () => {
  const [activeTab, setActiveTab] = useState('pending')
  const [allPage, setAllPage] = useState(1)
  const [pendingPage, setPendingPage] = useState(1)

  // Query for "all" tab (also used for approved/rejected via status filter)
  const statusFilter = STATUS_MAP[activeTab]
  const { data: allData, loading: allLoading, error: allError, refetch: refetchAll } = useAdminCharacters(
    { page: allPage, limit: 20, ...(statusFilter && { status: statusFilter }) },
    { enabled: activeTab !== 'pending' }
  )

  // Query for "pending" tab (separate endpoint, sorted oldest first)
  const { data: pendingData, loading: pendingLoading, error: pendingError, refetch: refetchPending } = usePendingCharacters(
    { page: pendingPage, limit: 20 },
    { enabled: activeTab === 'pending' }
  )

  // Mutations
  const { mutate: approveCharacter, loading: approveLoading } = useApproveCharacter({
    onSuccess: () => { refetchPending(); refetchAll() },
  })
  const { mutate: rejectCharacter, loading: rejectLoading } = useRejectCharacter({
    onSuccess: () => { refetchPending(); refetchAll() },
  })
  const { mutate: deleteCharacter, loading: deleteLoading } = useDeleteCharacter({
    onSuccess: () => { refetchAll(); refetchPending() },
  })

  const handleApprove = useCallback((characterId) => {
    approveCharacter(characterId)
  }, [approveCharacter])

  const handleReject = useCallback((characterId, reason) => {
    rejectCharacter({ id: characterId, data: { rejectionReason: reason } })
  }, [rejectCharacter])

  const handleDelete = useCallback((characterId) => {
    deleteCharacter(characterId)
  }, [deleteCharacter])

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
    setAllPage(1)
    setPendingPage(1)
  }, [])

  // Current data based on tab
  const isPendingTab = activeTab === 'pending'
  const currentData = isPendingTab ? pendingData : allData
  const currentLoading = isPendingTab ? pendingLoading : allLoading
  const currentError = isPendingTab ? pendingError : allError
  const currentRefetch = isPendingTab ? refetchPending : refetchAll
  const currentPage = isPendingTab ? pendingPage : allPage
  const setCurrentPage = isPendingTab ? setPendingPage : setAllPage

  const items = currentData?.items || []
  const pagination = currentData ? {
    page: currentData.page || 1,
    totalPages: currentData.totalPages || 1,
    total: currentData.total || 0,
  } : null

  // Pending count for tab badge
  const pendingCount = pendingData?.total

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader title="Gestion des personnages" color="#6b9664" />

      {/* Tab bar */}
      <div className="bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-1 flex gap-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key
          const showBadge = tab.key === 'pending' && pendingCount > 0

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={[
                'px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-150 whitespace-nowrap',
                'flex items-center gap-2',
                isActive
                  ? 'bg-[#232930] text-[#ff9635] border border-[#ff9635]/40 shadow-[0_0_8px_rgba(255,150,53,0.15)]'
                  : 'text-[#8f99a5] hover:text-[#bba794] hover:bg-[#232930]/50 border border-transparent',
              ].join(' ')}
            >
              {tab.label}
              {showBadge && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#ff9635]/20 text-[#ff9635] border border-[#ff9635]/40">
                  {pendingCount > 99 ? '99+' : pendingCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Error state */}
      {currentError && (
        <ErrorState message={currentError.message} onRetry={currentRefetch} />
      )}

      {/* Content */}
      {!currentError && (
        <>
          {/* PENDING TAB — CharacterApprovalCard grid */}
          {isPendingTab && (
            <>
              {currentLoading ? (
                <CardsSkeleton />
              ) : items.length === 0 ? (
                <EmptyState tab="pending" />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {items.map((character) => (
                    <CharacterApprovalCard
                      key={character.id}
                      character={character}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onView={() => {}}
                      loading={approveLoading || rejectLoading}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ALL / APPROVED / REJECTED — Table view */}
          {!isPendingTab && (
            <>
              {currentLoading ? (
                <TableSkeleton />
              ) : items.length === 0 ? (
                <EmptyState tab={activeTab} />
              ) : (
                <>
                  {/* Mobile cards */}
                  <div className="md:hidden space-y-3">
                    {items.map((character) => (
                      <CharacterMobileCard
                        key={character.id}
                        character={character}
                        onDelete={handleDelete}
                        deleteLoading={deleteLoading}
                      />
                    ))}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden md:block bg-[#1a2027] border border-[#6b3212]/40 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#232930] border-b-2 border-[#6b3212]/60">
                            <th className="px-4 py-3 text-left text-[#d4c9ba] text-xs uppercase tracking-wider font-ui font-semibold">Personnage</th>
                            <th className="px-4 py-3 text-left text-[#d4c9ba] text-xs uppercase tracking-wider font-ui font-semibold">Propriétaire</th>
                            <th className="px-4 py-3 text-left text-[#d4c9ba] text-xs uppercase tracking-wider font-ui font-semibold">Statut</th>
                            <th className="px-4 py-3 text-left text-[#d4c9ba] text-xs uppercase tracking-wider font-ui font-semibold hidden lg:table-cell">Ethnie</th>
                            <th className="px-4 py-3 text-left text-[#d4c9ba] text-xs uppercase tracking-wider font-ui font-semibold hidden lg:table-cell">Faction</th>
                            <th className="px-4 py-3 text-left text-[#d4c9ba] text-xs uppercase tracking-wider font-ui font-semibold hidden md:table-cell">Création</th>
                            <th className="px-4 py-3 text-right text-[#d4c9ba] text-xs uppercase tracking-wider font-ui font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((character, index) => (
                            <CharacterRow
                              key={character.id}
                              character={character}
                              index={index}
                              onDelete={handleDelete}
                              deleteLoading={deleteLoading}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-1">
              <span className="text-[#8f99a5] text-sm font-ui">
                {pagination.total} personnage{pagination.total > 1 ? 's' : ''}
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
                showInfo
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

AdminCharacters.displayName = 'AdminCharacters'

export default AdminCharacters
export { AdminCharacters }
