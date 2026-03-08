import { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal/Modal'
import Button from '@/components/ui/Button/Button'

// ============================================
// CONSTANTS
// ============================================

const DURATION_OPTIONS = [
  { label: '1h', hours: 1 },
  { label: '6h', hours: 6 },
  { label: '12h', hours: 12 },
  { label: '24h', hours: 24 },
  { label: '3j', hours: 72 },
  { label: '7j', hours: 168 },
  { label: '30j', hours: 720 },
  { label: '∞ Permanent', hours: 0, span: true },
]

// ============================================
// ICONS
// ============================================

const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

// ============================================
// MUTE MODAL
// ============================================

const MuteModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  user,
  loading = false,
}) => {
  const [reason, setReason] = useState('')
  const [durationHours, setDurationHours] = useState(null)

  useEffect(() => {
    if (!isOpen) {
      setReason('')
      setDurationHours(null)
    }
  }, [isOpen])

  const handleConfirm = () => {
    if (reason.trim().length >= 10 && durationHours !== null) {
      onConfirm?.({ reason: reason.trim(), durationHours })
    }
  }

  const isValid = reason.trim().length >= 10 && durationHours !== null

  const initials = (user?.username || '?').charAt(0).toUpperCase()

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader onClose={onClose}>Mettre en sourdine</ModalHeader>

      <ModalBody>
        <div className="space-y-5">
          {/* Target user */}
          {user && (
            <div className="flex items-center gap-3 p-4 bg-[#232930] rounded-md border-l-4 border-l-[#ff9635]">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username}
                  className="w-12 h-12 rounded-full border-2 border-[#e67315]/60 object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-[#e67315]/60 bg-[#1a2027] flex items-center justify-center text-[#8f99a5] font-subheading">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-[#8f99a5] text-xs">Utilisateur ciblé</p>
                <p className="text-[#d4c9ba] text-lg font-medium">{user.username}</p>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="block text-[#bba794] text-sm font-medium mb-2">
              Raison <span className="text-[#ff9635]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Décrivez la raison de la mise en sourdine (min. 10 caractères)..."
              rows={4}
              className={[
                'w-full bg-[#232930] border border-[#6b3212]/40 rounded-md p-3',
                'text-[#bba794] text-sm placeholder:text-[#64707e] resize-none',
                'focus:border-[#ff9635]/60 focus:ring-2 focus:ring-[#ff9635]/30',
                'focus:ring-offset-2 focus:ring-offset-[#1a2027] focus:outline-none',
              ].join(' ')}
            />
            <p className="text-[#8f99a5] text-xs text-right mt-1 tabular-nums">
              {reason.length} / 500
            </p>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[#bba794] text-sm font-medium mb-3">
              Durée <span className="text-[#ff9635]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DURATION_OPTIONS.map((opt) => (
                <button
                  key={opt.hours}
                  type="button"
                  onClick={() => setDurationHours(opt.hours)}
                  className={[
                    'px-3 py-2 rounded-md text-sm font-medium transition-all duration-150',
                    opt.span ? 'col-span-2' : '',
                    durationHours === opt.hours
                      ? 'bg-[#e67315]/20 border-2 border-[#ff9635] text-[#ff9635] shadow-[0_0_12px_rgba(255,150,53,0.3)]'
                      : 'bg-[#232930] border border-[#6b3212]/40 text-[#8f99a5] hover:border-[#ff9635]/60 hover:text-[#ff9635] cursor-pointer',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 rounded-md bg-[#e67315]/10 border border-[#e67315]/40 flex items-start gap-2 text-[#ff9635] text-sm">
            <IconInfo />
            <span>L'utilisateur ne pourra plus publier de messages ni créer de sujets pendant la durée du mute.</span>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            loading={loading}
            disabled={!isValid}
          >
            Confirmer le mute
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}

MuteModal.displayName = 'MuteModal'

export default MuteModal
export { MuteModal }
