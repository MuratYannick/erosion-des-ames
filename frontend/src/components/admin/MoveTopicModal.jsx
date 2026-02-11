import { useState, useMemo, useCallback } from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal/Modal'
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
// TREE UTILITIES
// ============================================

const buildTree = (flatCategories) => {
  const map = {}
  const roots = []
  flatCategories.forEach(cat => {
    map[cat.id] = { ...cat, children: [] }
  })
  flatCategories.forEach(cat => {
    if (cat.parentId && map[cat.parentId]) {
      map[cat.parentId].children.push(map[cat.id])
    } else {
      roots.push(map[cat.id])
    }
  })
  const sortChildren = (nodes) => {
    nodes.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    nodes.forEach(node => sortChildren(node.children))
  }
  sortChildren(roots)
  return roots
}

const flattenTreeForSelect = (tree, depth = 0) => {
  const result = []
  tree.forEach(node => {
    const prefix = depth > 0 ? '\u00A0\u00A0'.repeat(depth) + '\u2514 ' : ''
    result.push({ value: String(node.id), label: prefix + node.name })
    if (node.children?.length > 0) {
      result.push(...flattenTreeForSelect(node.children, depth + 1))
    }
  })
  return result
}

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

  const handleClose = useCallback(() => {
    setSelectedCategoryId('')
    onClose?.()
  }, [onClose])

  const handleConfirm = useCallback(() => {
    const catId = Number(selectedCategoryId)
    if (catId && catId !== topic?.category?.id) {
      onConfirm?.(catId)
    }
  }, [selectedCategoryId, topic?.category?.id, onConfirm])

  // Build indented tree options, filtering out current category
  const availableCategories = useMemo(() => {
    const filtered = categories.filter((cat) => cat.id !== topic?.category?.id)
    const tree = buildTree(filtered)
    return flattenTreeForSelect(tree)
  }, [categories, topic?.category?.id])

  const isValid = selectedCategoryId && Number(selectedCategoryId) !== topic?.category?.id

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm" className="!bg-[#1a2027] !border-[#6b3212]/60">
      <ModalHeader onClose={handleClose} className="!bg-[#1a2027] !border-b-[#6b3212]/40 [&_.modal-title]:!text-[#d4c9ba] [&_.modal-close]:!text-[#64707e] [&_.modal-close:hover]:!text-[#d4c9ba] [&_.modal-close:hover]:!bg-[#232930]">Déplacer le sujet</ModalHeader>

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
              <p className="text-[#8f99a5] text-xs uppercase tracking-wide mb-2">
                Catégorie actuelle
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#232930] border border-[#6b3212]/60 text-[#bba794] text-sm font-medium">
                <IconFolder />
                {topic.category.name}
              </div>
            </div>
          )}

          {/* Destination category */}
          <div>
            <label
              htmlFor="move-category-select"
              className="block text-[#8f99a5] text-xs uppercase tracking-wide mb-1.5"
            >
              Nouvelle catégorie
            </label>
            <select
              id="move-category-select"
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full bg-[#232930] border border-[#6b3212]/50 text-[#d4c9ba] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-[#ff9635] focus:ring-2 focus:ring-[#ff9635]/20 cursor-pointer"
            >
              <option value="" disabled className="text-[#64707e]">
                Sélectionner une catégorie...
              </option>
              {availableCategories.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </ModalBody>

      <ModalFooter className="!bg-[#1a2027] !border-t-[#6b3212]/40">
        <div className="flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={handleClose}>
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
