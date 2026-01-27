/**
 * ImageGallery - Galerie d'images avec lightbox
 * Grille responsive avec navigation et légendes
 */

import { useState, useEffect, useCallback, forwardRef } from 'react'
import PropTypes from 'prop-types'
import './ImageGallery.css'

/**
 * Icône de fermeture
 */
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 6 L18 18 M18 6 L6 18" strokeLinecap="round" />
  </svg>
)

/**
 * Icône flèche précédent
 */
const PrevIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 6 L9 12 L15 18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * Icône flèche suivant
 */
const NextIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 6 L15 12 L9 18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * Composant Lightbox
 */
const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  const currentImage = images[currentIndex]

  // Navigation clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Galerie d'images">
      {/* Bouton fermer */}
      <button
        className="lightbox__close"
        onClick={onClose}
        aria-label="Fermer la galerie"
      >
        <CloseIcon />
      </button>

      {/* Navigation précédent */}
      {images.length > 1 && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label="Image précédente"
        >
          <PrevIcon />
        </button>
      )}

      {/* Image principale */}
      <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
        <figure className="lightbox__figure">
          <img
            src={currentImage.src}
            alt={currentImage.alt || currentImage.caption || 'Image de galerie'}
            className="lightbox__image"
          />
          {currentImage.caption && (
            <figcaption className="lightbox__caption">
              {currentImage.caption}
            </figcaption>
          )}
        </figure>

        {/* Compteur */}
        {images.length > 1 && (
          <div className="lightbox__counter">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Navigation suivant */}
      {images.length > 1 && (
        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label="Image suivante"
        >
          <NextIcon />
        </button>
      )}
    </div>
  )
}

Lightbox.propTypes = {
  images: PropTypes.array.isRequired,
  currentIndex: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
}

/**
 * Composant ImageGallery principal
 */
const ImageGallery = forwardRef(({
  images = [],
  columns = 3,
  gap = 'md',
  aspectRatio = 'auto',
  showCaptions = false,
  className = '',
  ...props
}, ref) => {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = useCallback((index) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  if (images.length === 0) return null

  return (
    <>
      <div
        ref={ref}
        className={`
          image-gallery
          image-gallery--cols-${columns}
          image-gallery--gap-${gap}
          image-gallery--ratio-${aspectRatio}
          ${className}
        `}
        {...props}
      >
        {images.map((image, index) => (
          <figure
            key={image.id || index}
            className="image-gallery__item"
          >
            <button
              className="image-gallery__button"
              onClick={() => openLightbox(index)}
              aria-label={`Ouvrir ${image.alt || image.caption || `l'image ${index + 1}`}`}
            >
              <img
                src={image.thumbnail || image.src}
                alt={image.alt || image.caption || ''}
                className="image-gallery__image"
                loading="lazy"
              />
              <div className="image-gallery__overlay">
                <span className="image-gallery__zoom-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21 L16 16" strokeLinecap="round" />
                    <path d="M11 8 L11 14 M8 11 L14 11" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </button>
            {showCaptions && image.caption && (
              <figcaption className="image-gallery__caption">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onPrev={goToPrev}
          onNext={goToNext}
        />
      )}
    </>
  )
})

ImageGallery.displayName = 'ImageGallery'

ImageGallery.propTypes = {
  /** Liste des images */
  images: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    src: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    alt: PropTypes.string,
    caption: PropTypes.string
  })).isRequired,
  /** Nombre de colonnes (1-4) */
  columns: PropTypes.oneOf([1, 2, 3, 4]),
  /** Espacement entre les images */
  gap: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Ratio d'aspect des images */
  aspectRatio: PropTypes.oneOf(['auto', 'square', '4/3', '16/9', '3/2']),
  /** Afficher les légendes sous les images */
  showCaptions: PropTypes.bool,
  /** Classes CSS additionnelles */
  className: PropTypes.string
}

export default ImageGallery
