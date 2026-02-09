import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input/Input'
import Select from '@/components/ui/Select/Select'
import RichTextEditor from '@/components/ui/RichTextEditor'
import Button from '@/components/ui/Button/Button'

const TopicForm = ({
  initialValues = {},
  categories = [],
  characters = [],
  isRpCategory = false,
  isStaff = false,
  isEditing = false,
  loading = false,
  errors = {},
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [title, setTitle] = useState(initialValues.title || '')
  const [categoryId, setCategoryId] = useState(initialValues.categoryId || '')
  const [content, setContent] = useState(initialValues.content || '')
  const [characterId, setCharacterId] = useState(initialValues.characterId || '')
  const [isPinned, setIsPinned] = useState(initialValues.isPinned || false)
  const [isLocked, setIsLocked] = useState(initialValues.isLocked || false)

  const [showCharacterSelect, setShowCharacterSelect] = useState(isRpCategory)

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const selectedCat = categories.find((c) => String(c.id) === String(categoryId))
      setShowCharacterSelect(selectedCat?.isRp || false)
    }
  }, [categoryId, categories])

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { title, categoryId, content }
    if (showCharacterSelect && characterId) {
      data.characterId = characterId
    }
    if (isStaff) {
      data.isPinned = isPinned
      data.isLocked = isLocked
    }
    onSubmit?.(data)
  }

  const categoryOptions = categories.map((c) => ({
    value: String(c.id),
    label: c.name,
  }))

  const characterOptions = characters.map((c) => ({
    value: String(c.id),
    label: c.name,
  }))

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Category selector (only for creation) */}
      {!isEditing && (
        <Select
          label="Catégorie"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categoryOptions}
          placeholder="Choisir une catégorie"
          error={errors.categoryId}
          required
        />
      )}

      {/* Title */}
      <Input
        label="Titre du sujet"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Entrez le titre de votre sujet"
        error={errors.title}
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
          error={errors.characterId}
          hint="Les catégories RP nécessitent un personnage"
        />
      )}

      {/* Content editor */}
      <RichTextEditor
        label="Message"
        content={content}
        onChange={setContent}
        placeholder="Écrivez votre message..."
        minHeight="250px"
        error={errors.content}
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
