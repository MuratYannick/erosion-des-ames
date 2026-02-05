# Pages d'Erreur - Erosion des Âmes

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-e67315?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61dafb?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3+-38bdf8?style=for-the-badge&logo=tailwind-css)
![Status](https://img.shields.io/badge/status-production--ready-4a6f4d?style=for-the-badge)

**Système complet de pages d'erreur avec design tribal immersif**

[Documentation](#documentation) •
[Installation](#installation-rapide) •
[Demo](#demo) •
[Features](#fonctionnalités)

</div>

---

## 🎨 Aperçu

<table>
<tr>
<td width="25%" align="center">
<h3>🧭 404</h3>
<p><strong>Chemin Perdu</strong></p>
<p>Boussole tribale brisée avec aiguille oscillante</p>
</td>
<td width="25%" align="center">
<h3>🗿 403</h3>
<p><strong>Territoire Interdit</strong></p>
<p>Totem gardien avec yeux animés et flammes sacrées</p>
</td>
<td width="25%" align="center">
<h3>⚡ 500</h3>
<p><strong>Perturbation Spirituelle</strong></p>
<p>Vortex chaotique avec particules énergétiques</p>
</td>
<td width="25%" align="center">
<h3>🔥 Maintenance</h3>
<p><strong>Rituel en Cours</strong></p>
<p>Autel rituel avec flammes et auto-refresh</p>
</td>
</tr>
</table>

---

## ✨ Fonctionnalités

<table>
<tr>
<td width="33%">

### 🎯 Design Immersif
- Thème tribal cohérent
- 4 illustrations SVG originales
- 15 animations CSS natives
- Métaphores spirituelles

</td>
<td width="33%">

### ⚡ Performance
- SVG inline (0 requêtes)
- Animations CSS pures
- Transformations GPU
- Bundle minimal

</td>
<td width="33%">

### ♿ Accessibilité
- WCAG 2.1 AA
- ARIA attributes
- Reduced motion
- Navigation clavier

</td>
</tr>
</table>

---

## 📦 Installation Rapide

### 1. Vérifier les dépendances

```bash
npm install react-router-dom lucide-react
```

### 2. Intégrer dans App.jsx

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/errors'
import { NotFound } from './pages/errors'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Vos autres routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
```

### 3. Tester

```bash
npm run dev
# Visitez: http://localhost:5173/page-inexistante
```

**C'est tout!** 🎉

👉 [Guide complet](./QUICKSTART.md)

---

## 📚 Documentation

| Document | Description | Lignes |
|----------|-------------|--------|
| [**QUICKSTART.md**](./QUICKSTART.md) | Installation en 5 minutes | 382 |
| [**README.md**](./README.md) | Documentation API complète | 391 |
| [**FEATURES.md**](./FEATURES.md) | Vue d'ensemble technique | 523 |
| [**INTEGRATION_EXAMPLE.jsx**](./INTEGRATION_EXAMPLE.jsx) | 10 patterns d'intégration | 430 |
| [**CHANGELOG.md**](./CHANGELOG.md) | Historique et roadmap | 253 |
| [**INDEX.md**](./INDEX.md) | Navigation complète | 365 |

**Total:** 2344 lignes de documentation

---

## 🏗️ Architecture

```
src/
├── components/errors/           # Composants de base
│   ├── ErrorPage.jsx           # Composant réutilisable
│   ├── ErrorPage.css           # 15 animations CSS
│   ├── ErrorBoundary.jsx       # Capture d'erreurs
│   └── index.js
│
└── pages/errors/               # Pages spécifiques
    ├── NotFound.jsx            # 404 - Boussole brisée
    ├── Forbidden.jsx           # 403 - Totem gardien
    ├── ServerError.jsx         # 500 - Vortex chaotique
    ├── Maintenance.jsx         # Autel rituel
    ├── index.js
    │
    ├── ErrorPages.test.jsx     # 40+ tests unitaires
    └── ErrorPagesDemo.jsx      # Demo interactive
```

---

## 💡 Exemples d'Utilisation

### Page 404 - Route Inexistante

```jsx
import { NotFound } from './pages/errors'

<Route path="*" element={<NotFound />} />
```

### Page 403 - Route Protégée

```jsx
import { Forbidden } from './pages/errors'

const PrivateRoute = ({ children, hasAccess }) => {
  if (!hasAccess) return <Forbidden userAuthenticated={true} />
  return children
}
```

### Page 500 - Erreur Serveur

```jsx
import { ServerError } from './pages/errors'

const DataPage = () => {
  const [error, setError] = useState(false)

  if (error) {
    return <ServerError onRetry={() => fetchData()} />
  }
  // ...
}
```

### ErrorBoundary - Capture Automatique

```jsx
import { ErrorBoundary } from './components/errors'

<ErrorBoundary onError={(error) => logToSentry(error)}>
  <App />
</ErrorBoundary>
```

### Page Personnalisée

```jsx
import ErrorPage from './components/errors/ErrorPage'

<ErrorPage
  code="418"
  title="Je suis une théière"
  message="Impossible de préparer du café."
  illustration={<TeapotSVG />}
  actions={[{
    label: 'Commander du thé',
    onClick: () => navigate('/tea'),
    variant: 'primary'
  }]}
/>
```

👉 [Voir les 10 patterns complets](./INTEGRATION_EXAMPLE.jsx)

---

## 🧪 Tests & Demo

### Tests Unitaires

```bash
npm test ErrorPages.test.jsx
```

**Coverage:**
- ✅ 4 pages d'erreur
- ✅ ErrorBoundary
- ✅ Responsive design
- ✅ Accessibilité
- ✅ 40+ assertions

### Demo Interactive

```bash
npm run dev
# Naviguer vers: /demo/errors
```

**Permet de:**
- Visualiser les 4 pages
- Tester les options (auth, retry)
- Déclencher une erreur
- Voir les animations

---

## 🎨 Animations CSS

<table>
<tr>
<td width="50%">

### 404 - Chemin Perdu
- `float-lost` - Flottement doux (6s)
- `compass-needle-drift` - Aiguille (4s)
- Particules de sable

### 403 - Territoire Interdit
- `guardian-watch` - Clignement yeux (6s)
- `sacred-flame` - Flammes (2s × 3)
- `totem-glow` - Lueur pulsante (3s)

</td>
<td width="50%">

### 500 - Perturbation
- `vortex-spin` - Rotation externe (8s)
- `vortex-spin-reverse` - Interne (6s)
- `energy-particle` - Éjection (3s × 4)

### Maintenance - Rituel
- `ritual-flame` - Flammes (2.5s × 4)
- `ritual-smoke` - Fumée (4s × 3)
- `altar-pulse` - Pulsation (3s)

</td>
</tr>
</table>

**Support complet de `prefers-reduced-motion`**

---

## 📊 Statistiques

```
Total:              4643 lignes
Composants:          709 lignes (15%)
Pages:              1090 lignes (24%)
Tests & Demo:        500 lignes (11%)
Documentation:      2344 lignes (50%)
```

<table>
<tr>
<td align="center">
<h3>17</h3>
<p>Fichiers</p>
</td>
<td align="center">
<h3>7</h3>
<p>Composants React</p>
</td>
<td align="center">
<h3>4</h3>
<p>Illustrations SVG</p>
</td>
<td align="center">
<h3>15</h3>
<p>Animations CSS</p>
</td>
<td align="center">
<h3>40+</h3>
<p>Tests unitaires</p>
</td>
<td align="center">
<h3>10</h3>
<p>Patterns exemples</p>
</td>
</tr>
</table>

---

## 🚀 Technologies

<table>
<tr>
<td>

### Requis
- React 18.0.0+
- react-router-dom 6.0.0+
- lucide-react
- TailwindCSS 3.0.0+

</td>
<td>

### Optionnel
- @testing-library/react
- jest
- Sentry / LogRocket

</td>
</tr>
</table>

---

## 🔧 API du Composant ErrorPage

```typescript
interface ErrorPageProps {
  code?: string                     // Code d'erreur (404, 403...)
  title: string                     // Titre principal
  message: string                   // Message explicatif
  secondaryMessage?: string         // Message additionnel
  illustration?: ReactNode          // Composant SVG
  actions?: Array<{                 // Actions personnalisées
    label: string
    onClick: () => void
    variant: 'primary' | 'secondary' | 'outline' | 'danger'
    icon?: ReactNode
  }>
  showHomeLink?: boolean           // Lien accueil par défaut
  backgroundGradient?: string      // Classes Tailwind
  codeColor?: string               // Couleur du code
}
```

---

## ✅ Checklist d'Intégration

### Configuration Initiale
- [ ] Dépendances installées (`react-router-dom`, `lucide-react`)
- [ ] Routes configurées dans App.jsx
- [ ] ErrorBoundary ajouté au niveau racine
- [ ] Page 404 testée sur URL inexistante

### Pages Spécifiques (Optionnel)
- [ ] Page 403 pour routes protégées
- [ ] Page 500 pour erreurs serveur/API
- [ ] Page Maintenance (si applicable)

### Production
- [ ] Tests unitaires passés
- [ ] Responsive vérifié (mobile, tablet, desktop)
- [ ] Animations testées (prefers-reduced-motion)
- [ ] Navigation fonctionnelle (retour, accueil)
- [ ] Monitoring configuré (Sentry/LogRocket)

---

## 🗺️ Roadmap

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

---

## 🏆 Points Forts

### Design
✨ **Cohérence thématique** absolue avec l'univers tribal
✨ **Illustrations originales** avec motifs authentiques
✨ **Métaphores immersives** (Anciens, territoires, rituels)

### Performance
⚡ **SVG inline** - Zéro requête réseau
⚡ **Animations CSS** - Pas de JavaScript
⚡ **GPU accelerated** - 60fps garantis

### Code Quality
🏗️ **Architecture modulaire** - Composants réutilisables
🏗️ **TypeScript-ready** - Props bien typées
🏗️ **Tests exhaustifs** - 300+ lignes de tests

### Documentation
📖 **2344 lignes** de documentation
📖 **10 patterns** d'intégration
📖 **Guide rapide** 5 minutes

---

## 📄 License

Propriétaire - Projet "Erosion des Âmes"

---

## 🤝 Contribution

Le système est conçu pour être extensible:
- Ajout de nouvelles pages via `ErrorPage.jsx`
- Nouvelles animations dans `ErrorPage.css`
- Thèmes via config Tailwind
- Tests dans `ErrorPages.test.jsx`

---

## 💬 Support

**Question rapide?** → [QUICKSTART.md](./QUICKSTART.md)

**Documentation API?** → [README.md](./README.md)

**Exemples code?** → [INTEGRATION_EXAMPLE.jsx](./INTEGRATION_EXAMPLE.jsx)

**Problème technique?** → [QUICKSTART.md](./QUICKSTART.md) - Problèmes Courants

---

## 🎯 Cas d'Usage

<details>
<summary><strong>Protéger une route admin</strong></summary>

```jsx
import { Forbidden } from './pages/errors'

const AdminRoute = ({ children }) => {
  const { user } = useAuth()

  if (!user || user.role !== 'admin') {
    return <Forbidden userAuthenticated={!!user} />
  }

  return children
}
```
</details>

<details>
<summary><strong>Gérer les erreurs API</strong></summary>

```jsx
import { ServerError } from './pages/errors'

const DataPage = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data')
      if (!response.ok) throw new Error()
      setData(await response.json())
    } catch {
      setError(true)
    }
  }

  if (error) return <ServerError onRetry={fetchData} />
  return <div>{/* Afficher data */}</div>
}
```
</details>

<details>
<summary><strong>Mode maintenance global</strong></summary>

```jsx
import { Maintenance } from './pages/errors'

function App() {
  const isDown = process.env.REACT_APP_MAINTENANCE === 'true'

  if (isDown) {
    return (
      <Maintenance
        estimatedTime="2 heures"
        message="Mise à jour majeure en cours."
      />
    )
  }

  return <NormalApp />
}
```
</details>

---

<div align="center">

## 🌟 Prêt à Démarrer?

**[📖 Lire le Quick Start](./QUICKSTART.md)** • **[💻 Voir les Exemples](./INTEGRATION_EXAMPLE.jsx)** • **[🎨 Lancer la Demo](#demo)**

---

### Made with ❤️ for Erosion des Âmes

**4 pages • 15 animations • 4643 lignes • 100% production-ready**

![Version](https://img.shields.io/badge/version-1.0.0-e67315?style=flat-square)
![React](https://img.shields.io/badge/React-18+-61dafb?style=flat-square&logo=react)
![Tests](https://img.shields.io/badge/tests-40+-4a6f4d?style=flat-square)
![Coverage](https://img.shields.io/badge/docs-2344_lines-7a6454?style=flat-square)

*"Les Anciens veillent sur chaque erreur."*

---

🧭 • 🗿 • ⚡ • 🔥

</div>
