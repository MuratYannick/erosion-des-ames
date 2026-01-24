# ImageCard - Composant d'images avec effets post-apocalyptiques

Conteneur pour images avec effets visuels inspirés de l'univers post-apocalyptique et du style BD européenne (Bilal, Jodorowsky, Métal Hurlant).

## Installation

```jsx
import { ImageCard } from '@/components/ui/ImageCard'
```

## Usage de base

```jsx
<ImageCard
  src="image.jpg"
  alt="Description de l'image"
  ratio="16/9"
/>
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `src` | string | required | URL de l'image |
| `alt` | string | '' | Texte alternatif pour accessibilité |
| `fx` | array | [] | Liste des effets à appliquer |
| `ratio` | string | '16/9' | Ratio d'aspect ('square', '4/3', '16/9', '21/9', '3/4', '9/16', 'auto') |
| `caption` | string | null | Légende affichée en bas de l'image |
| `overlayVariant` | string | 'dark' | Variante de l'overlay ('dark', 'dark-heavy', 'fire', 'dust', 'tribal') |
| `loading` | string | 'lazy' | Stratégie de chargement ('lazy', 'eager') |
| `className` | string | '' | Classes additionnelles pour le container |
| `imageClassName` | string | '' | Classes additionnelles pour l'image |
| `captionClassName` | string | '' | Classes additionnelles pour la légende |

## Effets disponibles (fx)

### Effets de base

#### 1. `hover-zoom`
Zoom léger au survol (1.08x) - dynamisme BD européenne
```jsx
<ImageCard fx={['hover-zoom']} />
```

#### 2. `overlay`
Overlay sombre/coloré sur l'image
```jsx
<ImageCard
  fx={['overlay']}
  overlayVariant="tribal"
/>
```

**Variantes d'overlay:**
- `dark` - Dégradé sombre du bas vers le haut (défaut)
- `dark-heavy` - Overlay noir uniforme 60% opacité
- `fire` - Dégradé orangé (feu sacré)
- `dust` - Dégradé terre et poussière
- `tribal` - Dégradé terre/charbon

#### 3. `blur`
Flou léger (2px) qui se dissipe au survol
```jsx
<ImageCard fx={['blur']} />
```

**Variante:** Ajoutez `.fx-blur-heavy` via `imageClassName` pour flou intense (4px)

#### 4. `grayscale`
Désaturation totale (monde désolé) - récupère 80% couleur au survol
```jsx
<ImageCard fx={['grayscale']} />
```

**Variante:** `.fx-grayscale-partial` pour désaturation 60%

#### 5. `sepia`
Effet vieilli/ancien - style photographie du passé
```jsx
<ImageCard fx={['sepia']} />
```

**Variante:** `.fx-sepia-aged` pour effet très vieilli

#### 6. `vignette`
Assombrissement radial des bords - focus central
```jsx
<ImageCard fx={['vignette']} />
```

**Variante:** `.fx-vignette-heavy` pour vignette dramatique

#### 7. `torn-edges`
Bords déchirés/usés - style BD arraché
```jsx
<ImageCard fx={['torn-edges']} />
```

**Variante:** `.fx-torn-edges-rough` pour déchirure agressive

**Note:** Sur mobile, les bords déchirés sont remplacés par `border-radius` simple pour performance.

### Effets bonus

#### 8. `dust`
Texture poussiéreuse avec points semi-transparents
```jsx
<ImageCard fx={['dust', 'sepia']} />
```

#### 9. `contrast`
Contraste accentué (1.15x) - style BD européenne
```jsx
<ImageCard fx={['contrast']} />
```

**Variante:** `.fx-contrast-high` pour contraste dramatique (1.4x)

## Combinaisons d'effets

Les effets peuvent être combinés librement:

```jsx
// Souvenir ancien
<ImageCard
  fx={['sepia', 'vignette', 'dust']}
  caption="Photographie d'avant la chute"
/>

// Monde désolé
<ImageCard
  fx={['grayscale', 'overlay', 'vignette']}
  overlayVariant="dark-heavy"
  caption="Le silence des ruines"
/>

// Relique tribale
<ImageCard
  fx={['torn-edges', 'sepia', 'dust']}
  caption="Témoignage des ancêtres"
/>

// Dynamisme BD
<ImageCard
  fx={['hover-zoom', 'contrast', 'overlay']}
  overlayVariant="fire"
/>
```

## Combos prédéfinis

Pour une application rapide, utilisez les classes combo via `imageClassName`:

```jsx
// Souvenir (sepia + grayscale partiel + vignette)
<ImageCard imageClassName="fx-combo-memory" />

// Désolation (grayscale fort + contraste + assombrissement)
<ImageCard imageClassName="fx-combo-desolate" />

// Tribal (sepia + contraste + saturation réduite)
<ImageCard imageClassName="fx-combo-tribal" />
```

## Ratios d'aspect

```jsx
<ImageCard ratio="square" />   {/* 1:1 */}
<ImageCard ratio="4/3" />      {/* Photos classiques */}
<ImageCard ratio="16/9" />     {/* Défaut - HD standard */}
<ImageCard ratio="21/9" />     {/* Ultra-wide cinéma */}
<ImageCard ratio="3/4" />      {/* Portrait */}
<ImageCard ratio="9/16" />     {/* Portrait mobile */}
<ImageCard ratio="auto" />     {/* Hauteur naturelle */}
```

## Animations

Ajoutez via `imageClassName`:

```jsx
// Emergence du passé (apparition progressive)
<ImageCard imageClassName="fx-animate-emerge" />

// Dissolution dans le temps (disparition)
<ImageCard imageClassName="fx-animate-dissolve" />
```

## Exemples d'usage réel

### Galerie de profils tribaux
```jsx
<div className="grid grid-cols-4 gap-3">
  {members.map(member => (
    <ImageCard
      key={member.id}
      src={member.avatar}
      ratio="square"
      fx={['hover-zoom', 'overlay', 'sepia']}
      overlayVariant="tribal"
      caption={member.name}
    />
  ))}
</div>
```

### Chronique post-apocalyptique
```jsx
<ImageCard
  src={entry.image}
  ratio="16/9"
  fx={['torn-edges', 'sepia', 'dust', 'vignette']}
  caption={`Jour ${entry.day} : ${entry.description}`}
/>
```

### Bannière héroïque
```jsx
<ImageCard
  src={hero.image}
  ratio="21/9"
  fx={['hover-zoom', 'contrast', 'overlay', 'vignette']}
  overlayVariant="fire"
  caption={hero.tagline}
  className="w-full"
/>
```

### Souvenir d'avant la chute
```jsx
<ImageCard
  src={memory.image}
  ratio="4/3"
  imageClassName="fx-combo-memory"
  caption="Avant que tout ne s'effondre..."
/>
```

## Guide de sélection des effets

**Pour évoquer la nostalgie:** `sepia + vignette + dust`

**Pour le monde désolé:** `grayscale + overlay (dark-heavy)`

**Pour l'esprit tribal:** `overlay (tribal) + sepia + vignette`

**Pour dynamiser (style BD):** `hover-zoom + contrast`

**Pour document ancien:** `torn-edges + sepia-aged + dust`

**Pour mystère/brume:** `blur + overlay (dust)`

**Pour impact visuel maximal:** `hover-zoom + contrast + overlay (fire) + vignette`

## Accessibilité

Le composant respecte automatiquement:

- **`prefers-reduced-motion`**: Désactive toutes les animations et transitions
- **`prefers-contrast: more`**: Simplifie les filtres et réduit les overlays
- **Alt text**: Toujours fournir une prop `alt` descriptive
- **Caption**: Affiché en texte accessible (non décoratif)

## Performance

- **Lazy loading par défaut**: Les images hors viewport ne se chargent pas
- **Responsive**: Effets simplifiés sur mobile (< 768px)
  - Bords déchirés remplacés par border-radius
  - Effet dust désactivé
  - Zoom réduit (1.04x au lieu de 1.08x)
- **GPU acceleration**: Transformations CSS optimisées

## Personnalisation avancée

```jsx
// Classes custom via className
<ImageCard
  className="shadow-elevated-lg"
  imageClassName="fx-sepia-aged custom-filter"
  captionClassName="text-lg font-accent"
/>

// Ratio custom
<ImageCard ratio="2.35 / 1" /> {/* Cinémascope */}

// Style inline si nécessaire
<ImageCard
  style={{ maxWidth: '600px' }}
/>
```

## Tailwind Classes recommandées

Combinez avec vos classes Tailwind existantes:

```jsx
<ImageCard
  className="border-4 border-primary-500 shadow-glow"
  fx={['overlay']}
  overlayVariant="fire"
/>
```

## Thème

Le composant utilise les tokens de votre design system:

- Couleurs: `primary`, `secondary`, `neutral`
- Transitions: Variables CSS custom (`--transition-*`, `--ease-*`)
- Border radius: `rounded-stone` (0.5rem)
- Ombres: System shadow tokens

## Notes de style

**Inspirations BD européenne:**
- Contraste marqué (Bilal)
- Textures organiques (Moebius)
- Tonalités terre et feu
- Ombres atmosphériques

**Cohérence post-apocalyptique:**
- Effets de vieillissement
- Textures poussiéreuses
- Désaturation partielle
- Bords usés et irréguliers

## Compatibilité

- **Navigateurs modernes**: Chrome, Firefox, Safari, Edge (dernières versions)
- **Mobile**: iOS Safari, Chrome Android
- **Dégradation gracieuse**: Fallback sur images normales si CSS non supporté
