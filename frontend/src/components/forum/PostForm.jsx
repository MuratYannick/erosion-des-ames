import { useState } from 'react'
import Select from '@/components/ui/Select/Select'
import RichTextEditor from '@/components/ui/RichTextEditor'
import Button from '@/components/ui/Button/Button'
import QuoteBlock from './QuoteBlock'

const PostForm = ({
  initialContent = '',
  characters = [],
  isRpTopic = false,
  isEditing = false,
  quotedPost = null,
  loading = false,
  errors = {},
  onSubmit,
  onCancel,
  onClearQuote,
  className = '',
}) => {
  const [content, setContent] = useState(initialContent)
  const [characterId, setCharacterId] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { content }
    if (isRpTopic && characterId) {
      data.characterId = characterId
    }
    if (quotedPost) {
      data.quotedPostId = quotedPost.id
    }
    onSubmit?.(data)
  }

  const characterOptions = characters.map((c) => ({
    value: String(c.id),
    label: c.name,
  }))

  return (
    <form onSubmit={handleSubmit} className={`space-y-3 ${className}`}>
      {/* Quote preview */}
      {quotedPost && (
        <div className="relative">
          <QuoteBlock author={quotedPost.author?.username} date={quotedPost.createdAt}>
            <div dangerouslySetInnerHTML={{ __html: quotedPost.content }} />
          </QuoteBlock>
          {onClearQuote && (
            <button
              type="button"
              onClick={onClearQuote}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-neutral-200 hover:bg-neutral-300 text-skin-muted hover:text-skin-base transition-colors duration-fast"
              aria-label="Retirer la citation"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 6L18 18M18 6L6 18" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Character selector for RP topics */}
      {isRpTopic && characters.length > 0 && (
        <Select
          label="Personnage"
          value={characterId}
          onChange={(e) => setCharacterId(e.target.value)}
          options={characterOptions}
          placeholder="Choisir un personnage"
          error={errors.characterId}
        />
      )}

      {/* Content editor */}
      <RichTextEditor
        label={isEditing ? 'Modifier le message' : 'Votre réponse'}
        content={content}
        onChange={setContent}
        placeholder="Écrivez votre message..."
        minHeight="180px"
        error={errors.content}
      />

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {isEditing ? 'Enregistrer' : 'Répondre'}
        </Button>
      </div>
    </form>
  )
}

PostForm.displayName = 'PostForm'
export default PostForm
