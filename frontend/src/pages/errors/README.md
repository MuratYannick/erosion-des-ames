# Pages d'Erreur - Erosion des Âmes

Composants de pages d'erreur avec design tribal immersif et animations personnalisées.

## Structure

```
frontend/src/
├── components/
│   └── errors/
│       ├── ErrorPage.jsx          # Composant de base réutilisable
│       ├── ErrorPage.css          # Animations CSS
│       ├── ErrorBoundary.jsx      # Capture des erreurs React
│       └── index.js
├── pages/
│   └── errors/
│       ├── NotFound.jsx           # Page 404
│       ├── Forbidden.jsx          # Page 403
│       ├── ServerError.jsx        # Page 500
│       ├── Maintenance.jsx        # Page maintenance
│       └── index.js
```

## Utilisation

### Dans React Router

```jsx
import { NotFound, Forbidden, ServerError, Maintenance } from './pages/errors'

// Configuration des routes
<Routes>
  {/* Vos routes normales */}
  <Route path="/" element={<Home />} />

  {/* Page de maintenance conditionnelle */}
  {isUnderMaintenance && (
    <Route path="*" element={<Maintenance estimatedTime="30 minutes" />} />
  )}

  {/* Routes d'erreur */}
  <Route path="/403" element={<Forbidden />} />
  <Route path="/500" element={<ServerError />} />

  {/* 404 catch-all - doit être la dernière route */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### ErrorBoundary

```jsx
import { ErrorBoundary } from './components/errors'

// Wrapper global dans App.jsx
function App() {
  return (
    <ErrorBoundary onError={(error, errorInfo) => {
      // Optionnel : envoyer à un service de monitoring
      console.error('Error caught:', error, errorInfo)
    }}>
      <Router>
        <Routes>
          {/* vos routes */}
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

// Wrapper pour une section spécifique
<ErrorBoundary fallback={<CustomErrorPage />}>
  <ComplexComponent />
</ErrorBoundary>
```

## Pages Disponibles

### 404 - NotFound (Chemin Perdu)

**Thème**: Boussole tribale brisée symbolisant la perte des repères ancestraux

**Utilisation**:
```jsx
import { NotFound } from './pages/errors'

<Route path="*" element={<NotFound />} />
```

**Design**:
- Fond: Dégradé neutre vers primaire
- Animation: Flottement doux de la boussole, aiguille oscillante
- Actions: Retour accueil (primary), Page précédente (secondary)

---

### 403 - Forbidden (Territoire Interdit)

**Thème**: Totem gardien avec flammes sacrées protégeant le territoire

**Utilisation**:
```jsx
import { Forbidden } from './pages/errors'

// Sans authentification
<Route path="/admin" element={<Forbidden />} />

// Avec état d'auth
<Route path="/admin" element={<Forbidden userAuthenticated={true} />} />
```

**Props**:
- `userAuthenticated` (boolean): Ajuste le message et les actions selon l'état d'auth

**Design**:
- Fond: Dégradé avec teintes rouges (error)
- Animation: Clignement des yeux du totem, flammes dansantes
- Actions: Retour accueil + Se connecter (si non authentifié)

---

### 500 - ServerError (Perturbation Spirituelle)

**Thème**: Vortex chaotique représentant le déséquilibre des forces

**Utilisation**:
```jsx
import { ServerError } from './pages/errors'

// Simple
<Route path="/500" element={<ServerError />} />

// Avec callback de retry personnalisé
<ServerError onRetry={() => {
  // Logique personnalisée
  refetchData()
}} />
```

**Props**:
- `onRetry` (function): Callback personnalisé pour le bouton "Réessayer"

**Design**:
- Fond: Dégradé warning avec teintes secondaires
- Animation: Rotation du vortex, particules énergétiques
- Actions: Réessayer (primary), Retour accueil (secondary)

---

### Maintenance (Rituel en Cours)

**Thème**: Autel rituel avec flammes et fumée mystique

**Utilisation**:
```jsx
import { Maintenance } from './pages/errors'

// Simple
<Route path="*" element={<Maintenance />} />

// Avec durée estimée
<Maintenance estimatedTime="30 minutes" />

// Avec message personnalisé
<Maintenance
  estimatedTime="1 heure"
  message="Mise à jour majeure des systèmes ancestraux en cours."
/>
```

**Props**:
- `estimatedTime` (string): Durée estimée du rituel
- `message` (string): Message personnalisé

**Fonctionnalités**:
- Auto-refresh toutes les 60s (toggle activé par défaut)
- Compte à rebours visible
- Action: Rafraîchir (primary)

**Design**:
- Fond: Dégradé chaleureux secondary/primary
- Animation: Flammes rituelles, fumée montante, autel pulsant
- Pas de code d'erreur

---

## Composant ErrorPage (Base)

Composant réutilisable pour créer des pages d'erreur personnalisées.

**Props**:

```jsx
<ErrorPage
  code="418"                           // Code d'erreur (optionnel)
  title="I'm a Teapot"                 // Titre principal
  message="Message principal"          // Message explicatif
  secondaryMessage="Détails..."        // Message secondaire (optionnel)
  illustration={<CustomSVG />}         // Composant SVG
  actions={[                           // Actions personnalisées
    {
      label: 'Action',
      onClick: handleAction,
      variant: 'primary',
      icon: <Icon />
    }
  ]}
  showHomeLink={true}                  // Afficher lien accueil
  backgroundGradient="bg-gradient-..." // Classes Tailwind
  codeColor="text-primary-500"         // Couleur du code
/>
```

**Exemple personnalisé**:

```jsx
import ErrorPage from './components/errors/ErrorPage'
import { Coffee } from 'lucide-react'

const TeapotError = () => (
  <ErrorPage
    code="418"
    title="Je suis une théière"
    message="Je ne peux pas préparer de café, je suis une théière tribale."
    illustration={<TeapotSVG />}
    actions={[{
      label: 'Commander du thé',
      onClick: () => navigate('/tea'),
      variant: 'primary',
      icon: <Coffee />
    }]}
    backgroundGradient="bg-gradient-to-b from-secondary-50 to-warning-light/20"
    codeColor="text-secondary-500"
  />
)
```

## Animations

Toutes les animations sont définies dans `ErrorPage.css`:

- **pulse-error-code**: Pulsation du code d'erreur
- **float-lost**: Flottement de la boussole (404)
- **compass-needle-drift**: Oscillation de l'aiguille
- **guardian-watch**: Clignement des yeux du totem (403)
- **sacred-flame**: Flammes du totem
- **totem-glow**: Lueur mystique
- **vortex-spin**: Rotation du vortex (500)
- **energy-particle**: Particules énergétiques
- **ritual-flame**: Flammes de l'autel (Maintenance)
- **ritual-smoke**: Fumée montante
- **altar-pulse**: Pulsation de l'autel

### Accessibilité

Les animations respectent `prefers-reduced-motion` et sont automatiquement désactivées pour les utilisateurs sensibles au mouvement.

## Responsive Design

Toutes les pages sont optimisées mobile-first:

- **Mobile** (< 640px): Illustrations 48px × 48px, textes réduits, boutons empilés
- **Tablet** (≥ 640px): Illustrations 56px × 56px, boutons côte à côte
- **Desktop** (≥ 768px): Illustrations 64px × 64px
- **Large** (≥ 1024px): Illustrations 72px × 72px

## Personnalisation

### Créer une nouvelle page d'erreur

1. Créer le SVG d'illustration avec animations CSS appropriées
2. Utiliser le composant `ErrorPage` avec vos props
3. Suivre la nomenclature tribale établie

```jsx
const CustomError = () => {
  const CustomIllustration = () => (
    <svg className="w-full h-full custom-animation">
      {/* Votre SVG tribal */}
    </svg>
  )

  return (
    <ErrorPage
      code="XXX"
      title="Titre Tribal"
      message="Message avec métaphore tribale"
      illustration={<CustomIllustration />}
      // ... autres props
    />
  )
}
```

### Ajouter une animation

Dans `ErrorPage.css`:

```css
@keyframes my-animation {
  0%, 100% { /* état initial */ }
  50% { /* état intermédiaire */ }
}

.my-element {
  animation: my-animation 3s ease-in-out infinite;
}
```

## Intégration avec services de monitoring

```jsx
// Dans ErrorBoundary
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack
        }
      }
    })

    // LogRocket
    LogRocket.captureException(error, {
      extra: { errorInfo }
    })
  }}
>
  <App />
</ErrorBoundary>
```

## Tests

```jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { NotFound } from './pages/errors'

describe('NotFound', () => {
  it('affiche le code 404', () => {
    render(<NotFound />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('navigue vers l\'accueil au clic', () => {
    const mockNavigate = jest.fn()
    jest.mock('react-router-dom', () => ({
      useNavigate: () => mockNavigate
    }))

    render(<NotFound />)
    fireEvent.click(screen.getByText(/retour à l'accueil/i))
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
```

## Checklist d'implémentation

- [x] Composant ErrorPage.jsx de base
- [x] Animations CSS (ErrorPage.css)
- [x] ErrorBoundary pour capture d'erreurs React
- [x] Page 404 - NotFound avec boussole brisée
- [x] Page 403 - Forbidden avec totem gardien
- [x] Page 500 - ServerError avec vortex chaotique
- [x] Page Maintenance avec autel rituel
- [x] Support responsive mobile-first
- [x] Animations respectant prefers-reduced-motion
- [x] Documentation complète

## Notes de design

**Cohérence thématique**: Toutes les pages suivent le thème tribal "Erosion des Âmes":
- Métaphores spirituelles et ancestrales
- Vocabulaire immersif (Anciens, territoires, rituels)
- Illustrations SVG avec motifs tribaux
- Palette de couleurs du design system (primary, secondary, error, warning)
- Animations organiques et naturelles

**Performance**:
- SVG inline pour éviter les requêtes réseau
- Animations CSS pures (pas de JavaScript)
- Lazy loading du ServerError dans ErrorBoundary

**Accessibilité**:
- Attributs ARIA appropriés
- Support reduced-motion
- Contraste des couleurs respectant WCAG
- Navigation au clavier
