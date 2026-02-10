import { useState } from 'react'

// ============================================
// INLINE ICONS
// ============================================

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
)

const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
    className="w-10 h-10 text-[#64707e]" aria-hidden="true">
    <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a6 6 0 0112 0v1" />
  </svg>
)

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-hidden="true">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
)

// ============================================
// HELPERS
// ============================================

function formatRelativeDate(isoString) {
  const now = new Date()
  const date = new Date(isoString)
  const diffMs = now - date
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 30) return `Il y a ${days} jours`
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ============================================
// CHARACTER APPROVAL CARD
// ============================================

const CharacterApprovalCard = ({
  character,
  onApprove,
  onReject,
  onView,
  loading = false,
  className = '',
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const handleRejectClick = () => {
    setShowRejectForm(true)
  }

  const handleConfirmReject = () => {
    if (rejectReason.trim()) {
      onReject?.(character.id, rejectReason.trim())
      setShowRejectForm(false)
      setRejectReason('')
    }
  }

  const handleCancelReject = () => {
    setShowRejectForm(false)
    setRejectReason('')
  }

  return (
    <div
      className={[
        'bg-[#1a2027] border border-[#6b3212]/40 rounded-lg p-6 space-y-4',
        'hover:border-[#6b3212]/70 hover:shadow-[0_6px_16px_rgba(0,0,0,0.5)]',
        'transition-all duration-200 motion-reduce:transition-none',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Header: Avatar + Name/Owner */}
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-[#232930] to-[#1a2027] border-2 border-[#6b3212]/60 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {character.avatar ? (
            <img
              src={character.avatar}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <IconUser />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[#d4c9ba] text-xl font-subheading truncate">
            {character.name}
          </h3>

          {character.user && (
            <p className="mt-1">
              <span className="text-[#64707e] text-xs">Créé par </span>
              <span className="text-[#8f99a5] text-sm">{character.user.username}</span>
            </p>
          )}

          {/* Submission date */}
          <div className="flex items-center gap-1.5 mt-2 text-[#8f99a5]">
            <IconClock />
            <span className="text-xs">{formatRelativeDate(character.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-3">
        {character.ethnicity && (
          <div>
            <p className="text-[#64707e] text-xs uppercase tracking-wide">Ethnie</p>
            <p className="text-[#bba794] text-sm font-medium mt-0.5">{character.ethnicity.name}</p>
          </div>
        )}
        {character.faction && (
          <div>
            <p className="text-[#64707e] text-xs uppercase tracking-wide">Faction</p>
            <p className="text-sm font-medium mt-0.5 flex items-center gap-1.5">
              {character.faction.color && (
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: character.faction.color }}
                />
              )}
              <span className="text-[#bba794]">{character.faction.name}</span>
            </p>
          </div>
        )}
      </div>

      {/* Background preview */}
      {character.background && (
        <div className="bg-[#232930] rounded-md p-4 border-l-4 border-l-[#6b3212]/60">
          <p className="text-[#64707e] text-xs uppercase tracking-wide mb-2">Historique</p>
          <p className="text-[#8f99a5] text-sm leading-relaxed line-clamp-3">
            {character.background}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-4 border-t border-[#6b3212]/30">
        <button
          type="button"
          onClick={() => onApprove?.(character.id)}
          disabled={loading}
          className={[
            'flex-1 px-4 py-2.5 rounded-md font-medium text-sm',
            'bg-[#6b9664]/20 border border-[#6b9664]/50 text-[#7fb076]',
            'hover:bg-[#6b9664]/30 hover:border-[#6b9664]/70',
            'hover:shadow-[0_0_12px_rgba(107,150,100,0.3)]',
            'transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none',
            'inline-flex items-center justify-center gap-2',
          ].join(' ')}
          aria-label={`Approuver ${character.name}`}
        >
          <IconCheck />
          Approuver
        </button>

        <button
          type="button"
          onClick={handleRejectClick}
          disabled={loading || showRejectForm}
          className={[
            'flex-1 px-4 py-2.5 rounded-md font-medium text-sm',
            'bg-[#a63f38]/20 border border-[#a63f38]/50 text-[#c95951]',
            'hover:bg-[#a63f38]/30 hover:border-[#a63f38]/70',
            'hover:shadow-[0_0_12px_rgba(166,63,56,0.3)]',
            'transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none',
            'inline-flex items-center justify-center gap-2',
          ].join(' ')}
          aria-label={`Rejeter ${character.name}`}
        >
          <IconX />
          Rejeter
        </button>

        <button
          type="button"
          onClick={() => onView?.(character.id)}
          disabled={loading}
          className={[
            'px-4 py-2.5 rounded-md font-medium text-sm',
            'bg-[#232930] border border-[#6b3212]/40 text-[#bba794]',
            'hover:border-[#ff9635]/60 hover:text-[#ff9635]',
            'hover:shadow-[0_0_8px_rgba(255,150,53,0.2)]',
            'transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none',
            'inline-flex items-center justify-center gap-2',
          ].join(' ')}
          aria-label={`Voir ${character.name}`}
        >
          <IconEye />
          Voir
        </button>
      </div>

      {/* Reject reason form (conditional) */}
      <div
        className={[
          'overflow-hidden transition-all duration-300 ease-in-out',
          showRejectForm ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0',
        ].join(' ')}
      >
        <div className="space-y-3 pt-2">
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Raison du rejet (obligatoire)..."
            rows={3}
            className={[
              'w-full bg-[#232930] border border-[#6b3212]/40 rounded-md p-3',
              'text-[#bba794] text-sm placeholder:text-[#64707e]',
              'focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/30',
              'focus:ring-offset-2 focus:ring-offset-[#1a2027] focus:outline-none',
              'resize-none',
            ].join(' ')}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancelReject}
              className="px-3 py-1.5 text-[#8f99a5] text-sm hover:text-[#d4c9ba] transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim() || loading}
              className={[
                'px-4 py-1.5 rounded-md text-sm font-medium',
                'bg-[#a63f38]/20 border border-[#a63f38]/50 text-[#c95951]',
                'hover:bg-[#a63f38]/30 transition-all duration-150',
                'disabled:opacity-50 disabled:pointer-events-none',
              ].join(' ')}
            >
              Confirmer le rejet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

CharacterApprovalCard.displayName = 'CharacterApprovalCard'

export default CharacterApprovalCard
export { CharacterApprovalCard }
