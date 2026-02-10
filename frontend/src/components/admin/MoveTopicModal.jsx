import { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal/Modal'
import { Select } from '@/components/ui/Select/Select'
import Button from '@/components/ui/Button/Button'

// ============================================
// ICONS
// ============================================

const IconFolder = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
)

// ============================================
// MOVE TOPIC MODAL
// ============================================

const MoveTopicModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  topic,
  categories = [],
  loading = false,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setSelectedCategoryId('')
    }
  }, [isOpen])

  const handleConfirm = () => {
    const catId = Number(selectedCategoryId)
    if (catId && catId !== topic?.category?.id) {
      onConfirm?.(catId)
    }
  }

  // Filter out current category from destination options
  const availableCategories = categories
    .filter((cat) => cat.id !== topic?.category?.id)
    .map((cat) => ({ value: String(cat.id), label: cat.name }))

  const isValid = selectedCategoryId && Number(selectedCategoryId) !== topic?.category?.id

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader onClose={onClose}>Déplacer le sujet</ModalHeader>

      <ModalBody>
        <div className="space-y-5">
          {/* Topic info */}
          {topic && (
            <div className="p-4 bg-[#232930] rounded-md border-l-4 border-l-[#ff9635]">
              <p className="text-[#d4c9ba] text-base font-medium line-clamp-2">
                {topic.title}
              </p>
              {topic.author && (
                <p className="text-[#8f99a5] text-sm mt-1">
                  Par {topic.author.username}
                </p>
              )}
            </div>
          )}

          {/* Current category */}
          {topic?.category && (
            <div>
              <p className="text-[#64707e] text-xs uppercase tracking-wide mb-2">
                Catégorie actuelle
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#232930] border border-[#6b3212]/60 text-[#bba794] text-sm font-medium">
                <IconFolder />
                {topic.category.name}
              </div>
            </div>
          )}

          {/* Destination category */}
          <Select
            label="Nouvelle catégorie"
            placeholder="Sélectionner une catégorie..."
            options={availableCategories}
            value={selectedCategoryId}
            onChange={setSelectedCategoryId}
          />
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
            Déplacer le sujet
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}

MoveTopicModal.displayName = 'MoveTopicModal'

export default MoveTopicModal
export { MoveTopicModal }
