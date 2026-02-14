# Phase 8bis — Permissions granulaires des catégories et topics du forum

## Objectif

Mettre en place un système de permissions modulable et granulaire permettant de contrôler finement l'accès et les actions possibles sur chaque catégorie et chaque topic du forum, avec héritage depuis la catégorie parente.

**Principe fondamental** : Les admins ont toujours toutes les permissions. Les permissions définies sur une catégorie s'additionnent à celles héritées de la catégorie parente (héritage cumulatif).

---

## Types de permissions

| Code                  | Description                                                                                       |
|-----------------------|---------------------------------------------------------------------------------------------------|
| `access_category`     | Peut accéder (voir) cette catégorie                                                               |
| `edit_category`       | Peut éditer et supprimer cette catégorie                                                          |
| `create_subcategory`  | Peut créer une sous-catégorie dans cette catégorie                                                |
| `move_category`       | Peut déplacer une sous-catégorie depuis/vers cette catégorie                                      |
| `create_topic`        | Peut créer un topic dans cette catégorie                                                          |
| `edit_topic`          | Peut éditer et supprimer un topic dans cette catégorie                                            |
| `move_topic`          | Peut déplacer un topic depuis/vers cette catégorie                                                |
| `merge_topic`         | Peut fusionner un topic avec un topic de cette catégorie (dans les deux sens)                     |

## Cibles (grantees) des permissions

| Code                         | Description                                                              |
|------------------------------|--------------------------------------------------------------------------|
| `public`                     | Tout le monde (y compris visiteurs non connectés)                        |
| `player`                     | Tout utilisateur avec le rôle PLAYER                                     |
| `player_accepted_rules`      | PLAYER ayant accepté le règlement et les CGU                             |
| `player_with_character`      | PLAYER avec un personnage sélectionné (actif)                            |
| `player_character_faction`   | PLAYER avec personnage sélectionné appartenant à une faction spécifique  |
| `player_character_clan`      | PLAYER avec personnage sélectionné appartenant à un clan spécifique      |
| `specific_user`              | Un utilisateur spécifique (par UUID)                                     |
| `specific_character`         | Un utilisateur avec un personnage spécifique sélectionné                 |
| `game_master`                | Tout utilisateur avec le rôle GAME_MASTER                                |
| `moderator`                  | Tout utilisateur avec le rôle MODERATOR                                  |

---

## Etape 1 — Modèle et migration `CategoryPermission`

### 1.1 Migration `create-category-permissions`

Créer la table `category_permissions` :

```
id              INTEGER, PK, auto-increment
category_id     INTEGER, FK -> forum_categories(id), NOT NULL, ON DELETE CASCADE
permission      ENUM('access_category', 'edit_category', 'create_subcategory',
                     'move_category', 'create_topic', 'edit_topic',
                     'move_topic', 'merge_topic'), NOT NULL
grantee_type    ENUM('public', 'player', 'player_accepted_rules',
                     'player_with_character', 'player_character_faction',
                     'player_character_clan', 'specific_user',
                     'specific_character', 'game_master', 'moderator'), NOT NULL
grantee_id      VARCHAR(36), NULL
                — UUID de l'utilisateur pour 'specific_user'
                — UUID du personnage pour 'specific_character'
                — ID de la faction pour 'player_character_faction'
                — ID du clan pour 'player_character_clan'
                — NULL pour les types génériques (public, player, moderator, etc.)
created_at      DATETIME, NOT NULL, DEFAULT CURRENT_TIMESTAMP
updated_at      DATETIME, NOT NULL, DEFAULT CURRENT_TIMESTAMP
```

Index :
- `category_id` + `permission` + `grantee_type` + `grantee_id` (index unique composite pour éviter les doublons)
- `category_id` (index FK)
- `grantee_type` (index pour filtrage rapide)

### 1.2 Modèle Sequelize `CategoryPermission`

- Factory function standard `(sequelize, DataTypes) =>`
- `underscored: true`, `timestamps: true`, `paranoid: false` (pas de soft delete pour les permissions)
- Association : `belongsTo(ForumCategory, { as: 'category', foreignKey: 'categoryId' })`
- Association inverse sur `ForumCategory` : `hasMany(CategoryPermission, { as: 'permissions' })`
- Scopes utilitaires :
  - `forCategory(categoryId)` — toutes les permissions d'une catégorie
  - `ofType(permission)` — filtrer par type de permission
  - `forGrantee(granteeType, granteeId)` — permissions pour un type de cible

### 1.3 Seeder de développement

Créer `seed-test-x8bis-category-permissions.js` :
- Permissions par défaut pour les catégories existantes (accès public, création topic pour players, etc.)
- Quelques permissions spécifiques pour tester (ex : catégorie RP réservée aux joueurs avec personnage)

---

## Etape 2 — Service de résolution des permissions

### 2.1 `services/categoryPermissionService.js`

Service backend centralisant la logique de vérification des permissions :

**`resolvePermissions(categoryId)`**
- Charge les permissions de la catégorie ET de toutes ses catégories parentes (remontée récursive)
- Fusionne les permissions (union) : une permission accordée à un niveau parent est héritée
- Retourne un tableau consolidé de `{ permission, granteeType, granteeId }`
- Cache en mémoire (invalidé lors des modifications)

**`userHasPermission(user, categoryId, permission, options)`**
- `options` : `{ characterId?, factionId?, clanId? }` — contexte du personnage sélectionné
- Retourne `true` si :
  1. L'utilisateur est ADMIN (toujours true), OU
  2. Il existe une permission correspondante dont le grantee matche l'utilisateur :
     - `public` → toujours true
     - `moderator` → user.role === 'MODERATOR'
     - `game_master` → user.role === 'GAME_MASTER'
     - `player` → user.role === 'PLAYER'
     - `player_accepted_rules` → user.role === 'PLAYER' && user.hasAcceptedRules
     - `player_with_character` → characterId fourni et appartient à l'utilisateur
     - `player_character_faction` → characterId fourni && personnage.factionId === granteeId
     - `player_character_clan` → characterId fourni && personnage.clanId === granteeId
     - `specific_user` → user.id === granteeId
     - `specific_character` → characterId === granteeId

**`getCategoryPermissionsForUser(user, categoryId, options)`**
- Retourne la liste des permissions effectives de l'utilisateur pour cette catégorie
- Utilisé par le frontend pour afficher/masquer les actions

---

## Etape 3 — Middleware de vérification des permissions

### 3.1 `middlewares/categoryPermission.js`

**`requireCategoryPermission(permission)`**
- Middleware Express qui vérifie que l'utilisateur a la permission spécifiée sur la catégorie
- Récupère le `categoryId` depuis `req.params.categoryId`, `req.params.id`, ou `req.body.categoryId`
- Utilise `categoryPermissionService.userHasPermission()`
- Retourne 403 Forbidden si la permission est refusée

### 3.2 Intégration dans les routes existantes

Remplacer les `authorize('ADMIN', 'MODERATOR')` statiques par les nouveaux middlewares sur les routes forum :

| Route                                     | Permission requise     |
|-------------------------------------------|------------------------|
| `GET /forum/categories/:id`               | `access_category`      |
| `PUT /admin/forum/categories/:id`         | `edit_category`        |
| `DELETE /admin/forum/categories/:id`      | `edit_category`        |
| `POST /admin/forum/categories` (avec parentId) | `create_subcategory` |
| `PATCH /admin/forum/categories/reorder`   | `move_category`        |
| `POST /forum/topics` (dans une catégorie) | `create_topic`         |
| `PUT /forum/topics/:id`                   | `edit_topic`           |
| `DELETE /forum/topics/:id`                | `edit_topic`           |
| `PATCH /admin/forum/topics/:id/move`      | `move_topic` (source ET destination) |
| `PATCH /admin/forum/topics/merge`         | `merge_topic` (sur les deux catégories) |

**Note** : Les routes qui impliquent deux catégories (déplacement, fusion) vérifient la permission sur les deux catégories concernées.

---

## Etape 4 — API CRUD des permissions

### 4.1 Routes admin

```
GET    /api/admin/forum/categories/:id/permissions      — Liste les permissions d'une catégorie
POST   /api/admin/forum/categories/:id/permissions      — Ajoute une permission
DELETE /api/admin/forum/categories/:id/permissions/:permId — Supprime une permission
GET    /api/admin/forum/categories/:id/permissions/effective — Permissions effectives (avec héritage)
```

### 4.2 Controller `adminCategoryPermissionController.js`

- `getPermissions` — Liste les permissions directes de la catégorie
- `getEffectivePermissions` — Liste les permissions effectives (directes + héritées)
- `addPermission` — Ajoute une permission (avec validation unicité)
- `removePermission` — Supprime une permission

### 4.3 Validators

- `permission` : doit être dans l'ENUM défini
- `granteeType` : doit être dans l'ENUM défini
- `granteeId` : requis pour `specific_user`, `specific_character`, `player_character_faction`, `player_character_clan` ; interdit pour les autres types
- Vérification que la combinaison n'existe pas déjà

---

## Etape 5 — API publique des permissions utilisateur

### 5.1 Route

```
GET /api/forum/categories/:id/my-permissions   — Permissions de l'utilisateur courant
```

### 5.2 Réponse

```json
{
  "success": true,
  "data": {
    "permissions": ["access_category", "create_topic"],
    "inherited": {
      "access_category": { "fromCategoryId": 1, "fromCategoryName": "Forum général" }
    }
  }
}
```

Permet au frontend de savoir quels boutons/actions afficher pour chaque catégorie.

---

## Etape 6 — Intégration dans les controllers existants

### 6.1 Filtrage des catégories visibles

Modifier `forumCategoryController.getAll` :
- Filtrer les catégories selon `access_category` pour l'utilisateur courant
- Utiliser `optionalAuth` pour supporter les visiteurs non connectés
- Retourner uniquement les catégories accessibles

### 6.2 Filtrage des topics visibles

Modifier `forumTopicController.getByCategory` :
- Vérifier `access_category` avant d'afficher les topics d'une catégorie

### 6.3 Création de topic

Modifier `forumTopicController.create` :
- Vérifier `create_topic` sur la catégorie cible

### 6.4 Actions de modération

Modifier `adminForumController` :
- `moveTopic` : vérifier `move_topic` sur source ET destination
- `mergeTopics` : vérifier `merge_topic` sur les deux catégories

---

## Etape 7 — Frontend : Editeur de permissions dans le panel admin

### 7.1 Composant `CategoryPermissionEditor`

Editeur intégré dans le formulaire de création/édition de catégorie (`CategoryForm` dans `AdminForum.jsx`) :

- **Section dédiée** : "Permissions" avec accordéon ou onglet
- **Tableau des permissions existantes** : colonnes Permission | Cible | Détail | Actions
- **Formulaire d'ajout** :
  - Select "Type de permission" (les 8 types)
  - Select "Cible" (les 10 types de grantee)
  - Champ conditionnel selon le grantee :
    - `player_character_faction` → select de faction
    - `player_character_clan` → select de clan
    - `specific_user` → recherche d'utilisateur (autocomplete)
    - `specific_character` → recherche de personnage (autocomplete)
  - Bouton "Ajouter"
- **Affichage de l'héritage** : section distincte montrant les permissions héritées des catégories parentes (lecture seule, grisée)

### 7.2 Hook `useAdminCategoryPermissions`

- `useQuery` pour charger les permissions d'une catégorie
- `useMutation` pour ajouter/supprimer des permissions
- Hook séparé pour les permissions effectives (avec héritage)

### 7.3 Service `adminService.js`

Ajouter les fonctions :
- `getCategoryPermissions(categoryId)`
- `getCategoryEffectivePermissions(categoryId)`
- `addCategoryPermission(categoryId, data)`
- `removeCategoryPermission(categoryId, permissionId)`

---

## Etape 8 — Frontend : Application des permissions dans les pages publiques

### 8.1 Hook `useCategoryPermissions`

- Appelle `GET /api/forum/categories/:id/my-permissions`
- Retourne les permissions de l'utilisateur courant sur une catégorie
- Utilise un cache pour éviter les appels multiples

### 8.2 Modifications des pages forum

**ForumIndex.jsx** :
- Le bouton "Nouvelle catégorie" utilise la permission `create_subcategory` (au lieu de `isAdmin`)
- Les catégories non accessibles sont masquées

**ForumCategory.jsx** :
- Le bouton "Nouveau sujet" utilise `create_topic` (au lieu de `!!user`)
- Le bouton "Nouvelle sous-catégorie" utilise `create_subcategory` (au lieu de `isAdmin`)
- Les sous-catégories non accessibles sont masquées

**AdminForum.jsx** :
- Les boutons édition/suppression utilisent `edit_category`
- Les boutons déplacement/fusion utilisent `move_topic` / `merge_topic`

---

## Etape 9 — Migration des permissions par défaut

### 9.1 Migration de données

Créer une migration qui initialise les permissions par défaut pour toutes les catégories existantes, basées sur le comportement actuel :

| Catégorie             | Permission par défaut                                                         |
|-----------------------|-------------------------------------------------------------------------------|
| Toutes                | `access_category` → `public`                                                 |
| Non-RP                | `create_topic` → `player`                                                    |
| RP                    | `create_topic` → `player_with_character`                                     |
| Toutes                | `edit_topic` → `moderator`, `edit_topic` → `game_master`                     |
| Toutes                | `move_topic` → `moderator`, `move_topic` → `game_master`                     |
| Toutes                | `merge_topic` → `moderator`, `merge_topic` → `game_master`                   |
| Toutes                | `edit_category` → `moderator` (optionnel)                                    |

### 9.2 Rétrocompatibilité

- L'ancien système `authorize('ADMIN', 'MODERATOR')` reste fonctionnel en parallèle pendant la transition
- Les routes sont migrées progressivement vers le nouveau middleware
- Les tests existants continuent de passer

---

## Etape 10 — Tests et validation

### 10.1 Tests backend

- Tests unitaires du service `categoryPermissionService` :
  - Résolution des permissions avec héritage multi-niveaux
  - Vérification de chaque type de grantee
  - Cas limites : catégorie sans permission, chaîne d'héritage profonde
- Tests des middlewares de permission
- Tests des routes CRUD des permissions
- Tests d'intégration : création de topic avec/sans permission

### 10.2 Tests frontend

- Vérification que les boutons apparaissent/disparaissent selon les permissions
- Test du composant éditeur de permissions
- Test de l'héritage affiché dans l'éditeur

---

## Résumé de l'ordre d'implémentation

1. **Migration + Modèle** `CategoryPermission` (base de données)
2. **Service** de résolution des permissions (logique métier backend)
3. **Middleware** de vérification (sécurité des routes)
4. **API CRUD admin** des permissions (gestion)
5. **API publique** des permissions utilisateur (consultation)
6. **Intégration backend** dans les controllers existants
7. **Frontend admin** : éditeur de permissions
8. **Frontend public** : application des permissions
9. **Migration de données** : permissions par défaut
10. **Tests** et validation complète
