import { forwardRef, useState, useRef, useEffect } from 'react'
import './FileUpload.css'

/**
 * Edit icon - Pencil/inscription tool
 */
const EditIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Stylus/chisel */}
    <path
      d="M13 3 L17 7 L7 17 L3 17 L3 13 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Detail line */}
    <path d="M11 5 L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Tribal marks */}
    <circle cx="5" cy="15" r="0.8" fill="currentColor" opacity="0.4" />
    <circle cx="15" cy="5" r="0.8" fill="currentColor" opacity="0.4" />
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
 * Default avatar placeholder icon
 */
const DefaultAvatarIcon = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Head circle */}
    <circle
      cx="32"
      cy="24"
      r="10"
      stroke="currentColor"
      strokeWidth="2.5"
      fill="none"
    />
    {/* Body shoulders */}
    <path
      d="M16 48 C16 38 22 34 32 34 C42 34 48 38 48 48"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Tribal marks */}
    <circle cx="28" cy="23" r="1" fill="currentColor" opacity="0.5" />
    <circle cx="36" cy="23" r="1" fill="currentColor" opacity="0.5" />
    <path d="M30 28 L34 28" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
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

/**
 * Size configurations
 */
const SIZES = {
  sm: {
    dimension: 64,
    className: 'avatar-upload--sm'
  },
  md: {
    dimension: 96,
    className: 'avatar-upload--md'
  },
  lg: {
    dimension: 128,
    className: 'avatar-upload--lg'
  }
}

const AvatarUpload = forwardRef(({
  currentAvatar, // URL or File of current avatar
  onChange,
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  error,
  maxSize = 2 * 1024 * 1024, // 2MB par défaut
  id,
  className = '',
  ...props
}, ref) => {
  const inputRef = useRef(null)
  const [localError, setLocalError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const avatarUploadId = id || `avatar-upload-${Math.random().toString(36).slice(2, 9)}`

  const displayError = error || localError
  const sizeConfig = SIZES[size] || SIZES.md

  /**
   * Generate preview URL when currentAvatar changes
   */
  useEffect(() => {
    if (!currentAvatar) {
      setPreview(null)
      return
    }

    // If currentAvatar is already a URL string
    if (typeof currentAvatar === 'string') {
      setPreview(currentAvatar)
      return
    }

    // If currentAvatar is a File object
    if (currentAvatar instanceof File) {
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

      reader.readAsDataURL(currentAvatar)

      // Cleanup
      return () => {
        reader.abort()
      }
    }
  }, [currentAvatar])

  /**
   * Validate file
   */
  const validateFile = (file) => {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      return 'Seules les images sont acceptées'
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
   * Handle input change
   */
  const handleInputChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileChange(files[0])
    }
  }

  /**
   * Trigger file input click
   */
  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className={`avatar-upload-wrapper ${className}`}>
      <div
        className={[
          'avatar-upload',
          sizeConfig.className,
          displayError && 'avatar-upload--error',
          disabled && 'avatar-upload--disabled',
          isLoading && 'avatar-upload--loading'
        ].filter(Boolean).join(' ')}
        style={{
          width: `${sizeConfig.dimension}px`,
          height: `${sizeConfig.dimension}px`
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
          id={avatarUploadId}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
          aria-describedby={displayError ? `${avatarUploadId}-error` : undefined}
          aria-invalid={!!displayError}
          {...props}
        />

        <div className="avatar-upload-preview">
          {isLoading ? (
            <div className="avatar-upload-loading">
              <div className="avatar-upload-spinner" />
            </div>
          ) : preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="avatar-upload-img"
            />
          ) : (
            <div className="avatar-upload-placeholder">
              <DefaultAvatarIcon />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={[
            'avatar-upload-overlay',
            isHovered && 'avatar-upload-overlay--visible'
          ].filter(Boolean).join(' ')}
          aria-label="Modifier l'avatar"
        >
          <div className="avatar-upload-overlay-content">
            <EditIcon />
            <span className="avatar-upload-overlay-text">Modifier</span>
          </div>
        </button>
      </div>

      {displayError && (
        <p
          id={`${avatarUploadId}-error`}
          className="mt-1.5 text-sm font-ui flex items-center gap-1.5 text-error"
        >
          <WarningIcon />
          {displayError}
        </p>
      )}
    </div>
  )
})

AvatarUpload.displayName = 'AvatarUpload'

export default AvatarUpload
export { AvatarUpload, EditIcon, DefaultAvatarIcon }
