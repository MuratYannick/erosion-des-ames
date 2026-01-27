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

### Concept créatif: "Les Âmes Marquées - Sanctuaire des Légendes"
- Métaphore: Fragments d'âmes (Soul Shards) dans un sanctuaire mystique
- Cards hexagonales cristallines avec effets de fissures lumineuses
- Filtres style "Autel de Sélection" avec runes tribales
- Modal "Codex de l'Âme" style parchemin ancien

### Structure des fichiers (implémentée)
```
frontend/src/
├── pages/
│   ├── Characters/
│   │   ├── Characters.jsx             ✅
│   │   ├── Characters.css             ✅
│   │   ├── components/
│   │   │   ├── CharacterCard.jsx      ✅
│   │   │   ├── CharacterCard.css      ✅
│   │   │   ├── CharacterFilters.jsx   ✅
│   │   │   ├── CharacterFilters.css   ✅
│   │   │   ├── CharacterGrid.jsx      ✅
│   │   │   ├── CharacterGrid.css      ✅
│   │   │   ├── CharacterModal.jsx     ✅
│   │   │   ├── CharacterModal.css     ✅
│   │   │   ├── SoulShardElements.jsx  ✅
│   │   │   └── index.js               ✅
│   │   ├── data/
│   │   │   └── presetCharacters.js    ✅
│   │   └── index.js                   ✅
```

### Grille de personnages
- [x] Créer le composant CharacterGrid
- [x] Affichage en grille responsive (auto-fill 280px min)
- [x] Espacement cohérent (gap 2rem)
- [x] Animations d'apparition staggered (0.08s delay)
- [x] État vide si aucun résultat de filtre
- [x] Particules d'ambiance (braises flottantes)

### Card de personnage - "Soul Shard"
- [x] Créer le composant CharacterCard
- [x] Bordure cristalline SVG (SoulShardBorder)
- [x] Avatar/portrait avec placeholder race-symbol
- [x] Nom du personnage (Metal Mania)
- [x] Race/classe avec runes et symboles
- [x] Faction avec couleur et point lumineux
- [x] Courte description (ellipsis 2 lignes)
- [x] Runes de difficulté RP (DifficultyRunes)
- [x] Action au clic (ouvrir modal)
- [x] Effets hover: lueur faction, particules cendres, CTA
- [x] **Thématique tribal**: Fissures lumineuses, coins tribaux, lueur pulsante

### Système de filtres - "Autel de Sélection"
- [x] Créer le composant CharacterFilters
- [x] Style tablette rituelle avec ornements
- [x] Filtres implémentés:
  - [x] Par race (4 races: Humain, Marqué, Ombre, Braise)
  - [x] Par classe (6 classes: Guerrier, Chamane, Éclaireur, Guérisseur, Mystique, Artisan)
  - [x] Par faction (5 factions avec couleurs)
  - [x] Par niveau de difficulté RP (1-5)
- [x] Dropdown tribal personnalisé avec runes
- [x] Reset des filtres ("Réinitialiser les Runes")
- [x] Compteur de résultats avec SoulFlameIcon
- [x] **Thématique tribal**: Runes, ornements SVG, pattern watermark

### Modal détail personnage - "Codex de l'Âme"
- [x] Créer le composant CharacterModal
- [x] Overlay avec backdrop blur
- [x] Portrait en grand avec lueur faction
- [x] Informations complètes:
  - [x] Nom complet (Metal Mania 2rem)
  - [x] Race, âge, classe avec symboles
  - [x] Faction/allégeance avec emblème
  - [x] Citation du personnage
  - [x] Histoire/background (paragraphes)
  - [x] Traits de personnalité (Force/Faiblesse/Particularité)
  - [x] Capacités signature (liste)
  - [x] Équipement (liste)
  - [x] Notes pour le RP
- [x] Bouton "Incarner cette Âme" (désactivé pour v1)
- [x] Animations d'entrée en cascade
- [x] Focus trap et gestion clavier (Escape)
- [x] **Thématique tribal**: Parchemin ancien, bords brûlés, ornements

### Données des personnages (presetCharacters.js)
- [x] Structure de données complète
- [x] 8 personnages exemples variés:
  - Kael Cendrenuit (Guerrier Marqué)
  - Lyria Brumemonde (Mystique Ombre)
  - Theron Maindefer (Artisan Humain)
  - Vera Florenuit (Guérisseuse Braise)
  - Renn Piedléger (Éclaireur Humain)
  - Morgana Appelle-Tempête (Chamane Marquée)
  - Dex Ravaudombre (Éclaireur Ombre)
  - Alba Porteaurore (Guérisseuse Braise)
- [x] Diversité de races/classes/factions
- [x] Niveaux de difficulté RP variés (1-5)
- [x] Helpers: getRaceById, getClassById, getFactionById

### Éléments SVG tribaux (SoulShardElements.jsx)
- [x] SoulShardBorder - Bordure cristalline avec fissures
- [x] SoulFlameIcon - Flamme d'âme animée
- [x] DifficultyRunes - Système de runes 1-5
- [x] FactionGlow - Cercle de lueur faction
- [x] RaceSymbol - Symboles tribaux par race
- [x] ClassSymbol - Symboles par classe
- [x] AshParticles - Particules de cendres
- [x] ModalOrnament - Ornements décoratifs

### Intégration Page Characters
- [x] Header avec titre et introduction
- [x] Icône SoulFlame centrale
- [x] Ornements tribaux SVG
- [x] Filtres en haut (tablette rituelle)
- [x] Grille de personnages
- [x] ScrollToTop
- [x] Route /personnages configurée
- [x] Responsive design (breakpoints 480, 600, 768, 900, 1200px)
- [ ] SEO: meta title, description (reporté)

---

## Composants partagés pour pages statiques

### Structure des fichiers (implémentée)
```
frontend/src/
├── components/
│   ├── content/
│   │   ├── PageHeader.jsx         ✅
│   │   ├── PageHeader.css         ✅
│   │   ├── SectionTitle.jsx       ✅
│   │   ├── SectionTitle.css       ✅
│   │   ├── TextBlock.jsx          ✅
│   │   ├── TextBlock.css          ✅
│   │   ├── ImageGallery.jsx       ✅
│   │   ├── ImageGallery.css       ✅
│   │   ├── Breadcrumb.jsx         ✅
│   │   ├── Breadcrumb.css         ✅
│   │   └── index.js               ✅
│   └── ui/
│       └── ScrollToTop/           ✅ (existant)
```

### PageHeader
- [x] Créer le composant PageHeader
- [x] Titre de page (h1) avec Metal Mania
- [x] Sous-titre/description optionnelle
- [x] Image de fond optionnelle avec overlay
- [x] Breadcrumb optionnel intégré
- [x] Tailles: compact, default, large, hero
- [x] Alignements: left, center, right
- [x] **Thématique tribal**: Ornement SVG décoratif, bordure gravée

### SectionTitle
- [x] Créer le composant SectionTitle
- [x] Titre de section (h2-h6) avec styles par niveau
- [x] Icône optionnelle
- [x] Ancre auto-générée pour navigation (#id)
- [x] Sous-titre optionnel
- [x] **Thématique tribal**: Séparateur tribal SVG avec diamant

### TextBlock
- [x] Créer le composant TextBlock
- [x] Container pour texte long
- [x] Typography optimisée lecture (Patrick Hand 1.1rem)
- [x] Variantes: default, manuscript, quote, lore
- [x] Colonnes: 1-3 avec responsive
- [x] Drop caps optionnel (lettrine Metal Mania)
- [x] Sous-composants: Paragraph, BlockQuote, TribalList
- [x] **Thématique tribal**: Puces tribales ◇, style manuscrit

### ImageGallery
- [x] Créer le composant ImageGallery
- [x] Grille responsive 1-4 colonnes
- [x] Lightbox au clic avec animation
- [x] Navigation clavier (flèches, Escape)
- [x] Navigation boutons prev/next
- [x] Légendes optionnelles
- [x] Compteur d'images
- [x] Ratios: auto, square, 4/3, 16/9, 3/2

### ScrollToTop
- [x] Créer le composant ScrollToTop (existant dans ui/)
- [x] Bouton fixe en bas à droite
- [x] Apparaît après scroll
- [x] Animation smooth au clic
- [x] **Thématique tribal**: Icône flèche tribale

### Breadcrumb
- [x] Créer le composant Breadcrumb
- [x] Fil d'Ariane avec React Router Link
- [x] Liens cliquables (sauf dernier élément)
- [x] Icône maison pour l'accueil
- [x] Responsive: masque éléments intermédiaires sur mobile
- [x] **Thématique tribal**: Séparateurs tribaux SVG

---

## Configuration des routes

### Mise à jour de App.jsx ✅
Routes configurées:
- `/` → Home
- `/avant-propos` → Foreword
- `/univers` → Universe
- `/personnages` → Characters
- `/forum` → ForumPage (placeholder)
- `*` → NotFoundPage

### Navigation
- [x] Mettre à jour les liens dans Header (navItems configurés)
- [x] Activer les NavLink avec état actif (className isActive)
- [x] Scroll to top au changement de route (ScrollToTopOnNavigate)

### Composant ScrollToTopOnNavigate
```
frontend/src/components/utils/
├── ScrollToTopOnNavigate.jsx  ✅
└── index.js                   ✅
```

---

## Styles globaux pour contenu

### Typographie texte long
Couverts par `TextBlock.css` et les composants content:
- [x] Styles pour articles/prose (TextBlock variantes)
- [x] Headings hierarchy (SectionTitle h2-h6)
- [x] Paragraphes avec espacement (Paragraph component)
- [x] Listes stylisées ul/ol (TribalList avec puces ◇)
- [x] Blockquotes tribaux (BlockQuote component)
- [x] Links inline stylisés (TextBlock a styles)
- [x] **Thématique tribal**: Drop cap (TextBlock--drop-cap), underline rituel

### Utilitaires de mise en page
Couverts par Tailwind et variables CSS (index.css):
- [x] Container avec max-width (Tailwind `.container`, TextBlock--prose/wide/full)
- [x] Grid layouts prédéfinis (Tailwind `.grid`)
- [x] Spacing sections (variables --spacing-xs à --spacing-3xl)
- [x] Responsive breakpoints (Tailwind responsive modifiers)

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
