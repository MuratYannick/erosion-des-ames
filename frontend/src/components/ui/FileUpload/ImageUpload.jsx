import { forwardRef, useState, useRef, useEffect } from 'react'
import './FileUpload.css'

/**
 * Image icon - Frame/picture representation
 */
const ImageIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="file-upload-icon"
  >
    {/* Frame */}
    <rect
      x="8"
      y="8"
      width="32"
      height="32"
      rx="2"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
    />
    {/* Mountain/landscape */}
    <path
      d="M8 32 L16 22 L24 28 L32 18 L40 28 L40 40 L8 40 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      opacity="0.2"
    />
    {/* Sun/moon */}
    <circle
      cx="32"
      cy="16"
      r="4"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    {/* Tribal marks on frame */}
    <circle cx="12" cy="12" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="36" cy="12" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="12" cy="36" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="36" cy="36" r="1" fill="currentColor" opacity="0.4" />
  </svg>
)

/**
 * Upload icon (same as FileUpload)
 */
const UploadIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="file-upload-icon"
  >
    <path d="M24 36 L24 16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M14 22 L24 12 L34 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M20 28 L22 28" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <path d="M26 28 L28 28" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <path d="M20 32 L22 32" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <path d="M26 32 L28 32" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <path d="M12 40 L36 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="18" cy="40" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="24" cy="40" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="30" cy="40" r="1" fill="currentColor" opacity="0.4" />
  </svg>
)

/**
 * Trash icon (same as FileUpload)
 */
const TrashIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3 5 L4 16 C4 16.5 4.5 17 5 17 L13 17 C13.5 17 14 16.5 14 16 L15 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 5 L16 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 2 L11 2 C11.5 2 12 2.5 12 3 L12 5 L6 5 L6 3 C6 2.5 6.5 2 7 2 Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 8 L7 14" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    <path d="M9 8 L9 14" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    <path d="M11 8 L11 14" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
  </svg>
)

/**
 * Warning icon (from Input component)
 */
const WarningIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="input-error-icon"
  >
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M8 4.5 L8 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="11" r="0.75" fill="currentColor" />
    <path d="M5 4 L6.5 8 L5 12" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
  </svg>
)

/**
 * Format file size for display
 */
const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const ImageUpload = forwardRef(({
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  onChange,
  value,
  disabled = false,
  label,
  hint,
  error,
  aspectRatio, // ex: "16/9", "1/1", "4/3"
  recommendedDimensions, // ex: "1200x630px"
  id,
  className = '',
  ...props
}, ref) => {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const imageUploadId = id || `image-upload-${Math.random().toString(36).slice(2, 9)}`

  const displayError = error || localError

  /**
   * Generate preview URL when value changes
   */
  useEffect(() => {
    if (!value) {
      setPreview(null)
      return
    }

    // If value is already a URL string
    if (typeof value === 'string') {
      setPreview(value)
      return
    }

    // If value is a File object
    if (value instanceof File) {
      setIsLoading(true)
      const reader = new FileReader()

      reader.onloadend = () => {
        setPreview(reader.result)
        setIsLoading(false)
      }

      reader.onerror = () => {
        setLocalError('Erreur lors de la lecture du fichier')
        setIsLoading(false)
      }

      reader.readAsDataURL(value)

      // Cleanup
      return () => {
        reader.abort()
      }
    }
  }, [value])

  /**
   * Validate file
   */
  const validateFile = (file) => {
    // Check file type
    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim())
      const fileType = file.type
      const fileExtension = '.' + file.name.split('.').pop()

      const isValid = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension.toLowerCase() === type.toLowerCase()
        }
        if (type.endsWith('/*')) {
          const baseType = type.replace('/*', '')
          return fileType.startsWith(baseType)
        }
        return fileType === type
      })

      if (!isValid) {
        return 'Type d\'image non supporté'
      }
    }

    // Check file size
    if (maxSize && file.size > maxSize) {
      return `Image trop volumineuse (max ${formatSize(maxSize)})`
    }

    return null
  }

  /**
   * Handle file selection
   */
  const handleFileChange = (file) => {
    if (!file) return

    const validationError = validateFile(file)
    if (validationError) {
      setLocalError(validationError)
      return
    }

    setLocalError(null)
    if (onChange) {
      onChange(file)
    }
  }

  /**
   * Handle drag events
   */
  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleFileChange(files[0])
    }
  }

  /**
   * Handle input change
   */
  const handleInputChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileChange(files[0])
    }
  }

  /**
   * Handle image removal
   */
  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (inputRef.current) {
      inputRef.current.value = ''
    }
    setLocalError(null)
    setPreview(null)
    if (onChange) {
      onChange(null)
    }
  }

  /**
   * Trigger file input click
   */
  const handleBrowseClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click()
    }
  }

  const maxSizeMB = Math.round(maxSize / (1024 * 1024))

  return (
    <div className={`file-upload-wrapper image-upload-wrapper ${className}`}>
      {label && (
        <label
          htmlFor={imageUploadId}
          className="block font-ui text-sm text-primary-700 mb-1.5 file-upload-label"
        >
          {label}
        </label>
      )}

      <div
        className={[
          'file-upload-dropzone',
          'image-upload-dropzone',
          isDragging && 'file-upload-dropzone--dragging',
          displayError && 'file-upload-dropzone--error',
          disabled && 'file-upload-dropzone--disabled',
          preview && 'image-upload-dropzone--has-preview',
          isLoading && 'image-upload-dropzone--loading'
        ].filter(Boolean).join(' ')}
        style={aspectRatio ? { aspectRatio } : undefined}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={(node) => {
            inputRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          id={imageUploadId}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
          aria-describedby={displayError ? `${imageUploadId}-error` : hint ? `${imageUploadId}-hint` : undefined}
          aria-invalid={!!displayError}
          {...props}
        />

        {!preview ? (
          <div className="file-upload-empty">
            {isLoading ? (
              <div className="image-upload-loading">
                <div className="image-upload-spinner" />
                <p className="file-upload-text">Chargement...</p>
              </div>
            ) : (
              <>
                <ImageIcon />
                <p className="file-upload-text">
                  Glisse ton image ici ou{' '}
                  <button
                    type="button"
                    onClick={handleBrowseClick}
                    disabled={disabled}
                    className="file-upload-browse-button"
                  >
                    parcourir
                  </button>
                </p>
                <span className="file-upload-hint">
                  {hint || `Maximum ${maxSizeMB} Mo`}
                  {recommendedDimensions && ` - ${recommendedDimensions} recommandé`}
                </span>
              </>
            )}
          </div>
        ) : (
          <div className="image-upload-preview">
            <img
              src={preview}
              alt="Aperçu"
              className="image-upload-preview-img"
            />
            <div className="image-upload-overlay">
              <button
                type="button"
                onClick={handleBrowseClick}
                disabled={disabled}
                className="image-upload-change-button"
                aria-label="Changer l'image"
              >
                <UploadIcon />
                <span>Changer</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled}
                className="image-upload-remove-button"
                aria-label="Supprimer l'image"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <p
          id={`${imageUploadId}-error`}
          className="mt-1.5 text-sm font-ui flex items-center gap-1.5 text-error"
        >
          <WarningIcon />
          {displayError}
        </p>
      )}
    </div>
  )
})

ImageUpload.displayName = 'ImageUpload'

export default ImageUpload
export { ImageUpload, ImageIcon }
