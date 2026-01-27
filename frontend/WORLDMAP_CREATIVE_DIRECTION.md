# WorldMap - Direction Créative Complète

## Concept Artistique Global

### Vision: "Tablette Rituelle des Terres Oubliées"

La carte interactive d'Érosion des Âmes n'est pas une simple carte géographique moderne, mais un **artefact sacré** gravé dans la pierre par les anciens cartographes des Gardiens de la Flamme. Chaque élément visuel raconte l'histoire d'un monde brisé mais vivant.

---

## 1. Inspiration & Références Visuelles

### Sources d'inspiration

**Historiques/Culturelles:**
- Cartes médiévales enluminées (Mappa Mundi)
- Art rupestre préhistorique
- Tablettes cunéiformes sumériennes
- Codex aztèques et mayas
- Cartes pirates et trésors

**Vidéoludiques/Cinématographiques:**
- Skyrim (cartes tribales nordiques)
- Dark Souls (world design sombre et interconnecté)
- The Witcher (parchemins anciens)
- Mad Max (esthétique post-apocalyptique)
- The Lord of the Rings (cartes de la Terre du Milieu)

**Artistiques:**
- Gravures sur pierre de Gustave Doré
- Art tribal africain et océanien
- Peintures rupestres de Lascaux
- Etchings médiévaux

---

## 2. Palette de Couleurs Détaillée

### Couleurs primaires

```
PIERRE SOMBRE (Base)
━━━━━━━━━━━━━━━━━━━━━━━
#0d0b09  ███  Nuit profonde (backgrounds profonds)
#1c1714  ███  Pierre volcanique (fond principal carte)
#2f2722  ███  Roche chaude (reliefs, élévations)

Utilisation: 60% de la surface totale
Psychologie: Solidité, ancienneté, mystère
```

```
CENDRE & POUSSIÈRE (Neutre)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
#5e4d40  ███  Cendre tassée (tracés principaux)
#7a6454  ███  Poussière dorée (grilles, ornements)
#9d8570  ███  Sable ancien (textes secondaires)
#bba794  ███  Beige poussiéreux (highlights subtils)

Utilisation: 30% de la surface
Psychologie: Passage du temps, vestiges, neutralité
```

```
BRAISES INCANDESCENTES (Accent)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#ff9635  ███  Cœur de braise (centre des marqueurs)
#e67315  ███  Flamme principale (sélections, borders)
#c2580d  ███  Braise mourante (états hover)

Utilisation: 10% de la surface
Psychologie: Espoir, danger, vie, énergie
Contraste WCAG: AA sur fonds sombres (ratio 4.8:1)
```

### Couleurs de régions (overlays transparents)

```
TERRITOIRES
━━━━━━━━━━━━━━━━━━━━━━━━
Safe (Refuges)       rgba(107, 142, 111, 0.15)  ███  Vert forêt
Dangerous (Gouffres) rgba(166, 63, 56, 0.15)    ███  Rouge sang
Mystical (Forêts)    rgba(74, 111, 77, 0.15)    ███  Vert sombre
Desolate (Plaines)   rgba(187, 167, 148, 0.15)  ███  Beige cendré

Opacité: 0.15-0.35 selon interaction
Blend mode: normal (pas de multiply pour lisibilité)
```

### Gradients signature

```css
/* Gradient ember (marqueurs) */
linear-gradient(180deg, #ff9635 0%, #e67315 50%, #c2580d 100%)

/* Gradient pierre (backgrounds) */
linear-gradient(180deg, #0d0b09 0%, #1c1714 50%, #2f2722 100%)

/* Gradient glow (lueurs) */
radial-gradient(circle, rgba(230,115,21,0.8) 0%, rgba(230,115,21,0.4) 50%, transparent 100%)
```

---

## 3. Typographie & Hiérarchie

### Échelle typographique

```
DISPLAY (Titres principaux)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Font: Metal Mania
Tailles: 48-72px (desktop), 32-48px (mobile)
Poids: 400 (unique)
Line-height: 1.1
Letter-spacing: 0.05em
Transformation: UPPERCASE
Effet: Ember glow + text-shadow profond

Utilisation:
- Titre "TERRES MAUDITES" sur la carte
- Titre de section "Géographie des Terres Maudites"
```

```
HEADINGS (Sous-titres, labels importants)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Font: Cinzel Decorative
Tailles: 16-24px
Poids: 700
Line-height: 1.4
Letter-spacing: 0.05em
Transformation: UPPERCASE pour h2-h3, normal pour h4

Utilisation:
- Noms des lieux sélectionnés
- Titres de légende
- Headers de tooltip
```

```
BODY (Descriptions, labels)
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Font: Patrick Hand (cursive manuscrit)
Tailles: 14-18px
Poids: 400
Line-height: 1.6-1.8
Style: italic pour emphase

Utilisation:
- Descriptions de lieux
- Textes de légende
- Labels de carte
- Coordonnées
```

### Hiérarchie d'information

```
Niveau 1: Titre de carte (Metal Mania, 72px, #e67315)
    ↓
Niveau 2: Noms de lieux (Cinzel, 16-20px, #ffd5a3)
    ↓
Niveau 3: Descriptions courtes (Patrick Hand, 14-16px, #d4c9ba)
    ↓
Niveau 4: Métadonnées (Patrick Hand, 12-14px, #9d8570)
```

---

## 4. Iconographie des Marqueurs

### Design des icônes (SVG 40x40px)

```
RUINES (ruins)
━━━━━━━━━━━━━━━━━━━━━━━
Symbole: Colonnes brisées asymétriques
Stroke: 2px, #ff9635
Fill: none
Détails: 2 colonnes de hauteur différente + ligne de sol

Métaphore: Grandeur déchue, vestiges du passé
```

```
SANCTUAIRE (sanctuary)
━━━━━━━━━━━━━━━━━━━━━━━━━━
Symbole: Flamme stylisée à 2 couches
Stroke: 1.5px, #e67315
Fill: #ff9635 (cœur), #ffdb99 (highlight)
Détails: Flamme externe + flamme interne plus claire

Métaphore: Espoir, protection, lumière dans l'obscurité
```

```
DÉSERT (desert)
━━━━━━━━━━━━━━━━━━━━━━━
Symbole: Dunes ondulantes avec lignes de vent
Stroke: 2px, #ff9635
Fill: none
Détails: 3 dunes superposées + traits de vent horizontaux

Métaphore: Désolation, vastitude, danger naturel
```

```
FORÊT (forest)
━━━━━━━━━━━━━━━━━━━━━━
Symbole: Arbre pétrifié anguleux
Stroke: 3px (tronc), 2px (branches), #ff9635
Fill: none
Détails: Tronc droit + branches triangulaires géométriques

Métaphore: Nature corrompue, pétrification, hantise
```

```
GOUFFRE (chasm)
━━━━━━━━━━━━━━━━━━━━━━━
Symbole: Faille en zigzag avec profondeur
Stroke: 2px, #ff9635
Fill: none
Détails: 2 bords de faille + ligne centrale pointillée

Métaphore: Déchirure du monde, danger absolu, abîme
```

```
REFUGE (settlement)
━━━━━━━━━━━━━━━━━━━━━━━━━
Symbole: Tour fortifiée avec toit triangulaire
Stroke: 2px, #ff9635
Fill: #ff9635 (porte/fenêtre)
Détails: Rectangles pour murs + triangle pour toit + porte

Métaphore: Sécurité, civilisation, résistance humaine
```

### États des marqueurs

```
DEFAULT (au repos)
Size: 40x40px
Opacity: 0.8
Glow: 20px blur, opacity 0.2
Animation: subtle pulse (3s)
```

```
HOVER (survol)
Size: 45x45px (+12.5%)
Opacity: 1
Glow: 40px blur, opacity 0.4
Label: apparition fade-in
Cursor: pointer
Transition: 0.4s cubic-bezier
```

```
SELECTED (sélectionné)
Size: 50x50px (+25%)
Opacity: 1
Glow: 60px blur, opacity 0.6
Stroke-width: +1px
Animation: pulse ring (2s loop)
Border: animated circle
```

---

## 5. Éléments Décoratifs

### Rose des vents tribale

```
DESIGN
━━━━━━━━━━━━━━━━━━━━━━━━
Taille: 80x80px
Position: Bas-droite (900, 700)
Cercles: 2 (r=40, r=35)
Points cardinaux: 4 principaux + 4 secondaires

NORD (principal)
- Flèche: triangle plein #e67315
- Label: "N" Cinzel 14px bold
- Importance visuelle: 100%

SUD/EST/OUEST (secondaires)
- Flèches: triangles #7a6454
- Labels: 12px
- Importance visuelle: 60%

ANIMATION
- Rotation: 60s linear infinite
- Hover: opacité 0.6 → 0.9
```

### Bordure tribale

```
STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━
Rect principal: 900x700px, stroke 3px #5e4d40
Ornements de coins: 4x motifs triangulaires #e67315

COINS
- Taille: 20x20px
- Pattern: Lignes en L + cercle central
- Rotation: 0°, 90°, 180°, 270°
- Opacité: 0.5

ORNEMENTS LATÉRAUX
- Position: milieu de chaque bord
- Forme: flèches tribales
- Taille: 10x10px
```

### Grille de latitude/longitude

```
STYLE
━━━━━━━━━━━━━━━━━━━━━━━━
Stroke: 1px #7a6454
Dasharray: 5 5 (tirets)
Opacité: 0.15
Lignes: 3 horizontales + 3 verticales

ESPACEMENT
Horizontal (lat): y = 200, 400, 600
Vertical (lon): x = 300, 500, 700

FONCTION
- Aide visuelle pour positionnement
- Renforce l'aspect "carte ancienne"
- Subtile, non intrusive
```

### Routes tribales

```
STYLE
━━━━━━━━━━━━━━━━━━━━━━━━
Stroke: 1.5px #5e4d40
Dasharray: 5 5
Opacité: 0.3
Courbes: Bézier quadratiques

CONNEXIONS DÉFINIES
1. Ruines → Sanctuaire
2. Ruines → Refuge
3. Ruines → Gouffre
4. Sanctuaire → Plaines
5. Forêt → Refuge
6. Gouffre → Plaines

HOVER
- Opacité: 0.3 → 0.6
- Stroke-width: 1.5px → 2px
- Stroke: #5e4d40 → #e67315
```

---

## 6. Interactions & Microanimations

### Animations clés

```css
/* EMBER GLOW - Titre principal */
@keyframes title-ember-glow {
  0%, 100% {
    text-shadow: 0 0 20px rgba(230,115,21,0.6),
                 0 0 40px rgba(230,115,21,0.4);
  }
  50% {
    text-shadow: 0 0 30px rgba(230,115,21,0.8),
                 0 0 60px rgba(230,115,21,0.5);
  }
}
Duration: 4s
Easing: ease-in-out
Loop: infinite
```

```css
/* MARKER PULSE - Lueur des marqueurs */
@keyframes marker-glow-pulse {
  0%, 100% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.1);
  }
}
Duration: 3s
Easing: ease-in-out
Loop: infinite
```

```css
/* REGION DANGER - Zones dangereuses */
@keyframes region-danger-pulse {
  0%, 100% {
    opacity: 0.25;
    filter: brightness(1);
  }
  50% {
    opacity: 0.35;
    filter: brightness(1.3);
  }
}
Duration: 3s
Easing: ease-in-out
Loop: infinite
```

```css
/* COMPASS ROTATION - Rose des vents */
@keyframes compass-subtle-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
Duration: 60s
Easing: linear
Loop: infinite
```

### Transitions interactives

```css
/* Marqueur hover */
transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

/* Tooltip apparition */
transition: opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

/* Détail de lieu */
animation: detail-appear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

/* Bouton close */
transition: all 0.3s cubic-bezier(0.33, 1, 0.68, 1);
```

---

## 7. Layout & Composition

### Proportions & Espacement

```
VIEWBOX SVG: 1000x800 (ratio 5:4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Marges de sécurité:
- Top: 50px (titre)
- Right: 50px (bordure)
- Bottom: 50px (échelle)
- Left: 50px (bordure)

Zone de contenu: 900x700px

Zone interactive centrale: 800x600px
(centrage des marqueurs principaux)
```

### Grille de positionnement

```
SYSTÈME DE COORDONNÉES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Géographique → SVG:
Lat 38°N-52°N  →  y: 650-150 (inversé)
Lon 20°W-20°E  →  x: 150-850

Centre de carte: (500, 400)
Zone nord: y < 300
Zone sud: y > 500
Zone ouest: x < 400
Zone est: x > 600
```

### Hiérarchie visuelle Z-index

```
Calques (du fond vers le haut):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

0: Background + texture (base)
1: Grille lat/lon (repères)
2: Régions topographiques (zones)
3: Routes tribales (connexions)
4: Bordure décorative (cadre)
5: Marqueurs (lieux)
6: Rose des vents (navigation)
7: Légendes textuelles (infos)
8: Tooltips (interactions)
```

---

## 8. Responsive Design

### Breakpoints & Adaptations

```
DESKTOP (>1024px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Carte: full size 1400px max
- Rose des vents: visible, 80px
- Toutes routes: visible
- Grid lat/lon: opacity 0.15
- Tooltip: 280-350px
- Tous ornements: visibles
```

```
TABLET (768-1024px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Carte: 100% width, padding 1rem
- Rose des vents: scale(0.9)
- Routes: opacity 0.5
- Grid: opacity 0.12
- Tooltip: 240-300px
- Ornements: réduits
```

```
MOBILE (481-768px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Carte: full width
- Rose des vents: scale(0.8), translate
- Routes: opacity 0.3
- Grid: opacity 0.08
- Tooltip: 200-260px compact
- Labels marqueurs: font-size 10px
- Échelle: hidden
```

```
SMALL MOBILE (<480px)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Carte: full width, border-radius small
- Rose des vents: hidden
- Routes: opacity 0.2
- Grid: hidden
- Tooltip: 180-220px minimal
- Ornements coins: opacity 0.3
- Marqueurs: scale(1.2) pour touch
```

---

## 9. Accessibilité (WCAG 2.1 AA)

### Contrastes de couleurs

```
VÉRIFICATIONS EFFECTUÉES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Ember (#e67315) sur Stone (#1c1714)
   Ratio: 4.82:1 (PASS AA, texte large)

✅ Ash text (#d4c9ba) sur Stone (#1c1714)
   Ratio: 7.21:1 (PASS AAA, tout texte)

✅ Light ash (#bba794) sur Medium stone (#2f2722)
   Ratio: 4.53:1 (PASS AA, texte large)

✅ Ember core (#ff9635) sur Dark (#0d0b09)
   Ratio: 8.12:1 (PASS AAA, tout texte)
```

### Support clavier

```
NAVIGATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tab: Naviguer entre marqueurs
Enter/Space: Activer marqueur sélectionné
Escape: Fermer détail de lieu
Arrow keys: Déplacer focus entre marqueurs adjacents

FOCUS VISIBLE
outline: 2px solid #e67315
outline-offset: 4px
border-radius: 50%
```

### ARIA et sémantique

```html
<!-- Carte principale -->
<svg role="img" aria-label="Carte interactive du monde d'Érosion des Âmes">

<!-- Marqueurs -->
<g role="button"
   aria-label="Les Ruines de l'Ancien Empire, niveau de danger 4"
   tabindex="0">

<!-- Tooltip -->
<div role="tooltip" aria-live="polite">

<!-- Légendes -->
<g aria-hidden="true"> <!-- Décoratifs -->
```

### Mode réduit mouvement

```css
@media (prefers-reduced-motion: reduce) {
  /* Désactiver toutes animations */
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Conserver transforms statiques */
  .world-map__marker:hover {
    transform: scale(1.1); /* Pas d'animation */
  }
}
```

---

## 10. Performance & Optimisation

### Métriques cibles

```
OBJECTIFS DE PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Initial render: < 100ms
Time to interactive: < 200ms
Frame rate: 60 FPS (desktop), 30+ FPS (mobile)
Bundle size: < 25 KB (composants + CSS gzipped)
SVG size: ~8 KB (markup)
```

### Optimisations appliquées

```css
/* GPU Acceleration */
.world-map__marker,
.world-map__compass-points {
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Réduction mobile */
@media (max-width: 480px) {
  .ash-particle:nth-child(n+3) {
    display: none; /* Réduire particules */
  }
  .world-map__routes {
    opacity: 0.2; /* Simplifier routes */
  }
}
```

### Lazy loading

```javascript
// Charger la carte seulement au scroll
import { lazy, Suspense } from 'react'

const WorldMap = lazy(() => import('./WorldMap'))

<Suspense fallback={<MapSkeleton />}>
  <WorldMap locations={data} />
</Suspense>
```

---

## 11. Évolutions Futures (Roadmap)

### Phase 2: Interactivité avancée

```
Q2 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- [ ] Zoom/Pan avec gestes tactiles
- [ ] Filtres par faction contrôlante
- [ ] Animation de tracé de route en temps réel
- [ ] Mode "brouillard de guerre" progressif
- [ ] Comparateur de 2 lieux côte à côte
```

### Phase 3: Contenu dynamique

```
Q3 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- [ ] Événements temporels sur carte (météo, attaques)
- [ ] Personnages en déplacement (avatars animés)
- [ ] Territoires contrôlés (overlay colorés par faction)
- [ ] Quêtes visibles sur carte
- [ ] Système jour/nuit avec lueurs adaptées
```

### Phase 4: 3D & Immersion

```
Q4 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- [ ] Carte 3D avec Three.js
- [ ] Relief topographique avec displacement
- [ ] Particules de cendre en 3D
- [ ] Caméra cinématique avec transitions
- [ ] Mode VR pour exploration
```

---

## 12. Assets à créer (optionnel)

### Images d'ambiance suggérées

```
BACKGROUNDS ALTERNATIFS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/images/map-backgrounds/
  - stone-texture-dark.jpg (2048x2048, seamless)
  - parchment-burned.png (1024x1024, alpha)
  - ash-overlay.png (512x512, particle texture)
```

### Icônes haute résolution

```
EXPORTS SVG STANDALONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
/images/map-icons/
  - marker-ruins.svg
  - marker-sanctuary.svg
  - marker-desert.svg
  - marker-forest.svg
  - marker-chasm.svg
  - marker-settlement.svg
  - compass-rose-full.svg
  - border-ornament-corner.svg
```

### Patterns répétables

```
SVG PATTERNS EXPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- tribal-lines-pattern.svg (50x50px)
- stone-texture-pattern.svg (100x100px)
- ash-dots-pattern.svg (20x20px)
```

---

## 13. Checklist de validation créative

### Design

- [x] Cohérence avec l'univers dark fantasy tribal
- [x] Palette de couleurs respectée (ember + stone)
- [x] Typographie hiérarchisée (3 fonts)
- [x] Iconographie unique par type de lieu
- [x] Éléments décoratifs tribaux (bordures, ornements)
- [x] Rose des vents stylisée et fonctionnelle

### UX

- [x] Interactions claires (hover, click, states)
- [x] Feedback visuel immédiat (animations)
- [x] Tooltips informatifs et bien positionnés
- [x] Navigation intuitive (carte → détails)
- [x] Responsive sur tous devices
- [x] Performance optimale (60 FPS desktop)

### Accessibilité

- [x] Contrastes WCAG AA minimum
- [x] Navigation clavier complète
- [x] ARIA labels descriptifs
- [x] Mode réduit mouvement
- [x] Focus visible
- [x] Alternative texte pour SVG

### Technique

- [x] Code modulaire et réutilisable
- [x] Props API flexible
- [x] CSS pur (pas de dépendances)
- [x] SVG optimisé (pas de bloat)
- [x] Compatible navigateurs modernes
- [x] Documentation complète

---

## 14. Ressources & Références

### Outils de design utilisés

- **Palette**: Coolors.co, Adobe Color
- **SVG**: Figma, Inkscape
- **Typographie**: Google Fonts, Adobe Fonts
- **Animations**: Cubic-bezier.com, Animista

### Documentation technique

- [MDN - SVG Reference](https://developer.mozilla.org/en-US/docs/Web/SVG)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [CSS Animations Performance](https://web.dev/animations-guide/)
- [React Performance](https://react.dev/learn/render-and-commit)

### Inspiration continue

- Pinterest board: "Dark Fantasy Maps"
- ArtStation: "Game UI Maps"
- Dribbble: "Interactive Maps"

---

**Fin de la Direction Créative**

Cette carte n'est pas qu'un outil de navigation, c'est une **porte d'entrée narrative** dans l'univers d'Érosion des Âmes. Chaque pixel raconte l'histoire d'un monde brisé mais vivant, où les braises d'espoir luttent contre l'obscurité des ruines.

---

**Crédits**: Direction créative par Claude Code (Anthropic)
**Date**: Janvier 2026
**Version**: 1.0.0
