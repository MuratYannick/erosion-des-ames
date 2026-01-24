# Phase 1: Fondations UI

**Branche**: `feature/phase-1-ui-foundations`

---

## 1.1 Configuration du système de design

### Palette de couleurs (`tailwind.config.js`)
- [x] Couleurs primaires (thème dark/fantasy)
- [x] Couleurs secondaires
- [x] Couleurs d'état (success, error, warning, info)
- [x] Couleurs de texte (primary, secondary, muted)
- [x] Couleurs de fond (background, surface, overlay)

### Typographie
- [x] Importer les fonts (Google Fonts)
- [x] Font principale (corps de texte) → Patrick Hand
- [x] Font d'affichage (titres) → Metal Mania, Rubik Distressed, Rubik Moonrocks
- [x] Fonts complémentaires → Architects Daughter, Caveat, Indie Flower, Permanent Marker
- [x] Échelle typographique (xs, sm, base, lg, xl, 2xl, etc.)
- [x] Line-height adaptés aux fonts handwritten

### Espacements et breakpoints
- [x] Breakpoints responsive (sm, md, lg, xl, 2xl) → Tailwind par défaut
- [x] Espacements custom (échelle 4px dans tailwind.config.js)

### Variables CSS custom (`index.css`)
- [x] Variables pour les transitions (durées + easing organiques)
- [x] Variables pour les ombres (subtiles, glow feu sacré, élevées, dark)
- [x] Variables pour les border-radius (rough, stone)
- [x] Z-index scale
- [x] Filtres spéciaux (dust, aged, faded)
- [x] Classes utilitaires (.transition-organic, .card-tribal, .btn-base, etc.)

---

## 1.2 Composants principaux réutilisables

### Structure des fichiers
```
frontend/src/
├── components/
│   ├── ui/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   ├── Button.css
│   │   │   └── index.js
│   │   ├── MenuBurgerButton/
│   │   ├── Input/
│   │   ├── Textarea/
│   │   ├── Card/
│   │   ├── ImageCard/
│   │   ├── Modal/
│   │   ├── Loader/
│   │   ├── Alert/
│   │   ├── Toast/
│   │   ├── Avatar/
│   │   ├── Badge/
│   │   ├── Dropdown/
│   │   ├── Pagination/
│   │   └── Tooltip/
│   └── index.js          # Export centralisé ✅
```

### Button ✅
- [x] Créer le composant
- [x] Variantes: `primary`, `secondary`, `outline`, `danger`, `ghost`
- [x] Tailles: `sm`, `md`, `lg`
- [x] États: `disabled`, `loading`
- [x] Support des icônes (left/right)
- [x] Props: `variant`, `size`, `disabled`, `loading`, `icon`, `iconPosition`, `onClick`, `type`, `className`
- [x] **Thématique tribal**: Textures (fire, stone, rust), TribalSpinner, corner marks, fire particles animation

### MenuBurgerButton ✅ (existait déjà)
- [x] Créer le composant
- [x] Animation open/close (3 barres → X)
- [x] Props: `isOpen`, `onClick`, `className`

### Input ✅
- [x] Créer le composant
- [x] Types: `text`, `email`, `password`, `number`
- [x] États: `error`, `success`, `disabled`
- [x] Label intégré (optionnel)
- [x] Message d'erreur/aide
- [x] Icône (left/right)
- [x] Props: `type`, `label`, `error`, `helperText`, `icon`, `iconPosition`, `disabled`, `className`
- [x] **Thématique tribal**: Ember ignition focus animation, TribalEye password toggle, tribal state icons, label ritual underline

### Textarea ✅
- [x] Créer le composant (séparé de Input)
- [x] Auto-resize optionnel
- [x] Compteur de caractères optionnel
- [x] Props: `label`, `error`, `helperText`, `maxLength`, `showCount`, `rows`, `autoResize`
- [x] **Thématique tribal**: RuneTally character counter avec barre de progression tribale

### Card ✅
- [x] Créer le composant
- [x] Variantes: `default`, `bordered`, `elevated`
- [x] Sections: `CardHeader`, `CardBody`, `CardFooter`
- [x] Props: `variant`, `padding`, `className`
- [x] **Thématique tribal**: 4 variantes supplémentaires (`tribal`, `fire`, `rusted`, `ancient`)
- [x] **Effets**: `dust`, `weathered`, `crack`
- [x] **Animations**: `emerge`, `flicker`, `settle`
- [x] **Décorations SVG**: `TribalCorner`, `TribalDivider`

### ImageCard ✅ (existait déjà)
- [x] Créer le composant
- [x] Container pour images avec ratio préservé
- [x] Effets visuels (FX): `hover-zoom`, `overlay`, `blur`, `grayscale`
- [x] Caption/légende optionnelle
- [x] Props: `src`, `alt`, `ratio`, `fx`, `caption`, `className`

### Modal ✅
- [x] Créer le composant
- [x] Overlay avec fermeture au clic
- [x] Fermeture avec Escape
- [x] Tailles: `sm`, `md`, `lg`, `fullscreen`
- [x] Header avec titre et bouton fermer
- [x] Body scrollable
- [x] Footer pour actions
- [x] Animation d'ouverture/fermeture
- [x] Props: `isOpen`, `onClose`, `title`, `size`, `children`
- [x] **Thématique tribal**: Stone portal frame, corner decorations SVG, ritual overlay

### Loader/Spinner ✅
- [x] Créer le composant
- [x] Variantes: `spinner`, `dots`, `bars`
- [x] Tailles: `sm`, `md`, `lg`
- [x] Mode fullscreen avec overlay
- [x] Props: `variant`, `size`, `fullscreen`, `text`
- [x] **Thématique tribal**:
  - `SoulVortex` (spinner) - cercles concentriques rituels
  - `HeartbeatDots` (dots) - triangles ember pulsants
  - `RitualChantBars` (bars) - barres oscillantes avec bords dentelés
  - Altar stones corners, ash particles, radial aura

### Alert/Toast ✅
- [x] Créer le composant Alert (inline)
- [x] Créer le composant Toast (notification flottante)
- [x] Variantes: `success`, `error`, `warning`, `info`
- [x] Icône automatique selon variante
- [x] Bouton de fermeture optionnel
- [x] Auto-dismiss pour Toast
- [x] Toast container (position: top-right, bottom-right, etc.)
- [x] Props Alert: `variant`, `title`, `message`, `dismissible`, `onDismiss`
- [x] Props Toast: `variant`, `message`, `duration`, `position`
- [x] **Thématique tribal**:
  - Alert: Stone tablet style, carved stone warnings
  - Toast: Spirit whisper style, glow effects, progress bar
  - Icons tribaux: Life Sprout (success), Fractured Circle (error), Ritual Triangle (warning), Sacred Scroll (info)
  - `ToastProvider` et `useToast` hook

### Avatar ✅
- [x] Créer le composant
- [x] Affichage image avec fallback (initiales ou icône)
- [x] Tailles: `xs`, `sm`, `md`, `lg`, `xl`
- [x] Forme: `circle`, `square`
- [x] Badge de statut optionnel (online, offline, busy, away)
- [x] Props: `src`, `alt`, `name`, `size`, `shape`, `status`
- [x] **Thématique tribal**: Stone frame border, ritual ring option, DefaultUserIcon tribal, AvatarGroup

### Badge ✅
- [x] Créer le composant
- [x] Variantes: `default`, `primary`, `secondary`, `success`, `error`, `warning`, `info`
- [x] Tailles: `sm`, `md`
- [x] Avec icône optionnelle
- [x] Props: `variant`, `size`, `icon`, `children`
- [x] **Thématique tribal**: TribalDot decoration

### Dropdown ✅
- [x] Créer le composant
- [x] Trigger (bouton ou custom)
- [x] Menu avec items
- [x] Position auto (top, bottom, left, right)
- [x] Fermeture au clic extérieur
- [x] Support clavier (Escape, Enter, flèches)
- [x] Props: `trigger`, `items`, `position`, `className`
- [x] Item props: `label`, `icon`, `onClick`, `disabled`, `divider`
- [x] **Thématique tribal**: Stone tablet menu, DropdownDivider, DropdownHeader

### Pagination ✅
- [x] Créer le composant
- [x] Affichage: première, précédente, pages, suivante, dernière
- [x] Ellipsis pour nombreuses pages
- [x] Info "Page X sur Y" optionnelle
- [x] Props: `currentPage`, `totalPages`, `onPageChange`, `showInfo`
- [x] **Thématique tribal**: Tribal ellipsis dots, chevron icons

### Tooltip ✅
- [x] Créer le composant
- [x] Positions: `top`, `bottom`, `left`, `right`
- [x] Trigger: `hover`, `click`
- [x] Délai d'apparition configurable
- [x] Props: `content`, `position`, `trigger`, `delay`, `children`

---

## 1.3 Layouts - Header et Footer ✅

### Structure des fichiers
```
frontend/src/
├── layouts/
│   ├── MainLayout/
│   │   ├── MainLayout.jsx   ✅
│   │   ├── Header.jsx       ✅
│   │   ├── Header.css       ✅
│   │   ├── Footer.jsx       ✅
│   │   ├── Footer.css       ✅
│   │   └── index.js         ✅
│   └── index.js             ✅
```

### Header principal ✅
- [x] Créer le composant Header
- [x] Logo cliquable (retour accueil) - LogoEmblem SVG tribal avec animation
- [x] Navigation principale
  - [x] Liens: Accueil, Avant-propos, Univers, Personnages, Forum
  - [x] Style actif pour la page courante (NavLink)
  - [x] Séparateurs tribaux (NavDivider)
- [x] Zone utilisateur
  - [x] Non connecté: boutons Connexion / Inscription (btn-auth styles)
  - [x] Connecté: Avatar + dropdown (Profil, Mes personnages, Déconnexion)
- [x] Menu burger (responsive mobile/tablette) - BurgerIcon animé
- [x] Menu mobile slide-in avec animation (mobile-menu-overlay)
- [x] Responsive: desktop / tablette / mobile
- [x] **Thématique tribal**: Stone texture, HeaderBorder carved edge, ritual animations

### Footer principal ✅
- [x] Créer le composant Footer
- [x] Colonnes de liens
  - [x] Navigation (liens principaux)
  - [x] Informations (Mentions légales, CGU, Contact)
  - [x] Réseaux sociaux (Discord, Twitter, GitHub)
- [x] Copyright avec année dynamique
- [x] Responsive (1 colonne mobile, 2 tablette, 4 desktop)
- [x] **Thématique tribal**: FooterBorder foundation edge, social icons avec hover tribal, tagline

### Layout principal (MainLayout) ✅
- [x] Créer le composant wrapper
- [x] Structure: Header + main content + Footer
- [x] Main avec min-height pour footer sticky (flex-1)
- [x] Intégration avec React Router (Outlet)
- [x] Props: user, onLogin, onRegister, onLogout, showHeader, showFooter

### Sidebar ✅
- [x] Créer le composant Sidebar
- [x] 3 variantes: `navigation`, `dashboard`, `forum`
- [x] Collapsible sur desktop (64px icon-only)
- [x] Slide-in sur mobile avec backdrop
- [x] Position: `left` ou `right`
- [x] Persistence de l'état (localStorage)
- [x] **Thématique tribal**:
  - SidebarBorder (vertical carved pillar)
  - SectionRitualMark (tribal section divider)
  - CollapseTotem (diamond frame collapse button)
  - Ember glow sur items actifs
  - Animations staggered slide-in
- [x] Sous-composants:
  - SidebarHeader, SidebarSection, SidebarNav
  - SidebarNavItem, SidebarNavGroup (collapsible)
  - SidebarStats, SidebarStatItem (dashboard)
  - SidebarUserInfo (dashboard)
  - SidebarFilters, SidebarFilterButton (forum)
  - SidebarSkeleton, SidebarEmpty (loading/empty states)

---

## Ordre de réalisation suggéré

1. ~~**Configuration système de design** - Base pour tout le reste~~ ✅
2. ~~**Button** - Composant le plus utilisé~~ ✅
3. ~~**Input / Textarea** - Formulaires de base~~ ✅
4. ~~**Loader/Spinner** - Feedback utilisateur~~ ✅
5. ~~**Alert/Toast** - Notifications~~ ✅
6. ~~**Card / ImageCard** - Conteneurs de contenu~~ ✅
7. ~~**Avatar / Badge** - Éléments d'interface~~ ✅
8. ~~**Modal** - Interactions complexes~~ ✅
9. ~~**Dropdown** - Navigation et menus~~ ✅
10. ~~**MenuBurgerButton** - Préparation header~~ ✅
11. ~~**Tooltip** - Finition UX~~ ✅
12. ~~**Pagination** - Listes paginées~~ ✅
13. ~~**Header** - Layout principal~~ ✅
14. ~~**Footer** - Layout principal~~ ✅
15. ~~**MainLayout** - Assemblage final~~ ✅

---

## Critères de validation

- [x] Tous les composants sont responsives
- [x] Tous les composants supportent className pour override
- [x] Accessibilité de base (focus visible, aria-labels)
- [x] Pas de style hardcodé, utilisation de Tailwind + CSS modules
- [x] Export centralisé depuis `components/index.js`
- [x] Export centralisé depuis `layouts/index.js`
- [x] Test visuel de chaque composant (à faire manuellement)

---

## Résumé Phase 1.2 - Composants UI

### Composants complétés: 14/14 ✅

| Composant | Fichiers | Éléments thématiques |
|-----------|----------|---------------------|
| Button | Button.jsx, Button.css | TribalSpinner, textures fire/stone/rust, corner marks |
| Card | Card.jsx, Card.css, TribalCorner.jsx, TribalDivider.jsx | 4 variantes tribales, effets visuels, animations |
| Input | Input.jsx, Input.css | TribalEye, ember focus, state icons |
| Textarea | Textarea.jsx | RuneTally counter |
| Loader | Loader.jsx, Loader.css | SoulVortex, HeartbeatDots, RitualChantBars |
| Alert | Alert.jsx, Alert.css | Stone tablet style, tribal icons |
| Toast | Toast.jsx, Toast.css | Spirit whisper, ToastProvider, useToast |
| Badge | Badge.jsx | TribalDot |
| Avatar | Avatar.jsx, Avatar.css | Stone frame, ritual ring, AvatarGroup |
| Modal | Modal.jsx, Modal.css | Portal frame, corner decorations |
| Dropdown | Dropdown.jsx, Dropdown.css | Stone tablet menu |
| Tooltip | Tooltip.jsx | 4 positions, hover/click |
| Pagination | Pagination.jsx | Tribal ellipsis |
| MenuBurgerButton | (existant) | Animation 3 barres → X |
| ImageCard | (existant) | Effets visuels FX |

### Import centralisé
```js
import {
  Button, Card, Input, Textarea,
  Loader, Alert, Toast, useToast,
  Badge, Avatar, Modal, Dropdown,
  Tooltip, Pagination
} from '@/components'
```

---

## Résumé Phase 1.3 - Layouts ✅

### Composants créés

| Composant | Fichiers | Éléments thématiques |
|-----------|----------|---------------------|
| Header | Header.jsx, Header.css | LogoEmblem, NavDivider, HeaderBorder, BurgerIcon tribal |
| Footer | Footer.jsx, Footer.css | FooterBorder, social icons, MobileDivider |
| MainLayout | MainLayout.jsx | Wrapper avec Header + Outlet + Footer |

### Éléments SVG tribaux

- **LogoEmblem**: Emblème sacré 64x64 avec cercles rituels et flamme centrale
- **NavDivider**: Diamant tribal entre les liens de navigation
- **HeaderBorder**: Bordure gravée avec marqueurs rituels
- **FooterBorder**: Bordure de fondation plus épaisse
- **BurgerIcon**: Icône menu avec cercles centraux

### Fonctionnalités

- Navigation responsive (desktop, tablette, mobile)
- Menu mobile slide-in avec animation séquentielle
- Zone utilisateur avec états connecté/déconnecté
- Header sticky avec compression au scroll
- Footer avec 4 colonnes et icônes sociales
- Intégration React Router (NavLink, Outlet)

### Import centralisé
```js
import {
  MainLayout,
  Header,
  Footer,
  LogoEmblem,
  HeaderBorder,
  FooterBorder,
  NavDivider,
} from '@/layouts'
```

---

## Phase 1 Complète ✅

Toutes les fondations UI sont maintenant en place :
- **1.1** Configuration système de design ✅
- **1.2** Composants UI (14/14) ✅
- **1.3** Layouts (Header, Footer, MainLayout) ✅
