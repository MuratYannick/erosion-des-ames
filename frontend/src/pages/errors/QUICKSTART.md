# Guide de Démarrage Rapide - Pages d'Erreur

> Configuration en **5 minutes** pour intégrer les pages d'erreur dans votre application React.

---

## Étape 1: Vérifier les Dépendances

```bash
# Les packages suivants doivent être installés:
npm list react react-router-dom lucide-react

# Si manquants, installer:
npm install react-router-dom lucide-react
```

**Versions minimales:**
- React: 18.0.0+
- react-router-dom: 6.0.0+
- lucide-react: latest

---

## Étape 2: Configurer React Router

Dans votre fichier `App.jsx` ou `main.jsx`:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/errors'
import { NotFound } from './pages/errors'

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Vos routes existantes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Page 404 - DOIT être la dernière route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
```

**Important:** La route `path="*"` doit toujours être en **dernière position** pour capturer les URLs non trouvées.

---

## Étape 3: Tester l'Installation

### Test du 404

1. Lancez votre serveur de dev: `npm run dev`
2. Naviguez vers une URL inexistante: `http://localhost:5173/page-inexistante`
3. Vous devriez voir la page "Chemin Perdu" avec la boussole brisée

### Test du ErrorBoundary

1. Créez un composant qui plante volontairement:

```jsx
const BrokenComponent = () => {
  throw new Error('Test error')
  return <div>Never rendered</div>
}
```

2. Ajoutez-le dans une route: `<Route path="/test" element={<BrokenComponent />} />`
3. Visitez `/test` - vous devriez voir la page 500 "Perturbation Spirituelle"

---

## Étape 4: Ajouter les Autres Pages (Optionnel)

### Page 403 - Accès Refusé

```jsx
import { Forbidden } from './pages/errors'

// Pour une route protégée
const ProtectedRoute = ({ children, isAllowed }) => {
  if (!isAllowed) {
    return <Forbidden userAuthenticated={true} />
  }
  return children
}

// Dans vos routes:
<Route
  path="/admin"
  element={
    <ProtectedRoute isAllowed={user?.role === 'admin'}>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

### Page 500 - Erreur Serveur

```jsx
import { ServerError } from './pages/errors'

// Pour gérer les erreurs API
const DataPage = () => {
  const [error, setError] = useState(false)

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data')
      if (!res.ok) setError(true)
    } catch (err) {
      setError(true)
    }
  }

  if (error) {
    return <ServerError onRetry={fetchData} />
  }

  return <div>Contenu normal</div>
}
```

### Page Maintenance

```jsx
import { Maintenance } from './pages/errors'

// Mode maintenance global
function App() {
  const isUnderMaintenance = process.env.REACT_APP_MAINTENANCE === 'true'

  if (isUnderMaintenance) {
    return (
      <Maintenance
        estimatedTime="30 minutes"
        message="Mise à jour majeure en cours."
      />
    )
  }

  return <YourNormalApp />
}
```

---

## Étape 5: Personnalisation (Optionnel)

### Créer une Page d'Erreur Personnalisée

```jsx
import ErrorPage from './components/errors/ErrorPage'
import { Coffee } from 'lucide-react'

const CustomError = () => (
  <ErrorPage
    code="418"
    title="Titre Personnalisé"
    message="Message principal"
    secondaryMessage="Détails supplémentaires"
    illustration={<YourSVGComponent />}
    actions={[
      {
        label: 'Action',
        onClick: () => navigate('/somewhere'),
        variant: 'primary',
        icon: <Coffee />
      }
    ]}
    backgroundGradient="bg-gradient-to-b from-blue-50 to-purple-50"
    codeColor="text-blue-600"
  />
)
```

---

## Configuration Avancée

### Routes d'Erreur Explicites (Recommandé)

```jsx
import { NotFound, Forbidden, ServerError, Maintenance } from './pages/errors'

<Routes>
  {/* Routes normales */}
  <Route path="/" element={<HomePage />} />

  {/* Routes d'erreur explicites */}
  <Route path="/error/403" element={<Forbidden />} />
  <Route path="/error/404" element={<NotFound />} />
  <Route path="/error/500" element={<ServerError />} />
  <Route path="/maintenance" element={<Maintenance />} />

  {/* 404 catch-all */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

**Avantage:** Permet de rediriger vers des pages d'erreur spécifiques via `navigate('/error/403')`.

### ErrorBoundary avec Logging

```jsx
import { ErrorBoundary } from './components/errors'

<ErrorBoundary
  onError={(error, errorInfo) => {
    // Envoyer à votre service de monitoring
    console.error('Error caught:', error)

    // Exemples d'intégrations:
    // Sentry.captureException(error, { contexts: { react: errorInfo } })
    // LogRocket.captureException(error)
    // Analytics.track('error', { message: error.message })
  }}
>
  <App />
</ErrorBoundary>
```

---

## Checklist de Vérification

Avant de déployer en production, vérifiez:

- [ ] **Route 404** configurée en dernière position
- [ ] **ErrorBoundary** wrapper autour de l'app
- [ ] **Page 403** pour routes protégées (si applicable)
- [ ] **Page 500** pour erreurs serveur (si applicable)
- [ ] **Maintenance** testée (si applicable)
- [ ] **Responsive** testé sur mobile
- [ ] **Animations** respectent prefers-reduced-motion
- [ ] **Navigation** fonctionne (retour accueil, page précédente)
- [ ] **Logging** configuré en production

---

## Commandes Utiles

```bash
# Tester en dev
npm run dev

# Tester la build de production
npm run build
npm run preview

# Lancer les tests
npm test ErrorPages.test.jsx

# Vérifier le coverage
npm test -- --coverage

# Build pour production
npm run build
```

---

## URLs de Test en Dev

Après avoir lancé `npm run dev`, testez ces URLs:

- `http://localhost:5173/` - Page d'accueil normale
- `http://localhost:5173/inexistant` - Devrait afficher 404
- `http://localhost:5173/demo/errors` - Page de démo (si configurée)

---

## Problèmes Courants

### Le 404 ne s'affiche pas

**Cause:** Route catch-all `path="*"` pas en dernière position

**Solution:**
```jsx
<Routes>
  {/* Toutes vos routes spécifiques AVANT */}
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />

  {/* Route 404 EN DERNIER */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### ErrorBoundary ne capture pas les erreurs

**Cause:** ErrorBoundary ne capture que les erreurs de **rendu React**, pas:
- Les erreurs dans les event handlers
- Les erreurs dans du code asynchrone
- Les erreurs dans `setTimeout` ou `setInterval`

**Solution:** Utiliser try/catch dans ces cas:
```jsx
const handleClick = async () => {
  try {
    await riskyOperation()
  } catch (error) {
    navigate('/error/500')
  }
}
```

### Les animations ne s'affichent pas

**Cause:** CSS `ErrorPage.css` pas importé

**Solution:** Vérifier que `import './ErrorPage.css'` est bien dans `ErrorPage.jsx`

### Icônes manquantes

**Cause:** Package `lucide-react` pas installé

**Solution:**
```bash
npm install lucide-react
```

### Couleurs incorrectes

**Cause:** Config Tailwind du projet pas chargée

**Solution:** Vérifier que `tailwind.config.js` contient les couleurs personnalisées (`primary`, `secondary`, `error`, etc.)

---

## Prochaines Étapes

Une fois l'installation de base terminée:

1. **Lisez le README.md** pour comprendre toutes les options
2. **Consultez INTEGRATION_EXAMPLE.jsx** pour les patterns avancés
3. **Lancez ErrorPagesDemo.jsx** pour visualiser toutes les pages
4. **Personnalisez** les messages selon votre projet
5. **Configurez le monitoring** d'erreurs (Sentry, LogRocket)

---

## Support & Documentation

- **Guide complet:** `README.md`
- **Exemples d'intégration:** `INTEGRATION_EXAMPLE.jsx`
- **Tests:** `ErrorPages.test.jsx`
- **Demo interactive:** `ErrorPagesDemo.jsx`
- **Changelog:** `CHANGELOG.md`
- **Features:** `FEATURES.md`

---

## Félicitations!

Votre système de pages d'erreur est maintenant configuré. Les utilisateurs verront des pages d'erreur immersives et thématiques plutôt que des écrans blancs ou des erreurs brutes.

**Test final:** Naviguez vers une page inexistante et admirez la boussole tribale flottante!

---

<div align="center">

**Prêt à Déployer?**

Vérifiez la checklist ci-dessus ☝️

🧭 • 🗿 • ⚡ • 🔥

*"Les Anciens veillent sur vos utilisateurs, même dans l'erreur."*

</div>
