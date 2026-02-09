# Phase 7: Système de forum

**Branche**: `feature/phase-7-forum`

---

## Vue d'ensemble

Cette phase consiste à créer le système complet de forum, incluant :
- Tables principales (catégories, sujets, posts)
- Tables complémentaires (lecture, abonnements, signalements)
- API REST pour les opérations CRUD + modération
- Interface frontend pour naviguer, créer et interagir avec le forum

> **Note** : Cette phase consolide les anciennes phases 7-11 du ROADMAP.md en un seul bloc cohérent.

### Stack technique
- **Backend**: Express + Sequelize ORM + MySQL
- **Frontend**: React + TailwindCSS + React Router
- **Validation**: express-validator (backend)
- **Éditeur riche**: TipTap (déjà installé en Phase 4)

---

## 7.1 Tables principales

### Schema de la table `forum_categories`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| parent_id | INTEGER | FK (forum_categories), NULL, ON DELETE SET NULL | Catégorie parente (NULL = racine) |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Nom de la catégorie |
| slug | VARCHAR(100) | NOT NULL, UNIQUE | Slug URL-friendly |
| description | TEXT | NULL | Description de la catégorie |
| icon | VARCHAR(255) | NULL | Icône ou image |
| display_order | INTEGER | NOT NULL, DEFAULT 0 | Ordre d'affichage |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Catégorie active/masquée |
| is_rp | BOOLEAN | NOT NULL, DEFAULT false | Catégorie RP (sélection de personnage requise) |
| topic_count | INTEGER | NOT NULL, DEFAULT 0 | Nombre de sujets (dénormalisé) |
| post_count | INTEGER | NOT NULL, DEFAULT 0 | Nombre de posts (dénormalisé) |
| last_post_id | INTEGER | FK (forum_posts), NULL, ON DELETE SET NULL | Dernier post de la catégorie |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de modification |
| deleted_at | DATETIME | NULL | Soft delete (paranoid) |

### Schema de la table `forum_topics`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| category_id | INTEGER | FK (forum_categories), NOT NULL, ON DELETE CASCADE | Catégorie du sujet |
| user_id | UUID | FK (users), NOT NULL, ON DELETE CASCADE | Auteur du sujet |
| character_id | INTEGER | FK (characters), NULL, ON DELETE SET NULL | Personnage (catégorie RP) |
| title | VARCHAR(200) | NOT NULL | Titre du sujet |
| slug | VARCHAR(200) | NOT NULL | Slug URL-friendly |
| is_pinned | BOOLEAN | NOT NULL, DEFAULT false | Sujet épinglé |
| is_locked | BOOLEAN | NOT NULL, DEFAULT false | Sujet verrouillé |
| view_count | INTEGER | NOT NULL, DEFAULT 0 | Nombre de vues |
| post_count | INTEGER | NOT NULL, DEFAULT 0 | Nombre de posts (dénormalisé) |
| last_post_id | INTEGER | FK (forum_posts), NULL, ON DELETE SET NULL | Dernier post du sujet |
| last_post_at | DATETIME | NULL | Date du dernier post |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de modification |
| deleted_at | DATETIME | NULL | Soft delete (paranoid) |

### Schema de la table `forum_posts`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| topic_id | INTEGER | FK (forum_topics), NOT NULL, ON DELETE CASCADE | Sujet parent |
| user_id | UUID | FK (users), NOT NULL, ON DELETE CASCADE | Auteur du post |
| character_id | INTEGER | FK (characters), NULL, ON DELETE SET NULL | Personnage (catégorie RP) |
| content | TEXT | NOT NULL | Contenu HTML (TipTap) |
| is_first_post | BOOLEAN | NOT NULL, DEFAULT false | Premier post du sujet |
| quoted_post_id | INTEGER | FK (forum_posts), NULL, ON DELETE SET NULL | Post cité |
| edited_at | DATETIME | NULL | Date de dernière édition |
| edited_by | UUID | FK (users), NULL, ON DELETE SET NULL | Éditeur (si différent de l'auteur) |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de modification |
| deleted_at | DATETIME | NULL | Soft delete (paranoid) |

---

## 7.2 Tables complémentaires

### Schema de la table `topic_reads`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| topic_id | INTEGER | FK (forum_topics), NOT NULL, ON DELETE CASCADE | Sujet lu |
| user_id | UUID | FK (users), NOT NULL, ON DELETE CASCADE | Utilisateur |
| last_read_at | DATETIME | NOT NULL | Date de dernière lecture |

- **Index UNIQUE** sur `(topic_id, user_id)`

### Schema de la table `topic_subscriptions`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| topic_id | INTEGER | FK (forum_topics), NOT NULL, ON DELETE CASCADE | Sujet suivi |
| user_id | UUID | FK (users), NOT NULL, ON DELETE CASCADE | Abonné |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date d'abonnement |

- **Index UNIQUE** sur `(topic_id, user_id)`

### Schema de la table `post_reports`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| post_id | INTEGER | FK (forum_posts), NOT NULL, ON DELETE CASCADE | Post signalé |
| user_id | UUID | FK (users), NOT NULL, ON DELETE CASCADE | Auteur du signalement |
| reason | ENUM | NOT NULL | spam, offensive, off_topic, other |
| description | TEXT | NULL | Détails du signalement |
| status | ENUM | NOT NULL, DEFAULT 'pending' | pending, reviewed, dismissed |
| reviewed_by | UUID | FK (users), NULL, ON DELETE SET NULL | Staff qui a traité |
| reviewed_at | DATETIME | NULL | Date de traitement |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de modification |

---

## 7.3 Fichiers Backend

### Migrations
- [x] `migrations/20260207200000-create-forum-categories.js`
- [x] `migrations/20260207200001-create-forum-topics.js`
- [x] `migrations/20260207200002-create-forum-posts.js`
- [x] `migrations/20260207200003-create-topic-reads.js`
- [x] `migrations/20260207200004-create-topic-subscriptions.js`
- [x] `migrations/20260207200005-create-post-reports.js`

### Modèles
- [x] `models/ForumCategory.js`
  - Scopes : `active`, `root` (parent_id NULL), `rp`
  - `associate()` : `belongsTo(ForumCategory, { as: 'parent' })`, `hasMany(ForumCategory, { as: 'children' })`, `hasMany(ForumTopic)`, `belongsTo(ForumPost, { as: 'lastPost' })`
  - Instance methods : `generateSlug()`, `incrementCounts()`, `decrementCounts()`
- [x] `models/ForumTopic.js`
  - Scopes : `pinned`, `locked`, `withLastPost`, `withAuthor`
  - `associate()` : `belongsTo(ForumCategory)`, `belongsTo(User, { as: 'author' })`, `belongsTo(Character)`, `hasMany(ForumPost)`, `belongsTo(ForumPost, { as: 'lastPost' })`, `hasMany(TopicRead)`, `hasMany(TopicSubscription)`
  - Instance methods : `generateSlug()`, `pin()`, `unpin()`, `lock()`, `unlock()`, `incrementViews()`
- [x] `models/ForumPost.js`
  - Scopes : `withAuthor`, `withCharacter`, `withQuotedPost`
  - `associate()` : `belongsTo(ForumTopic)`, `belongsTo(User, { as: 'author' })`, `belongsTo(Character)`, `belongsTo(ForumPost, { as: 'quotedPost' })`, `belongsTo(User, { as: 'editor' })`, `hasMany(PostReport)`
- [x] `models/TopicRead.js`
  - `associate()` : `belongsTo(ForumTopic)`, `belongsTo(User)`
- [x] `models/TopicSubscription.js`
  - `associate()` : `belongsTo(ForumTopic)`, `belongsTo(User)`
- [x] `models/PostReport.js`
  - Scopes : `pending`, `reviewed`
  - `associate()` : `belongsTo(ForumPost)`, `belongsTo(User, { as: 'reporter' })`, `belongsTo(User, { as: 'reviewer' })`

### Validators
- [x] `validators/forumCategoryValidators.js` - create/update/reorder
- [x] `validators/forumTopicValidators.js` - create/update
- [x] `validators/forumPostValidators.js` - create/update/report/reviewReport

### Controllers
- [x] `controllers/forumCategoryController.js`
  - `getAll` : arbre de catégories (parent → children), filtrage is_active pour public
  - `getById` : avec sujets paginés, compteurs
  - `create` : vérification parent existe si fourni, génération slug
  - `update` : mise à jour partielle, re-génération slug si name change
  - `reorder` : mise à jour display_order en batch
  - `remove` : soft delete (vérification pas de sujets actifs)
- [x] `controllers/forumTopicController.js`
  - `getByCategory` : liste paginée, tri (récent, populaire, dernière réponse), épinglés en premier
  - `getRecent` : sujets récents tous catégories confondues
  - `getById` : avec posts paginés, incrémente view_count, marque lu si authentifié
  - `create` : vérification catégorie active + non verrouillée, création du first post, mise à jour compteurs catégorie
  - `update` : auteur ou staff, re-génération slug si titre change
  - `pin` / `unpin` : staff uniquement
  - `lock` / `unlock` : staff uniquement
  - `remove` : auteur ou staff, mise à jour compteurs catégorie
  - `markAsRead` : upsert TopicRead
  - `toggleSubscription` : toggle TopicSubscription
- [x] `controllers/forumPostController.js`
  - `getByTopic` : liste paginée avec auteur, personnage, post cité
  - `create` : vérification sujet non verrouillé, mise à jour compteurs (topic + catégorie), mise à jour last_post_id/last_post_at
  - `update` : auteur ou staff, set edited_at/edited_by
  - `remove` : auteur ou staff, mise à jour compteurs
  - `report` : vérification pas déjà signalé par le même user
- [x] `controllers/forumReportController.js`
  - `getPending` : liste des signalements en attente, avec post + reporter
  - `review` : marquer reviewed/dismissed, set reviewed_by/reviewed_at

### Routes
- [x] `routes/forum/categories.js`
- [x] `routes/forum/topics.js`
- [x] `routes/forum/posts.js`
- [x] `routes/forum/reports.js`
- [x] `routes/forum/index.js` - Combine les sous-routes

### Routes API

#### Catégories (`/api/forum/categories`)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/` | optionalAuth | Public | Liste des catégories (arbre) |
| GET | `/:id` | optionalAuth | Public | Détail avec sujets paginés |
| POST | `/` | Requis | ADMIN | Créer une catégorie |
| PUT | `/:id` | Requis | ADMIN | Modifier une catégorie |
| PATCH | `/reorder` | Requis | ADMIN | Réordonner les catégories |
| DELETE | `/:id` | Requis | ADMIN | Supprimer une catégorie |

#### Sujets (`/api/forum/topics`)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/recent` | optionalAuth | Public | Sujets récents (toutes catégories) |
| GET | `/category/:categoryId` | optionalAuth | Public | Sujets d'une catégorie (paginés) |
| GET | `/:id` | optionalAuth | Public | Détail du sujet avec posts |
| POST | `/` | Requis | Tous | Créer un sujet |
| PUT | `/:id` | Requis | Auteur/Staff | Modifier un sujet |
| PATCH | `/:id/pin` | Requis | ADMIN, MODERATOR | Épingler/désépingler |
| PATCH | `/:id/lock` | Requis | ADMIN, MODERATOR | Verrouiller/déverrouiller |
| POST | `/:id/read` | Requis | Tous | Marquer comme lu |
| POST | `/:id/subscribe` | Requis | Tous | S'abonner/se désabonner |
| DELETE | `/:id` | Requis | Auteur/ADMIN | Supprimer un sujet |

#### Posts (`/api/forum/posts`)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/topic/:topicId` | optionalAuth | Public | Posts d'un sujet (paginés) |
| POST | `/topic/:topicId` | Requis | Tous | Répondre à un sujet |
| PUT | `/:id` | Requis | Auteur/Staff | Modifier un post |
| DELETE | `/:id` | Requis | Auteur/ADMIN | Supprimer un post |
| POST | `/:id/report` | Requis | Tous | Signaler un post |

#### Signalements (`/api/forum/reports`) - Staff uniquement

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/` | Requis | ADMIN, MODERATOR | Liste des signalements en attente |
| PATCH | `/:id/review` | Requis | ADMIN, MODERATOR | Traiter un signalement |

### Seeders
- [x] `seeders/seed-test-x5-forum-categories.js` - 3 catégories de base + 3 sous-catégories
- [x] `seeders/seed-test-x6-forum-topics.js` - 7 sujets (épinglés, verrouillé, RP avec personnages)
- [x] `seeders/seed-test-x7-forum-posts.js` - 14 posts + mise à jour compteurs
- [x] `seeders/production/seed-prod-05-forum-categories.js` - 3 catégories de base (Général, HRP, RP)

### Montage routes
- [x] `routes/index.js` - Mount `/forum` -> `routes/forum/index.js`

---

## 7.4 Frontend - Services et Hooks

### Services
- [x] `services/forumService.js`
  - `getCategories()` - Liste des catégories (arbre)
  - `getCategory(id)` - Détail catégorie avec sujets
  - `createCategory(data)` - Créer catégorie (admin)
  - `updateCategory(id, data)` - Modifier catégorie (admin)
  - `reorderCategories(orderedIds)` - Réordonner (admin)
  - `deleteCategory(id)` - Supprimer catégorie (admin)
  - `getRecentTopics(params)` - Sujets récents
  - `getTopicsByCategory(categoryId, params)` - Sujets par catégorie
  - `getTopic(id)` - Détail sujet avec posts
  - `createTopic(data)` - Créer un sujet
  - `updateTopic(id, data)` - Modifier un sujet
  - `deleteTopic(id)` - Supprimer un sujet
  - `pinTopic(id)` - Épingler/désépingler
  - `lockTopic(id)` - Verrouiller/déverrouiller
  - `markTopicAsRead(id)` - Marquer lu
  - `toggleTopicSubscription(id)` - S'abonner/se désabonner
  - `getPostsByTopic(topicId, params)` - Posts d'un sujet
  - `createPost(topicId, data)` - Répondre
  - `updatePost(id, data)` - Modifier un post
  - `deletePost(id)` - Supprimer un post
  - `reportPost(id, data)` - Signaler un post
  - `getPendingReports()` - Signalements en attente (staff)
  - `reviewReport(id, data)` - Traiter un signalement (staff)

### Hooks (`hooks/useForum.js`)
- [x] `useForumCategories()` - Liste des catégories
- [x] `useForumCategory(id)` - Détail catégorie + sujets
- [x] `useRecentTopics(params)` - Sujets récents
- [x] `useTopicsByCategory(categoryId, params)` - Sujets d'une catégorie
- [x] `useTopic(id)` - Détail sujet + posts
- [x] `useCreateTopic()` - Mutation création sujet
- [x] `useUpdateTopic()` - Mutation modification sujet
- [x] `useDeleteTopic()` - Mutation suppression sujet
- [x] `useCreatePost()` - Mutation création post
- [x] `useUpdatePost()` - Mutation modification post
- [x] `useDeletePost()` - Mutation suppression post
- [x] `useReportPost()` - Mutation signalement
- [x] `useToggleSubscription()` - Mutation abonnement
- [x] `usePendingReports()` - Liste signalements (staff)
- [x] `useReviewReport()` - Mutation traitement signalement (staff)

---

## 7.5 Frontend - Composants

### Composants forum (`components/forum/`)

- [x] `ForumCategoryCard.jsx` - Card de catégorie avec icône, description, compteurs (sujets, posts), dernier post
- [x] `TopicRow.jsx` - Ligne de sujet dans la liste : titre, auteur, réponses, vues, dernier post, badges (épinglé/verrouillé/non-lu)
- [x] `PostCard.jsx` - Affichage d'un post : carte auteur (avatar, pseudo, rôle, nb posts), contenu HTML, date, actions
- [x] `AuthorSidebar.jsx` - Sidebar auteur dans un post : avatar, username, rôle badge, personnage si RP, date d'inscription, nombre de posts
- [x] `QuoteBlock.jsx` - Citation d'un message avec attribution
- [x] `PostActions.jsx` - Boutons d'action : répondre, citer, éditer, supprimer, signaler (contextuel selon rôle/auteur)
- [x] `TopicStatusBadge.jsx` - Badges : épinglé, verrouillé, non-lu
- [x] `ForumBreadcrumb.jsx` - Fil d'Ariane : Forum > Catégorie > Sujet
- [x] `ForumPagination.jsx` - Pagination spécifique au forum (réutilisation du composant Pagination existant)
- [x] `ForumStats.jsx` - Statistiques globales : nombre de sujets, posts, membres, dernier inscrit

### Composants de formulaire (`components/forum/`)

- [x] `TopicForm.jsx` - Formulaire de création/édition de sujet
  - Sélection de catégorie
  - Titre du sujet
  - Contenu riche (RichTextEditor)
  - Sélection de personnage (si catégorie RP)
  - Options modération (épinglé, verrouillé) si staff
- [x] `PostForm.jsx` - Formulaire de réponse/édition de post
  - Contenu riche (RichTextEditor)
  - Sélection de personnage (si catégorie RP)
  - Affichage citation si citation en cours
- [x] `ReportModal.jsx` - Modal de signalement
  - Sélection raison (spam, offensant, hors-sujet, autre)
  - Description optionnelle

---

## 7.6 Frontend - Pages

### Pages forum (`pages/Forum/`)

- [x] `ForumIndex.jsx` - Page d'accueil du forum
  - Liste des catégories avec sous-catégories
  - Statistiques globales
  - Derniers sujets actifs
  - Route : `/forum`

- [x] `ForumCategory.jsx` - Page d'une catégorie
  - En-tête catégorie (nom, description)
  - Sous-catégories si existantes
  - Liste des sujets paginée (épinglés en premier)
  - Tri : récent, populaire, dernière réponse
  - Bouton "Nouveau sujet"
  - Route : `/forum/:categorySlug`

- [x] `ForumTopic.jsx` - Page d'un sujet
  - En-tête sujet (titre, catégorie, auteur, date, vues)
  - Badges (épinglé, verrouillé)
  - Liste des posts paginée
  - Formulaire de réponse en bas (si non verrouillé)
  - Actions modération (pin, lock, delete) si staff
  - Bouton s'abonner/se désabonner
  - Route : `/forum/:categorySlug/:topicId`

- [x] `ForumCreateTopic.jsx` - Page de création de sujet
  - TopicForm complet
  - Preview avant publication (optionnel)
  - Route : `/forum/:categorySlug/nouveau-sujet`

- [x] `ForumEditTopic.jsx` - Page d'édition de sujet
  - TopicForm pré-rempli
  - Route : `/forum/:categorySlug/:topicId/modifier`

- [x] `ForumEditPost.jsx` - Page d'édition de post
  - PostForm pré-rempli
  - Route : `/forum/:categorySlug/:topicId/modifier-post/:postId`

### Intégration Router (`App.jsx`)
- [x] Route `/forum` -> `ForumIndex`
- [x] Route `/forum/:categorySlug` -> `ForumCategory`
- [x] Route `/forum/:categorySlug/nouveau-sujet` -> `ForumCreateTopic` (ProtectedRoute)
- [x] Route `/forum/:categorySlug/:topicId` -> `ForumTopic`
- [x] Route `/forum/:categorySlug/:topicId/modifier` -> `ForumEditTopic` (ProtectedRoute)
- [x] Route `/forum/:categorySlug/:topicId/modifier-post/:postId` -> `ForumEditPost` (ProtectedRoute)

---

## 7.7 Fonctionnalités avancées

### Système lu/non-lu
- [x] Marquer automatiquement un sujet comme lu quand on le visite
- [x] Indicateur visuel "non-lu" dans la liste des sujets
- [x] Compteur de sujets non-lus par catégorie
- [x] Bouton "Tout marquer comme lu"

### Abonnements
- [x] S'abonner automatiquement à un sujet quand on y répond (configurable)
- [ ] Liste "Mes abonnements" dans le profil utilisateur (Phase future)

### Recherche forum
- [x] Recherche full-text dans les titres de sujets et contenus de posts
- [x] Filtres : catégorie, auteur, date, personnage
- [x] Route : `/forum/recherche`
- [x] Page : `ForumSearch.jsx`

### Panel de modération (staff)
- [x] Vue des signalements en attente
- [x] Actions rapides : supprimer post, verrouiller sujet, avertir utilisateur
- [x] Route : `/forum/moderation`
- [x] Page : `ForumModeration.jsx`

---

## Notes techniques

### Conventions
- Les FK vers `users` sont de type UUID (users.id est UUID)
- Les FK vers les autres tables sont de type INTEGER
- Soft delete via `paranoid: true` sur categories, topics, posts
- Les compteurs dénormalisés (topic_count, post_count, last_post_id) sont mis à jour dans les controllers via transactions
- Les slugs sont générés à partir des noms/titres (librairie `slugify` ou implémentation manuelle)

### Pagination
- Pagination côté serveur avec `limit` + `offset`
- Format de réponse paginée : `{ success, data: { items, total, page, totalPages, limit } }`
- Pagination par défaut : 20 sujets par page, 15 posts par page

### Performance
- Index sur toutes les FK et colonnes de filtrage
- Compteurs dénormalisés pour éviter les COUNT() en lecture
- Eager loading des associations courantes (auteur, personnage, dernier post)

### Sécurité
- Sanitization du contenu HTML des posts (côté backend, avant stockage)
- Rate limiting sur la création de posts/sujets
- Vérification des permissions par catégorie (future Phase permissions)
- Protection contre le spam (délai minimum entre posts)

---

## Ordre de réalisation suggéré

1. **Backend - Base de données**
   - [x] Migrations (6 tables)
   - [x] Modèles avec associations
   - [x] Seeders dev + prod

2. **Backend - API**
   - [x] Validators
   - [x] Controllers catégories + sujets + posts
   - [x] Controller signalements
   - [x] Routes + montage dans index.js

3. **Frontend - Services**
   - [x] forumService.js
   - [x] useForum.js hooks

4. **Frontend - Composants**
   - [x] Composants de base (ForumCategoryCard, TopicRow, PostCard, etc.)
   - [x] Composants de formulaire (TopicForm, PostForm, ReportModal)

5. **Frontend - Pages**
   - [x] ForumIndex + ForumCategory
   - [x] ForumTopic + formulaire de réponse
   - [x] ForumCreateTopic + ForumEditTopic + ForumEditPost
   - [x] Intégration Router

6. **Fonctionnalités avancées**
   - [x] Système lu/non-lu
   - [x] Abonnements
   - [x] Recherche forum
   - [x] Panel modération

---

## Critères de validation

- [x] Les catégories s'affichent en arbre (parent/enfants)
- [x] Les sujets épinglés apparaissent en premier
- [x] La création de sujet crée automatiquement le first post
- [x] Les compteurs (sujets, posts, vues) se mettent à jour correctement
- [x] Le contenu riche (TipTap) s'affiche correctement dans les posts
- [x] Les catégories RP demandent la sélection d'un personnage approuvé
- [x] Les sujets verrouillés empêchent les nouvelles réponses
- [x] Les signalements sont visibles uniquement par le staff
- [x] La pagination fonctionne sur les sujets et les posts
- [x] Le système lu/non-lu fonctionne pour les utilisateurs connectés
