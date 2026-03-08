import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal/Modal'
import Button from '@/components/ui/Button/Button'

// ============================================
// ROLE CONFIG
// ============================================

const ROLES = [
  { value: 'ADMIN', label: 'Admin', description: "Accès complet au panel d'administration" },
  { value: 'MODERATOR', label: 'Modérateur', description: 'Modération des contenus et sanctions' },
  { value: 'GAME_MASTER', label: 'Maître de jeu', description: 'Gestion des personnages et du monde' },
  { value: 'PLAYER', label: 'Joueur', description: 'Accès standard au jeu' },
]

const ROLE_BADGE_CONFIG = {
  ADMIN: 'bg-[#944210]/20 text-[#ff9635] border-[#944210]/40',
  MODERATOR: 'bg-[#5b8fb9]/20 text-[#7ba5c9] border-[#5b8fb9]/40',
  GAME_MASTER: 'bg-[#8b6fa8]/20 text-[#a890c0] border-[#8b6fa8]/40',
  PLAYER: 'bg-[#64707e]/20 text-[#8f99a5] border-[#64707e]/40',
}

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
// ROLE CHANGE MODAL
// ============================================

const RoleChangeModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  user,
  loading = false,
}) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'PLAYER')

  const handleClose = () => {
    setSelectedRole(user?.role || 'PLAYER')
    onClose?.()
  }

  const handleConfirm = () => {
    if (selectedRole !== user?.role) {
      onConfirm?.(selectedRole)
    }
  }

  const isChanged = selectedRole !== user?.role

  const initials = (user?.username || '?').charAt(0).toUpperCase()
  const currentBadge = ROLE_BADGE_CONFIG[user?.role] || ROLE_BADGE_CONFIG.PLAYER
  const currentLabel = ROLES.find(r => r.value === user?.role)?.label || user?.role

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalHeader onClose={handleClose}>Modifier le rôle</ModalHeader>

      <ModalBody>
        <div className="space-y-5">
          {/* Target user + current role */}
          {user && (
            <div className="flex items-center gap-3 p-4 bg-[#232930] rounded-md border-l-4 border-l-[#ff9635]">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username}
                  className="w-12 h-12 rounded-full border-2 border-[#6b3212]/60 object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-[#6b3212]/60 bg-[#1a2027] flex items-center justify-center text-[#8f99a5] font-subheading">
                  {initials}
                </div>
              )}
              <div className="flex-1">
                <p className="text-[#d4c9ba] text-lg font-medium">{user.username}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[#64707e] text-xs">Rôle actuel :</span>
                  <span className={[
                    'inline-flex items-center px-2.5 py-0.5 rounded-md border',
                    'text-xs font-medium uppercase tracking-wide font-ui',
                    currentBadge,
                  ].join(' ')}>
                    {currentLabel}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Role selection */}
          <div>
            <label className="block text-[#bba794] text-sm font-medium mb-3">
              Nouveau rôle
            </label>
            <div className="space-y-2">
              {ROLES.map((role) => {
                const isSelected = selectedRole === role.value
                const isCurrent = user?.role === role.value

                return (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={[
                      'w-full px-4 py-3 rounded-md text-left transition-all duration-150',
                      isSelected
                        ? 'border-2 border-[#ff9635] bg-[#ff9635]/10 shadow-[0_0_12px_rgba(255,150,53,0.2)]'
                        : 'border-2 border-[#6b3212]/40 bg-[#232930] hover:border-[#ff9635]/60',
                    ].join(' ')}
                  >
                    <div className="flex items-center gap-3">
                      {/* Custom radio */}
                      <div className={[
                        'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                        isSelected
                          ? 'border-[#ff9635] bg-[#ff9635]'
                          : 'border-[#6b3212]/60 bg-transparent',
                      ].join(' ')}>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-[#1a2027]" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={[
                            'text-sm font-medium uppercase tracking-wide',
                            isSelected ? 'text-[#ff9635]' : 'text-[#bba794]',
                          ].join(' ')}>
                            {role.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[#64707e] text-xs">(actuel)</span>
                          )}
                        </div>
                        <p className="text-[#8f99a5] text-xs mt-1">{role.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Info banner */}
          <div className="p-3 rounded-md bg-[#5b8fb9]/10 border border-[#5b8fb9]/40 flex items-start gap-2 text-[#7ba5c9] text-sm">
            <IconInfo />
            <span>Le changement de rôle prend effet immédiatement.</span>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            loading={loading}
            disabled={!isChanged}
          >
            Confirmer le changement
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}

RoleChangeModal.displayName = 'RoleChangeModal'

export default RoleChangeModal
export { RoleChangeModal, ROLES, ROLE_BADGE_CONFIG }
