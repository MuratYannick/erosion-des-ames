import { useState } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal/Modal'
import Button from '@/components/ui/Button/Button'
import Textarea from '@/components/ui/Textarea/Textarea'

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam', description: 'Contenu publicitaire ou non sollicité' },
  {
    value: 'offensive',
    label: 'Contenu offensant',
    description: 'Propos injurieux, discriminatoires ou inappropriés',
  },
  {
    value: 'off_topic',
    label: 'Hors-sujet',
    description: 'Message sans rapport avec le sujet',
  },
  { value: 'other', label: 'Autre', description: 'Raison non listée ci-dessus' },
]

const ReportModal = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reason) return
    onSubmit?.({ reason, description: description.trim() || undefined })
  }

  const handleClose = () => {
    setReason('')
    setDescription('')
    onClose?.()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <form onSubmit={handleSubmit}>
        <ModalHeader onClose={handleClose}>Signaler ce message</ModalHeader>

        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block font-ui text-sm font-medium text-skin-base mb-2">
                Motif du signalement
              </label>
              <div className="space-y-2">
                {REPORT_REASONS.map(({ value, label, description: desc }) => (
                  <label
                    key={value}
                    className={[
                      'flex items-start gap-3 p-3 rounded-stone border cursor-pointer',
                      'transition-colors duration-fast',
                      reason === value
                        ? 'border-secondary-400 bg-secondary-50/50'
                        : 'border-neutral-200 hover:border-neutral-300',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={value}
                      checked={reason === value}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-0.5 accent-secondary-500"
                    />
                    <div>
                      <div className="font-ui text-sm font-medium text-skin-base">{label}</div>
                      <div className="font-ui text-xs text-skin-muted">{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Textarea
              label="Description (optionnel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le problème en détail si nécessaire..."
              maxLength={500}
              rows={3}
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={loading} disabled={!reason}>
              Envoyer le signalement
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  )
}

ReportModal.displayName = 'ReportModal'
export default ReportModal
