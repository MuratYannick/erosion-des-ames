# Phase 10: Finitions et optimisations

**Branche**: `feature/phase-10-finitions`

---

## Vue d'ensemble

Cette phase finalise le projet avec quatre grands axes :
- Page de profil utilisateur (public + paramètres du compte)
- Optimisations techniques (lazy loading, images, cache, SEO)
- Couverture de tests (backend + frontend)
- Préparation au déploiement en production

> **Pré-requis** : Phases 1 à 9 complètes. Le modèle User possède déjà `avatar` (URL), `username`, le système d'auth complet et la sélection de personnage (`selectedCharacterId`).

### Stack technique
- **Backend**: Express + Sequelize ORM + MySQL
- **Frontend**: React + TailwindCSS + React Router
- **Tests backend**: Jest (déjà configuré, 9 fichiers de tests existants)
- **Tests frontend**: Vitest (à installer)
- **SEO**: react-helmet-async
- **Images**: multer + sharp (upload + optimisation)

---

## 10.1 Profil utilisateur

### 10.1.1 Backend - Routes API profil

#### Routes publiques (`/api/users`)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/:id` | optionalAuth | Profil public d'un utilisateur |
| GET | `/:id/characters` | optionalAuth | Personnages publics d'un utilisateur (approved + active) |
| GET | `/:id/posts` | optionalAuth | Historique des posts d'un utilisateur (paginé) |
| GET | `/:id/topics` | optionalAuth | Sujets créés par un utilisateur (paginé) |

#### Route paramètres (`/api/auth`)

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| PUT | `/update-profile` | authenticate | Modifier profil (username, avatar) — **route existante** |

### 10.1.2 Backend - Fichiers

#### Controller
- [x] `controllers/userController.js`
  - `getPublicProfile` : retourne les infos publiques (username, avatar, rôle, date inscription, personnage sélectionné, statistiques forum)
  - `getUserCharacters` : personnages approved + active de l'utilisateur, paginés
  - `getUserPosts` : posts de l'utilisateur avec topic + catégorie, paginés
  - `getUserTopics` : sujets créés par l'utilisateur avec catégorie + compteurs, paginés

#### Validators
- [x] `validators/userValidators.js`
  - `getUserValidation` - param('id').isUUID()

#### Routes
- [x] `routes/users.js`
  - GET `/:id` -> optionalAuth -> getUserValidation -> validate -> getPublicProfile
  - GET `/:id/characters` -> optionalAuth -> getUserValidation -> validate -> getUserCharacters
  - GET `/:id/posts` -> optionalAuth -> getUserValidation -> validate -> getUserPosts
  - GET `/:id/topics` -> optionalAuth -> getUserValidation -> validate -> getUserTopics

#### Modifications existantes
- [x] `routes/index.js` : monter `/users` -> `routes/users.js`

### 10.1.3 Frontend - Service et Hooks

#### Service (`services/userService.js`)
- [x] `getUserProfile(id)` - Profil public
- [x] `getUserCharacters(id, params)` - Personnages d'un utilisateur
- [x] `getUserPosts(id, params)` - Posts d'un utilisateur (paginés)
- [x] `getUserTopics(id, params)` - Sujets d'un utilisateur (paginés)

#### Hooks (`hooks/useUser.js`)
- [x] `useUserProfile(id)` - Query profil public
- [x] `useUserCharacters(id, params)` - Query personnages
- [x] `useUserPosts(id, params)` - Query posts paginés
- [x] `useUserTopics(id, params)` - Query sujets paginés
- [x] `useUpdateProfile()` - Mutation mise à jour profil (username, avatar)

### 10.1.4 Frontend - Pages et composants

#### Page profil public (`pages/Profile/ProfilePage.jsx`)
- [x] En-tête : avatar (grand format), username, rôle (badge), date d'inscription, personnage actif
- [x] Onglets : Personnages, Sujets, Messages
- [x] Onglet Personnages : grille de CharacterCard (approved + active uniquement)
- [x] Onglet Sujets : liste des sujets créés avec catégorie, date, nombre de réponses
- [x] Onglet Messages : liste des posts récents avec lien vers le sujet, date
- [x] Pagination par onglet
- [x] Route : `/profil/:id`

#### Page paramètres du compte (`pages/Profile/ProfileSettings.jsx`)
- [x] Section identité : formulaire username
- [x] Section avatar : champ URL avatar + aperçu en temps réel (composant Avatar existant)
- [x] Section mot de passe : formulaire changement de mot de passe (réutilise `changePassword` existant)
- [x] Section email : affichage email + statut vérification
- [x] Section danger zone : bouton désactivé — `// TODO: requires DELETE /auth/account endpoint`
- [x] Route : `/profil/parametres` (ProtectedRoute)

#### Composants
- [x] `ProfileHeader.jsx` - En-tête de profil avec avatar, username, rôle, personnage actif
- [x] `ProfileTabs.jsx` - Navigation par onglets (Personnages, Sujets, Messages)
- [x] `ProfileActivityRow.jsx` - Ligne d'activité (post ou sujet avec date relative)

#### Intégration Router (`App.jsx`)
- [x] Route `/profil/parametres` -> `ProfileSettings` (ProtectedRoute)
- [x] Route `/profil/:id` -> `ProfilePage` (public)
- [x] Remplacer le placeholder `ProfilPage` existant

#### Navigation
- [x] Lien "Mon profil" dans le menu utilisateur du Header (`/profil/${user.id}`)
- [x] Lien "Paramètres" dans le menu utilisateur du Header
- [x] Lien cliquable sur les username dans le forum (AuthorSidebar, TopicRow) vers `/profil/:id`

---

## 10.2 Optimisations

### 10.2.1 Lazy loading des composants

> **État actuel** : toutes les pages sont en `React.lazy()` avec code splitting Vite actif.

- [x] Créer un composant `SuspenseFallback.jsx` (Loader centré plein écran avec le thème tribal)
- [x] Convertir les imports de pages dans `App.jsx` en `React.lazy()` :
  - Pages publiques : Home, Foreword, Universe, Characters
  - Pages auth : Login, Register, ForgotPassword, ResetPassword, VerifyEmail
  - Pages protégées : MyCharacters (create, detail, edit, list)
  - Pages forum : ForumIndex, ForumCategory, ForumTopic, ForumCreateTopic, ForumEditTopic, ForumEditPost, ForumSearch, ForumModeration
  - Pages profil : ProfilePage, ProfileSettings
  - Pages admin : AdminDashboard, AdminUsers, AdminUserDetail, AdminCharacters, AdminForum, AdminModeration, AdminLogs
  - Pages erreur : NotFound, Forbidden, ServerError, Maintenance
- [x] Envelopper les routes avec `<Suspense fallback={<SuspenseFallback />}>`

### 10.2.2 Optimisation des images

> **État actuel** : upload serveur opérationnel via multer + sharp. Les avatars sont stockés en WebP 200×200.

#### Backend - Upload d'images
- [x] Installer `multer` + `sharp`
- [x] Créer `middlewares/upload.js` : multer memoryStorage, filtre MIME (jpeg/png/webp/gif), limite 5 Mo
- [x] Créer `utils/imageProcessor.js` : resize 200×200 cover, conversion WebP qualité 80%
- [x] Route `POST /api/upload/avatar` (authenticate) : upload + traitement + retourne l'URL
- [x] Servir les fichiers statiques : `express.static('uploads')` dans `app.js`
- [x] Créer le dossier `uploads/avatars/` avec `.gitkeep`

#### Frontend - Intégration upload
- [x] Modifier la section avatar de `ProfileSettings.jsx` : remplacer le champ URL par `<AvatarUpload>`
- [x] Upload réel vers `POST /api/upload/avatar` + `updateUser` après succès

### 10.2.3 Mise en cache des requêtes

> **État actuel** : cache frontend opt-in dans `useGet`, headers Cache-Control + ETag sur les routes publiques backend.

#### Frontend - Cache des hooks
- [x] Ajouter un cache mémoire simple dans `useApi.js` (`queryCache` Map, clé = URL + params, TTL configurable)
- [x] Options hook : `{ cache: true, cacheTTL: 60000 }` (opt-in, 60s par défaut)
- [x] Méthode `invalidateCache(pattern)` exportée pour vider le cache après une mutation

#### Backend - Headers de cache HTTP
- [x] `Cache-Control: public, max-age=3600` sur les routes GET de référence (ethnicités, factions, clans)
- [x] `Cache-Control: public, max-age=300` sur les routes GET profils utilisateurs
- [x] `ETag` MD5 + support `If-None-Match` / `304` sur les 3 endpoints paginés de `userController`

### 10.2.4 SEO

> **État actuel** : meta tags dynamiques via react-helmet-async sur toutes les pages principales.

- [x] Installer `react-helmet-async`
- [x] Créer `components/common/SEO.jsx` : composant réutilisable (title, description, Open Graph, Twitter Card)
- [x] Envelopper `App` avec `<HelmetProvider>`
- [x] Ajouter `<SEO>` sur les pages principales :
  - Home, Foreword, ForumIndex
  - ForumCategory : `{category.name} - Forum` (dynamique)
  - ForumTopic : `{topic.title}` (dynamique)
  - ProfilePage : `Profil de {username}` (dynamique)
  - ProfileSettings : "Paramètres du compte"
- [x] `sitemap.xml` dans `frontend/public/`
- [x] `robots.txt` dans `frontend/public/`

---

## 10.3 Tests et qualité

### 10.3.1 Tests unitaires backend (Jest)

> **État actuel** : 18 suites de tests, 479 tests — tous passants ✅

#### Tests complétés

- [x] `tests/unit/controllers/authController.test.js` - Fonctions critiques (register, login, selectCharacter, updateProfile)
- [x] `tests/unit/controllers/userController.test.js` - Profil public, pagination posts/topics
- [x] `tests/unit/controllers/characterController.test.js` - CRUD, workflow d'approbation
- [x] `tests/unit/models/User.test.js` - Hooks bcrypt, scopes, validations
- [x] `tests/unit/models/Character.test.js` - Workflow statut, hook afterUpdate (auto-désélection)
- [x] `tests/unit/middlewares/errorHandler.test.js` - ApiError, format de réponse

#### Tests non réalisés (hors périmètre phase 10)
- [ ] `tests/unit/controllers/forumTopicController.test.js`
- [ ] `tests/unit/controllers/forumPostController.test.js`
- [ ] `tests/unit/models/UserSanction.test.js`

### 10.3.2 Tests d'intégration API (Jest + Supertest)

> **État actuel** : 4 fichiers d'intégration, tous passants ✅

#### Tests complétés
- [x] `tests/integration/auth.test.js` - Register, login, verify-email, change-password, etc.
- [x] `tests/integration/users.test.js` - Routes profil public (GET /:id, /characters, /posts, /topics)
- [x] `tests/integration/users-admin.test.js` - Gestion admin : liste, rôle, ban
- [x] `tests/integration/characters.test.js` - CRUD personnages, workflow approbation

#### Configuration intégration
- [x] `tests/helpers/setup.js` : helpers rate-limit bypass
- [x] `tests/helpers/auth.js` : helpers JWT de test
- [x] `.env.test` : variables d'environnement de test

#### Tests non réalisés (hors périmètre phase 10)
- [ ] `tests/integration/forum/` - Tests forum (categories, topics, posts)
- [ ] `tests/integration/admin/moderation.test.js`

### 10.3.3 Tests composants React (Vitest)

> **État actuel** : 8 suites de tests, 256 tests — tous passants ✅

#### Installation et configuration
- [x] Configurer Vitest dans `vite.config.js` (environment: jsdom, setup files, globals)
- [x] Créer `frontend/src/tests/setup.js` : mock localStorage Map-backed + `@testing-library/jest-dom`
- [x] Ajouter les scripts `test`/`test:ui`/`test:coverage` dans `frontend/package.json`
- [x] Dépendances installées : `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `axios-mock-adapter`

#### Tests créés et passants
- [x] `components/ui/Button/Button.test.jsx` - Variantes, états disabled, onClick
- [x] `components/ui/Card/Card.test.jsx` - Rendu, variantes
- [x] `components/characters/CharacterCard.test.jsx` - Rendu, sélection, statut, menu actions
- [x] `hooks/useAuth.test.jsx` - Login, logout, état utilisateur, helpers de rôles
- [x] `hooks/useApi.test.js` - Queries, cache, états loading/error, `enabled`, pagination
- [x] `hooks/useNavigateToError.test.js` - Navigation vers pages d'erreur
- [x] `pages/errors/ErrorPages.test.jsx` - NotFound, Forbidden, ServerError, Maintenance, ErrorBoundary
- [x] `services/api.test.js` - Instance Axios, intercepteurs, gestion erreurs HTTP/réseau

### 10.3.4 Tests end-to-end (optionnel)

- [ ] Installer Playwright ou Cypress
- [ ] Configurer pour les scénarios critiques
- [ ] Scénarios E2E :
  - Inscription -> vérification email -> connexion -> consultation profil
  - Création personnage -> soumission -> approbation -> sélection
  - Navigation forum -> création sujet -> réponse -> signalement
  - Admin : ban utilisateur -> vérification accès bloqué

---

## 10.4 Déploiement

### 10.4.1 Configuration environnement production

#### Backend
- [ ] Créer `.env.production.example` avec toutes les variables requises (commentées)
- [ ] Configurer `helmet` pour les headers de sécurité HTTP
- [ ] Configurer `compression` pour la compression gzip des réponses
- [ ] Configurer `express-rate-limit` pour la protection contre le brute force :
  - Global : 100 requêtes / 15 min par IP
  - Auth (login, register) : 5 requêtes / 15 min par IP
  - API écriture : 30 requêtes / 15 min par IP
- [ ] Configurer CORS pour le domaine de production uniquement
- [ ] Configurer le logging avec `morgan` (format combined, fichier rotatif)
- [ ] Configurer Sequelize pour le pool de connexions (min: 2, max: 10, idle: 10000)
- [ ] Créer le script `npm run db:migrate:prod` (migrations en production)
- [ ] Créer le seeder de production `seeders/seed-prod-*.js` (catégories forum de base, compte admin initial)

#### Frontend
- [ ] Configurer les variables d'environnement Vite pour la production (`VITE_API_URL`)
- [ ] Optimiser le build Vite : `build.rollupOptions.output.manualChunks` pour séparer les vendors
- [ ] Vérifier la taille du bundle (objectif < 500 Ko gzipped pour le JS initial)
- [ ] Configurer les assets statiques avec hash pour le cache busting

### 10.4.2 CI/CD pipeline

- [ ] Créer `.github/workflows/ci.yml` :
  - Déclenché sur push (main, feature/*) et pull request vers main
  - Job `lint` : ESLint backend + frontend
  - Job `test-backend` : Jest avec base MySQL de test (service container)
  - Job `test-frontend` : Vitest
  - Job `build` : vérifier que le build frontend passe sans erreur
- [ ] Créer `.github/workflows/deploy.yml` :
  - Déclenché sur push vers main uniquement
  - Build frontend -> upload artifacts
  - SSH vers le serveur -> pull -> migrations -> restart
- [ ] Configurer les secrets GitHub (SSH_KEY, DB credentials, JWT_SECRET)

### 10.4.3 Documentation déploiement

- [ ] Créer `DEPLOYMENT.md` avec les instructions complètes :
  - Pré-requis serveur (Node.js 20+, MySQL 8+, Nginx)
  - Installation et configuration initiale
  - Variables d'environnement requises
  - Commandes de déploiement (migrations, seeders prod, build, restart)
  - Configuration Nginx (reverse proxy, SSL, assets statiques)
  - Procédure de mise à jour

### 10.4.4 Backup base de données

- [ ] Créer `scripts/backup-db.sh` : mysqldump compressé avec date dans le nom
- [ ] Créer `scripts/restore-db.sh` : restauration depuis un fichier de backup
- [ ] Configurer un cron job pour le backup quotidien automatique
- [ ] Documenter la stratégie de rétention (7 jours quotidiens, 4 hebdomadaires, 3 mensuels)

---

## Notes techniques

### Conventions
- Les FK vers `users` sont de type UUID (users.id est UUID)
- Les FK vers les autres tables sont de type INTEGER
- Les controllers utilisent `asyncHandler` + `ApiError` depuis `middlewares/errorHandler.js`
- Format de réponse : `{ success, data, message }`
- Validators avec `express-validator`, messages en français
- Routes avec JSDoc, middleware stack : authenticate -> authorize -> validators -> validate -> controller

### Pagination
- Pagination côté serveur avec `limit` + `offset`
- Format de réponse paginée : `{ success, data: { items, total, page, totalPages, limit } }`
- Valeurs par défaut : 20 items par page

### Performance
- `React.lazy()` pour le code splitting par route
- Cache mémoire frontend avec TTL configurable
- Headers `Cache-Control` sur les routes publiques
- Pool de connexions Sequelize en production
- Compression gzip des réponses

### Sécurité
- Rate limiting par IP et par route
- Headers de sécurité via helmet
- CORS restreint au domaine de production
- Validation côté serveur sur toutes les entrées
- Protection CSRF si cookies utilisés
- Upload : filtrage type MIME, limite de taille, nom de fichier sanitisé

---

## Ordre de réalisation suggéré

1. **Profil utilisateur - Backend**
   - [x] Controller + validators + routes profil public
   - [x] Montage routes dans index.js

2. **Profil utilisateur - Frontend**
   - [x] Service + hooks
   - [x] Page profil public (onglets, pagination)
   - [x] Page paramètres du compte
   - [x] Liens de navigation (Header, forum)

3. **Optimisations - Lazy loading**
   - [x] SuspenseFallback + React.lazy() dans App.jsx

4. **Optimisations - Images**
   - [x] Backend : multer + sharp + route upload
   - [x] Frontend : intégration AvatarUpload

5. **Optimisations - Cache et SEO**
   - [x] Cache frontend (useApi)
   - [x] Headers Cache-Control backend
   - [x] react-helmet-async + composant SEO
   - [x] sitemap.xml + robots.txt

6. **Tests - Backend**
   - [ ] Tests unitaires controllers et modèles
   - [ ] Tests d'intégration API
   - [ ] Helpers de test (setup, auth)

7. **Tests - Frontend**
   - [ ] Installation et configuration Vitest
   - [ ] Tests composants UI
   - [ ] Tests hooks et pages

8. **Déploiement**
   - [ ] Configuration production (backend + frontend)
   - [ ] CI/CD pipeline GitHub Actions
   - [ ] Documentation déploiement
   - [ ] Scripts de backup

---

## Critères de validation

### Profil utilisateur
- [x] Le profil public affiche les infos, personnages et activité d'un utilisateur
- [x] Les paramètres permettent de modifier username, avatar et mot de passe
- [x] Les username dans le forum sont cliquables et mènent au profil
- [x] Le profil d'un utilisateur désactivé affiche un message approprié

### Optimisations
- [x] Le build produit des chunks séparés par route (React.lazy + Vite code splitting)
- [x] Les avatars uploadés sont redimensionnés et convertis en WebP (200×200, qualité 80%)
- [x] Les meta tags sont présents sur les pages principales (Helmet + Open Graph)
- [ ] Le temps de chargement initial est < 3s sur une connexion 3G simulée (à mesurer en prod)

### Tests
- [ ] Couverture backend > 70% sur les controllers et modèles
- [ ] Couverture frontend > 50% sur les composants critiques
- [ ] Tous les tests passent dans la CI

### Déploiement
- [ ] Le pipeline CI bloque les PR si les tests échouent
- [ ] Le déploiement automatique fonctionne sur push vers main
- [ ] Les backups quotidiens sont fonctionnels
- [ ] La documentation de déploiement permet une mise en production par un développeur tiers
