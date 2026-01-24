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
- [ ] Créer le composant HeroSection
- [ ] Bannière pleine largeur avec image d'accroche
- [ ] Titre principal avec typographie Metal Mania
- [ ] Sous-titre/accroche immersive
- [ ] Call-to-action (bouton inscription / découvrir)
- [ ] Effet parallax ou animation subtile
- [ ] **Thématique tribal**: Overlay rituel, bordure gravée, particules ember

### Section Présentation
- [ ] Créer le composant PresentationSection
- [ ] Texte d'immersion dans l'univers
- [ ] Mise en page avec ImageCard pour illustrations
- [ ] Typography adaptée pour texte long (Patrick Hand)
- [ ] Animations au scroll (fade-in, slide-in)
- [ ] **Thématique tribal**: Séparateurs tribaux, coins décorés

### Section Actualités/Annonces
- [ ] Créer le composant NewsSection
- [ ] Liste des 3-4 dernières annonces
- [ ] Card pour chaque annonce (titre, date, extrait)
- [ ] Badge "Nouveau" pour annonces récentes
- [ ] Lien "Voir toutes les actualités"
- [ ] **Thématique tribal**: Cards avec variante `ancient`

### Section Liens Rapides
- [ ] Créer le composant QuickLinksSection
- [ ] Grille de liens vers sections importantes
  - [ ] Inscription
  - [ ] Règlement
  - [ ] Univers
  - [ ] Créer un personnage
  - [ ] Forum
- [ ] Icônes tribaux pour chaque lien
- [ ] Effet hover avec glow
- [ ] **Thématique tribal**: Cards `fire` avec animations

### Intégration Page Home
- [ ] Assembler tous les composants dans Home.jsx
- [ ] Responsive design (mobile, tablette, desktop)
- [ ] Scroll fluide entre sections
- [ ] SEO: meta title, description

---

## 2.2 Page Foreword (Avant-propos/Règlement)

### Structure des fichiers
```
frontend/src/
├── pages/
│   ├── Foreword/
│   │   ├── Foreword.jsx
│   │   ├── Foreword.css
│   │   ├── components/
│   │   │   ├── TableOfContents.jsx
│   │   │   ├── RuleSection.jsx
│   │   │   ├── RuleItem.jsx
│   │   │   └── index.js
│   │   ├── data/
│   │   │   └── rules.js
│   │   └── index.js
```

### Navigation interne (Table des matières)
- [ ] Créer le composant TableOfContents
- [ ] Liste des sections cliquables
- [ ] Scroll smooth vers les ancres
- [ ] Indicateur de section active au scroll
- [ ] Position sticky sur desktop
- [ ] Collapse sur mobile
- [ ] **Thématique tribal**: Style parchemin, marqueurs rituels

### Sections de règles
- [ ] Créer le composant RuleSection
- [ ] Titre de section avec ancre
- [ ] Contenu texte formaté
- [ ] Numérotation des règles
- [ ] Support pour sous-sections
- [ ] **Thématique tribal**: Bordures gravées, icônes de section

### Items de règles
- [ ] Créer le composant RuleItem
- [ ] Numéro de règle
- [ ] Texte de la règle
- [ ] Notes/précisions en retrait
- [ ] Mise en évidence des points importants
- [ ] **Thématique tribal**: Puces tribales, emphase avec glow

### Contenu des règles (data/rules.js)
- [ ] Structure de données pour les règles
- [ ] Sections suggérées:
  - [ ] Introduction / Bienvenue
  - [ ] Règles générales de conduite
  - [ ] Règles du roleplay
  - [ ] Création de personnage
  - [ ] Système de jeu (si applicable)
  - [ ] Modération et sanctions
  - [ ] Mentions légales

### Intégration visuelle
- [ ] ImageCard pour illustrations thématiques
- [ ] Séparateurs entre grandes sections
- [ ] Bouton "Retour en haut"
- [ ] **Thématique tribal**: Cards `ancient`, effet parchemin

### Intégration Page Foreword
- [ ] Layout avec sidebar (TableOfContents) + contenu principal
- [ ] Responsive: sidebar collapse sur mobile
- [ ] Scroll spy pour navigation active
- [ ] SEO: meta title, description

---

## 2.3 Page Univers

### Structure des fichiers
```
frontend/src/
├── pages/
│   ├── Universe/
│   │   ├── Universe.jsx
│   │   ├── Universe.css
│   │   ├── components/
│   │   │   ├── UniverseHero.jsx
│   │   │   ├── LoreSection.jsx
│   │   │   ├── WorldMap.jsx (optionnel)
│   │   │   ├── FactionCard.jsx
│   │   │   ├── LocationCard.jsx
│   │   │   ├── TimelineEvent.jsx
│   │   │   └── index.js
│   │   ├── data/
│   │   │   ├── lore.js
│   │   │   ├── factions.js
│   │   │   ├── locations.js
│   │   │   └── timeline.js
│   │   └── index.js
```

### Section Hero Univers
- [ ] Créer le composant UniverseHero
- [ ] Image d'accroche du monde
- [ ] Titre "L'Univers d'Erosion des Ames"
- [ ] Citation ou texte d'ambiance
- [ ] **Thématique tribal**: Overlay mystique, bordures rituelles

### Section Histoire/Lore
- [ ] Créer le composant LoreSection
- [ ] Récit de l'histoire du monde
- [ ] Chapitres/époques clés
- [ ] Mise en page texte long avec illustrations
- [ ] Collapse/expand pour sections longues
- [ ] **Thématique tribal**: Style manuscrit ancien

### Section Géographie (optionnel)
- [ ] Créer le composant WorldMap
- [ ] Carte interactive ou image cliquable
- [ ] Points d'intérêt avec tooltips
- [ ] Zoom et navigation
- [ ] **Thématique tribal**: Carte style parchemin

### Section Factions/Groupes
- [ ] Créer le composant FactionCard
- [ ] Card pour chaque faction
  - [ ] Nom et emblème
  - [ ] Description courte
  - [ ] Philosophie/valeurs
  - [ ] Territoire (si applicable)
- [ ] Grille responsive de cards
- [ ] Modal ou page détail au clic
- [ ] **Thématique tribal**: Emblèmes SVG, couleurs par faction

### Section Lieux importants
- [ ] Créer le composant LocationCard
- [ ] Card pour chaque lieu
  - [ ] Nom du lieu
  - [ ] Image/illustration
  - [ ] Description
  - [ ] Importance dans l'histoire
- [ ] Grille avec ImageCard
- [ ] **Thématique tribal**: Style carte ancienne

### Section Chronologie (optionnel)
- [ ] Créer le composant TimelineEvent
- [ ] Frise chronologique verticale
- [ ] Événements clés de l'histoire
- [ ] Date/époque + description
- [ ] Marqueurs visuels
- [ ] **Thématique tribal**: Ligne rituelle, marqueurs tribaux

### Navigation Univers
- [ ] Sidebar avec sections (Aside)
  - [ ] Histoire
  - [ ] Factions
  - [ ] Lieux
  - [ ] Chronologie
- [ ] Scroll spy actif
- [ ] Mobile: menu dropdown ou accordion

### Intégration Page Universe
- [ ] Assembler tous les composants
- [ ] Layout avec aside navigation
- [ ] Transitions entre sections
- [ ] SEO: meta title, description

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
- [ ] Créer le composant ScrollToTop
- [ ] Bouton fixe en bas à droite
- [ ] Apparaît après scroll
- [ ] Animation smooth au clic
- [ ] **Thématique tribal**: Icône flèche tribale

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
