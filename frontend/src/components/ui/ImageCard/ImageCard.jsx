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
 * // Image simple
 * <ImageCard
 *   src="image.jpg"
 *   fx={['hover-zoom', 'vignette', 'sepia']}
 *   ratio="16/9"
 *   caption="Ruines de l'ancien monde"
 * />
 *
 * @example
 * // Image responsive avec sources par breakpoint
 * <ImageCard
 *   src="image-xs.png"
 *   sources={[
 *     { media: '(min-width: 1536px)', srcSet: 'image-2xl.png' },
 *     { media: '(min-width: 1280px)', srcSet: 'image-xl.png' },
 *     { media: '(min-width: 1024px)', srcSet: 'image-lg.png' },
 *     { media: '(min-width: 768px)', srcSet: 'image-md.png' },
 *     { media: '(min-width: 640px)', srcSet: 'image-sm.png' },
 *   ]}
 *   fx={['hover-zoom', 'overlay']}
 *   ratio="4/3"
 * />
 *
 * @example
 * // Utilisation avec preset
 * <ImageCard
 *   src="image.jpg"
 *   preset="tribal"
 *   ratio="4/3"
 * />
 *
 * @example
 * // Preset avec overrides
 * <ImageCard
 *   src="image.jpg"
 *   preset="tribal"
 *   fx={['hover-zoom', 'overlay', 'sepia', 'vignette']}
 *   ratio="4/3"
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

// Presets d'effets - Combinaisons prêtes à l'emploi
const PRESETS = {
  nostalgia: {
    fx: ['sepia', 'vignette', 'dust'],
    overlayVariant: 'dark',
    imageClassName: ''
  },
  desolation: {
    fx: ['grayscale', 'overlay', 'vignette'],
    overlayVariant: 'dark-heavy',
    imageClassName: ''
  },
  tribal: {
    fx: ['overlay', 'sepia', 'vignette'],
    overlayVariant: 'tribal',
    imageClassName: ''
  },
  comic: {
    fx: ['hover-zoom', 'contrast'],
    overlayVariant: 'dark',
    imageClassName: ''
  },
  worn: {
    fx: ['torn-edges', 'sepia', 'dust'],
    overlayVariant: 'dark',
    imageClassName: 'fx-sepia-aged'
  },
  mystery: {
    fx: ['blur', 'overlay'],
    overlayVariant: 'dust',
    imageClassName: ''
  },
  memory: {
    fx: [],
    overlayVariant: 'dark',
    imageClassName: 'fx-combo-memory'
  },
  desolate: {
    fx: [],
    overlayVariant: 'dark',
    imageClassName: 'fx-combo-desolate'
  },
  tribalCombo: {
    fx: [],
    overlayVariant: 'dark',
    imageClassName: 'fx-combo-tribal'
  }
}

const ImageCard = forwardRef(({
  src,
  alt = '',
  sources = [],
  fx = [],
  ratio = '16/9',
  caption = null,
  overlayVariant = 'dark',
  className = '',
  imageClassName = '',
  captionClassName = '',
  loading = 'lazy',
  preset = null,
  ...props
}, ref) => {
  // Appliquer le preset si fourni et merger avec les props manuelles
  let effectiveFx = fx
  let effectiveOverlayVariant = overlayVariant
  let effectiveImageClassName = imageClassName

  if (preset && PRESETS[preset]) {
    const presetConfig = PRESETS[preset]

    // Merger les effets: preset fx + manual fx (manual override/extend)
    // Si fx est fourni manuellement, on l'utilise tel quel (override complet)
    // Sinon on utilise les fx du preset
    effectiveFx = fx.length > 0 ? fx : presetConfig.fx

    // overlayVariant: manuel override preset
    effectiveOverlayVariant = overlayVariant !== 'dark' ? overlayVariant : presetConfig.overlayVariant

    // imageClassName: merger preset + manuel
    effectiveImageClassName = [presetConfig.imageClassName, imageClassName]
      .filter(Boolean)
      .join(' ')
  }

  // Construire les classes FX
  const fxClasses = effectiveFx.map(effect => `fx-${effect}`).join(' ')

  // Construire le style du ratio d'aspect
  const aspectRatioStyle = ratio !== 'auto'
    ? { aspectRatio: aspectRatios[ratio] || ratio }
    : {}

  // Overlay est-il activé?
  const hasOverlay = effectiveFx.includes('overlay')
  const overlayClass = hasOverlay
    ? overlayVariants[effectiveOverlayVariant] || overlayVariants.dark
    : ''

  // Classes communes pour l'image
  const imgClasses = [
    'image-card__img',
    'w-full h-full object-cover',
    fxClasses,
    effectiveImageClassName
  ].filter(Boolean).join(' ')

  // Rendre l'image (simple <img> ou <picture> avec sources)
  const renderImage = () => {
    const imgElement = (
      <img
        src={src}
        alt={alt}
        loading={loading}
        className={imgClasses}
      />
    )

    // Si pas de sources, retourner l'image simple
    if (!sources || sources.length === 0) {
      return imgElement
    }

    // Sinon, wrapper dans <picture> avec <source> elements
    return (
      <picture>
        {sources.map((source, index) => (
          <source
            key={index}
            media={source.media}
            srcSet={source.srcSet}
          />
        ))}
        {imgElement}
      </picture>
    )
  }

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
      {/* Image avec effets (simple ou responsive) */}
      {renderImage()}

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
export { ImageCard, PRESETS }
