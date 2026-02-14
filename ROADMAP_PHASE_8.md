# Phase 8: Administration et modération

**Branche**: `feature/phase-8-administration`

---

## Vue d'ensemble

Cette phase consiste à créer le système complet d'administration et de modération, incluant :
- Tables d'audit (actions de modération, sanctions utilisateurs)
- Dashboard d'administration avec statistiques générales
- Gestion centralisée des utilisateurs (liste, ban, mute, rôles)
- Gestion des personnages et du forum depuis le panel admin
- Historique complet des actions de modération

> **Note** : Cette phase consolide les sections 8.1 et 8.2 du ROADMAP.md en un seul bloc cohérent. Les fonctionnalités existantes de modération (signalements, pin/lock de sujets) sont intégrées dans le panel centralisé.

### Stack technique
- **Backend**: Express + Sequelize ORM + MySQL
- **Frontend**: React + TailwindCSS + React Router
- **Validation**: express-validator (backend)

---

## 8.1 Nouvelles tables

### Schema de la table `moderation_actions`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| action_type | ENUM | NOT NULL | Type d'action (voir liste ci-dessous) |
| moderator_id | UUID | FK (users), NOT NULL, ON DELETE CASCADE | Modérateur qui a effectué l'action |
| target_user_id | UUID | FK (users), NULL, ON DELETE SET NULL | Utilisateur concerné |
| target_id | INTEGER | NULL | ID de l'entité concernée (post, sujet, personnage, etc.) |
| target_type | VARCHAR(50) | NULL | Type de l'entité (post, topic, character, category) |
| reason | TEXT | NULL | Raison de l'action |
| details | JSON | NULL | Métadonnées supplémentaires (ancien rôle, nouveau rôle, durée ban, etc.) |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de modification |

**Valeurs ENUM `action_type`** : `ban_user`, `unban_user`, `mute_user`, `unmute_user`, `warn_user`, `change_role`, `delete_user`, `activate_user`, `deactivate_user`, `approve_character`, `reject_character`, `delete_character`, `delete_post`, `delete_topic`, `lock_topic`, `unlock_topic`, `pin_topic`, `unpin_topic`, `move_topic`, `merge_topics`, `review_report`, `edit_category`, `delete_category`

> **Important** : Pas de `deleted_at` / pas de `paranoid`. Les logs d'audit ne doivent jamais être supprimés (soft ou hard delete).

### Schema de la table `user_sanctions`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| user_id | UUID | FK (users), NOT NULL, ON DELETE CASCADE | Utilisateur sanctionné |
| type | ENUM | NOT NULL | ban, mute |
| reason | TEXT | NOT NULL | Raison de la sanction |
| issued_by | UUID | FK (users), NOT NULL, ON DELETE CASCADE | Modérateur qui a émis la sanction |
| starts_at | DATETIME | NOT NULL | Date de début de la sanction |
| expires_at | DATETIME | NULL | Date d'expiration (NULL = permanente) |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Sanction active |
| revoked_by | UUID | FK (users), NULL, ON DELETE SET NULL | Modérateur qui a révoqué la sanction |
| revoked_at | DATETIME | NULL | Date de révocation |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de modification |

> **Important** : Pas de `deleted_at` / pas de `paranoid`. Les sanctions sont désactivées via `is_active = false` + `revoked_by`/`revoked_at`, jamais supprimées.

- **Index** sur `(user_id, is_active)` pour la recherche de sanctions actives
- **Index** sur `(type, is_active)` pour le filtrage

---

## 8.2 Fichiers Backend

### Migrations
- [x] `migrations/20260210300000-create-moderation-actions.js`
- [x] `migrations/20260210300001-create-user-sanctions.js`

### Modèles
- [x] `models/ModerationAction.js`
  - `paranoid: false` (pas de soft delete)
  - Scopes : `byType(type)`, `byModerator(userId)`, `byTargetUser(userId)`, `recent` (30 derniers jours)
  - `associate()` : `belongsTo(User, { as: 'moderator', foreignKey: 'moderatorId' })`, `belongsTo(User, { as: 'targetUser', foreignKey: 'targetUserId' })`
  - Méthode statique : `log({ actionType, moderatorId, targetUserId, targetId, targetType, reason, details })` - création simplifiée d'un log

- [x] `models/UserSanction.js`
  - `paranoid: false` (pas de soft delete)
  - Scopes : `active` (is_active = true + expires_at NULL ou > now), `bans`, `mutes`, `expired`
  - `associate()` : `belongsTo(User, { as: 'user', foreignKey: 'userId' })`, `belongsTo(User, { as: 'issuer', foreignKey: 'issuedBy' })`, `belongsTo(User, { as: 'revoker', foreignKey: 'revokedBy' })`
  - Instance methods : `revoke(revokerId)` (set is_active=false, revoked_by, revoked_at), `isExpired()` (vérifie expiration)

### Validators
- [x] `validators/adminValidators.js`
  - `changeRoleValidation` - body('role').isIn(['ADMIN', 'MODERATOR', 'GAME_MASTER', 'PLAYER'])
  - `banUserValidation` - body('reason').notEmpty(), body('duration').optional().isInt({ min: 1 }) (durée en heures, omis = permanent)
  - `muteUserValidation` - body('reason').notEmpty(), body('duration').optional().isInt({ min: 1 })
  - `updateUserStatusValidation` - body('isActive').isBoolean()
  - `reorderCategoriesValidation` - body('categories').isArray()

- [x] `validators/moderationValidators.js`
  - `moveTopicValidation` - body('categoryId').isInt({ min: 1 })
  - `mergeTopicsValidation` - body('sourceTopicId').isInt({ min: 1 }), body('targetTopicId').isInt({ min: 1 })
  - `reviewReportValidation` - body('status').isIn(['reviewed', 'dismissed']), body('note').optional()

### Controllers
- [x] `controllers/adminDashboardController.js`
  - `getStats` : statistiques générales (nombre d'utilisateurs, personnages par statut, sujets, posts, signalements en attente, sanctions actives, inscriptions récentes)

- [x] `controllers/adminUserController.js`
  - `getAll` : liste paginée des utilisateurs avec filtres (role, isActive, search par username/email), tri (date inscription, dernière connexion, username)
  - `getById` : détail d'un utilisateur avec ses personnages, sanctions, statistiques forum
  - `changeRole` : changer le rôle d'un utilisateur + log ModerationAction
  - `ban` : créer une sanction ban + désactiver l'utilisateur + log ModerationAction
  - `unban` : révoquer la sanction ban active + réactiver l'utilisateur + log ModerationAction
  - `mute` : créer une sanction mute + log ModerationAction
  - `unmute` : révoquer la sanction mute active + log ModerationAction
  - `updateStatus` : activer/désactiver un utilisateur + log ModerationAction

- [x] `controllers/adminCharacterController.js`
  - `getAll` : liste paginée des personnages avec filtres (status, userId, ethnicityId, factionId), inclut owner
  - `getPending` : file d'attente des personnages en attente d'approbation
  - `approve` : approuver un personnage + log ModerationAction
  - `reject` : rejeter un personnage avec raison + log ModerationAction
  - `remove` : supprimer un personnage (soft delete) + log ModerationAction

- [x] `controllers/adminForumController.js`
  - `getCategories` : liste de toutes les catégories (actives et inactives) pour gestion
  - `createCategory` : créer une catégorie + log ModerationAction
  - `updateCategory` : modifier une catégorie + log ModerationAction
  - `deleteCategory` : supprimer une catégorie + log ModerationAction
  - `reorderCategories` : réordonner les catégories
  - `moveTopic` : déplacer un sujet vers une autre catégorie + mise à jour compteurs + log ModerationAction
  - `mergeTopics` : fusionner deux sujets (posts du source vers target, suppression source) + log ModerationAction

- [x] `controllers/moderationController.js`
  - `getActions` : historique des actions de modération paginé, avec filtres (action_type, moderator_id, target_user_id, date range)
  - `getSanctions` : liste des sanctions (actives ou toutes) avec filtres (type, is_active, user_id)
  - `getReports` : liste des signalements en attente (réutilise la logique existante de forumReportController)
  - `reviewReport` : traiter un signalement + log ModerationAction

### Routes

- [x] `routes/admin/index.js` - Combine les sous-routes admin
- [x] `routes/admin/dashboard.js`
- [x] `routes/admin/users.js`
- [x] `routes/admin/characters.js`
- [x] `routes/admin/forum.js`
- [x] `routes/admin/moderation.js`

### Routes API

#### Dashboard (`/api/admin/dashboard`)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/stats` | Requis | ADMIN | Statistiques générales du site |

#### Utilisateurs (`/api/admin/users`)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/` | Requis | ADMIN | Liste des utilisateurs (paginée, filtrable) |
| GET | `/:id` | Requis | ADMIN | Détail d'un utilisateur |
| PATCH | `/:id/role` | Requis | ADMIN | Changer le rôle d'un utilisateur |
| PATCH | `/:id/ban` | Requis | ADMIN, MODERATOR | Bannir un utilisateur |
| PATCH | `/:id/unban` | Requis | ADMIN, MODERATOR | Débannir un utilisateur |
| PATCH | `/:id/mute` | Requis | ADMIN, MODERATOR | Muter un utilisateur |
| PATCH | `/:id/unmute` | Requis | ADMIN, MODERATOR | Démuter un utilisateur |
| PATCH | `/:id/status` | Requis | ADMIN | Activer/désactiver un utilisateur |

#### Personnages (`/api/admin/characters`)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/` | Requis | ADMIN, MODERATOR | Liste des personnages (paginée, filtrable) |
| GET | `/pending` | Requis | ADMIN, MODERATOR | File d'attente des personnages en attente |
| PATCH | `/:id/approve` | Requis | ADMIN, MODERATOR | Approuver un personnage |
| PATCH | `/:id/reject` | Requis | ADMIN, MODERATOR | Rejeter un personnage |
| DELETE | `/:id` | Requis | ADMIN | Supprimer un personnage |

#### Forum (`/api/admin/forum`)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/categories` | Requis | ADMIN | Liste des catégories (toutes, y compris inactives) |
| POST | `/categories` | Requis | ADMIN | Créer une catégorie |
| PUT | `/categories/:id` | Requis | ADMIN | Modifier une catégorie |
| DELETE | `/categories/:id` | Requis | ADMIN | Supprimer une catégorie |
| PATCH | `/categories/reorder` | Requis | ADMIN | Réordonner les catégories |
| PATCH | `/topics/:id/move` | Requis | ADMIN, MODERATOR | Déplacer un sujet |
| PATCH | `/topics/:id/merge` | Requis | ADMIN, MODERATOR | Fusionner deux sujets |

#### Modération (`/api/admin/moderation`)

| Méthode | Route | Auth | Rôle | Description |
|---------|-------|------|------|-------------|
| GET | `/actions` | Requis | ADMIN, MODERATOR | Historique des actions de modération |
| GET | `/sanctions` | Requis | ADMIN, MODERATOR | Liste des sanctions |
| GET | `/reports` | Requis | ADMIN, MODERATOR | Signalements en attente |
| PATCH | `/reports/:id/review` | Requis | ADMIN, MODERATOR | Traiter un signalement |

### Seeders
- [x] `seeders/seed-test-x8-user-sanctions.js` - 3 sanctions test (1 ban actif, 1 mute actif, 1 ban révoqué)
- [x] `seeders/seed-test-x9-moderation-actions.js` - 10 actions de modération test (ban, mute, approve, reject, etc.)

### Montage routes
- [x] `routes/index.js` - Mount `/admin` -> `routes/admin/index.js`

---

## 8.3 Frontend - Services et Hooks

### Service (`services/adminService.js`)

- [x] **Dashboard**
  - `getDashboardStats()` - Statistiques générales

- [x] **Utilisateurs**
  - `getUsers(params)` - Liste des utilisateurs (paginée, filtrable)
  - `getUser(id)` - Détail d'un utilisateur
  - `changeUserRole(id, data)` - Changer le rôle
  - `banUser(id, data)` - Bannir un utilisateur
  - `unbanUser(id)` - Débannir un utilisateur
  - `muteUser(id, data)` - Muter un utilisateur
  - `unmuteUser(id)` - Démuter un utilisateur
  - `updateUserStatus(id, data)` - Activer/désactiver

- [x] **Personnages**
  - `getCharacters(params)` - Liste des personnages
  - `getPendingCharacters()` - File d'attente
  - `approveCharacter(id)` - Approuver
  - `rejectCharacter(id, data)` - Rejeter avec raison
  - `deleteCharacter(id)` - Supprimer

- [x] **Forum**
  - `getAdminCategories()` - Toutes les catégories
  - `createCategory(data)` - Créer une catégorie
  - `updateCategory(id, data)` - Modifier une catégorie
  - `deleteCategory(id)` - Supprimer une catégorie
  - `reorderCategories(categories)` - Réordonner
  - `moveTopic(id, data)` - Déplacer un sujet
  - `mergeTopics(data)` - Fusionner des sujets

- [x] **Modération**
  - `getModerationActions(params)` - Historique des actions
  - `getSanctions(params)` - Liste des sanctions
  - `getReports(params)` - Signalements en attente
  - `reviewReport(id, data)` - Traiter un signalement

### Hooks (`hooks/useAdmin.js`)

- [x] **Queries (exécution automatique au montage)**
  - `useDashboardStats()` - Statistiques du dashboard
  - `useAdminUsers(params)` - Liste des utilisateurs
  - `useAdminUser(id)` - Détail d'un utilisateur
  - `useAdminCharacters(params)` - Liste des personnages
  - `usePendingCharacters()` - Personnages en attente
  - `useAdminForumCategories()` - Catégories du forum (admin)
  - `useModerationActions(params)` - Historique des actions
  - `useUserSanctions(params)` - Liste des sanctions
  - `useAdminReports(params)` - Signalements en attente

- [x] **Mutations (exécution manuelle)**
  - `useChangeUserRole()` - Mutation changement de rôle
  - `useBanUser()` - Mutation ban
  - `useUnbanUser()` - Mutation déban
  - `useMuteUser()` - Mutation mute
  - `useUnmuteUser()` - Mutation démute
  - `useUpdateUserStatus()` - Mutation activation/désactivation
  - `useApproveCharacter()` - Mutation approbation personnage
  - `useRejectCharacter()` - Mutation rejet personnage
  - `useDeleteCharacter()` - Mutation suppression personnage
  - `useCreateCategory()` - Mutation création catégorie
  - `useUpdateCategory()` - Mutation modification catégorie
  - `useDeleteCategory()` - Mutation suppression catégorie
  - `useReorderCategories()` - Mutation réordonnancement
  - `useMoveTopic()` - Mutation déplacement sujet
  - `useMergeTopics()` - Mutation fusion sujets
  - `useAdminReviewReport()` - Mutation traitement signalement

---

## 8.4 Frontend - Layout et Composants

### Layout (`layouts/AdminLayout/AdminLayout.jsx`)
- [x] Layout dédié avec sidebar de navigation + zone de contenu
  - Sidebar fixe à gauche avec liens vers les sections admin
  - En-tête avec titre de la section courante (breadcrumb)
  - Zone de contenu principale
  - Responsive : sidebar en drawer sur mobile avec backdrop
  - Wrapper `ProtectedRoute` avec `roles={['ADMIN', 'MODERATOR']}`
  - Thème "War Room" dark avec animations ember/sigil
  - `AdminLayout.css` (849 lignes) avec tokens CSS, keyframes, noise texture, print/motion queries

### Composants admin (`components/admin/`)

- [x] `AdminSidebar` — Intégré directement dans `AdminLayout.jsx`
  - Liens : Dashboard, Utilisateurs, Personnages, Forum, Modération, Journal
  - Indicateur de section active (ember bar animé)
  - Badge compteur (standard/urgent) cappé à 99+
  - Collapse sur mobile avec animation staggered slide-in
  - Sigil décoratif (épées croisées + anneau runique)

- [x] `StatCard.jsx` - Carte de statistique pour le dashboard
  - Icône, label, valeur (formatage FR), tendance (optionnel)
  - 4 variantes de couleur : users (bleu), characters (vert), forum (ember), moderation (rouge)
  - Accent border-l-4, hover translate, motion-reduce support

- [x] `UserTable.jsx` - Tableau des utilisateurs avec colonnes triables
  - Colonnes : avatar+username, email, rôle (badge coloré), inscription, dernière connexion, statut, actions
  - Actions rapides : changer rôle, ban, mute (icon buttons)
  - Tri par colonnes avec indicateur chevron
  - Pagination intégrée (composant Pagination existant)
  - Responsive : cards empilées sur mobile, table sur desktop
  - Loading skeleton + empty state

- [x] `UserSanctionBadge.jsx` - Badge indiquant une sanction active
  - Variantes : ban (rouge avec glow), mute (orange avec glow)
  - Durée restante calculée (Xj Xh, Xh Xm, Xm) ou "∞" permanent
  - Helper `formatRemainingTime()` exporté
  - Retourne null si sanction expirée

- [x] `CharacterApprovalCard.jsx` - Carte de personnage en attente d'approbation
  - Affiche : nom, avatar (fallback silhouette), propriétaire, ethnie, faction (dot couleur), date relative
  - Boutons : approuver (vert), rejeter (rouge), voir détail (neutre)
  - Formulaire de rejet conditionnel avec textarea et validation
  - Preview background (line-clamp-3, border-l accent)

- [x] `ModerationActionRow.jsx` - Ligne d'historique d'action de modération
  - 23 types d'action mappés (label FR + catégorie + icône SVG)
  - 5 catégories avec border-l coloré : sanction, user, character, forum, report
  - Affiche : date/heure, type, modérateur, cible, raison, temps relatif
  - Détails expandables avec JSON coloré syntaxiquement (clés cyan, strings violet, nombres vert, booleans ember)
  - Responsive : raison masquée sur mobile, affichée inline sur lg+

- [x] `BanModal.jsx` - Modal de bannissement
  - Champ raison (obligatoire, min 10 car.)
  - Sélection durée grid 4 cols (1h, 6h, 12h, 24h, 3j, 7j, 30j, ∞ permanent)
  - Thème danger rouge (border, glow, warning banner)
  - Reset state on close

- [x] `MuteModal.jsx` - Modal de mute
  - Même structure que BanModal, thème ambre/orange
  - Warning : "ne pourra plus publier de messages ni créer de sujets"
  - Confirm button variant="primary" au lieu de "danger"

- [x] `RoleChangeModal.jsx` - Modal de changement de rôle
  - Radio-style cards avec description FR pour chaque rôle
  - Badge rôle actuel coloré (ADMIN orange, MODERATOR bleu, GAME_MASTER violet, PLAYER gris)
  - Info banner bleu : "prend effet immédiatement"
  - Disabled si même rôle sélectionné

- [x] `MoveTopicModal.jsx` - Modal de déplacement de sujet
  - Info topic (titre line-clamp-2 + auteur)
  - Catégorie actuelle (badge avec icône dossier)
  - Select destination (filtre la catégorie courante)
  - Modal size="sm"

- [x] `index.js` - Barrel export centralisé de tous les composants admin

---

## 8.5 Frontend - Pages

### Pages admin (`pages/Admin/`)

- [x] `AdminDashboard.jsx` - Tableau de bord administrateur
  - Grille de StatCards (utilisateurs, personnages, sujets, posts, signalements)
  - Barres de distribution rôles/personnages (CSS-only), vue d'ensemble forum
  - Listes rapides : derniers inscrits, dernières actions de modération, personnages en attente
  - Loading skeleton, error state avec retry
  - Route : `/admin`

- [x] `AdminUsers.jsx` - Gestion des utilisateurs
  - UserTable avec filtres (recherche debounced, rôle, statut) et tri par colonnes
  - Actions rapides en ligne (ban, mute, changement de rôle)
  - Modaux BanModal, MuteModal, RoleChangeModal câblés avec mutations
  - Navigation vers AdminUserDetail au clic
  - Route : `/admin/utilisateurs`

- [x] `AdminUserDetail.jsx` - Détail d'un utilisateur
  - Informations du profil (avatar, username, email, rôle badge, statut, dates inscription/connexion)
  - 6 boutons d'action (changer rôle, ban/unban, mute/unmute, activer/désactiver)
  - Section sanctions actives avec UserSanctionBadge
  - Grille des personnages, statistiques forum (sujets, posts)
  - Modaux câblés avec `user` object prop, mutations onSuccess at creation
  - Route : `/admin/utilisateurs/:id`

- [x] `AdminCharacters.jsx` - Gestion des personnages
  - Onglets : Tous, En attente, Approuvés, Rejetés (avec badge compteur pending)
  - Grille de CharacterApprovalCard pour onglet En attente (approve/reject)
  - Tableau desktop + cards mobile pour les autres onglets
  - Requêtes séparées (usePendingCharacters vs useAdminCharacters) avec `enabled` par onglet
  - Pagination partagée, actions approuver/rejeter/supprimer
  - Route : `/admin/personnages`

- [x] `AdminForum.jsx` - Gestion du forum
  - Section catégories : liste ordonnée avec boutons flèche (haut/bas) pour réordonner
  - Formulaire inline de création/édition de catégorie (nom, description, parent, icône, isActive, isRp)
  - Suppression avec confirmation inline, banner d'erreur contextuel
  - Section outils sujets : déplacer (ID + MoveTopicModal), fusionner (source + cible IDs)
  - Messages succès/erreur inline pour les opérations sur les sujets
  - Route : `/admin/forum`

- [x] `AdminModeration.jsx` - Outils de modération
  - Onglets : Signalements en attente (avec badge compteur), Sanctions actives
  - ReportCard : reporter, raison colorée (spam/offensant/hors-sujet/autre), preview post avec lien topic, actions valider/rejeter
  - SanctionRow : utilisateur, UserSanctionBadge, raison, émetteur, dates, révocation avec confirmation
  - Requêtes conditionnelles par onglet (`enabled`), pagination par onglet
  - Route : `/admin/moderation`

- [x] `AdminLogs.jsx` - Journal des actions de modération
  - Liste chronologique utilisant ModerationActionRow (détails expandables JSON coloré)
  - Filtre type d'action (dropdown 22 types), filtres avancés collapsibles (ID modérateur, ID cible, dates début/fin)
  - Pagination (30/page), compteur total, bouton réinitialiser
  - Navigation vers AdminUserDetail au clic sur username
  - Route : `/admin/journal`

### Intégration Router (`App.jsx`)
- [x] Route `/admin` -> `AdminLayout` (wrapper ProtectedRoute rôles ADMIN, MODERATOR)
  - Route index -> `AdminDashboard`
  - Route `/admin/utilisateurs` -> `AdminUsers` (ADMIN uniquement via ProtectedRoute imbriqué)
  - Route `/admin/utilisateurs/:id` -> `AdminUserDetail` (ADMIN uniquement via ProtectedRoute imbriqué)
  - Route `/admin/personnages` -> `AdminCharacters`
  - Route `/admin/forum` -> `AdminForum` (ADMIN uniquement via ProtectedRoute imbriqué)
  - Route `/admin/moderation` -> `AdminModeration`
  - Route `/admin/journal` -> `AdminLogs`

### Routes Frontend

| Route | Composant | Auth |
|-------|-----------|------|
| `/admin` | AdminDashboard | ProtectedRoute roles={['ADMIN', 'MODERATOR']} |
| `/admin/utilisateurs` | AdminUsers | ProtectedRoute roles={['ADMIN']} |
| `/admin/utilisateurs/:id` | AdminUserDetail | ProtectedRoute roles={['ADMIN']} |
| `/admin/personnages` | AdminCharacters | ProtectedRoute roles={['ADMIN', 'MODERATOR']} |
| `/admin/forum` | AdminForum | ProtectedRoute roles={['ADMIN']} |
| `/admin/moderation` | AdminModeration | ProtectedRoute roles={['ADMIN', 'MODERATOR']} |
| `/admin/journal` | AdminLogs | ProtectedRoute roles={['ADMIN', 'MODERATOR']} |

---

## Notes techniques

### Conventions
- Les FK vers `users` sont de type UUID (users.id est UUID)
- Les FK vers les autres tables sont de type INTEGER
- Les tables `moderation_actions` et `user_sanctions` n'utilisent PAS `paranoid: true` (pas de soft delete pour les logs d'audit et l'historique des sanctions)
- Chaque action d'administration (ban, mute, changement de rôle, approbation, etc.) doit créer un enregistrement dans `moderation_actions` via la méthode statique `ModerationAction.log()`
- Les sanctions expirées sont détectées en comparant `expires_at` avec la date courante ; un scope `active` combine `is_active = true` ET `(expires_at IS NULL OR expires_at > NOW())`

### Pagination
- Pagination côté serveur avec `limit` + `offset`
- Format de réponse paginée : `{ success, data: { items, total, page, totalPages, limit } }`
- Pagination par défaut : 20 utilisateurs par page, 20 personnages par page, 30 actions de modération par page

### Performance
- Index sur toutes les FK et colonnes de filtrage (moderator_id, target_user_id, action_type, user_id, is_active, type)
- Les statistiques du dashboard utilisent des `COUNT()` avec cache côté serveur (optionnel, à évaluer selon la charge)
- Eager loading des associations (modérateur, utilisateur cible) dans les listes d'actions

### Sécurité
- Toutes les routes admin requièrent `authenticate` + `authorize('ADMIN')` ou `authorize('ADMIN', 'MODERATOR')` selon la route
- Un MODERATOR ne peut pas modifier un utilisateur ADMIN (vérification dans les controllers)
- Un utilisateur ne peut pas se bannir / se muter lui-même (vérification dans les controllers)
- Les changements de rôle vers ADMIN sont réservés exclusivement aux ADMIN
- Validation des données en entrée avec express-validator, messages en français
- Protection contre la suppression accidentelle : confirmation requise côté frontend, vérifications côté backend

---

## Ordre de réalisation suggéré

1. **Backend - Base de données**
   - [x] Migrations (2 tables : moderation_actions, user_sanctions)
   - [x] Modèles avec associations et scopes
   - [x] Seeders dev (sanctions test + actions de modération test)

2. **Backend - API Administration**
   - [x] Validators (adminValidators, moderationValidators)
   - [x] Controller dashboard (statistiques)
   - [x] Controller utilisateurs (CRUD + ban/mute/rôle)
   - [x] Controller personnages (liste + approbation)
   - [x] Controller forum (catégories + déplacement/fusion sujets)
   - [x] Controller modération (historique + sanctions + signalements)
   - [x] Routes admin + montage dans index.js

3. **Frontend - Services et Hooks**
   - [x] adminService.js (toutes les méthodes API)
   - [x] useAdmin.js (queries + mutations)

4. **Frontend - Layout et Composants**
   - [x] AdminLayout + AdminSidebar
   - [x] Composants de base (StatCard, UserTable, UserSanctionBadge, etc.)
   - [x] Composants modaux (BanModal, MuteModal, RoleChangeModal, MoveTopicModal)

5. **Frontend - Pages**
   - [x] AdminDashboard
   - [x] AdminUsers + AdminUserDetail
   - [x] AdminCharacters
   - [x] AdminForum
   - [x] AdminModeration
   - [x] AdminLogs
   - [x] Intégration Router dans App.jsx

---

## Critères de validation

- [x] Le dashboard affiche les statistiques correctes (utilisateurs, personnages, forum, signalements)
- [x] La liste des utilisateurs est filtrable par rôle, statut et recherche textuelle
- [x] Le bannissement désactive le compte et empêche la connexion
- [x] Le mute empêche la création de posts/sujets sans désactiver le compte
- [ ] Les sanctions avec durée expirent automatiquement
- [x] La révocation d'une sanction réactive le compte (unban) ou le droit de poster (unmute)
- [x] Le changement de rôle est immédiatement effectif
- [x] Les personnages en attente peuvent être approuvés ou rejetés avec raison depuis le panel
- [x] Les catégories du forum sont gérées (CRUD + réordonnancement) depuis le panel
- [ ] Le déplacement de sujet met à jour les compteurs des catégories source et destination
- [ ] La fusion de sujets transfère tous les posts et supprime le sujet source
- [x] Toutes les actions d'administration sont enregistrées dans moderation_actions
- [x] Le journal de modération affiche l'historique complet avec filtres fonctionnels
- [ ] Les MODERATOR ne peuvent pas modifier les ADMIN
- [x] Un utilisateur ne peut pas se bannir ou se muter lui-même
- [ ] Les routes admin ne sont accessibles qu'aux rôles ADMIN et/ou MODERATOR
- [ ] Le panel est responsive et utilisable sur mobile
