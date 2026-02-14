# Services API - Documentation

Ce dossier contient la configuration de l'API Axios avec intercepteurs pour gérer automatiquement l'authentification et les erreurs HTTP.

## Structure des fichiers

```
frontend/src/services/
├── api.js                # Instance Axios configurée avec intercepteurs
├── authService.js        # Services d'authentification
├── adminService.js       # Services administration
├── characterService.js   # Services personnages
├── forumService.js       # Services forum
├── index.js              # Exports centralisés
└── README.md             # Ce fichier

frontend/src/hooks/
└── useApi.js             # Hooks personnalisés pour simplifier les appels API
```

## Installation rapide

### 1. Installer Axios

```bash
cd frontend
npm install axios
```

### 2. Importer dans votre composant

```jsx
import api from '@/services/api';

// Ou avec les hooks personnalisés
import { useGet, useMutation } from '@/hooks/useApi';
```

### 3. Utiliser l'API

```jsx
// Approche 1: Directement avec l'instance Axios
const response = await api.get('/users');
const users = response.data.data;

// Approche 2: Avec les hooks personnalisés (recommandé)
const { data: users, loading, error } = useGet('/users');
```

## Fonctionnalités principales

### 1. Authentification automatique

Le token JWT est ajouté automatiquement à toutes les requêtes:

```jsx
// Pas besoin de gérer le token manuellement
const response = await api.get('/auth/me');
// Le header Authorization est ajouté automatiquement
```

### 2. Gestion automatique des erreurs

Les erreurs HTTP déclenchent des redirections automatiques:

| Code HTTP | Action                                    | Page de destination |
|-----------|-------------------------------------------|---------------------|
| 401       | Déconnexion + redirection                 | `/connexion`        |
| 403       | Redirection                               | `/interdit`         |
| 404       | Aucune (géré par le composant)            | -                   |
| 500-502   | Redirection                               | `/erreur`           |
| 503       | Redirection                               | `/maintenance`      |

```jsx
// Erreur 401: Déconnecte automatiquement et redirige vers /connexion
await api.get('/protected-resource');

// Erreur 403: Redirige vers /interdit
await api.get('/admin-only');

// Erreur 500: Redirige vers /erreur
await api.get('/failing-endpoint');
```

### 3. Désactiver la redirection automatique

Pour gérer les erreurs manuellement dans votre composant:

```jsx
try {
  const response = await api.get('/resource', {
    skipErrorRedirect: true, // Gérer l'erreur manuellement
  });
} catch (error) {
  // Gérer l'erreur comme vous le souhaitez
  if (error.status === 404) {
    setError('Ressource non trouvée');
  }
}
```

### 4. Retry automatique pour les erreurs réseau

L'API réessaye automatiquement 3 fois en cas d'erreur réseau:

```jsx
try {
  const response = await api.get('/users');
} catch (error) {
  if (error.isNetworkError) {
    console.error('Impossible de se connecter au serveur');
  }
}
```

### 5. Logging en développement

En mode développement, chaque requête est loggée dans la console:

```
[API] GET /users - 234ms
[API] POST /articles - 156ms
```

## Hooks personnalisés

### useGet - Requêtes GET automatiques

```jsx
const { data, loading, error, refetch } = useGet('/users', {
  params: { page: 1, limit: 10 }
});
```

### useMutation - Mutations (POST, PUT, PATCH, DELETE)

```jsx
const { mutate, loading, error } = useMutation(
  (data) => api.post('/users', data),
  {
    onSuccess: () => console.log('Succès!'),
    onError: (err) => console.error('Erreur:', err),
  }
);

// Dans un handler
await mutate({ username: 'john', email: 'john@example.com' });
```

### useApi - Hook générique

```jsx
const { data, loading, error, execute } = useApi(
  () => api.get('/users')
);

// Exécuter manuellement
useEffect(() => {
  execute();
}, []);
```

## Exemples d'utilisation

### Exemple 1: Formulaire de connexion

```jsx
import { useState } from 'react';
import api from '@/services/api';

const LoginForm = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      setLoading(true);
      setError(null);

      await api.post('/auth/login', {
        identifier: formData.get('email'),
        password: formData.get('password'),
      }, {
        skipErrorRedirect: true, // Gérer l'erreur localement
      });

      // Redirection après succès
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
};
```

### Exemple 2: Upload de fichier

```jsx
const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append('avatar', file);

  try {
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur upload:', error);
    throw error;
  }
};
```

### Exemple 3: Pagination

```jsx
const { data, loading, error } = useGet('/articles', {
  params: {
    page: currentPage,
    limit: 20,
    sort: 'createdAt',
    order: 'desc',
  },
});
```

## Configuration

### Variables d'environnement

Créez un fichier `.env` dans `frontend/`:

```env
VITE_API_URL=http://localhost:3001/api
```

### Modifier le timeout

Par défaut: 30 secondes. Pour changer globalement:

```jsx
// frontend/src/services/api.js
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 secondes
});
```

Pour une requête spécifique:

```jsx
const response = await api.get('/long-operation', {
  timeout: 120000, // 2 minutes
});
```

### Modifier le nombre de retries

Par défaut: 3 tentatives avec 1 seconde entre chaque. Pour changer:

```jsx
// frontend/src/services/api.js
api.defaults.retry = 5;
api.defaults.retryDelay = 2000; // 2 secondes
```

## Migration depuis fetch

Si vous utilisez actuellement `fetch` ou `authService.apiRequest`:

### Avant (fetch)

```jsx
const response = await fetch(`${API_URL}/users`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data),
});
const json = await response.json();
```

### Après (Axios)

```jsx
const response = await api.post('/users', data);
const json = response.data;
```

## Différences importantes avec fetch

| Aspect | fetch | Axios |
|--------|-------|-------|
| JSON | `JSON.stringify()` requis | Automatique |
| Headers | Manuelle | Automatique (token) |
| Erreurs | `response.ok` à vérifier | Throw automatique |
| Intercepteurs | Non | Oui |
| Timeout | Non natif | Oui |
| Retry | Non | Oui (3x) |
| Cancel | AbortController | CancelToken |

## Troubleshooting

### Erreur: "Module 'axios' not found"

```bash
cd frontend
npm install axios
```

### Les redirections ne fonctionnent pas

1. Vérifiez que les routes d'erreur existent dans votre router
2. Vérifiez que vous n'avez pas `skipErrorRedirect: true`
3. Consultez la console pour les logs d'erreur

### Le token n'est pas envoyé

Vérifiez que le token est dans localStorage:

```js
console.log(localStorage.getItem('auth_token'));
```

### Erreurs CORS

Les erreurs CORS sont gérées côté backend. Vérifiez:
- Configuration CORS du serveur
- L'URL de base dans `.env`
- Les credentials dans la requête

## Architecture technique

### Flux d'une requête

```
Composant React
    ↓
  api.get('/users') ou useGet('/users')
    ↓
Intercepteur de requête (ajoute le token)
    ↓
  Serveur backend
    ↓
Intercepteur de réponse (gère les erreurs)
    ↓
  - 200-299: Retourne les données
  - 401: Déconnecte + redirige vers /connexion
  - 403: Redirige vers /interdit
  - 500+: Redirige vers /erreur
  - Network: Retry 3x puis erreur
    ↓
Composant React (data, loading, error)
```

### Structure de réponse API

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "..."
  },
  "message": "Connexion réussie"
}
```

### Structure d'erreur API

```json
{
  "success": false,
  "error": {
    "message": "Email invalide",
    "code": "VALIDATION_ERROR",
    "details": {
      "email": "Format invalide"
    }
  }
}
```

## Bonnes pratiques

1. **Toujours utiliser try/catch** pour les requêtes API
2. **Utiliser les hooks** (useGet, useMutation) pour simplifier le code
3. **Gérer les états de chargement** pour une meilleure UX
4. **Utiliser skipErrorRedirect: true** pour les erreurs que vous voulez gérer manuellement
5. **Ne pas stocker de tokens** manuellement, l'intercepteur gère tout
6. **Utiliser params** pour les query strings (au lieu de concaténer l'URL)
7. **Annuler les requêtes** dans useEffect avec cleanup function
8. **Refetch après mutations** pour garder les données synchronisées

---

**Dernière mise à jour**: 2026-02-14
