import { forwardRef, useState, useRef } from 'react'
import './FileUpload.css'

/**
 * Upload icon - Arrow pointing up with tribal patterns
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
    {/* Arrow shaft with texture */}
    <path
      d="M24 36 L24 16"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    {/* Arrow head */}
    <path
      d="M14 22 L24 12 L34 22"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Tribal marks on shaft */}
    <path d="M20 28 L22 28" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <path d="M26 28 L28 28" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <path d="M20 32 L22 32" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    <path d="M26 32 L28 32" stroke="currentColor" strokeWidth="2" opacity="0.5" strokeLinecap="round" />
    {/* Ground/base line */}
    <path
      d="M12 40 L36 40"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="18" cy="40" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="24" cy="40" r="1" fill="currentColor" opacity="0.4" />
    <circle cx="30" cy="40" r="1" fill="currentColor" opacity="0.4" />
  </svg>
)

/**
 * File icon - Scroll/tablet representation
 */
const FileIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Tablet outline */}
    <path
      d="M5 2 L15 2 C15.5 2 16 2.5 16 3 L16 17 C16 17.5 15.5 18 15 18 L5 18 C4.5 18 4 17.5 4 17 L4 3 C4 2.5 4.5 2 5 2 Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Inscription lines */}
    <path d="M7 6 L13 6" stroke="currentColor" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
    <path d="M7 9 L13 9" stroke="currentColor" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
    <path d="M7 12 L11 12" stroke="currentColor" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
    {/* Corner marks */}
    <circle cx="6.5" cy="15.5" r="0.8" fill="currentColor" opacity="0.3" />
    <circle cx="13.5" cy="15.5" r="0.8" fill="currentColor" opacity="0.3" />
  </svg>
)

/**
 * Trash icon - Destruction symbol
 */
const TrashIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Container */}
    <path
      d="M3 5 L4 16 C4 16.5 4.5 17 5 17 L13 17 C13.5 17 14 16.5 14 16 L15 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Top lid */}
    <path d="M2 5 L16 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Handle */}
    <path d="M7 2 L11 2 C11.5 2 12 2.5 12 3 L12 5 L6 5 L6 3 C6 2.5 6.5 2 7 2 Z" stroke="currentColor" strokeWidth="1.5" />
    {/* Crack lines */}
    <path d="M7 8 L7 14" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    <path d="M9 8 L9 14" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    <path d="M11 8 L11 14" stroke="currentColor" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
  </svg>
)

/**
 * Warning icon for errors (from Input component)
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

const FileUpload = forwardRef(({
  accept,
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  onChange,
  value,
  disabled = false,
  label,
  hint,
  error,
  id,
  className = '',
  ...props
}, ref) => {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [localError, setLocalError] = useState(null)
  const fileUploadId = id || `file-upload-${Math.random().toString(36).slice(2, 9)}`

  const displayError = error || localError

  /**
   * Validate file against accept and maxSize constraints
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
        return 'Type de fichier non supporté'
      }
    }

    // Check file size
    if (maxSize && file.size > maxSize) {
      return `Fichier trop volumineux (max ${formatSize(maxSize)})`
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
   * Handle file removal
   */
  const handleRemove = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (inputRef.current) {
      inputRef.current.value = ''
    }
    setLocalError(null)
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
    <div className={`file-upload-wrapper ${className}`}>
      {label && (
        <label
          htmlFor={fileUploadId}
          className="block font-ui text-sm text-primary-700 mb-1.5 file-upload-label"
        >
          {label}
        </label>
      )}

      <div
        className={[
          'file-upload-dropzone',
          isDragging && 'file-upload-dropzone--dragging',
          displayError && 'file-upload-dropzone--error',
          disabled && 'file-upload-dropzone--disabled',
          value && 'file-upload-dropzone--has-file'
        ].filter(Boolean).join(' ')}
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
          id={fileUploadId}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
          aria-describedby={displayError ? `${fileUploadId}-error` : hint ? `${fileUploadId}-hint` : undefined}
          aria-invalid={!!displayError}
          {...props}
        />

        {!value ? (
          <div className="file-upload-empty">
            <UploadIcon />
            <p className="file-upload-text">
              Glisse ton fichier ici ou{' '}
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
              {accept && ` - ${accept}`}
            </span>
          </div>
        ) : (
          <div className="file-upload-preview">
            <FileIcon />
            <div className="file-upload-file-info">
              <span className="file-upload-file-name">{value.name}</span>
              <span className="file-upload-file-size">{formatSize(value.size)}</span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled}
              className="file-upload-remove-button"
              aria-label="Supprimer le fichier"
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>

      {displayError && (
        <p
          id={`${fileUploadId}-error`}
          className="mt-1.5 text-sm font-ui flex items-center gap-1.5 text-error"
        >
          <WarningIcon />
          {displayError}
        </p>
      )}
    </div>
  )
})

FileUpload.displayName = 'FileUpload'

export default FileUpload
export { FileUpload, UploadIcon, FileIcon, TrashIcon, formatSize }
