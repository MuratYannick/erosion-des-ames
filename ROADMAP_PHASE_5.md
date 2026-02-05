# Phase 5: Pages d'erreur HTTP personnalisées

**Branche**: `feature/phase-5-error-pages`

---

## Vue d'ensemble

Cette phase consiste à créer des pages d'erreur HTTP personnalisées et un système de gestion des erreurs robuste pour :
- Offrir une expérience utilisateur cohérente même en cas d'erreur
- Guider l'utilisateur vers des actions correctives
- Maintenir l'immersion dans l'univers tribal du site
- Capturer et gérer proprement les erreurs React

### Stack technique
- **Frontend**: React 19 + TailwindCSS + React Router
- **Gestion d'erreurs**: ErrorBoundary React natif
- **Animations**: CSS transitions/keyframes

---

## 5.1 Structure des fichiers

```
frontend/src/
├── components/
│   └── errors/
│       ├── ErrorBoundary.jsx       # Capture les erreurs React
│       ├── ErrorBoundary.css
│       ├── ErrorPage.jsx           # Composant de base pour pages d'erreur
│       ├── ErrorPage.css
│       └── index.js
├── pages/
│   └── errors/
│       ├── NotFound.jsx            # Page 404
│       ├── Forbidden.jsx           # Page 403
│       ├── ServerError.jsx         # Page 500
│       ├── Maintenance.jsx         # Page de maintenance
│       └── index.js
└── assets/
    └── images/
        └── errors/                 # Illustrations pour les pages d'erreur
            ├── 404-tribal.svg
            ├── 403-tribal.svg
            ├── 500-tribal.svg
            └── maintenance-tribal.svg
```

---

## 5.2 Composant ErrorPage - Base réutilisable

### ErrorPage.jsx
- [x] Créer `ErrorPage.jsx` :
  - Props : `code`, `title`, `message`, `illustration`, `actions`, `showHomeLink`
  - Layout centré avec illustration tribale
  - Code d'erreur stylisé (grand, tribal)
  - Titre descriptif
  - Message explicatif personnalisable
  - Zone d'actions (boutons)
  - Lien retour accueil par défaut
- [x] **États** : default, avec actions custom, minimal

### Structure du composant
```jsx
<ErrorPage
  code="404"
  title="Chemin Perdu"
  message="Les esprits n'ont pu trouver la voie que tu cherches..."
  illustration={<NotFoundIllustration />}
  actions={[
    { label: "Retour à l'accueil", to: "/", variant: "primary" },
    { label: "Page précédente", onClick: goBack, variant: "secondary" }
  ]}
/>
```

### Style tribal
- [x] Code d'erreur avec effet gravé/pierre
- [x] Bordures tribales autour du conteneur
- [x] Animation subtile sur l'illustration
- [x] Couleurs cohérentes avec le design system

---

## 5.3 Page 404 - Page non trouvée

### NotFound.jsx
- [x] Créer la page `NotFound.jsx` :
  - Utilise `ErrorPage` comme base
  - Code : "404"
  - Titre : "Chemin Perdu" ou "Sentier Oublié"
  - Message thématique (ex: "Les anciens n'ont laissé aucune trace de ce chemin...")
  - Illustration : symbole tribal de chemin brisé/perdu
- [x] Actions :
  - Bouton "Retour à l'accueil" (primary)
  - Bouton "Page précédente" (secondary)
  - Optionnel : barre de recherche

### Illustration SVG
- [x] Créer `404-tribal.svg` (inline dans NotFound.jsx) :
  - Style : lignes tribales, motifs géométriques
  - Thème : boussole brisée avec aiguille oscillante
  - Animation CSS : flottement et rotation de l'aiguille

---

## 5.4 Page 403 - Accès interdit

### Forbidden.jsx
- [x] Créer la page `Forbidden.jsx` :
  - Utilise `ErrorPage` comme base
  - Code : "403"
  - Titre : "Territoire Interdit" ou "Accès Scellé"
  - Message thématique (ex: "Les gardiens protègent ce sanctuaire. Tu n'as pas la marque requise.")
  - Illustration : symbole tribal de barrière/sceau
- [x] Actions :
  - Bouton "Retour à l'accueil" (primary)
  - Bouton "Se connecter" (secondary) - si non authentifié
  - Message explicatif si droits insuffisants

### Illustration SVG
- [x] Créer `403-tribal.svg` (inline dans Forbidden.jsx) :
  - Style : lignes tribales, motifs protecteurs
  - Thème : totem gardien avec yeux animés et flammes sacrées
  - Animation CSS : yeux qui surveillent, flammes dansantes

---

## 5.5 Page 500 - Erreur serveur

### ServerError.jsx
- [x] Créer la page `ServerError.jsx` :
  - Utilise `ErrorPage` comme base
  - Code : "500"
  - Titre : "Perturbation Spirituelle" ou "Chaos Ancestral"
  - Message thématique (ex: "Les esprits sont troublés. Nos chamans travaillent à rétablir l'harmonie.")
  - Illustration : symbole tribal de chaos/disruption
- [x] Actions :
  - Bouton "Réessayer" (primary) - recharge la page
  - Bouton "Retour à l'accueil" (secondary)
  - Optionnel : lien contact/support

### Illustration SVG
- [x] Créer `500-tribal.svg` (inline dans ServerError.jsx) :
  - Style : lignes tribales brisées, motifs chaotiques
  - Thème : vortex chaotique avec particules énergétiques
  - Animation CSS : rotation du vortex, particules flottantes

---

## 5.6 Page de maintenance

### Maintenance.jsx
- [x] Créer la page `Maintenance.jsx` :
  - Utilise `ErrorPage` comme base (ou layout custom)
  - Pas de code d'erreur
  - Titre : "Rituel en Cours" ou "Cérémonie de Purification"
  - Message thématique (ex: "Les anciens accomplissent un rituel sacré. Le village sera bientôt accessible.")
  - Illustration : symbole tribal de rituel/travail
- [x] Éléments spéciaux :
  - Barre de progression optionnelle (si temps estimé)
  - Compte à rebours avec auto-refresh (60s)
  - Animation de "travail en cours"
- [x] Actions :
  - Bouton "Rafraîchir" (primary)
  - Liens réseaux sociaux (optionnel)

### Illustration SVG
- [x] Créer `maintenance-tribal.svg` (inline dans Maintenance.jsx) :
  - Style : lignes tribales, motifs de construction/réparation
  - Thème : autel rituel avec flammes et fumée mystique
  - Animation CSS : flammes dansantes, fumée montante

---

## 5.7 ErrorBoundary - Capture des erreurs React

### ErrorBoundary.jsx
- [x] Créer `ErrorBoundary.jsx` :
  - Classe React avec `componentDidCatch`
  - Props : `fallback`, `onError`, `children`
  - State : `hasError`, `error`, `errorInfo`
  - Affiche le fallback en cas d'erreur
  - Log l'erreur (console + optionnel: service externe)
- [x] Fallback par défaut :
  - Utilise le composant `ServerError` ou `ErrorPage`
  - Bouton "Réessayer" qui reset l'état d'erreur
  - Affichage des détails en mode développement

### Implémentation
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to error reporting service
    console.error('ErrorBoundary caught:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}
```

### ErrorFallback.jsx (composant interne)
- [x] Créer `ErrorFallback.jsx` (intégré dans ErrorBoundary.jsx) :
  - Props : `error`, `onReset`
  - Affiche message d'erreur générique
  - Bouton reset
  - En dev : affiche stack trace

---

## 5.8 Intégration avec React Router

### Configuration des routes
- [x] Ajouter route catch-all pour 404 :
  ```jsx
  <Route path="*" element={<NotFound />} />
  ```
- [ ] Créer hook `useNavigateToError` (optionnel) :
  - `navigateTo404()` - redirige vers 404
  - `navigateTo403()` - redirige vers 403
  - `navigateTo500()` - redirige vers 500
  - `navigateToMaintenance()` - redirige vers maintenance

### Gestion dans ProtectedRoute
- [x] Modifier `ProtectedRoute.jsx` :
  - Si non authentifié : redirect vers login (existant)
  - Si authentifié mais droits insuffisants : afficher Forbidden (403)

### Gestion des erreurs API
- [ ] Créer/modifier `useApi` ou intercepteur axios (optionnel) :
  - 401 : redirect vers login
  - 403 : afficher page 403 ou message
  - 404 : afficher page 404 (si route API)
  - 500+ : afficher page 500

---

## 5.9 Gestion des erreurs Backend

### Middleware Express
- [x] Créer middleware de gestion d'erreurs (`backend/middlewares/errorHandler.js`) :
  - `ApiError` : classe d'erreur personnalisée avec helpers statiques
  - `errorHandler` : middleware principal de formatage des erreurs
  - `notFoundHandler` : middleware 404 pour les routes API
  - `asyncHandler` : wrapper pour fonctions async
  - Gestion des erreurs Sequelize (validation, unicité, FK)
  - Gestion des erreurs JWT

### Format de réponse d'erreur standardisé
- [x] Toutes les erreurs API suivent le format :
  ```json
  {
    "success": false,
    "error": {
      "code": 404,
      "message": "Resource not found",
      "details": {} // optionnel
    }
  }
  ```

---

## 5.10 Animations et transitions

### Animations CSS
- [x] Animation d'entrée pour les pages d'erreur :
  - Fade in + léger slide up
  - Durée : 300-500ms
  - Easing : ease-out
- [x] Animation de l'illustration :
  - Flottement subtil (translateY)
  - Pulsation légère (scale)
  - Rotation lente pour certains éléments
- [x] Animation du code d'erreur :
  - Apparition avec effet "gravure"
  - Glow tribal subtil

### Keyframes suggérés
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 5px var(--accent-glow)); }
  50% { filter: drop-shadow(0 0 15px var(--accent-glow)); }
}

@keyframes engrave {
  from { opacity: 0; transform: scale(1.1); }
  to { opacity: 1; transform: scale(1); }
}
```

---

## Ordre de réalisation suggéré

1. **Base**
   - [x] Créer `ErrorPage.jsx` (composant réutilisable)
   - [x] Créer `ErrorPage.css` (styles de base + 15 animations)

2. **Pages d'erreur**
   - [x] Page 404 (NotFound.jsx)
   - [x] Page 403 (Forbidden.jsx)
   - [x] Page 500 (ServerError.jsx)
   - [x] Page maintenance (Maintenance.jsx)

3. **Illustrations**
   - [x] Créer les SVG tribaux pour chaque page (inline)
   - [x] Ajouter les animations CSS

4. **ErrorBoundary**
   - [x] Créer ErrorBoundary.jsx
   - [x] Créer ErrorFallback.jsx (intégré)
   - [x] Intégrer dans App.jsx

5. **Intégration Router**
   - [x] Route catch-all 404
   - [ ] Hook useNavigateToError (optionnel)
   - [x] Gestion dans ProtectedRoute (affiche Forbidden 403)

6. **Backend**
   - [x] Créer middleware errorHandler.js (ApiError, errorHandler, notFoundHandler, asyncHandler)
   - [x] Standardiser les réponses d'erreur

---

## Critères de validation

- [x] Toutes les pages d'erreur sont accessibles et fonctionnelles
- [x] Le style est cohérent avec le design system tribal existant
- [x] Les illustrations SVG sont légères et animées
- [x] ErrorBoundary capture les erreurs React sans crash
- [x] La route 404 catch-all fonctionne
- [x] Les pages sont responsive (mobile, tablet, desktop)
- [x] Les messages sont en français et thématiques
- [x] Navigation de retour fonctionne (accueil, page précédente)

---

## Tests manuels à effectuer

1. **404** : Accéder à une URL inexistante (ex: `/page-inexistante`)
2. **403** : Tenter d'accéder à une ressource protégée sans droits
3. **500** : Simuler une erreur serveur (désactiver le backend)
4. **ErrorBoundary** : Provoquer une erreur React (throw dans un composant)
5. **Responsive** : Vérifier l'affichage sur mobile/tablet
6. **Navigation** : Tester tous les boutons de retour/action

---

## Notes techniques

- Utiliser les couleurs du design system existant (`tailwind.config.js`)
- Les SVG doivent être optimisés (SVGO) et inline si animés
- Prévoir le support du mode sombre (si implémenté plus tard)
- ErrorBoundary ne capture pas les erreurs async (utiliser try/catch)
- Penser à l'accessibilité (aria-labels, focus management)

---

## Exemples d'utilisation

### Page 404 dans le router
```jsx
// App.jsx ou router config
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  {/* ... autres routes ... */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### ErrorBoundary autour de l'app
```jsx
// main.jsx ou App.jsx
<ErrorBoundary
  fallback={<ServerError />}
  onError={(error) => logErrorToService(error)}
>
  <App />
</ErrorBoundary>
```

### Redirect vers 403 dans ProtectedRoute
```jsx
// ProtectedRoute.jsx
if (!hasRequiredRole) {
  return <Forbidden />;
  // ou: return <Navigate to="/forbidden" replace />;
}
```
