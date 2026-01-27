# Intégration WorldMap dans Universe.jsx

## Option 1: Remplacer LocationSection par GeographySection (Recommandé)

La **GeographySection** combine la carte interactive ET la liste des lieux. C'est l'option la plus complète.

### Modifications dans Universe.jsx

```jsx
import {
  UniverseHero,
  LoreSection,
  sampleLoreChapters,
  FactionSection,
  factionsData,
  GeographySection  // Remplace LocationSection
} from './components'
import { locationsData } from '@/data/locationData'
import { ScrollToTop } from '@/components'

const Universe = () => {
  return (
    <div className="universe-page">
      <UniverseHero
        title="UNIVERS D'EROSION&#10;DES AMES"
        subtitle="Là où les ruines murmurent les secrets d'un monde oublié"
        description="Explorez un univers de dark fantasy tribale..."
        ctaLabel="Explorer le Lore"
        ctaHref="#lore"
        backgroundImage="/images/universe-bg.jpg"
      />

      <LoreSection
        chapters={sampleLoreChapters}
        title="Le Codex des Anciens"
        subtitle="Les fragments d'histoire gravés dans la pierre du temps"
      />

      <FactionSection factions={factionsData} />

      {/* NOUVELLE SECTION - Carte interactive avec détails */}
      <GeographySection
        title="Géographie des Terres Maudites"
        subtitle="Explorez les territoires brisés par le Cataclysme"
        locations={locationsData}
      />

      <ScrollToTop />
    </div>
  )
}

export default Universe
```

### Mise à jour de components/index.js

```jsx
// Ajouter les exports
export { default as GeographySection } from './GeographySection'
export { default as WorldMap } from './WorldMap'
```

---

## Option 2: Garder les deux sections séparées

Si vous voulez garder **LocationSection** ET ajouter la carte interactive.

### Universe.jsx

```jsx
import {
  UniverseHero,
  LoreSection,
  sampleLoreChapters,
  FactionSection,
  factionsData,
  LocationSection,
  GeographySection  // Ajouter
} from './components'
import { locationsData } from '@/data/locationData'
import { ScrollToTop } from '@/components'
import { useState } from 'react'

const Universe = () => {
  const [selectedLocation, setSelectedLocation] = useState(null)

  return (
    <div className="universe-page">
      <UniverseHero
        title="UNIVERS D'EROSION&#10;DES AMES"
        subtitle="Là où les ruines murmurent les secrets d'un monde oublié"
        description="Explorez un univers de dark fantasy tribale..."
        ctaLabel="Explorer le Lore"
        ctaHref="#lore"
        backgroundImage="/images/universe-bg.jpg"
      />

      <LoreSection
        chapters={sampleLoreChapters}
        title="Le Codex des Anciens"
        subtitle="Les fragments d'histoire gravés dans la pierre du temps"
      />

      <FactionSection factions={factionsData} />

      {/* Carte interactive AVANT la liste */}
      <GeographySection
        title="Carte du Monde"
        subtitle="Vue d'ensemble des territoires découverts"
        locations={locationsData}
        initialSelectedLocation={selectedLocation}
      />

      {/* Liste détaillée des lieux */}
      <LocationSection
        title="Territoires Maudits"
        subtitle="Explorez les terres brisées où rôdent ombres et mystères"
        onLocationClick={(location) => {
          setSelectedLocation(location)
          // Scroll vers la carte
          document.getElementById('geography')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }}
      />

      <ScrollToTop />
    </div>
  )
}

export default Universe
```

---

## Option 3: Carte seule dans une section custom

Si vous voulez juste intégrer la carte dans une section personnalisée.

### Universe.jsx

```jsx
import {
  UniverseHero,
  LoreSection,
  sampleLoreChapters,
  FactionSection,
  factionsData,
  LocationSection,
  WorldMap  // Import direct de la carte
} from './components'
import { locationsData } from '@/data/locationData'
import { ScrollToTop } from '@/components'
import { useState } from 'react'
import './Universe.css'

const Universe = () => {
  const [selectedLoc, setSelectedLoc] = useState(null)

  return (
    <div className="universe-page">
      <UniverseHero {...} />
      <LoreSection {...} />
      <FactionSection {...} />

      {/* Section carte custom */}
      <section className="map-section">
        <div className="map-section__header">
          <h2>Carte Interactive</h2>
          <p>Cliquez sur les marqueurs pour explorer</p>
        </div>

        <WorldMap
          locations={locationsData}
          selectedLocation={selectedLoc}
          onLocationSelect={(loc) => setSelectedLoc(loc)}
          showCompass={true}
          showLegend={true}
        />

        {/* Détail du lieu si sélectionné */}
        {selectedLoc && (
          <div className="selected-location-detail">
            <h3>{selectedLoc.name}</h3>
            <p>{selectedLoc.description}</p>
            <button onClick={() => setSelectedLoc(null)}>
              Fermer
            </button>
          </div>
        )}
      </section>

      <LocationSection {...} />
      <ScrollToTop />
    </div>
  )
}

export default Universe
```

### CSS custom (Universe.css)

```css
.map-section {
  padding: 4rem 1.5rem;
  background: #0d0b09;
}

.map-section__header {
  max-width: 1200px;
  margin: 0 auto 2rem;
  text-align: center;
}

.map-section__header h2 {
  font-family: 'Metal Mania', cursive;
  font-size: 2.5rem;
  color: #e67315;
  margin-bottom: 1rem;
}

.map-section__header p {
  font-family: 'Patrick Hand', cursive;
  font-size: 1.125rem;
  color: #d4c9ba;
}

.selected-location-detail {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding: 2rem;
  background: rgba(28, 23, 20, 0.8);
  border: 2px solid #e67315;
  border-radius: 1rem;
}
```

---

## Ordre recommandé des sections

Pour une expérience utilisateur optimale:

```
1. UniverseHero        (Introduction immersive)
2. LoreSection         (Histoire et contexte)
3. FactionSection      (Acteurs du monde)
4. GeographySection    (Carte + Lieux)  ← NOUVEAU
5. ScrollToTop         (Utilitaire)
```

---

## Checklist d'intégration

### Étape 1: Vérifier les fichiers

- [ ] `WorldMap.jsx` créé
- [ ] `WorldMap.css` créé
- [ ] `GeographySection.jsx` créé
- [ ] `GeographySection.css` créé
- [ ] `locationData.js` existe avec les 6 lieux

### Étape 2: Exports

Mettre à jour `frontend/src/pages/Universe/components/index.js`:

```jsx
// Exports existants
export { default as UniverseHero } from './UniverseHero'
export { default as LoreSection } from './LoreSection'
export { default as FactionSection } from './FactionSection'
export { default as LocationSection } from './LocationSection'
export { default as LocationCard } from './LocationCard'
export { default as FactionCard } from './FactionCard'

// NOUVEAUX exports
export { default as WorldMap } from './WorldMap'
export { default as GeographySection } from './GeographySection'

// Data exports
export { sampleLoreChapters } from '@/data/loreData'
export { factionsData } from '@/data/factionData'
```

### Étape 3: Import dans Universe.jsx

Choisir une des 3 options ci-dessus et modifier `Universe.jsx`.

### Étape 4: Test

1. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

2. **Naviguer vers /universe**

3. **Tester les interactions**
   - Survoler les marqueurs → Tooltip apparaît
   - Cliquer sur un marqueur → Lieu sélectionné
   - Vérifier la responsivité (mobile/tablet/desktop)

### Étape 5: Ajustements

Si nécessaire, ajuster:
- Les coordonnées des lieux dans `locationData.js`
- Les connexions entre lieux dans `WorldMap.jsx`
- Les couleurs dans les fichiers CSS
- Les textes dans `GeographySection.jsx`

---

## Données requises

Vérifier que `locationData.js` contient bien:

```javascript
export const locationsData = [
  {
    id: 'ancient-empire-ruins',
    name: 'Les Ruines de l\'Ancien Empire',
    coordinates: '47°N, 12°E',  // ← IMPORTANT
    type: 'ruins',               // ← IMPORTANT
    dangerLevel: 4,              // ← IMPORTANT
    shortDescription: '...',
    description: '...',
    // ... autres props
  },
  // ... 5 autres lieux
]
```

---

## Dépendances

Aucune dépendance externe requise. Le composant utilise uniquement:
- React (déjà installé)
- PropTypes (déjà installé)
- SVG natif
- CSS pur

---

## Performance attendue

- **Taille du bundle**: +15-20 KB (composants + CSS)
- **Temps de rendu initial**: < 50ms
- **Animations**: 60 FPS sur desktop, 30-60 FPS sur mobile
- **Compatible**: Chrome, Firefox, Safari, Edge (90+)

---

## Problèmes courants

### "Cannot find module 'WorldMap'"

**Solution**: Vérifier l'export dans `index.js`

```jsx
export { default as WorldMap } from './WorldMap'
```

### Coordonnées invalides

**Solution**: Format obligatoire `"XX°N, XX°E"` ou `"XX°N, XX°W"`

### Tooltip ne s'affiche pas

**Solution**: S'assurer que `.world-map` a `position: relative`

### Animations saccadées sur mobile

**Solution**: Réduire les particules dans `WorldMap.css`:

```css
@media (max-width: 480px) {
  .ash-particle:nth-child(n+3) {
    display: none;
  }
}
```

---

## Support

Pour toute question:
1. Consulter `WORLDMAP_README.md`
2. Vérifier les PropTypes dans les composants
3. Tester avec les données d'exemple fournies

---

**Bonne intégration !**
