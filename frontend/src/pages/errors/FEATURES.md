# Pages d'Erreur - Erosion des Âmes

> Système complet de pages d'erreur avec design tribal immersif, animations CSS natives et architecture React moderne.

## Vue d'ensemble

Ce système offre **4 pages d'erreur thématiques** entièrement personnalisées, un composant **ErrorBoundary** pour capturer les erreurs React, et un composant **ErrorPage** réutilisable pour créer facilement de nouvelles pages.

**Total:** 3373+ lignes de code | 14 fichiers | 0 dépendances externes lourdes

---

## Pages Disponibles

### 🧭 404 - Chemin Perdu

<table>
<tr>
<td width="50%">

**Thématique**
- Boussole tribale brisée
- Aiguille oscillante perdue
- Symboles cardinaux effacés
- Particules de sable

**Métaphore**
> "Les repères ancestraux se sont effacés. Le chemin que vous cherchez n'existe plus dans nos territoires."

**Actions**
- Retour à l'accueil (primary)
- Page précédente (secondary)

</td>
<td width="50%">

**Animations CSS**
- `float-lost` - Flottement doux 6s
- `compass-needle-drift` - Oscillation 4s
- Particules de sable en mouvement

**Design**
- Fond: `neutral-50` → `primary-50`
- Code couleur: `text-secondary-500`
- Illustrations: Motifs tribaux authentiques

**Responsive**
- Mobile: 48×48px
- Tablet: 56×56px
- Desktop: 64×64px
- Large: 72×72px

</td>
</tr>
</table>

---

### 🗿 403 - Territoire Interdit

<table>
<tr>
<td width="50%">

**Thématique**
- Totem gardien imposant
- Yeux mystiques animés
- Flammes sacrées dansantes
- Bras protecteurs avec griffes

**Métaphore**
> "Ce territoire sacré est gardé par les Anciens. Seuls les initiés peuvent franchir ce seuil."

**Actions**
- Retour à l'accueil (primary)
- Se connecter (secondary si non auth)

</td>
<td width="50%">

**Animations CSS**
- `guardian-watch` - Clignement 6s
- `sacred-flame` - Flammes 2s
- `totem-glow` - Lueur pulsante 3s
- 3 flammes avec délais décalés

**Design**
- Fond: `error-light/10` → `error-dark/5`
- Code couleur: `text-error-DEFAULT`
- Props: `userAuthenticated` adapte le message

**Intelligence**
- Message différent selon état auth
- Bouton "Se connecter" conditionnel

</td>
</tr>
</table>

---

### ⚡ 500 - Perturbation Spirituelle

<table>
<tr>
<td width="50%">

**Thématique**
- Vortex chaotique en rotation
- Particules énergétiques éclatées
- Éclairs spirituels
- Spirales contre-rotatives

**Métaphore**
> "Les forces primordiales sont en déséquilibre. Une perturbation spirituelle affecte nos systèmes."

**Actions**
- Réessayer (primary avec callback)
- Retour à l'accueil (secondary)

</td>
<td width="50%">

**Animations CSS**
- `vortex-spin` - Rotation externe 8s
- `vortex-spin-reverse` - Rotation interne 6s
- `energy-particle` - 4 particules 3s
- Éclairs énergétiques

**Design**
- Fond: `warning-light/15` → `secondary-900/20`
- Code couleur: `text-secondary-600`
- Props: `onRetry` callback personnalisé

**Flexibilité**
- Retry personnalisable ou reload par défaut
- Utilisé par ErrorBoundary

</td>
</tr>
</table>

---

### 🔥 Maintenance - Rituel en Cours

<table>
<tr>
<td width="50%">

**Thématique**
- Autel rituel sacré
- Flammes mystiques variées
- Fumée montante
- Offrandes et cristaux

**Métaphore**
> "Les Anciens effectuent un rituel de restauration. Les territoires sont temporairement inaccessibles."

**Actions**
- Rafraîchir avec compte à rebours (primary)
- Toggle auto-refresh (60s par défaut)

</td>
<td width="50%">

**Animations CSS**
- `ritual-flame` - 4 flammes 2.5s
- `ritual-smoke` - Fumée montante 4s
- `altar-pulse` - Lueur pulsante 3s
- Délais décalés pour effet naturel

**Design**
- Fond: `secondary-50` → `primary-100`
- Pas de code d'erreur (page positive)
- Props: `estimatedTime`, `message` custom

**Fonctionnalités**
- Auto-refresh intelligent
- Compte à rebours visible
- Toggle activable/désactivable

</td>
</tr>
</table>

---

## Architecture Technique

### 📦 Composants de Base

#### ErrorPage.jsx (136 lignes)

Composant réutilisable hautement configurable.

**Props:**
```typescript
{
  code?: string                    // Code d'erreur (404, 403, etc.)
  title: string                    // Titre principal
  message: string                  // Message explicatif
  secondaryMessage?: string        // Message additionnel
  illustration?: ReactNode         // Composant SVG
  actions?: Array<{
    label: string
    onClick: () => void
    variant: 'primary' | 'secondary' | 'outline' | 'danger'
    icon?: ReactNode
  }>
  showHomeLink?: boolean          // Lien accueil par défaut
  backgroundGradient?: string     // Classes Tailwind
  codeColor?: string              // Couleur du code
}
```

**Fonctionnalités:**
- Layout responsive automatique
- Actions personnalisables ou par défaut
- Navigation intelligente (historique ou accueil)
- Animations d'entrée en cascade
- Support complet des icônes Lucide

---

#### ErrorBoundary.jsx (119 lignes)

Classe React pour capturer les erreurs de rendu.

**Props:**
```typescript
{
  children: ReactNode              // Composants à surveiller
  fallback?: ReactNode | Function  // UI de remplacement
  onError?: (error, errorInfo) => void  // Callback d'erreur
}
```

**Fonctionnalités:**
- Capture `componentDidCatch` native React
- Fallback par défaut vers ServerError
- Support des fallbacks fonctionnels
- Méthode `handleReset` pour réinitialiser
- Logging en console + callback personnalisé
- Prêt pour intégration Sentry/LogRocket

---

#### ErrorPage.css (452 lignes)

Système d'animations CSS complet et performant.

**Animations principales:**
- `pulse-error-code` - Pulsation subtile 3s
- `float-lost` - Flottement organique 6s
- `compass-needle-drift` - Oscillation réaliste 4s
- `guardian-watch` - Clignement d'yeux 6s
- `sacred-glow` - Lueur mystique 3s
- `sacred-flame` - Flammes dynamiques 2s
- `vortex-spin` - Rotation fluide 8s
- `vortex-spin-reverse` - Contre-rotation 6s
- `energy-particle` - Éjection particulaire 3s
- `ritual-flame` - Flammes rituelles 2.5s
- `ritual-smoke` - Fumée montante 4s
- `altar-pulse` - Pulsation sacrée 3s
- `fade-in-up` - Apparition progressive 0.6s

**Optimisations:**
- Transformations GPU (`transform`, pas `top`/`left`)
- Opacité optimisée
- Réduction amplitude sur mobile
- Support `prefers-reduced-motion`
- Dark mode compatible

---

## Documentation Complète

### 📖 Fichiers de Documentation

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `README.md` | 391 | Guide complet d'utilisation et API |
| `INTEGRATION_EXAMPLE.jsx` | 430 | 10 patterns d'intégration React Router |
| `CHANGELOG.md` | 253 | Historique des versions et roadmap |
| `FEATURES.md` | Ce fichier | Vue d'ensemble visuelle |
| `ErrorPages.test.jsx` | 300 | Suite de tests complète |
| `ErrorPagesDemo.jsx` | 200 | Page de démo interactive |

---

## Statistiques du Projet

### Code Source

```
Total général:    3373+ lignes
Composants:         709 lignes (21%)
Pages:             1086 lignes (32%)
Tests:              300 lignes (9%)
Documentation:     1278 lignes (38%)
```

### Fichiers

```
Components:    4 fichiers
Pages:        10 fichiers
Total:        14 fichiers
```

### Complexité

```
Composants React:     7
SVG Illustrations:    4 (complexes, animés)
Animations CSS:      15
Tests unitaires:     40+
Exemples code:       10
```

---

## Points Forts

### ✅ Design & UX

- **Cohérence thématique absolue** avec l'univers "Erosion des Âmes"
- **Métaphores immersives** (Anciens, territoires, rituels)
- **Illustrations SVG originales** avec motifs tribaux authentiques
- **Animations organiques** respectant le thème post-apocalyptique
- **Responsive mobile-first** strict sur tous les composants

### ✅ Performance

- **SVG inline** - Pas de requêtes réseau
- **Animations CSS pures** - Pas de JavaScript
- **Transformations GPU** - Fluidité optimale
- **Lazy loading** du ServerError dans ErrorBoundary
- **Bundle minimal** - Pas de dépendances lourdes

### ✅ Accessibilité

- **ARIA attributes** sur éléments critiques
- **Support prefers-reduced-motion** complet
- **Contraste WCAG 2.1 AA** respecté
- **Navigation clavier** fonctionnelle
- **Labels explicites** sur tous les boutons
- **SVG aria-hidden** pour ne pas polluer les lecteurs d'écran

### ✅ Maintenabilité

- **Architecture modulaire** - Composants réutilisables
- **TypeScript-ready** - Props bien typées (JSDoc)
- **Tests exhaustifs** - 300+ lignes de tests
- **Documentation complète** - 1278 lignes
- **Exemples pratiques** - 10 patterns d'intégration

### ✅ Extensibilité

- **Composant ErrorPage** réutilisable pour nouvelles pages
- **Props flexibles** - Personnalisation totale
- **Animations modulaires** - Réutilisables ailleurs
- **Thème adaptable** - Couleurs via Tailwind config
- **Fallback personnalisables** dans ErrorBoundary

---

## Technologies & Dépendances

### Requis

- **React** 18.0.0+ - Hooks et composants modernes
- **react-router-dom** 6.0.0+ - Navigation et useNavigate
- **lucide-react** - Icônes (Home, ArrowLeft, RefreshCw, etc.)
- **TailwindCSS** 3.0.0+ - Avec config personnalisée du projet

### Optionnel (Recommandé)

- **@testing-library/react** - Pour les tests
- **jest** - Runner de tests
- **Sentry** / **LogRocket** - Monitoring d'erreurs en production

---

## Utilisation Rapide

### Installation

```bash
# Déjà inclus dans le projet "Erosion des Âmes"
cd frontend/src
```

### Intégration Basique

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/errors'
import { NotFound, Forbidden, ServerError } from './pages/errors'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* ... autres routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
```

### Page Personnalisée

```jsx
import ErrorPage from './components/errors/ErrorPage'
import { Coffee } from 'lucide-react'

const TeapotError = () => (
  <ErrorPage
    code="418"
    title="Je suis une théière"
    message="Impossible de préparer du café."
    illustration={<MyTeapotSVG />}
    actions={[{
      label: 'Commander du thé',
      onClick: () => navigate('/tea'),
      variant: 'primary',
      icon: <Coffee />
    }]}
  />
)
```

---

## Demo & Tests

### Page de Démo Interactive

En développement, accéder à `/demo/errors` pour:
- Naviguer entre toutes les pages d'erreur
- Tester les différentes options (auth 403, retry 500)
- Déclencher une erreur pour tester ErrorBoundary
- Visualiser les animations en temps réel

### Lancer les Tests

```bash
npm test ErrorPages.test.jsx
```

**Coverage:**
- Tests unitaires de chaque page
- Tests du ErrorBoundary
- Tests de responsive design
- Tests d'accessibilité
- Tests des animations

---

## Roadmap

### Version 1.1.0 (Prochaine)

- [ ] Page 401 Unauthorized
- [ ] Page 429 Too Many Requests
- [ ] Page 503 Service Unavailable
- [ ] Dark mode pour toutes les pages
- [ ] Sons d'ambiance optionnels

### Version 1.2.0 (Future)

- [ ] Animations WebGL pour illustrations
- [ ] Internationalisation (i18n)
- [ ] Thèmes de couleurs alternatifs
- [ ] Easter eggs interactifs
- [ ] Storybook complet

---

## Support

**Documentation:** Voir `README.md` pour le guide complet

**Exemples:** Consulter `INTEGRATION_EXAMPLE.jsx` pour 10 patterns

**Demo:** Lancer `ErrorPagesDemo.jsx` en dev

**Tests:** Référence dans `ErrorPages.test.jsx`

**Issues:** Contact maintainers du projet

---

## Licence

Propriétaire - Projet "Erosion des Âmes"

---

## Crédits

**Design & Concept:** ui-web-designer
**Développement Frontend:** frontend-tailwind-react
**Framework:** React + TailwindCSS
**Inspirations:** Design tribal, univers post-apocalyptique, spiritualité ancestrale

---

<div align="center">

**Erosion des Âmes - Pages d'Erreur v1.0.0**

*"Même dans l'erreur, les Anciens veillent sur vous."*

🧭 • 🗿 • ⚡ • 🔥

</div>
