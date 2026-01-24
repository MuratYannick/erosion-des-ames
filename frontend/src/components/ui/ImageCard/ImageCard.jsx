import { forwardRef } from 'react'
import './ImageCard.css'

/**
 * ImageCard - Container pour images avec effets visuels post-apocalyptiques
 *
 * Effets disponibles (fx prop):
 * - hover-zoom: Zoom léger au survol (style BD dynamique)
 * - overlay: Overlay sombre/coloré sur l'image
 * - blur: Effet de flou léger (souvenirs brumeux)
 * - grayscale: Désaturation (monde désolé)
 * - sepia: Effet vieilli/ancien
 * - vignette: Assombrissement des bords
 * - torn-edges: Effet bords déchirés/usés
 * - dust: Texture poussiéreuse
 * - contrast: Contraste accentué (style BD)
 *
 * @example
 * <ImageCard
 *   src="image.jpg"
 *   fx={['hover-zoom', 'vignette', 'sepia']}
 *   ratio="16/9"
 *   caption="Ruines de l'ancien monde"
 * />
 */

// Ratios d'aspect prédéfinis
const aspectRatios = {
  'square': '1 / 1',
  '4/3': '4 / 3',
  '16/9': '16 / 9',
  '21/9': '21 / 9',
  '3/4': '3 / 4',
  '9/16': '9 / 16',
  'auto': 'auto'
}

// Variantes d'overlay
const overlayVariants = {
  dark: 'bg-gradient-to-t from-neutral-900/70 via-neutral-900/30 to-transparent',
  'dark-heavy': 'bg-neutral-900/60',
  fire: 'bg-gradient-to-t from-secondary-900/60 via-secondary-700/20 to-transparent',
  dust: 'bg-gradient-to-br from-primary-800/40 via-transparent to-primary-900/50',
  tribal: 'bg-gradient-to-t from-primary-900/70 via-transparent to-neutral-900/20'
}

const ImageCard = forwardRef(({
  src,
  alt = '',
  fx = [],
  ratio = '16/9',
  caption = null,
  overlayVariant = 'dark',
  className = '',
  imageClassName = '',
  captionClassName = '',
  loading = 'lazy',
  ...props
}, ref) => {
  // Construire les classes FX
  const fxClasses = fx.map(effect => `fx-${effect}`).join(' ')

  // Construire le style du ratio d'aspect
  const aspectRatioStyle = ratio !== 'auto'
    ? { aspectRatio: aspectRatios[ratio] || ratio }
    : {}

  // Overlay est-il activé?
  const hasOverlay = fx.includes('overlay')
  const overlayClass = hasOverlay
    ? overlayVariants[overlayVariant] || overlayVariants.dark
    : ''

  return (
    <div
      ref={ref}
      className={[
        'image-card',
        'relative overflow-hidden rounded-stone',
        'bg-neutral-800', // Fallback pendant le chargement
        className
      ].filter(Boolean).join(' ')}
      style={aspectRatioStyle}
      {...props}
    >
      {/* Image avec effets */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={[
          'image-card__img',
          'w-full h-full object-cover',
          fxClasses,
          imageClassName
        ].filter(Boolean).join(' ')}
      />

      {/* Overlay si demandé */}
      {hasOverlay && (
        <div
          className={[
            'image-card__overlay',
            'absolute inset-0 pointer-events-none',
            overlayClass
          ].filter(Boolean).join(' ')}
          aria-hidden="true"
        />
      )}

      {/* Caption si fournie */}
      {caption && (
        <div className="image-card__caption absolute bottom-0 left-0 right-0 p-4 z-10">
          <p className={[
            'font-ui text-sm text-neutral-50',
            'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]',
            captionClassName
          ].filter(Boolean).join(' ')}>
            {caption}
          </p>
        </div>
      )}
    </div>
  )
})

ImageCard.displayName = 'ImageCard'

export default ImageCard
export { ImageCard }
