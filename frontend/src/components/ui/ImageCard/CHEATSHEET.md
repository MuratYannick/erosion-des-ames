# ImageCard - Cheatsheet rapide

## Usage minimal

```jsx
<ImageCard src="image.jpg" fx={['hover-zoom', 'vignette']} />
```

## Props essentielles

```jsx
src="url"              // Image source (requis)
alt="description"      // Accessibilité
fx={[...]}            // Array d'effets
ratio="16/9"          // square | 4/3 | 16/9 | 21/9 | 3/4 | 9/16 | auto
caption="texte"       // Légende en bas
overlayVariant="dark" // dark | dark-heavy | fire | dust | tribal
```

## Effets FX (via prop `fx`)

| Effet | Description | Au survol |
|-------|-------------|-----------|
| `hover-zoom` | Zoom 1.08x | - |
| `overlay` | Overlay (voir variants) | S'intensifie |
| `blur` | Flou 2px | Se dissipe |
| `grayscale` | Noir & blanc | 80% couleur revient |
| `sepia` | Vieilli/ancien | S'éclaircit |
| `vignette` | Bords sombres | S'atténue |
| `torn-edges` | Bords déchirés | - |
| `dust` | Texture poussiéreuse | - |
| `contrast` | Contraste BD | S'accentue |

## Variantes (via prop `imageClassName`)

```jsx
// Blur
imageClassName="fx-blur-heavy"          // Flou intense 4px

// Grayscale
imageClassName="fx-grayscale-partial"   // Gris 60%

// Sepia
imageClassName="fx-sepia-aged"          // Très vieilli

// Vignette
imageClassName="fx-vignette-heavy"      // Dramatique

// Torn edges
imageClassName="fx-torn-edges-rough"    // Déchirure agressive

// Contrast
imageClassName="fx-contrast-high"       // Contraste 1.4x
```

## Combos prédéfinis

```jsx
// Souvenir ancien
imageClassName="fx-combo-memory"

// Monde désolé
imageClassName="fx-combo-desolate"

// Relique tribale
imageClassName="fx-combo-tribal"
```

## Animations

```jsx
// Emergence progressive
imageClassName="fx-animate-emerge"

// Dissolution
imageClassName="fx-animate-dissolve"
```

## Recettes rapides

### Nostalgie
```jsx
fx={['sepia', 'vignette', 'dust']}
```

### Désolation
```jsx
fx={['grayscale', 'overlay', 'vignette']}
overlayVariant="dark-heavy"
```

### Tribal
```jsx
fx={['overlay', 'sepia', 'vignette']}
overlayVariant="tribal"
```

### BD dynamique
```jsx
fx={['hover-zoom', 'contrast']}
```

### Document usé
```jsx
fx={['torn-edges', 'sepia', 'dust']}
imageClassName="fx-sepia-aged"
```

### Mystère/Brume
```jsx
fx={['blur', 'overlay']}
overlayVariant="dust"
```

### Impact maximal
```jsx
fx={['hover-zoom', 'contrast', 'overlay', 'vignette']}
overlayVariant="fire"
```

## Overlays

```jsx
overlayVariant="dark"        // Dégradé bas → haut
overlayVariant="dark-heavy"  // Noir uniforme 60%
overlayVariant="fire"        // Orangé (feu sacré)
overlayVariant="dust"        // Terre/poussière
overlayVariant="tribal"      // Terre/charbon
```

## Ratios courants

```jsx
ratio="square"   // Avatars, vignettes
ratio="4/3"      // Photos classiques
ratio="16/9"     // Standard (défaut)
ratio="21/9"     // Bannières ultra-wide
```

## Exemples d'usage

```jsx
// Avatar tribal
<ImageCard
  src={user.avatar}
  ratio="square"
  fx={['hover-zoom', 'overlay']}
  overlayVariant="tribal"
/>

// Chronique post-apo
<ImageCard
  src={entry.img}
  ratio="16/9"
  fx={['torn-edges', 'sepia', 'dust', 'vignette']}
  caption={`Jour ${entry.day}`}
/>

// Bannière héroïque
<ImageCard
  src={hero.img}
  ratio="21/9"
  fx={['hover-zoom', 'contrast', 'overlay', 'vignette']}
  overlayVariant="fire"
/>

// Souvenir ancien
<ImageCard
  src={memory.img}
  imageClassName="fx-combo-memory"
  caption="Avant la chute..."
/>
```

## Accessibilité checklist

- [ ] Toujours fournir `alt` descriptif
- [ ] `prefers-reduced-motion` respecté automatiquement
- [ ] `prefers-contrast: more` respecté automatiquement
- [ ] Captions accessibles (non décoratifs)
