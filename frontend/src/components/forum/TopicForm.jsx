import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input/Input'
import Select from '@/components/ui/Select/Select'
import RichTextEditor from '@/components/ui/RichTextEditor'
import Button from '@/components/ui/Button/Button'

const TopicForm = ({
  initialValues = {},
  categoryName,
  isRpCategory = false,
  characters = [],
  isStaff = false,
  isEditing = false,
  loading = false,
  errors = {},
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [title, setTitle] = useState(initialValues.title || '')
  const [content, setContent] = useState(initialValues.content || '')
  const [characterId, setCharacterId] = useState(initialValues.characterId || '')
  const [isPinned, setIsPinned] = useState(initialValues.isPinned || false)
  const [isLocked, setIsLocked] = useState(initialValues.isLocked || false)
  const [localErrors, setLocalErrors] = useState({})

  const [showCharacterSelect, setShowCharacterSelect] = useState(isRpCategory)

  useEffect(() => {
    setShowCharacterSelect(isRpCategory)
  }, [isRpCategory])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Le titre est requis'
    } else if (title.trim().length < 3) {
      newErrors.title = 'Le titre doit contenir au moins 3 caractères'
    } else if (title.length > 200) {
      newErrors.title = 'Le titre ne doit pas dépasser 200 caractères'
    }
    if (!content || !content.trim() || content.trim() === '<p></p>') {
      newErrors.content = 'Le contenu est requis'
    }
    if (Object.keys(newErrors).length > 0) {
      setLocalErrors(newErrors)
      return
    }
    setLocalErrors({})
    const data = { title, content }
    if (showCharacterSelect && characterId) {
      data.characterId = characterId
    }
    if (isStaff) {
      data.isPinned = isPinned
      data.isLocked = isLocked
    }
    onSubmit?.(data)
  }

  // Fusionner les erreurs locales et serveur (les erreurs serveur ont la priorité)
  const mergedErrors = { ...localErrors, ...errors }

  const characterOptions = characters.map((c) => ({
    value: String(c.id),
    label: c.name,
  }))

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Category (read-only, only for creation) */}
      {!isEditing && categoryName && (
        <div>
          <label className="block font-ui text-sm text-primary-700 mb-1.5">
            Catégorie
          </label>
          <div className="px-3 py-2 bg-primary-50/50 border border-neutral-200 rounded-stone font-body text-sm text-skin-base">
            {categoryName}
          </div>
        </div>
      )}

      {/* Title */}
      <Input
        label="Titre du sujet"
        value={title}
        onChange={(e) => { setTitle(e.target.value); if (localErrors.title) setLocalErrors((prev) => ({ ...prev, title: '' })) }}
        placeholder="Entrez le titre de votre sujet"
        error={mergedErrors.title}
        maxLength={200}
        required
      />

      {/* Character selector for RP categories */}
      {showCharacterSelect && characters.length > 0 && (
        <Select
          label="Personnage"
          value={characterId}
          onChange={(e) => setCharacterId(e.target.value)}
          options={characterOptions}
          placeholder="Choisir un personnage"
          error={mergedErrors.characterId}
          hint="Les catégories RP nécessitent un personnage"
        />
      )}

      {/* Content editor */}
      <RichTextEditor
        label="Message"
        content={content}
        onChange={(val) => { setContent(val); if (localErrors.content) setLocalErrors((prev) => ({ ...prev, content: '' })) }}
        placeholder="Écrivez votre message..."
        minHeight="250px"
        error={mergedErrors.content}
      />

      {/* Staff options */}
      {isStaff && (
        <div className="flex items-center gap-4 p-3 bg-primary-50/50 border border-neutral-200 rounded-stone">
          <span className="font-ui text-sm text-skin-muted">Options staff :</span>
          <label className="inline-flex items-center gap-2 font-ui text-sm text-skin-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="rounded border-neutral-300"
            />
            Épingler
          </label>
          <label className="inline-flex items-center gap-2 font-ui text-sm text-skin-secondary cursor-pointer">
            <input
              type="checkbox"
              checked={isLocked}
              onChange={(e) => setIsLocked(e.target.checked)}
              className="rounded border-neutral-300"
            />
            Verrouiller
          </label>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {isEditing ? 'Enregistrer' : 'Créer le sujet'}
        </Button>
      </div>
    </form>
  )
}

TopicForm.displayName = 'TopicForm'
export default TopicForm
