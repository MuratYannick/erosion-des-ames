# Phase 2: Pages de contenu statique

**Branche**: `feature/phase-2-static-pages`

---

## Vue d'ensemble

Cette phase consiste à créer les pages de contenu statique qui donneront vie au site et présenteront l'univers du jeu de rôle. Ces pages utilisent les composants UI créés en Phase 1.

### Pages à créer
1. **Home** - Page d'accueil avec hero, présentation et actualités
2. **Foreword** - Avant-propos et règlement du forum
3. **Univers** - Présentation du monde et du lore
4. **Characters** - Personnages prédéfinis/exemples

---

## 2.1 Page Home (Accueil)

### Structure des fichiers
```
frontend/src/
├── pages/
│   ├── Home/
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── components/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── PresentationSection.jsx
│   │   │   ├── NewsSection.jsx
│   │   │   ├── QuickLinksSection.jsx
│   │   │   └── index.js
│   │   └── index.js
│   └── index.js
```

### Section Hero
- [x] Créer le composant HeroSection
- [x] Bannière pleine largeur avec image d'accroche
- [x] Titre principal avec typographie Metal Mania
- [x] Sous-titre/accroche immersive
- [x] Call-to-action (bouton inscription / découvrir)
- [x] Effet parallax ou animation subtile
- [x] **Thématique tribal**: Overlay rituel, bordure gravée, particules ember

### Section Présentation
- [x] Créer le composant PresentationSection
- [x] Texte d'immersion dans l'univers
- [x] Mise en page avec ImageCard pour illustrations
- [x] Typography adaptée pour texte long (Patrick Hand)
- [x] Animations au scroll (fade-in, slide-in)
- [x] **Thématique tribal**: Séparateurs tribaux, coins décorés

### Section Actualités/Annonces
- [x] Créer le composant NewsSection
- [x] Liste des 3-4 dernières annonces
- [x] Card pour chaque annonce (titre, date, extrait)
- [x] Badge "Nouveau" pour annonces récentes
- [x] Lien "Voir toutes les actualités"
- [x] **Thématique tribal**: Cards avec variante `tribal`, icônes tribales par type

### Section Liens Rapides
- [x] Créer le composant QuickLinksSection
- [x] Grille de liens vers sections importantes
  - [x] Inscription (Portail)
  - [x] Règlement (Tablette gravée)
  - [x] Univers (Carte/Étoiles)
  - [x] Créer un personnage (Masque rituel)
  - [x] Forum (Cercle des voix)
- [x] Icônes tribaux pour chaque lien (5 icônes SVG custom)
- [x] Effet hover avec glow (couleurs distinctes par lien)
- [x] **Thématique tribal**: Cards avec glow coloré, pattern progressif, transition vers footer

### Intégration Page Home
- [x] Assembler tous les composants dans Home.jsx
- [x] Responsive design (mobile, tablette, desktop)
- [x] Scroll fluide entre sections (Intersection Observer)
- [ ] SEO: meta title, description

---

## 2.2 Page Foreword (Avant-propos/Règlement)

### Structure des fichiers
```
frontend/src/
├── components/ui/
│   └── TableOfContents/
│       ├── TableOfContents.jsx
│       ├── TableOfContents.css
│       └── index.js
├── pages/
│   └── Foreword/
│       ├── Foreword.jsx
│       └── index.js
```

### Navigation interne (Table des matières)
- [x] Créer le composant TableOfContents (dans components/ui)
- [x] Liste des sections cliquables
- [x] Scroll smooth vers les ancres
- [x] Indicateur de section active au scroll (Intersection Observer)
- [x] Position sticky sur desktop
- [x] Collapse sur mobile
- [x] **Thématique tribal**: TribalCorner, TribalDivider, TribalMarker, TribalBookIcon, TribalFooter

### Page Foreword complète
- [x] Layout avec sidebar TOC + contenu principal
- [x] Sections hiérarchiques (niveau 1 et 2)
- [x] Titre de section avec TribalBullet
- [x] Contenu texte formaté (listes, paragraphes)
- [x] Support pour sous-sections
- [x] **Thématique tribal**: Bordures gravées, coins tribaux, dividers

### Contenu du règlement
- [x] Introduction / Bienvenue
- [x] Règles générales de conduite (respect, langage)
- [x] Règles du roleplay (metagaming, godmodding, cohérence)
- [x] Création de personnage (fiche, validation)
- [x] Système de jeu (actions, combat)
- [x] Modération et sanctions
- [x] Mentions légales

### Items de règles (intégrés dans Foreword.jsx)
- [x] Composant Section avec id pour ancrage
- [x] Composant Subsection pour sous-sections
- [x] Texte de la règle
- [x] Notes/précisions en retrait (ml-4 sur Subsection)
- [x] Mise en évidence des points importants (font-accent)
- [x] **Thématique tribal**: Puces tribales (TribalBullet), emphase avec glow

### Contenu des règles (intégré dans Foreword.jsx)
- [x] Structure de données pour les règles (sections array)
- [x] Sections implémentées:
  - [x] Introduction / Bienvenue
  - [x] Règles générales de conduite
  - [x] Règles du roleplay
  - [x] Création de personnage
  - [x] Système de jeu
  - [x] Modération et sanctions
  - [x] Mentions légales

### Intégration visuelle
- [ ] ImageCard pour illustrations thématiques (images à fournir)
- [x] Séparateurs entre grandes sections (TribalDivider)
- [x] Bouton "Retour en haut" (ScrollToTop component)
- [x] **Thématique tribal**: Cards `ancient`, effet parchemin

### Intégration Page Foreword
- [x] Layout avec sidebar (TableOfContents) + contenu principal
- [x] Responsive: sidebar collapse sur mobile
- [x] Scroll spy pour navigation active
- [ ] SEO: meta title, description (reporté)

---

## 2.3 Page Univers

### Structure des fichiers (implémentée)
```
frontend/src/
├── pages/
│   ├── Universe/
│   │   ├── Universe.jsx              ✅
│   │   ├── components/
│   │   │   ├── UniverseHero.jsx      ✅
│   │   │   ├── UniverseHero.css      ✅
│   │   │   ├── LoreSection.jsx       ✅
│   │   │   ├── LoreSection.css       ✅
│   │   │   ├── loreSampleData.js     ✅
│   │   │   ├── FactionCard.jsx       ✅
│   │   │   ├── FactionCard.css       ✅
│   │   │   ├── FactionSection.jsx    ✅
│   │   │   ├── FactionSection.css    ✅
│   │   │   ├── FactionEmblems.jsx    ✅
│   │   │   ├── factionData.js        ✅
│   │   │   ├── LocationCard.jsx      ✅
│   │   │   ├── LocationCard.css      ✅
│   │   │   ├── LocationSection.jsx   ✅
│   │   │   ├── LocationSection.css   ✅
│   │   │   ├── LocationIcons.jsx     ✅
│   │   │   ├── WorldMap.jsx          ✅
│   │   │   ├── WorldMap.css          ✅
│   │   │   ├── GeographySection.jsx  ✅
│   │   │   ├── GeographySection.css  ✅
│   │   │   ├── DawnTransition.jsx    ✅
│   │   │   ├── DawnTransition.css    ✅
│   │   │   ├── TimelineSection.jsx   ✅
│   │   │   ├── TimelineSection.css   ✅
│   │   │   ├── timelineData.js       ✅
│   │   │   └── index.js              ✅
│   │   └── index.js                  ✅
```

### Section Hero Univers
- [x] Créer le composant UniverseHero
- [x] Image d'accroche du monde (background image prop)
- [x] Titre "L'Univers d'Erosion des Ames"
- [x] Citation ou texte d'ambiance (subtitle et description)
- [x] **Thématique tribal**: Overlay mystique (cercle rituel), bordures rituelles (fragments de pierre), particules de cendre

### Section Histoire/Lore
- [x] Créer le composant LoreSection
- [x] Récit de l'histoire du monde (5 chapitres exemple: Genèse, Cataclysme, Ère des Cendres, Redécouverte, Temps Présent)
- [x] Chapitres/époques clés (navigation par runes, timeline interactive)
- [x] Mise en page texte long avec illustrations (lettrines, images lazy-loaded)
- [x] Collapse/expand pour sections longues (tablettes de pierre animées)
- [x] **Thématique tribal**: Style "Codex des Anciens" - tablettes de pierre, runes navigables, ornements tribaux, coins décoratifs

### Section Géographie
- [x] Créer le composant WorldMap
- [x] Créer le composant GeographySection (wrapper)
- [x] Carte SVG interactive avec 6 marqueurs de lieux
- [x] Points d'intérêt avec tooltips au survol
- [x] Sélection de lieu avec affichage détails
- [x] Rose des vents tribale animée
- [x] Routes tribales entre lieux
- [x] Légende de carte complète
- [x] Effets de bords brûlés (radial-gradient)
- [x] Animation de révélation (clip-path)
- [x] Lueurs ember animées sur les coins
- [x] **Thématique tribal**: Carte style parchemin ancien, marqueurs tribaux, bordure décorative

### Section Factions/Groupes
- [x] Créer le composant FactionCard
- [x] Card pour chaque faction
  - [x] Nom et emblème (5 emblèmes SVG tribaux)
  - [x] Description courte
  - [x] Philosophie/valeurs (citation gravée + liste avec runes)
  - [x] Couleurs par faction (primary, accent, glow)
- [x] Grille responsive de cards (FactionSection avec auto-fit)
- [ ] Modal ou page détail au clic (reporté)
- [x] **Thématique tribal**: Emblèmes SVG (bouclier, flamme, lune, spirale, boussole), couleurs par faction, particules de cendre au hover

### Section Lieux importants
- [x] Créer le composant LocationCard
- [x] Card pour chaque lieu
  - [x] Nom du lieu
  - [x] Image/illustration (avec placeholder si absent)
  - [x] Description (courte + complète)
  - [x] Type de lieu (6 types avec icônes SVG)
  - [x] Niveau de danger (1-5 avec code couleur)
  - [x] Coordonnées révélées au hover
- [x] Grille responsive avec filtres (type, danger)
- [x] **Thématique tribal**: Style carte ancienne, particules de cendre, lueur ember selon danger, icônes tribales (ruines, sanctuaire, désert, forêt, gouffre, refuge)

### Section Chronologie - "Le Fleuve des Âges"
- [x] Créer le composant TimelineSection
- [x] Créer timelineData.js avec 4 ères (Genèse, Cataclysme, Survie, Renaissance)
- [x] Strates géologiques verticales (concept lave solidifiée)
- [x] 4 températures visuelles (cold, warm, hot, incandescent)
- [x] Événements clés par ère avec icônes SVG
- [x] Runes de navigation par ère (∆, ⧖, ◇, ◉)
- [x] Sidebar sticky avec navigation rapide (desktop)
- [x] Connecteurs de lave animés entre ères
- [x] Citations par ère avec auteurs
- [x] Expansion/collapse des détails
- [x] Révélation au scroll (Intersection Observer)
- [x] Animation heartbeat pour l'ère actuelle
- [x] Braises flottantes en overlay
- [x] **Thématique tribal**: Strates de roche, runes tribales, flux de lave, particules de cendre

### Navigation Univers
- [x] Scroll vertical fluide entre sections
- [x] Indicateurs de progression par section (LoreSection, TimelineSidebar)
- [ ] Sidebar globale avec sections (optionnel, reporté)
- [ ] Mobile: menu dropdown ou accordion (optionnel, reporté)

### Composant DawnTransition
- [x] Créer le composant DawnTransition
- [x] Transition visuelle entre sections sombre/clair
- [x] Rayons de lumière SVG décoratifs
- [x] Citation thématique des Cartographes
- [x] Ornements tribaux animés
- [x] **Thématique tribal**: Gradient progressif, lueurs dorées

### Intégration Page Universe
- [x] Assembler tous les composants dans Universe.jsx
- [x] Ordre des sections: Hero → Lore → Factions → Geography → DawnTransition → Locations → Timeline → ScrollToTop
- [x] Exports centralisés dans components/index.js
- [x] Responsive design (tous composants)
- [ ] SEO: meta title, description (reporté)

---

## 2.4 Page Characters (Personnages prédéfinis)

### Structure des fichiers
```
frontend/src/
├── pages/
│   ├── Characters/
│   │   ├── Characters.jsx
│   │   ├── Characters.css
│   │   ├── components/
│   │   │   ├── CharacterGrid.jsx
│   │   │   ├── CharacterCard.jsx
│   │   │   ├── CharacterFilters.jsx
│   │   │   ├── CharacterModal.jsx
│   │   │   └── index.js
│   │   ├── data/
│   │   │   └── presetCharacters.js
│   │   └── index.js
```

### Grille de personnages
- [ ] Créer le composant CharacterGrid
- [ ] Affichage en grille responsive
- [ ] Espacement cohérent
- [ ] Animations d'apparition staggered
- [ ] État vide si aucun résultat de filtre

### Card de personnage
- [ ] Créer le composant CharacterCard
- [ ] Avatar/portrait du personnage
- [ ] Nom du personnage
- [ ] Race/classe ou archétype
- [ ] Courte description
- [ ] Badges (faction, statut, etc.)
- [ ] Action au clic (ouvrir modal)
- [ ] **Thématique tribal**: Card `tribal` avec frame rituel

### Système de filtres
- [ ] Créer le composant CharacterFilters
- [ ] Filtres possibles:
  - [ ] Par race
  - [ ] Par classe/archétype
  - [ ] Par faction
  - [ ] Par niveau de difficulté RP
- [ ] Dropdown ou checkboxes
- [ ] Reset des filtres
- [ ] Compteur de résultats
- [ ] **Thématique tribal**: Style dropdown tribal

### Modal détail personnage
- [ ] Créer le composant CharacterModal
- [ ] Portrait en grand
- [ ] Informations complètes:
  - [ ] Nom complet
  - [ ] Race, âge, classe
  - [ ] Faction/allégeance
  - [ ] Histoire/background
  - [ ] Traits de personnalité
  - [ ] Capacités notables
  - [ ] Notes pour le RP
- [ ] Bouton "Utiliser ce personnage" (futur)
- [ ] **Thématique tribal**: Modal avec frame `ancient`

### Données des personnages (data/presetCharacters.js)
- [ ] Structure de données pour chaque personnage
- [ ] 5-10 personnages exemples variés
- [ ] Diversité de races/classes/factions
- [ ] Images placeholder ou illustrations

### Intégration Page Characters
- [ ] Header avec titre et introduction
- [ ] Filtres en haut ou sidebar
- [ ] Grille de personnages
- [ ] Pagination si beaucoup de personnages
- [ ] Responsive design
- [ ] SEO: meta title, description

---

## Composants partagés pour pages statiques

### Structure des fichiers
```
frontend/src/
├── components/
│   ├── content/
│   │   ├── PageHeader.jsx
│   │   ├── SectionTitle.jsx
│   │   ├── TextBlock.jsx
│   │   ├── ImageGallery.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── Breadcrumb.jsx
│   │   └── index.js
```

### PageHeader
- [ ] Créer le composant PageHeader
- [ ] Titre de page (h1)
- [ ] Sous-titre/description optionnelle
- [ ] Image de fond optionnelle
- [ ] Breadcrumb optionnel
- [ ] **Thématique tribal**: Bordure inférieure gravée

### SectionTitle
- [ ] Créer le composant SectionTitle
- [ ] Titre de section (h2, h3)
- [ ] Icône optionnelle
- [ ] Ancre pour navigation
- [ ] **Thématique tribal**: Séparateurs tribaux

### TextBlock
- [ ] Créer le composant TextBlock
- [ ] Container pour texte long
- [ ] Typography optimisée lecture
- [ ] Support markdown ou rich text
- [ ] Drop caps optionnel
- [ ] **Thématique tribal**: Style manuscrit

### ImageGallery
- [ ] Créer le composant ImageGallery
- [ ] Grille d'images cliquables
- [ ] Lightbox au clic
- [ ] Navigation entre images
- [ ] Légendes

### ScrollToTop
- [x] Créer le composant ScrollToTop
- [x] Bouton fixe en bas à droite
- [x] Apparaît après scroll
- [x] Animation smooth au clic
- [x] **Thématique tribal**: Icône flèche tribale

### Breadcrumb
- [ ] Créer le composant Breadcrumb
- [ ] Fil d'Ariane
- [ ] Liens cliquables
- [ ] Séparateurs tribaux
- [ ] Intégration React Router

---

## Configuration des routes

### Mise à jour de App.jsx
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from '@/layouts'
import { Home, Foreword, Universe, Characters } from '@/pages'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/foreword" element={<Foreword />} />
          <Route path="/universe" element={<Universe />} />
          <Route path="/characters" element={<Characters />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

### Navigation
- [ ] Mettre à jour les liens dans Header
- [ ] Activer les NavLink avec état actif
- [ ] Scroll to top au changement de route

---

## Styles globaux pour contenu

### Typographie texte long (index.css)
- [ ] Styles pour articles/prose
- [ ] Headings hierarchy (h1-h6)
- [ ] Paragraphes avec espacement
- [ ] Listes stylisées (ul, ol)
- [ ] Blockquotes tribaux
- [ ] Links inline stylisés
- [ ] **Thématique tribal**: First-letter drop cap, underline rituel

### Utilitaires de mise en page
- [ ] Container avec max-width
- [ ] Grid layouts prédéfinis
- [ ] Spacing sections
- [ ] Responsive breakpoints

---

## Ordre de réalisation suggéré

1. **Composants partagés** - Base pour toutes les pages
   - PageHeader, SectionTitle, TextBlock
   - ScrollToTop, Breadcrumb
2. **Page Home** - Vitrine du site
   - HeroSection
   - PresentationSection
   - NewsSection
   - QuickLinksSection
3. **Page Foreword** - Règles essentielles
   - TableOfContents
   - RuleSection, RuleItem
   - Données des règles
4. **Page Universe** - Lore et immersion
   - UniverseHero, LoreSection
   - FactionCard, LocationCard
   - Navigation aside
5. **Page Characters** - Personnages exemples
   - CharacterCard, CharacterGrid
   - CharacterFilters
   - CharacterModal
6. **Configuration routes** - Navigation complète
7. **Tests et ajustements** - Responsive, animations

---

## Critères de validation

- [ ] Toutes les pages sont responsives (mobile, tablette, desktop)
- [ ] Navigation fonctionnelle entre toutes les pages
- [ ] Scroll fluide et animations cohérentes
- [ ] Contenu placeholder pour toutes les sections
- [ ] Images optimisées et lazy loading
- [ ] SEO basique (meta tags)
- [ ] Accessibilité (headings, alt text, focus)
- [ ] Cohérence visuelle avec le système de design Phase 1
- [ ] Export centralisé depuis `pages/index.js`

---

## Assets nécessaires

### Images (à préparer)
- [ ] Image hero page accueil (1920x800 min)
- [ ] Images sections présentation (800x600)
- [ ] Illustrations règlement
- [ ] Carte du monde (optionnel)
- [ ] Emblèmes factions
- [ ] Images lieux
- [ ] Portraits personnages prédéfinis

### Contenu texte (à rédiger)
- [ ] Texte d'accroche accueil
- [ ] Texte de présentation du jeu
- [ ] Contenu complet du règlement
- [ ] Lore/histoire du monde
- [ ] Descriptions des factions
- [ ] Descriptions des lieux
- [ ] Fiches des personnages prédéfinis

---

## Notes techniques

- Utiliser les composants UI de Phase 1 (Card, ImageCard, Modal, etc.)
- Implémenter le lazy loading pour les images
- Utiliser React.lazy() pour le code splitting des pages
- Prévoir des états de chargement avec Loader
- Stocker le contenu texte dans des fichiers data/ séparés
- Utiliser des constantes pour les chemins d'images
