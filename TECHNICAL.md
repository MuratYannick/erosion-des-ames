# Documentation technique - L'Érosion des Âmes

Ce document fournit des informations techniques détaillées sur les APIs, l'authentification, les permissions et les conventions de développement.

## 📡 API REST

### Base URL

**Développement** :
- Backend : `http://localhost:3000`
- Frontend : `http://localhost:5173`
- Préfixe API : `/api`

**Production** :
- À définir

---

## 🔐 Authentification JWT

### Flow d'authentification

```
1. Client → POST /api/auth/register ou /api/auth/login
   Body: { username, email, password }

2. Server → Vérification credentials
   - Hash password avec bcrypt (10 rounds)
   - Vérification email unique
   - Vérification username unique

3. Server → Génération JWT
   - Payload: { id: user.id }
   - Secret: process.env.JWT_SECRET
   - Expiration: 7 jours

4. Server → Response
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "user": {
       "id": 1,
       "username": "john_doe",
       "email": "john@example.com",
       "role": "PLAYER",
       "terms_accepted": true,
       "forum_rules_accepted": true
     }
   }

5. Client → Stockage token
   - localStorage.setItem('token', token)

6. Client → Requêtes authentifiées
   Headers: { Authorization: "Bearer <token>" }
```

### Protection des routes

**Backend** :
```javascript
import { protect } from './middleware/authMiddleware.js';

// Route publique
router.get('/factions', factionController.getAll);

// Route protégée
router.get('/characters', protect, characterController.getMyCharacters);
```

**Middleware `protect`** :
1. Extrait le token du header `Authorization: Bearer <token>`
2. Vérifie le token avec `jwt.verify()`
3. Récupère l'utilisateur depuis la BDD
4. Attache `req.user` pour les contrôleurs
5. Retourne 401 si échec

**Frontend** :
```javascript
const { authenticatedFetch } = useAuth();

// Requête authentifiée
const response = await authenticatedFetch('/api/characters', {
  method: 'POST',
  body: JSON.stringify({ name: 'Xarn', faction_id: 1 })
});

// Déconnexion automatique si 401
```

### Gestion des erreurs

**Codes HTTP** :
- `200` - OK
- `201` - Created
- `400` - Bad Request (validation)
- `401` - Unauthorized (token invalide/expiré)
- `403` - Forbidden (permissions insuffisantes)
- `404` - Not Found
- `409` - Conflict (doublon)
- `500` - Internal Server Error

**Format d'erreur** :
```json
{
  "error": "Message d'erreur explicite"
}
```

---

## 🛣️ Routes API complètes

### Authentification (`/api/auth`)

| Méthode | Route | Protection | Description | Body |
|---------|-------|-----------|-------------|------|
| POST | `/register` | - | Inscription | `{ username, email, password }` |
| POST | `/login` | - | Connexion | `{ username/email, password }` |
| GET | `/me` | JWT | Profil utilisateur | - |
| POST | `/accept-terms` | JWT | Accepter CGU | - |
| POST | `/accept-forum-rules` | JWT | Accepter règlement | - |

**Exemple** :
```bash
# Inscription
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","email":"john@example.com","password":"securepass123"}'

# Connexion
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"securepass123"}'

# Profil (authentifié)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Personnages (`/api/characters`)

Toutes les routes nécessitent un token JWT.

| Méthode | Route | Description | Body |
|---------|-------|-------------|------|
| POST | `/` | Créer un personnage | `{ name, faction_id, clan_id? }` |
| GET | `/` | Mes personnages | - |
| GET | `/:id` | Détails personnage | - |
| PUT | `/:id` | Modifier personnage | `{ name?, health?, position_x?, ... }` |
| DELETE | `/:id` | Supprimer personnage | - |

**Validation** :
- `name` : 3-100 caractères
- `faction_id` : Doit exister
- `clan_id` : Doit appartenir à la faction (si fourni)

**Exemple** :
```bash
# Créer un personnage
curl -X POST http://localhost:3000/api/characters \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Xarn le Symbiote","faction_id":1,"clan_id":1}'
```

---

### Factions (`/api/factions`)

Routes publiques (pas de token requis).

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/` | Toutes les factions |
| GET | `/playable` | Factions jouables uniquement |
| GET | `/:id` | Détails faction |

**Exemple** :
```bash
# Liste des factions
curl -X GET http://localhost:3000/api/factions
```

---

### Clans (`/api/clans`)

Routes publiques.

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/` | Tous les clans |
| GET | `/type/:type` | Clans par type (caste_mutant, caste_non_mutant, clan_neutre) |
| GET | `/faction/:factionId` | Clans d'une faction |
| GET | `/:id` | Détails clan |

---

### Portail (`/api/portal`)

Routes publiques pour contenu statique.

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/home` | Contenu page d'accueil |
| GET | `/intro` | Contenu introduction |
| GET | `/lore` | Contenu lore |
| GET | `/rules` | Règles et CGU |
| GET | `/wiki` | Wiki |

---

### Forum - Catégories (`/api/forum/categories`)

| Méthode | Route | Protection | Description |
|---------|-------|-----------|-------------|
| GET | `/` | - | Liste catégories avec sections |
| GET | `/:slug` | - | Catégorie par slug |

---

### Forum - Sections (`/api/forum/sections`)

| Méthode | Route | Protection | Description | Body |
|---------|-------|-----------|-------------|------|
| GET | `/` | - | Toutes les sections | - |
| GET | `/:slug` | - | Section par slug (+ sous-sections + topics) | - |
| POST | `/` | JWT | Créer section | `{ category_id, name, description?, parent_section_id? }` |
| PUT | `/:id` | JWT | Modifier section | `{ name?, description?, order? }` |
| PUT | `/:id/move` | JWT | Déplacer section | `{ category_id?, parent_section_id? }` |
| DELETE | `/:id` | JWT | Supprimer section | - |

**Validations** :
- Empêche doublons de noms au même niveau
- Empêche suppression si contient sous-sections/topics
- Empêche boucles infinies (section parent de elle-même)
- Génération automatique de slugs uniques

**Exemple** :
```bash
# Créer une section
curl -X POST http://localhost:3000/api/forum/sections \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category_id":1,"name":"Taverne","description":"Discussions libres"}'

# Créer une sous-section
curl -X POST http://localhost:3000/api/forum/sections \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"category_id":1,"parent_section_id":5,"name":"Jeux de rôle"}'
```

---

### Forum - Topics (`/api/forum/topics`)

| Méthode | Route | Protection | Description | Body |
|---------|-------|-----------|-------------|------|
| GET | `/:id` | - | Topic avec posts | - |
| POST | `/` | JWT | Créer topic + premier post | `{ section_id, title, content, author_user_id?, author_character_id? }` |
| PUT | `/:id` | JWT (auteur) | Modifier topic | `{ title?, is_locked? }` |
| PUT | `/:id/move` | JWT (auteur) | Déplacer topic | `{ section_id }` |
| PUT | `/:id/pin` | JWT (mod+) | Épingler/désépingler | - |
| PUT | `/:id/lock` | JWT (mod+) | Verrouiller/déverrouiller | - |
| DELETE | `/:id` | JWT (auteur) | Supprimer topic + posts | - |

**Validations** :
- `title` : 5-200 caractères
- Empêche doublons de titres dans la même section
- Création bloquée si section verrouillée
- Un de `author_user_id` ou `author_character_id` requis

**Exemple** :
```bash
# Créer un topic
curl -X POST http://localhost:3000/api/forum/topics \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "section_id": 3,
    "title": "Bienvenue dans le Wasteland",
    "content": "Salut à tous ! Je suis nouveau ici...",
    "author_user_id": 1
  }'
```

---

### Forum - Posts (`/api/forum/posts`)

| Méthode | Route | Protection | Description | Body |
|---------|-------|-----------|-------------|------|
| POST | `/` | JWT | Créer post/réponse | `{ topic_id, content, author_user_id?, author_character_id? }` |
| PUT | `/:id` | JWT (auteur) | Modifier post | `{ content }` |
| PUT | `/:id/move` | JWT (mod+) | Déplacer post | `{ topic_id }` |
| DELETE | `/:id` | JWT (auteur) | Supprimer post | - |

**Validations** :
- `content` : 10-10000 caractères
- Création bloquée si topic verrouillé
- Marque `is_edited: true` et `edited_at` lors d'édition

---

### Forum - Permissions (`/api/forum/permissions`)

| Méthode | Route | Protection | Description | Body |
|---------|-------|-----------|-------------|------|
| GET | `/:entityType/:entityId` | - | Permissions d'une entité | - |
| PUT | `/:entityType/:entityId` | JWT (admin) | Mettre à jour permissions | `{ permissions: [...] }` |
| POST | `/:entityType/:entityId/inherit` | JWT (admin) | Hériter permissions parentes | - |

**Types d'entités** : `category`, `section`, `topic`

**Opérations** : `view`, `create`, `update`, `delete`

**Exemple de body PUT** :
```json
{
  "permissions": [
    {
      "operation": "view",
      "role_level": "everyone",
      "allow_author": false,
      "character_requirement": "none",
      "requires_terms": true,
      "requires_forum_rules": true
    },
    {
      "operation": "create",
      "role_level": "admin_moderator_gm_player",
      "allow_author": false,
      "character_requirement": "alive",
      "character_author_rule_enabled": false,
      "requires_terms": true,
      "requires_forum_rules": true
    }
  ]
}
```

---

## 🔒 Système de permissions

### Architecture à 5 couches

Les permissions sont évaluées dans l'ordre :

#### 1️⃣ Niveau Rôle (`role_level`)

Vérifie le rôle de l'utilisateur.

**Valeurs** :
- `admin` - Admin uniquement
- `admin_moderator` - Admin + Modérateur
- `admin_moderator_gm` - Admin + Modérateur + Game Master
- `admin_moderator_player` - Admin + Modérateur + Joueur (exclut GM)
- `admin_moderator_gm_player` - Admin + Modérateur + GM + Joueur
- `everyone` - Tous (par défaut)

**Exemple** :
```javascript
role_level: "admin_moderator_gm_player"
// ✅ user.role === "ADMIN" → OK
// ✅ user.role === "MODERATOR" → OK
// ✅ user.role === "GAME_MASTER" → OK
// ✅ user.role === "PLAYER" → OK
```

#### 2️⃣ Exception Auteur (`allow_author`)

Autorise l'auteur original même si le rôle est insuffisant.

**Exemple** :
```javascript
role_level: "admin_moderator"
allow_author: true

// ❌ user.role === "PLAYER" && user.id !== author_id → DENIED
// ✅ user.role === "PLAYER" && user.id === author_id → OK (exception)
```

#### 3️⃣ Exigences Personnage (`character_requirement`)

Nécessite un personnage avec critères spécifiques.

**Valeurs** :
- `none` - Aucune exigence (par défaut)
- `alive` - Personnage vivant requis
- `clan_member` - Membre du clan spécifié (+ `required_clan_id`)
- `faction_member` - Membre de la faction spécifiée (+ `required_faction_id`)
- `clan_leader` - Leader du clan spécifié (+ `required_clan_id`)

**Exemple** :
```javascript
character_requirement: "faction_member"
required_faction_id: 1

// ❌ user a 0 personnages → DENIED
// ❌ user a 1 personnage mort → DENIED
// ❌ user a 1 personnage vivant faction_id=2 → DENIED
// ✅ user a 1 personnage vivant faction_id=1 → OK
```

#### 4️⃣ Règle Auteur RP (`character_author_rule`)

Gère les posts RP avec personnages.

**Champs** :
- `character_author_rule_enabled` (boolean) - Active la règle
- `character_author_exclusive` (boolean) - Mode exclusif/inclusif

**Mode inclusif** (`exclusive: false`) :
- Autorise auteur User OU auteur Character

**Mode exclusif** (`exclusive: true`) :
- Autorise UNIQUEMENT auteur Character

**Exemple** :
```javascript
character_author_rule_enabled: true
character_author_exclusive: true

// Topic créé par character_id=5 (Xarn)
// ❌ user essaie d'éditer avec author_user_id → DENIED
// ✅ user essaie d'éditer avec character_id=5 → OK
```

#### 5️⃣ Exigences Acceptations (`requires_terms`, `requires_forum_rules`)

Vérifie que l'utilisateur a accepté les CGU et/ou le règlement.

**Exemple** :
```javascript
requires_terms: true
requires_forum_rules: true

// ❌ user.terms_accepted === false → DENIED
// ❌ user.forum_rules_accepted === false → DENIED
// ✅ user.terms_accepted && user.forum_rules_accepted → OK
```

### Évaluation complète

```javascript
function checkPermission(user, operation, entity) {
  const permission = getPermission(entity, operation); // ou hérite parent

  // 1. Vérifier rôle
  if (!hasRequiredRole(user.role, permission.role_level)) {
    // 2. Exception auteur ?
    if (!permission.allow_author || user.id !== entity.author_user_id) {
      return false;
    }
  }

  // 3. Vérifier personnage
  if (permission.character_requirement !== 'none') {
    const character = getUserCharacter(user, permission);
    if (!character) return false;
  }

  // 4. Règle auteur RP
  if (permission.character_author_rule_enabled) {
    if (permission.character_author_exclusive) {
      // Doit être l'auteur Character
      if (user.character_id !== entity.author_character_id) {
        return false;
      }
    }
  }

  // 5. Acceptations
  if (permission.requires_terms && !user.terms_accepted) return false;
  if (permission.requires_forum_rules && !user.forum_rules_accepted) return false;

  return true;
}
```

### Permissions par défaut

Si aucune permission n'est définie pour une entité :

**view** :
```javascript
{
  role_level: "everyone",
  allow_author: false,
  character_requirement: "none",
  requires_terms: false,
  requires_forum_rules: false
}
```

**create**, **update**, **delete** :
```javascript
{
  role_level: "admin_moderator_gm_player",
  allow_author: true,
  character_requirement: "none",
  requires_terms: true,
  requires_forum_rules: true
}
```

### Héritage de permissions

Les permissions peuvent être héritées :
- Topic → Section → Catégorie
- Section → Catégorie
- Sous-section → Section parente → Catégorie

**Algorithme** :
1. Chercher permission sur l'entité elle-même
2. Si absente, remonter à l'entité parente
3. Si toujours absente, utiliser défaut

**Exemple** :
```
Topic X (pas de permissions)
  → Section Y (permissions définies) ✅ UTILISE
    → Catégorie Z (permissions définies)
```

---

## 🧪 Tests et développement

### Comptes de test (seedDev)

| Username | Email | Role | Password | CGU | Règlement |
|----------|-------|------|----------|-----|-----------|
| admin_test | admin@test.com | ADMIN | password123 | ✅ | ✅ |
| moderator_test | moderator@test.com | MODERATOR | password123 | ✅ | ✅ |
| gm_test | gm@test.com | GAME_MASTER | password123 | ✅ | ✅ |
| player_mutant | mutant@test.com | PLAYER | password123 | ✅ | ✅ |
| player_pure | pure@test.com | PLAYER | password123 | ❌ | ❌ |
| player_neutral | neutral@test.com | PLAYER | password123 | ✅ | ❌ |

### Tester l'authentification

```bash
# 1. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_test","password":"password123"}' \
  | jq -r '.token'

# Copier le token retourné

# 2. Requête authentifiée
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Tester les permissions

```bash
# 1. Créer un topic en tant que PLAYER
TOKEN_PLAYER="..."
curl -X POST http://localhost:3000/api/forum/topics \
  -H "Authorization: Bearer $TOKEN_PLAYER" \
  -H "Content-Type: application/json" \
  -d '{
    "section_id": 3,
    "title": "Test topic",
    "content": "Test content",
    "author_user_id": 4
  }'

# 2. Essayer de modifier en tant qu'autre PLAYER (devrait échouer)
TOKEN_OTHER="..."
curl -X PUT http://localhost:3000/api/forum/topics/1 \
  -H "Authorization: Bearer $TOKEN_OTHER" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hacked title"}'
# → 403 Forbidden

# 3. Modifier en tant que MODERATOR (devrait réussir)
TOKEN_MOD="..."
curl -X PUT http://localhost:3000/api/forum/topics/1 \
  -H "Authorization: Bearer $TOKEN_MOD" \
  -H "Content-Type: application/json" \
  -d '{"title":"Moderated title"}'
# → 200 OK
```

---

## 📝 Conventions de développement

### Nommage

**Backend** :
- Fichiers : camelCase (`authController.js`, `seedDev.js`)
- Modèles : PascalCase (`User`, `ForumPermission`)
- Tables : snake_case pluriel (`users`, `forum_permissions`)
- Champs BDD : snake_case (`user_id`, `forum_rules_accepted_at`)
- Variables JS : camelCase (`userId`, `forumRulesAccepted`)

**Frontend** :
- Composants : PascalCase (`LoginPage.jsx`, `CreateTopicForm.jsx`)
- Fichiers non-composants : camelCase (`authContext.js`)
- Props : camelCase (`isVisible`, `onClose`)
- Classes CSS : kebab-case (`bg-city-900`, `text-ochre-300`)

### Structure des fichiers

**Contrôleur** :
```javascript
// backend/controllers/resourceController.js
export const getAll = async (req, res) => {
  try {
    const items = await Resource.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => { /* ... */ };
export const create = async (req, res) => { /* ... */ };
export const update = async (req, res) => { /* ... */ };
export const remove = async (req, res) => { /* ... */ };
```

**Composant React** :
```jsx
// frontend/src/components/ui/Card.jsx
export default function Card({ title, children, className = '' }) {
  return (
    <div className={`bg-city-800 rounded-lg p-4 ${className}`}>
      {title && <h3 className="text-xl font-bold mb-2">{title}</h3>}
      {children}
    </div>
  );
}
```

### Gestion d'erreurs

**Backend** :
```javascript
try {
  // Opération
  const result = await Model.create(data);
  res.status(201).json(result);
} catch (error) {
  // Erreur de validation Sequelize
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.errors[0].message });
  }

  // Erreur de contrainte unique
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Already exists' });
  }

  // Erreur générique
  res.status(500).json({ error: error.message });
}
```

**Frontend** :
```javascript
try {
  const response = await authenticatedFetch('/api/resource', {
    method: 'POST',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  const result = await response.json();
  // Succès
} catch (error) {
  setError(error.message);
  // Afficher message d'erreur à l'utilisateur
}
```

---

## 🔧 Variables d'environnement

**Fichier** : `backend/.env`

```env
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_password
DB_NAME=erosion_des_ames

# JWT
JWT_SECRET=votre_secret_tres_long_et_securise_minimum_32_caracteres
JWT_EXPIRES_IN=7d

# Serveur
PORT=3000
NODE_ENV=development

# Frontend (optionnel)
FRONTEND_URL=http://localhost:5173
```

**Sécurité** :
- ⚠️ Ne jamais commiter `.env`
- ✅ Fournir `.env.example` sans valeurs sensibles
- ✅ Utiliser secrets forts (min 32 caractères aléatoires)
- ✅ Différencier dev/production

---

## 🚀 Déploiement

### Checklist pré-production

- [ ] Variables d'environnement production configurées
- [ ] JWT_SECRET unique et sécurisé (min 64 caractères)
- [ ] Base de données de production créée
- [ ] Seed production exécuté (`npm run seed`)
- [ ] Frontend build (`npm run build`)
- [ ] CORS configuré pour domaine de production
- [ ] HTTPS activé
- [ ] Rate limiting configuré
- [ ] Logs de production configurés
- [ ] Backup automatique BDD configuré

### Build production

**Backend** :
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

**Frontend** :
```bash
cd frontend
npm run build
# Servir le dossier dist/ avec nginx/apache
```

---

**Dernière mise à jour** : 18 janvier 2025
