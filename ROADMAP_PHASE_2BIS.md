# ROADMAP Phase 2bis - Correctifs et Optimisations

## Contexte
Cette phase regroupe les correctifs et optimisations apportés suite à la phase 2 (pages statiques et navigation).

---

## Correctifs apportés

### 1. Suppression du scroll parasite sur la page Home
**Fichier modifié :** `frontend/src/pages/Home/Home.css`

**Problème :** Un double scroll apparaissait sur la page (html + .home-page), créant une expérience utilisateur dégradée.

**Solution :** Suppression de `overflow-x: hidden` sur `.home-page` qui créait un contexte de scroll distinct.

```css
/* Avant */
.home-page {
  width: 100%;
  overflow-x: hidden;
}

/* Après */
.home-page {
  width: 100%;
}
```

---

### 2. Images hero responsives (optimisation performance)
**Fichiers modifiés :**
- `frontend/src/pages/Home/components/HeroSection.jsx`
- `frontend/index.html`

**Problème :** L'image hero (`banner.png`) était trop lourde pour les appareils mobiles et tablettes.

**Solution :** Utilisation de l'élément `<picture>` avec des sources adaptées à chaque breakpoint.

**Images créées :**
| Breakpoint | Largeur écran | Image | Dimensions |
|------------|---------------|-------|------------|
| xs (fallback) | < 640px | `banner-xs.png` | 707×215 |
| sm | ≥ 640px | `banner-sm.png` | 848×258 |
| md | ≥ 768px | `banner-md.png` | 1131×345 |
| lg | ≥ 1024px | `banner-lg.png` | 1413×431 |
| xl | ≥ 1280px | `banner-xl.png` | 1696×517 |
| 2xl | ≥ 1536px | `banner-2xl.png` | 2035×620 |

*Note : Les images sont plus larges que les breakpoints pour accommoder l'effet de panoramique (pan) horizontal.*

**Preloads responsifs ajoutés dans `index.html` :**
```html
<link rel="preload" as="image" href="/images/banner-xs.png" media="(max-width: 639px)" fetchpriority="high" />
<link rel="preload" as="image" href="/images/banner-sm.png" media="(min-width: 640px) and (max-width: 767px)" fetchpriority="high" />
<link rel="preload" as="image" href="/images/banner-md.png" media="(min-width: 768px) and (max-width: 1023px)" fetchpriority="high" />
<link rel="preload" as="image" href="/images/banner-lg.png" media="(min-width: 1024px) and (max-width: 1279px)" fetchpriority="high" />
<link rel="preload" as="image" href="/images/banner-xl.png" media="(min-width: 1280px) and (max-width: 1535px)" fetchpriority="high" />
<link rel="preload" as="image" href="/images/banner-2xl.png" media="(min-width: 1536px)" fetchpriority="high" />
```

---

### 3. Correction du débordement header/contenu sur mobile
**Fichiers modifiés :**
- `frontend/src/layouts/MainLayout/Header.jsx`

**Problème :** Sur les écrans < 1024px, l'image hero débordait au-dessus de la bordure du header. Cela était dû à une incohérence entre :
- La hauteur CSS du header (56px sur mobile via media query)
- La hauteur du contenu interne (70px fixe en Tailwind)

**Solution :** Rendre la hauteur du contenu interne responsive avec Tailwind pour correspondre aux hauteurs attendues.

```jsx
/* Avant */
<div className="w-full px-4 sm:px-6 h-[70px] flex items-center justify-between relative z-10">

/* Après */
<div className="w-full px-4 sm:px-6 h-[48px] lg:h-[70px] flex items-center justify-between relative z-10">
```

**Calcul des hauteurs :**
- **Mobile (< 1024px)** : 48px nav + 8px bordure tribale = 56px total
- **Desktop (≥ 1024px)** : 70px nav + 8px bordure tribale = 78px total

---

### 4. Navbar éléments aux bords de la fenêtre
**Fichier modifié :** `frontend/src/layouts/MainLayout/Header.jsx`

**Problème :** Les éléments de la navbar (logo et menu burger) n'étaient pas alignés aux bords de la fenêtre au-delà de 640px à cause de `container mx-auto`.

**Solution :** Remplacement par `w-full px-4 sm:px-6` pour un padding fixe sans centrage par container.

---

## Résumé des fichiers modifiés

| Fichier | Type de modification |
|---------|---------------------|
| `frontend/src/pages/Home/Home.css` | Suppression overflow-x |
| `frontend/src/pages/Home/components/HeroSection.jsx` | Images responsives avec picture |
| `frontend/src/pages/Home/components/HeroSection.css` | Déjà modifié en phase 2 |
| `frontend/src/layouts/MainLayout/Header.jsx` | Hauteur nav responsive |
| `frontend/src/layouts/MainLayout/MainLayout.jsx` | Nettoyage (retrait padding-top) |
| `frontend/index.html` | Preloads responsifs |

---

## Tests effectués

- [x] Vérification scroll page Home (plus de double scroll)
- [x] Vérification chargement images responsives selon breakpoint
- [x] Vérification alignement header/contenu sur écrans < 1024px
- [x] Vérification alignement header/contenu sur écrans ≥ 1024px
- [x] Vérification navbar aux bords de la fenêtre

---

---

### 5. Correction du bug de tremblement des marqueurs sur la carte
**Fichiers modifiés :**
- `frontend/src/pages/Universe/components/WorldMap.jsx`
- `frontend/src/pages/Universe/components/WorldMap.css`

**Problème :** Les marqueurs de la carte interactive bougeaient dans tous les sens au survol de la souris, créant une boucle infinie mouseEnter/mouseLeave qui empêchait de cliquer dessus.

**Cause :** Le `transform: scale()` appliqué au groupe SVG `<g>` au hover déplaçait tous les éléments, y compris la zone de détection des événements, provoquant le tremblement.

**Solution :**
1. Ajout d'un cercle de détection invisible (`r={30}`, `fill="transparent"`) qui reçoit tous les événements et ne scale jamais
2. Application de `pointerEvents="none"` sur les éléments visuels (lueur, cercle, icône)
3. Modification du CSS pour appliquer le scale uniquement aux éléments visuels, pas au groupe parent

```jsx
/* WorldMap.jsx - Zone de détection invisible */
<circle
  r={30}
  fill="transparent"
  onMouseEnter={onHover}
  onMouseLeave={onLeave}
  onClick={onClick}
/>
```

```css
/* WorldMap.css - Scale sur éléments visuels seulement */
.world-map__marker:hover .world-map__marker-circle,
.world-map__marker:hover .world-map__marker-glow {
  transform: scale(1.15);
}
```

---

### 6. Nettoyage du code - Éléments inutilisés
**Fichiers modifiés :**
- `frontend/src/pages/Home/components/PresentationSection.jsx`
- `frontend/src/pages/Home/Home.jsx`
- `frontend/src/components/ui/Sidebar/Sidebar.jsx`

**Modifications :**

| Fichier | Élément supprimé | Raison |
|---------|------------------|--------|
| `PresentationSection.jsx` | Paramètre `images` (lignes 18-22) | Les chemins d'images sont maintenant codés en dur avec sources responsives |
| `Home.jsx` | Prop `images` passée à PresentationSection | Paramètre supprimé du composant enfant |
| `Sidebar.jsx` | `isCollapsed` dans SidebarHeader (ligne 224) | Variable extraite du contexte mais jamais utilisée |
| `Sidebar.jsx` | `isCollapsed` dans SidebarSection (ligne 241) | Variable extraite du contexte mais jamais utilisée |

---

## Résumé des fichiers modifiés

| Fichier | Type de modification |
|---------|---------------------|
| `frontend/src/pages/Home/Home.css` | Suppression overflow-x |
| `frontend/src/pages/Home/components/HeroSection.jsx` | Images responsives avec picture |
| `frontend/src/pages/Home/components/HeroSection.css` | Déjà modifié en phase 2 |
| `frontend/src/pages/Home/components/PresentationSection.jsx` | Suppression paramètre images inutilisé |
| `frontend/src/pages/Home/Home.jsx` | Suppression prop images |
| `frontend/src/layouts/MainLayout/Header.jsx` | Hauteur nav responsive |
| `frontend/src/layouts/MainLayout/MainLayout.jsx` | Nettoyage (retrait padding-top) |
| `frontend/src/pages/Universe/components/WorldMap.jsx` | Correction bug marqueurs + zone détection |
| `frontend/src/pages/Universe/components/WorldMap.css` | Scale sur éléments visuels seulement |
| `frontend/src/components/ui/Sidebar/Sidebar.jsx` | Suppression variables inutilisées |
| `frontend/index.html` | Preloads responsifs |

---

## Tests effectués

- [x] Vérification scroll page Home (plus de double scroll)
- [x] Vérification chargement images responsives selon breakpoint
- [x] Vérification alignement header/contenu sur écrans < 1024px
- [x] Vérification alignement header/contenu sur écrans ≥ 1024px
- [x] Vérification navbar aux bords de la fenêtre
- [x] Vérification survol et clic des marqueurs sur la carte (plus de tremblement)
- [x] Vérification ESLint (plus de warnings pour éléments inutilisés sur fichiers actifs)

---

## Date
31 janvier 2026
