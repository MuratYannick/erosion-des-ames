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
- [ ] `controllers/userController.js`
  - `getPublicProfile` : retourne les infos publiques (username, avatar, rôle, date inscription, personnage sélectionné, statistiques forum)
  - `getUserCharacters` : personnages approved + active de l'utilisateur, paginés
  - `getUserPosts` : posts de l'utilisateur avec topic + catégorie, paginés
  - `getUserTopics` : sujets créés par l'utilisateur avec catégorie + compteurs, paginés

#### Validators
- [ ] `validators/userValidators.js`
  - `getUserValidation` - param('id').isUUID()

#### Routes
- [ ] `routes/users.js`
  - GET `/:id` -> optionalAuth -> getUserValidation -> validate -> getPublicProfile
  - GET `/:id/characters` -> optionalAuth -> getUserValidation -> validate -> getUserCharacters
  - GET `/:id/posts` -> optionalAuth -> getUserValidation -> validate -> getUserPosts
  - GET `/:id/topics` -> optionalAuth -> getUserValidation -> validate -> getUserTopics

#### Modifications existantes
- [ ] `routes/index.js` : monter `/users` -> `routes/users.js`

### 10.1.3 Frontend - Service et Hooks

#### Service (`services/userService.js`)
- [ ] `getUserProfile(id)` - Profil public
- [ ] `getUserCharacters(id, params)` - Personnages d'un utilisateur
- [ ] `getUserPosts(id, params)` - Posts d'un utilisateur (paginés)
- [ ] `getUserTopics(id, params)` - Sujets d'un utilisateur (paginés)

#### Hooks (`hooks/useUser.js`)
- [ ] `useUserProfile(id)` - Query profil public
- [ ] `useUserCharacters(id, params)` - Query personnages
- [ ] `useUserPosts(id, params)` - Query posts paginés
- [ ] `useUserTopics(id, params)` - Query sujets paginés
- [ ] `useUpdateProfile()` - Mutation mise à jour profil (username, avatar)

### 10.1.4 Frontend - Pages et composants

#### Page profil public (`pages/Profile/ProfilePage.jsx`)
- [ ] En-tête : avatar (grand format), username, rôle (badge), date d'inscription, personnage actif
- [ ] Onglets : Personnages, Sujets, Messages
- [ ] Onglet Personnages : grille de CharacterCard (approved + active uniquement)
- [ ] Onglet Sujets : liste des sujets créés avec catégorie, date, nombre de réponses
- [ ] Onglet Messages : liste des posts récents avec lien vers le sujet, date
- [ ] Pagination par onglet
- [ ] Route : `/profil/:id`

#### Page paramètres du compte (`pages/Profile/ProfileSettings.jsx`)
- [ ] Section identité : formulaire username
- [ ] Section avatar : champ URL avatar + aperçu en temps réel (composant Avatar existant)
- [ ] Section mot de passe : formulaire changement de mot de passe (réutilise `changePassword` existant)
- [ ] Section email : affichage email + statut vérification
- [ ] Section danger zone : suppression de compte (soft delete, avec confirmation modale)
- [ ] Route : `/profil/parametres` (ProtectedRoute)

#### Composants
- [ ] `ProfileHeader.jsx` - En-tête de profil avec avatar, username, rôle, personnage actif
- [ ] `ProfileTabs.jsx` - Navigation par onglets (Personnages, Sujets, Messages)
- [ ] `ProfileActivityRow.jsx` - Ligne d'activité (post ou sujet avec date relative)

#### Intégration Router (`App.jsx`)
- [ ] Route `/profil/parametres` -> `ProfileSettings` (ProtectedRoute)
- [ ] Route `/profil/:id` -> `ProfilePage` (public)
- [ ] Remplacer le placeholder `ProfilPage` existant

#### Navigation
- [ ] Lien "Mon profil" dans le menu utilisateur du Header
- [ ] Lien "Paramètres" dans le menu utilisateur du Header
- [ ] Lien cliquable sur les username dans le forum (PostCard, TopicRow) vers `/profil/:id`

---

## 10.2 Optimisations

### 10.2.1 Lazy loading des composants

> **État actuel** : aucun `React.lazy()` utilisé. Toutes les pages sont importées statiquement dans `App.jsx`.

- [ ] Installer le polyfill si nécessaire pour les navigateurs anciens
- [ ] Créer un composant `SuspenseFallback.jsx` (Loader centré plein écran avec le thème tribal)
- [ ] Convertir les imports de pages dans `App.jsx` en `React.lazy()` :
  - Pages publiques : Home, Foreword, Universe, Characters
  - Pages auth : Login, Register, ForgotPassword, ResetPassword, VerifyEmail
  - Pages protégées : MyCharacters (create, detail, edit, list)
  - Pages forum : ForumIndex, ForumCategory, ForumTopic, ForumCreateTopic, ForumEditTopic, ForumEditPost, ForumSearch, ForumModeration
  - Pages profil : ProfilePage, ProfileSettings
  - Pages admin : AdminDashboard, AdminUsers, AdminUserDetail, AdminCharacters, AdminForum, AdminModeration, AdminLogs
- [ ] Envelopper les routes avec `<Suspense fallback={<SuspenseFallback />}>`
- [ ] Vérifier que le code splitting fonctionne (vérifier les chunks dans le build Vite)

### 10.2.2 Optimisation des images

> **État actuel** : les avatars sont stockés comme URL externes. Pas d'upload serveur. Les images statiques utilisent `loading="lazy"` natif.

#### Backend - Upload d'images
- [ ] Installer `multer` + `sharp`
- [ ] Créer `middlewares/upload.js` : configuration multer (stockage disque, filtres type MIME, limite taille 5 Mo)
- [ ] Créer `utils/imageProcessor.js` : redimensionnement avec sharp (avatar: 200x200, thumbnail: 100x100), conversion WebP, qualité 80%
- [ ] Route `POST /api/upload/avatar` (authenticate) : upload + traitement + retourne l'URL
- [ ] Servir les fichiers statiques : `express.static('uploads')` ou CDN
- [ ] Créer le dossier `uploads/avatars/` avec `.gitkeep`

#### Frontend - Intégration upload
- [ ] Modifier la section avatar de `ProfileSettings.jsx` : remplacer le champ URL par le composant `AvatarUpload` existant (Phase 4)
- [ ] Adapter `AvatarUpload` pour envoyer vers `POST /api/upload/avatar`

### 10.2.3 Mise en cache des requêtes

> **État actuel** : aucun cache côté frontend. Le backend utilise un cache mémoire uniquement pour les permissions de catégories (TTL 60s).

#### Frontend - Cache des hooks
- [ ] Ajouter un cache mémoire simple dans `useApi.js` avec invalidation (Map avec clé = URL + params, TTL configurable)
- [ ] Activer le cache par défaut pour les requêtes GET publiques (catégories forum, profils, données de référence)
- [ ] Options hook : `{ cache: true, cacheTTL: 60000 }` (par défaut 60s)
- [ ] Méthode `invalidateCache(pattern)` pour vider le cache après une mutation

#### Backend - Headers de cache HTTP
- [ ] Ajouter les headers `Cache-Control` sur les routes publiques statiques :
  - Données de référence (ethnies, factions, clans) : `max-age=3600` (1h)
  - Catégories forum : `max-age=300` (5min)
  - Pages de contenu statique : `max-age=86400` (24h)
- [ ] Ajouter `ETag` sur les réponses paginées pour le cache conditionnel

### 10.2.4 SEO

> **État actuel** : aucune gestion de meta tags. Le `index.html` a un titre statique.

- [ ] Installer `react-helmet-async`
- [ ] Créer `components/common/SEO.jsx` : composant réutilisable (title, description, image, url, type)
- [ ] Envelopper `App` avec `<HelmetProvider>`
- [ ] Ajouter `<SEO>` sur chaque page avec titre et description appropriés :
  - Home : "Erosion des Ames - Jeu de rôle en ligne"
  - Univers : "L'Univers - Erosion des Ames"
  - Forum catégorie : "Forum - {nom catégorie}"
  - Forum sujet : "{titre sujet} - Forum"
  - Profil : "Profil de {username}"
- [ ] Générer un `sitemap.xml` statique pour les pages publiques
- [ ] Ajouter `robots.txt` dans `frontend/public/`

---

## 10.3 Tests et qualité

### 10.3.1 Tests unitaires backend (Jest)

> **État actuel** : Jest configuré, 9 fichiers de tests existants couvrant auth, middlewares, validators, utils, services.

#### Tests à ajouter

- [ ] `tests/unit/controllers/authController.test.js` - Fonctions critiques (register, login, selectCharacter, updateProfile)
- [ ] `tests/unit/controllers/userController.test.js` - Profil public, pagination posts/topics
- [ ] `tests/unit/controllers/characterController.test.js` - CRUD, workflow d'approbation
- [ ] `tests/unit/controllers/forumTopicController.test.js` - CRUD, permissions, pin/lock
- [ ] `tests/unit/controllers/forumPostController.test.js` - CRUD, permissions
- [ ] `tests/unit/models/User.test.js` - Hooks bcrypt, scopes, validations
- [ ] `tests/unit/models/Character.test.js` - Workflow statut, hook afterUpdate (auto-désélection)
- [ ] `tests/unit/models/UserSanction.test.js` - Scopes active/expired, méthode revoke
- [ ] `tests/unit/middlewares/errorHandler.test.js` - ApiError, format de réponse

### 10.3.2 Tests d'intégration API (Jest + Supertest)

> **État actuel** : 1 fichier d'intégration existant (`auth.test.js`).

- [ ] `tests/integration/users.test.js` - Routes profil public
- [ ] `tests/integration/characters.test.js` - CRUD personnages, workflow approbation
- [ ] `tests/integration/forum/categories.test.js` - CRUD catégories, permissions
- [ ] `tests/integration/forum/topics.test.js` - CRUD sujets, pin/lock, recherche
- [ ] `tests/integration/forum/posts.test.js` - CRUD posts, signalements
- [ ] `tests/integration/admin/users.test.js` - Gestion utilisateurs, ban/mute/rôle
- [ ] `tests/integration/admin/characters.test.js` - File d'approbation admin
- [ ] `tests/integration/admin/moderation.test.js` - Actions de modération, sanctions

#### Configuration intégration
- [ ] Créer `tests/helpers/setup.js` : initialisation base de test, seeders, cleanup
- [ ] Créer `tests/helpers/auth.js` : helpers pour générer des tokens JWT de test
- [ ] Créer `.env.test` : variables d'environnement pour la base de test

### 10.3.3 Tests composants React (Vitest)

> **État actuel** : aucun framework de test frontend configuré. 2 fichiers de tests orphelins.

#### Installation et configuration
- [ ] Installer `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`
- [ ] Configurer Vitest dans `vite.config.js` (environment: jsdom, setup files, globals)
- [ ] Créer `frontend/tests/setup.js` : imports `@testing-library/jest-dom`
- [ ] Ajouter le script `test` dans `frontend/package.json`

#### Tests à écrire
- [ ] `components/ui/Button.test.jsx` - Variantes, états disabled, onClick
- [ ] `components/ui/Modal.test.jsx` - Ouverture, fermeture, overlay, accessibilité
- [ ] `components/ui/Card.test.jsx` - Rendu, variantes
- [ ] `components/forum/PostCard.test.jsx` - Rendu post, actions conditionnelles
- [ ] `components/forum/TopicForm.test.jsx` - Validation formulaire, soumission
- [ ] `components/characters/CharacterCard.test.jsx` - Rendu, sélection, statut
- [ ] `components/admin/UserTable.test.jsx` - Rendu tableau, tri, actions
- [ ] `hooks/useAuth.test.js` - Login, logout, état utilisateur
- [ ] `hooks/useForum.test.js` - Queries, mutations, cache
- [ ] `pages/Forum/ForumTopic.test.jsx` - Rendu page, pagination, actions

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
   - [ ] Controller + validators + routes profil public
   - [ ] Montage routes dans index.js

2. **Profil utilisateur - Frontend**
   - [ ] Service + hooks
   - [ ] Page profil public (onglets, pagination)
   - [ ] Page paramètres du compte
   - [ ] Liens de navigation (Header, forum)

3. **Optimisations - Lazy loading**
   - [ ] SuspenseFallback + React.lazy() dans App.jsx
   - [ ] Vérification code splitting

4. **Optimisations - Images**
   - [ ] Backend : multer + sharp + route upload
   - [ ] Frontend : intégration AvatarUpload

5. **Optimisations - Cache et SEO**
   - [ ] Cache frontend (useApi)
   - [ ] Headers Cache-Control backend
   - [ ] react-helmet-async + composant SEO
   - [ ] sitemap.xml + robots.txt

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
- [ ] Le profil public affiche les infos, personnages et activité d'un utilisateur
- [ ] Les paramètres permettent de modifier username, avatar, bio et mot de passe
- [ ] Les username dans le forum sont cliquables et mènent au profil
- [ ] Le profil d'un utilisateur désactivé affiche un message approprié

### Optimisations
- [ ] Le build produit des chunks séparés par route (vérifiable dans dist/assets)
- [ ] Le temps de chargement initial est < 3s sur une connexion 3G simulée
- [ ] Les avatars uploadés sont redimensionnés et convertis en WebP
- [ ] Les meta tags sont corrects sur chaque page (vérifiable avec l'inspecteur)

### Tests
- [ ] Couverture backend > 70% sur les controllers et modèles
- [ ] Couverture frontend > 50% sur les composants critiques
- [ ] Tous les tests passent dans la CI

### Déploiement
- [ ] Le pipeline CI bloque les PR si les tests échouent
- [ ] Le déploiement automatique fonctionne sur push vers main
- [ ] Les backups quotidiens sont fonctionnels
- [ ] La documentation de déploiement permet une mise en production par un développeur tiers
