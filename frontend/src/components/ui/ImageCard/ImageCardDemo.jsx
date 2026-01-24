import { useState } from 'react'
import ImageCard from './ImageCard'

/**
 * ImageCardDemo - Interface de test interactive pour ImageCard
 * Permet de tester toutes les combinaisons d'effets en temps réel
 *
 * Usage: Importez et affichez ce composant dans votre page de dev/test
 */

const DEMO_IMAGE = 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&q=80'

const AVAILABLE_FX = [
  { id: 'hover-zoom', label: 'Hover Zoom', description: 'Zoom au survol (1.08x)' },
  { id: 'overlay', label: 'Overlay', description: 'Overlay coloré' },
  { id: 'blur', label: 'Blur', description: 'Flou 2px' },
  { id: 'grayscale', label: 'Grayscale', description: 'Noir & blanc' },
  { id: 'sepia', label: 'Sepia', description: 'Effet vieilli' },
  { id: 'vignette', label: 'Vignette', description: 'Bords sombres' },
  { id: 'torn-edges', label: 'Torn Edges', description: 'Bords déchirés' },
  { id: 'dust', label: 'Dust', description: 'Texture poussiéreuse' },
  { id: 'contrast', label: 'Contrast', description: 'Contraste BD' }
]

const OVERLAY_VARIANTS = [
  { id: 'dark', label: 'Dark' },
  { id: 'dark-heavy', label: 'Dark Heavy' },
  { id: 'fire', label: 'Fire' },
  { id: 'dust', label: 'Dust' },
  { id: 'tribal', label: 'Tribal' }
]

const RATIOS = [
  { id: 'square', label: 'Square (1:1)' },
  { id: '4/3', label: '4:3' },
  { id: '16/9', label: '16:9' },
  { id: '21/9', label: '21:9' },
  { id: '3/4', label: '3:4' },
  { id: 'auto', label: 'Auto' }
]

const PRESETS = [
  {
    id: 'none',
    label: 'Aucun',
    fx: [],
    overlayVariant: 'dark',
    imageClassName: ''
  },
  {
    id: 'nostalgia',
    label: 'Nostalgie',
    fx: ['sepia', 'vignette', 'dust'],
    overlayVariant: 'dark',
    imageClassName: ''
  },
  {
    id: 'desolation',
    label: 'Désolation',
    fx: ['grayscale', 'overlay', 'vignette'],
    overlayVariant: 'dark-heavy',
    imageClassName: ''
  },
  {
    id: 'tribal',
    label: 'Tribal',
    fx: ['overlay', 'sepia', 'vignette'],
    overlayVariant: 'tribal',
    imageClassName: ''
  },
  {
    id: 'comic',
    label: 'BD Dynamique',
    fx: ['hover-zoom', 'contrast'],
    overlayVariant: 'dark',
    imageClassName: ''
  },
  {
    id: 'worn',
    label: 'Document usé',
    fx: ['torn-edges', 'sepia', 'dust'],
    overlayVariant: 'dark',
    imageClassName: 'fx-sepia-aged'
  },
  {
    id: 'mystery',
    label: 'Mystère',
    fx: ['blur', 'overlay'],
    overlayVariant: 'dust',
    imageClassName: ''
  },
  {
    id: 'combo-memory',
    label: 'Combo: Souvenir',
    fx: [],
    overlayVariant: 'dark',
    imageClassName: 'fx-combo-memory'
  },
  {
    id: 'combo-desolate',
    label: 'Combo: Désolé',
    fx: [],
    overlayVariant: 'dark',
    imageClassName: 'fx-combo-desolate'
  },
  {
    id: 'combo-tribal',
    label: 'Combo: Tribal',
    fx: [],
    overlayVariant: 'dark',
    imageClassName: 'fx-combo-tribal'
  }
]

export default function ImageCardDemo() {
  const [selectedFx, setSelectedFx] = useState([])
  const [overlayVariant, setOverlayVariant] = useState('dark')
  const [ratio, setRatio] = useState('16/9')
  const [caption, setCaption] = useState('')
  const [imageClassName, setImageClassName] = useState('')
  const [showCaption, setShowCaption] = useState(false)

  const toggleFx = (fxId) => {
    setSelectedFx(prev =>
      prev.includes(fxId)
        ? prev.filter(id => id !== fxId)
        : [...prev, fxId]
    )
  }

  const applyPreset = (preset) => {
    setSelectedFx(preset.fx)
    setOverlayVariant(preset.overlayVariant)
    setImageClassName(preset.imageClassName)
  }

  const resetAll = () => {
    setSelectedFx([])
    setOverlayVariant('dark')
    setRatio('16/9')
    setCaption('')
    setImageClassName('')
    setShowCaption(false)
  }

  const copyCode = () => {
    const fxArray = selectedFx.length > 0 ? `  fx={${JSON.stringify(selectedFx)}}` : ''
    const overlayLine = selectedFx.includes('overlay') ? `  overlayVariant="${overlayVariant}"` : ''
    const ratioLine = ratio !== '16/9' ? `  ratio="${ratio}"` : ''
    const captionLine = showCaption && caption ? `  caption="${caption}"` : ''
    const classLine = imageClassName ? `  imageClassName="${imageClassName}"` : ''

    const code = `<ImageCard
  src="image.jpg"
  alt="Description"${fxArray ? '\n' + fxArray : ''}${overlayLine ? '\n' + overlayLine : ''}${ratioLine ? '\n' + ratioLine : ''}${captionLine ? '\n' + captionLine : ''}${classLine ? '\n' + classLine : ''}
/>`

    navigator.clipboard.writeText(code)
    alert('Code copié dans le presse-papier!')
  }

  return (
    <div className="min-h-screen bg-neutral-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-neutral-900 mb-2">
            ImageCard - Testeur interactif
          </h1>
          <p className="font-ui text-neutral-600">
            Testez toutes les combinaisons d'effets en temps réel
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl text-neutral-800">Aperçu</h2>
                <button
                  onClick={copyCode}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md font-button hover:bg-primary-600 transition-colors"
                >
                  Copier le code
                </button>
              </div>
              <ImageCard
                src={DEMO_IMAGE}
                alt="Image de démonstration"
                fx={selectedFx}
                ratio={ratio}
                overlayVariant={overlayVariant}
                caption={showCaption ? caption : null}
                imageClassName={imageClassName}
              />
            </div>

            {/* Code généré */}
            <div className="bg-neutral-900 p-4 rounded-lg">
              <pre className="font-mono text-sm text-green-400 overflow-x-auto">
{`<ImageCard
  src="image.jpg"
  alt="Description"${selectedFx.length > 0 ? `\n  fx={${JSON.stringify(selectedFx)}}` : ''}${selectedFx.includes('overlay') ? `\n  overlayVariant="${overlayVariant}"` : ''}${ratio !== '16/9' ? `\n  ratio="${ratio}"` : ''}${showCaption && caption ? `\n  caption="${caption}"` : ''}${imageClassName ? `\n  imageClassName="${imageClassName}"` : ''}
/>`}
              </pre>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Presets */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-heading text-lg text-neutral-800 mb-3">
                Presets rapides
              </h3>
              <div className="space-y-2">
                {PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className="w-full px-3 py-2 text-left font-ui text-sm bg-neutral-100 hover:bg-primary-100 rounded-md transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Effets FX */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-heading text-lg text-neutral-800 mb-3">
                Effets (fx)
              </h3>
              <div className="space-y-2">
                {AVAILABLE_FX.map(fx => (
                  <label
                    key={fx.id}
                    className="flex items-start space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFx.includes(fx.id)}
                      onChange={() => toggleFx(fx.id)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-ui text-sm font-medium text-neutral-800">
                        {fx.label}
                      </div>
                      <div className="font-ui text-xs text-neutral-500">
                        {fx.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Overlay variant */}
            {selectedFx.includes('overlay') && (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="font-heading text-lg text-neutral-800 mb-3">
                  Variante d'overlay
                </h3>
                <div className="space-y-2">
                  {OVERLAY_VARIANTS.map(variant => (
                    <label
                      key={variant.id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded transition-colors"
                    >
                      <input
                        type="radio"
                        name="overlay-variant"
                        checked={overlayVariant === variant.id}
                        onChange={() => setOverlayVariant(variant.id)}
                      />
                      <span className="font-ui text-sm text-neutral-800">
                        {variant.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Ratio */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-heading text-lg text-neutral-800 mb-3">
                Ratio d'aspect
              </h3>
              <div className="space-y-2">
                {RATIOS.map(r => (
                  <label
                    key={r.id}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded transition-colors"
                  >
                    <input
                      type="radio"
                      name="ratio"
                      checked={ratio === r.id}
                      onChange={() => setRatio(r.id)}
                    />
                    <span className="font-ui text-sm text-neutral-800">
                      {r.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <label className="flex items-center space-x-2 mb-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCaption}
                  onChange={(e) => setShowCaption(e.target.checked)}
                />
                <h3 className="font-heading text-lg text-neutral-800">
                  Légende
                </h3>
              </label>
              {showCaption && (
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Texte de la légende..."
                  className="w-full px-3 py-2 border-2 border-neutral-300 rounded-md font-ui text-sm focus:border-primary-500 focus:outline-none"
                />
              )}
            </div>

            {/* Custom className */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="font-heading text-lg text-neutral-800 mb-3">
                Classes custom (imageClassName)
              </h3>
              <input
                type="text"
                value={imageClassName}
                onChange={(e) => setImageClassName(e.target.value)}
                placeholder="fx-sepia-aged, fx-combo-memory..."
                className="w-full px-3 py-2 border-2 border-neutral-300 rounded-md font-ui text-sm focus:border-primary-500 focus:outline-none"
              />
              <div className="mt-2 space-y-1">
                <p className="font-ui text-xs text-neutral-500">Exemples:</p>
                <button
                  onClick={() => setImageClassName('fx-sepia-aged')}
                  className="block font-mono text-xs text-primary-600 hover:underline"
                >
                  fx-sepia-aged
                </button>
                <button
                  onClick={() => setImageClassName('fx-combo-memory')}
                  className="block font-mono text-xs text-primary-600 hover:underline"
                >
                  fx-combo-memory
                </button>
                <button
                  onClick={() => setImageClassName('fx-contrast-high')}
                  className="block font-mono text-xs text-primary-600 hover:underline"
                >
                  fx-contrast-high
                </button>
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={resetAll}
              className="w-full px-4 py-2 bg-neutral-300 text-neutral-800 rounded-md font-button hover:bg-neutral-400 transition-colors"
            >
              Réinitialiser tout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
