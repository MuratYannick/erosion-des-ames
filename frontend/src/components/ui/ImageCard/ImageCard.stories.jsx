import ImageCard from './ImageCard'

/**
 * Documentation et exemples d'utilisation de ImageCard
 * Effets visuels pour l'univers post-apocalyptique d'Érosion des Âmes
 */

export default {
  title: 'Components/ImageCard',
  component: ImageCard,
  parameters: {
    docs: {
      description: {
        component: `
ImageCard est un conteneur pour images avec effets visuels post-apocalyptiques.
Inspiré de l'esthétique BD européenne (Bilal, Jodorowsky), il permet de créer
des ambiances de vestiges du passé, de souvenirs effacés, et de monde désolé.
        `
      }
    }
  }
}

// Image placeholder pour les exemples
const DEMO_IMAGE = 'https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&q=80'

/**
 * EXEMPLES DE BASE
 */

export const Default = () => (
  <div className="max-w-2xl">
    <ImageCard
      src={DEMO_IMAGE}
      alt="Ruines post-apocalyptiques"
      ratio="16/9"
    />
  </div>
)

export const WithCaption = () => (
  <div className="max-w-2xl">
    <ImageCard
      src={DEMO_IMAGE}
      alt="Vestiges de l'ancien monde"
      ratio="16/9"
      caption="Les vestiges de l'ancien monde témoignent de notre chute..."
      fx={['overlay', 'vignette']}
    />
  </div>
)

/**
 * EFFETS INDIVIDUELS
 */

export const HoverZoom = () => (
  <div className="grid grid-cols-2 gap-6 max-w-4xl">
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Sans hover-zoom</p>
      <ImageCard
        src={DEMO_IMAGE}
        alt="Image normale"
        ratio="4/3"
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Avec hover-zoom</p>
      <ImageCard
        src={DEMO_IMAGE}
        alt="Image avec zoom"
        ratio="4/3"
        fx={['hover-zoom']}
      />
    </div>
  </div>
)

export const Overlay = () => (
  <div className="grid grid-cols-3 gap-4">
    <div>
      <p className="font-ui text-xs text-neutral-600 mb-2">Dark</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="square"
        fx={['overlay']}
        overlayVariant="dark"
        caption="Overlay sombre"
      />
    </div>
    <div>
      <p className="font-ui text-xs text-neutral-600 mb-2">Fire</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="square"
        fx={['overlay']}
        overlayVariant="fire"
        caption="Feu sacré"
      />
    </div>
    <div>
      <p className="font-ui text-xs text-neutral-600 mb-2">Tribal</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="square"
        fx={['overlay']}
        overlayVariant="tribal"
        caption="Esprit tribal"
      />
    </div>
  </div>
)

export const Blur = () => (
  <div className="grid grid-cols-2 gap-6 max-w-4xl">
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Blur léger (survol pour révéler)</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="16/9"
        fx={['blur']}
        caption="Souvenirs brumeux"
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Blur intense</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="16/9"
        imageClassName="fx-blur-heavy"
        caption="Passé oublié"
      />
    </div>
  </div>
)

export const Grayscale = () => (
  <div className="grid grid-cols-2 gap-6 max-w-4xl">
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Grayscale total</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="4/3"
        fx={['grayscale']}
        caption="Monde sans vie"
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Grayscale partiel</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="4/3"
        imageClassName="fx-grayscale-partial"
        caption="Espoir fragile"
      />
    </div>
  </div>
)

export const Sepia = () => (
  <div className="grid grid-cols-2 gap-6 max-w-4xl">
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Sepia classique</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="4/3"
        fx={['sepia']}
        caption="Photographie ancienne"
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Sepia vieilli</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="4/3"
        imageClassName="fx-sepia-aged"
        caption="Relique du passé"
      />
    </div>
  </div>
)

export const Vignette = () => (
  <div className="grid grid-cols-2 gap-6 max-w-4xl">
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Vignette subtile</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="16/9"
        fx={['vignette']}
        caption="Focus central"
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Vignette intense</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="16/9"
        imageClassName="fx-vignette-heavy"
        caption="Tunnel visuel"
      />
    </div>
  </div>
)

export const TornEdges = () => (
  <div className="grid grid-cols-2 gap-6 max-w-4xl">
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Bords déchirés</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="4/3"
        fx={['torn-edges', 'sepia']}
        caption="Page arrachée"
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Bords très usés</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="4/3"
        imageClassName="fx-torn-edges-rough"
        fx={['sepia']}
        caption="Document endommagé"
      />
    </div>
  </div>
)

export const DustEffect = () => (
  <div className="max-w-2xl">
    <p className="font-ui text-sm text-neutral-600 mb-2">Texture poussiéreuse</p>
    <ImageCard
      src={DEMO_IMAGE}
      ratio="16/9"
      fx={['dust', 'sepia']}
      caption="Vestiges ensevelis dans le temps"
    />
  </div>
)

export const Contrast = () => (
  <div className="grid grid-cols-2 gap-6 max-w-4xl">
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Contraste accentué (style BD)</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="16/9"
        fx={['contrast']}
        caption="Esthétique comic"
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">High contrast</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="16/9"
        imageClassName="fx-contrast-high"
        caption="Noir et blanc puissant"
      />
    </div>
  </div>
)

/**
 * COMBINAISONS D'EFFETS
 */

export const CombinedEffects = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    <div>
      <p className="font-ui text-xs text-neutral-600 mb-2">Sepia + Vignette</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="square"
        fx={['sepia', 'vignette']}
        caption="Souvenir ancien"
      />
    </div>
    <div>
      <p className="font-ui text-xs text-neutral-600 mb-2">Grayscale + Overlay</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="square"
        fx={['grayscale', 'overlay', 'vignette']}
        overlayVariant="dark-heavy"
        caption="Monde désolé"
      />
    </div>
    <div>
      <p className="font-ui text-xs text-neutral-600 mb-2">Torn + Sepia + Dust</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="square"
        fx={['torn-edges', 'sepia', 'dust']}
        caption="Relique tribale"
      />
    </div>
    <div>
      <p className="font-ui text-xs text-neutral-600 mb-2">Hover-zoom + Contrast</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="square"
        fx={['hover-zoom', 'contrast']}
        caption="Dynamisme BD"
      />
    </div>
    <div>
      <p className="font-ui text-xs text-neutral-600 mb-2">Overlay Fire + Contrast</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="square"
        fx={['overlay', 'contrast']}
        overlayVariant="fire"
        caption="Feu sacré"
      />
    </div>
    <div>
      <p className="font-ui text-xs text-neutral-600 mb-2">Tous combinés</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="square"
        fx={['hover-zoom', 'overlay', 'sepia', 'vignette']}
        overlayVariant="tribal"
        caption="Maximum impact"
      />
    </div>
  </div>
)

/**
 * COMBOS PRÉDÉFINIS
 */

export const PresetCombos = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Combo: Souvenir</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="4/3"
        imageClassName="fx-combo-memory"
        caption="Souvenirs d'avant la chute"
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Combo: Désolation</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="4/3"
        imageClassName="fx-combo-desolate"
        caption="Le monde après la fin"
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Combo: Tribal</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="4/3"
        imageClassName="fx-combo-tribal"
        caption="Esprit des ancêtres"
      />
    </div>
  </div>
)

/**
 * RATIOS D'ASPECT
 */

export const AspectRatios = () => (
  <div className="space-y-6 max-w-4xl">
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Square (1/1)</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="square"
        fx={['hover-zoom', 'vignette']}
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">4/3 (classique)</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="4/3"
        fx={['hover-zoom', 'vignette']}
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">16/9 (cinéma)</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="16/9"
        fx={['hover-zoom', 'vignette']}
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">21/9 (ultra-wide)</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="21/9"
        fx={['hover-zoom', 'vignette']}
      />
    </div>
  </div>
)

/**
 * ANIMATIONS
 */

export const Animations = () => (
  <div className="grid grid-cols-2 gap-6 max-w-4xl">
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Emergence (rafraîchir pour voir)</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="4/3"
        imageClassName="fx-animate-emerge"
        caption="Révélation du passé"
      />
    </div>
    <div>
      <p className="font-ui text-sm text-neutral-600 mb-2">Note: Animation dissolution disponible</p>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="4/3"
        fx={['grayscale']}
        caption="Utilisez .fx-animate-dissolve pour disparition"
      />
    </div>
  </div>
)

/**
 * CAS D'USAGE RÉELS
 */

export const RealWorldUsage = () => (
  <div className="space-y-8 max-w-6xl">
    <div>
      <h3 className="font-heading text-xl text-neutral-800 mb-4">Galerie de profil tribal</h3>
      <div className="grid grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <ImageCard
            key={i}
            src={DEMO_IMAGE}
            ratio="square"
            fx={['hover-zoom', 'overlay', 'sepia']}
            overlayVariant="tribal"
            caption={`Membre ${i}`}
          />
        ))}
      </div>
    </div>

    <div>
      <h3 className="font-heading text-xl text-neutral-800 mb-4">Chroniques post-apocalyptiques</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageCard
          src={DEMO_IMAGE}
          ratio="16/9"
          fx={['torn-edges', 'sepia', 'dust', 'vignette']}
          caption="Jour 243 : Les ruines continuent de s'effriter..."
        />
        <ImageCard
          src={DEMO_IMAGE}
          ratio="16/9"
          fx={['torn-edges', 'sepia', 'dust', 'vignette']}
          caption="Jour 287 : Découverte d'un ancien sanctuaire..."
        />
      </div>
    </div>

    <div>
      <h3 className="font-heading text-xl text-neutral-800 mb-4">Bannière héroïque</h3>
      <ImageCard
        src={DEMO_IMAGE}
        ratio="21/9"
        fx={['hover-zoom', 'contrast', 'overlay', 'vignette']}
        overlayVariant="fire"
        caption="Le dernier bastion de l'humanité"
        className="max-w-full"
      />
    </div>
  </div>
)
