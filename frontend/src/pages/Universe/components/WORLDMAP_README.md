# WorldMap Component - Documentation

## Vue d'ensemble

Le composant **WorldMap** est une carte interactive du monde d'Érosion des Âmes, conçue dans un style tribal dark fantasy avec une esthétique de tablette de pierre gravée. La carte affiche les 6 lieux découverts avec des marqueurs incandescents cliquables.

## Architecture

### Composants créés

1. **WorldMap.jsx** - Carte SVG interactive avec marqueurs
2. **GeographySection.jsx** - Section wrapper avec carte + détails
3. **WorldMap.css** - Styles de la carte
4. **GeographySection.css** - Styles de la section

## Design System

### Palette de Couleurs

```css
/* Pierre et Cendre */
--map-stone-dark: #1c1714      /* Fond principal */
--map-stone-medium: #2f2722    /* Reliefs */
--map-stone-light: #5e4d40     /* Highlights */
--map-ash: #7a6454             /* Tracés subtils */

/* Ember - Points d'intérêt */
--map-ember-core: #ff9635      /* Centre des marqueurs */
--map-ember-glow: #e67315      /* Lueur principale */
--map-ember-dim: #c2580d       /* Ember atténué */

/* Régions par type */
--map-region-safe: rgba(107, 142, 111, 0.15)    /* Refuges */
--map-region-dangerous: rgba(166, 63, 56, 0.15) /* Gouffres */
--map-region-mystical: rgba(74, 111, 77, 0.15)  /* Forêts */
--map-region-desolate: rgba(187, 167, 148, 0.15) /* Plaines */
```

### Typographie

- **Titres**: Metal Mania (display avec effet ember glow)
- **Sous-titres**: Cinzel Decorative (headings élégants)
- **Corps/Labels**: Patrick Hand (style manuscrit)

## Intégration

### 1. Import simple dans Universe.jsx

```jsx
import GeographySection from './components/GeographySection'
import { locationsData } from '@/data/locationData'

function Universe() {
  return (
    <div className="universe-page">
      <UniverseHero />
      <LoreSection />
      <FactionSection />

      {/* Ajouter la section géographie */}
      <GeographySection
        locations={locationsData}
      />

      <LocationSection />
    </div>
  )
}
```

### 2. Utilisation avancée avec état

```jsx
import { useState } from 'react'
import GeographySection from './components/GeographySection'

function Universe() {
  const [selectedLoc, setSelectedLoc] = useState(null)

  return (
    <GeographySection
      title="Géographie des Terres Maudites"
      subtitle="Explorez les territoires brisés"
      locations={locationsData}
      initialSelectedLocation={selectedLoc}
    />
  )
}
```

### 3. Carte seule (sans wrapper)

```jsx
import WorldMap from './components/WorldMap'

function CustomSection() {
  const handleLocationClick = (location) => {
    console.log('Lieu sélectionné:', location)
  }

  return (
    <WorldMap
      locations={locationsData}
      selectedLocation={null}
      onLocationSelect={handleLocationClick}
      showCompass={true}
      showLegend={true}
    />
  )
}
```

## Props API

### GeographySection

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | "Géographie des Terres Maudites" | Titre de la section |
| `subtitle` | string | "Explorez les territoires..." | Sous-titre descriptif |
| `locations` | array | locationsData | Tableau des lieux à afficher |
| `initialSelectedLocation` | object | null | Lieu présélectionné au chargement |

### WorldMap

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `locations` | array | [] | Tableau des lieux avec coordinates |
| `selectedLocation` | object | null | Lieu actuellement sélectionné |
| `onLocationSelect` | function | undefined | Callback lors du clic sur un marqueur |
| `showCompass` | boolean | true | Afficher la rose des vents |
| `showLegend` | boolean | true | Afficher les légendes sur la carte |

## Fonctionnalités

### Interactions

1. **Survol (hover)**
   - Tooltip avec nom, type, description courte et coordonnées
   - Agrandissement du marqueur
   - Intensification de la lueur

2. **Clic**
   - Sélection du lieu
   - Affichage de la carte détaillée (LocationCard expanded)
   - Animation de pulse sur le marqueur sélectionné

3. **Routes**
   - Chemins tribaux stylisés entre lieux connectés
   - Hover pour surligner les routes

### Éléments visuels

1. **Marqueurs par type**
   - Ruines: Colonne brisée
   - Sanctuaire: Flamme rituelle
   - Désert: Dunes avec vent
   - Forêt: Arbre pétrifié
   - Gouffre: Faille béante
   - Refuge: Tour fortifiée

2. **Rose des vents tribale**
   - Animation de rotation subtile (60s)
   - Points cardinaux avec ornements
   - Style gravé dans la pierre

3. **Régions topographiques**
   - Zones colorées selon le type
   - Opacité subtile (0.15-0.3)
   - Animation de pulse pour zones dangereuses

## Coordonnées des lieux

Le système utilise des coordonnées simplifiées:

```javascript
// Format: "47°N, 12°E"
// Latitude: 38°N à 52°N
// Longitude: 20°W à 20°E

const locations = [
  { coordinates: '47°N, 12°E' }, // Centre (Ruines)
  { coordinates: '43°N, 8°E' },  // Sud-ouest (Sanctuaire)
  { coordinates: '38°N, 18°E' }, // Sud-est (Plaines)
  { coordinates: '52°N, 15°E' }, // Nord-est (Forêt)
  { coordinates: '45°N, 20°E' }, // Est (Gouffre)
  { coordinates: '50°N, 5°E' },  // Nord-ouest (Refuge)
]
```

### Conversion en positions SVG

```javascript
// ViewBox: 0 0 1000 800
// Latitude 38°N-52°N => y: 650-150 (inversé)
// Longitude 20°W-20°E => x: 150-850
```

## Personnalisation

### Ajouter un nouveau lieu

1. Ajouter dans `locationData.js`:

```javascript
{
  id: 'new-location',
  name: 'Nouveau Lieu',
  type: 'ruins', // ruins, sanctuary, desert, forest, chasm, settlement
  coordinates: '45°N, 10°E',
  dangerLevel: 3,
  shortDescription: 'Description courte',
  // ... autres propriétés
}
```

2. Le lieu apparaîtra automatiquement sur la carte

### Modifier les connexions entre lieux

Dans `WorldMap.jsx`, section `MapRoutes`:

```javascript
const connections = [
  ['ancient-empire-ruins', 'ember-sanctuary'],
  ['your-location-id', 'another-location-id'],
  // Ajouter vos connexions
]
```

### Personnaliser un type de marqueur

Dans `WorldMap.jsx`, fonction `MarkerIcon`:

```javascript
case 'your-type':
  return (
    <g transform="translate(-10, -10)">
      {/* Votre SVG personnalisé ici */}
      <path d="..." {...iconProps} />
    </g>
  )
```

## Accessibilité

- ✅ Labels ARIA sur les éléments interactifs
- ✅ Navigation au clavier supportée
- ✅ Tooltips avec descriptions alternatives
- ✅ Contrastes WCAG AA respectés
- ✅ Mode réduit mouvement (`prefers-reduced-motion`)
- ✅ Compatible lecteurs d'écran

## Performance

### Optimisations appliquées

1. **GPU Acceleration**
   - `will-change: transform` sur éléments animés
   - `transform: translateZ(0)` pour hardware acceleration

2. **Animations optimisées**
   - CSS animations plutôt que JavaScript
   - `requestAnimationFrame` pour updates
   - Réduction des particules sur mobile

3. **Responsive**
   - SVG scalable (pas d'images raster)
   - Simplification des détails sur mobile
   - Rose des vents cachée < 480px

## Responsive Breakpoints

```css
/* Tablettes */
@media (max-width: 1024px) { }

/* Mobile */
@media (max-width: 768px) {
  /* Tooltip adapté, grille simplifiée */
}

/* Petit mobile */
@media (max-width: 480px) {
  /* Rose des vents cachée, marqueurs agrandis */
}
```

## Troubleshooting

### Les marqueurs ne s'affichent pas
- Vérifier que `coordinates` est bien au format "XX°N, XX°E"
- Vérifier que latitude est entre 38-52 et longitude entre -20 et 20

### Le tooltip ne se positionne pas correctement
- S'assurer que `.world-map` a `position: relative`
- Vérifier que `mapRef` est bien attaché au SVG

### Les animations sont saccadées
- Réduire le nombre de particules animées
- Vérifier `will-change` sur les éléments animés
- Activer `hardware-acceleration` si nécessaire

### La carte ne répond pas aux clics sur mobile
- Augmenter la zone de clic des marqueurs
- Vérifier que `pointer-events` n'est pas bloqué
- Tester avec `touch-action: manipulation`

## Évolutions futures

### Phase 2 - Interactivité avancée
- [ ] Zoom et pan sur la carte
- [ ] Filtres par type de lieu
- [ ] Mode exploration (révéler progressivement)
- [ ] Chemins tracés en temps réel

### Phase 3 - Contenu dynamique
- [ ] Événements sur la carte (météo, attaques)
- [ ] Personnages mobiles
- [ ] Territoires contrôlés par factions
- [ ] Brouillard de guerre

### Phase 4 - 3D
- [ ] Carte 3D avec Three.js
- [ ] Relief topographique
- [ ] Particules de cendre en 3D
- [ ] Camera cinématique

## Support navigateurs

✅ Chrome 90+ (full support)
✅ Firefox 88+ (full support)
✅ Safari 14+ (full support)
✅ Edge 90+ (full support)
⚠️ IE11 (support partiel, dégradation gracieuse)

## Ressources

- [SVG Accessibility](https://www.w3.org/TR/SVG-access/)
- [CSS Animations Performance](https://web.dev/animations-guide/)
- [Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)

## Contact

Pour toute question ou amélioration, référez-vous au design system principal du projet.

---

**Créé pour**: Érosion des Âmes - Jeu de rôle dark fantasy tribal
**Version**: 1.0.0
**Date**: 2026-01
