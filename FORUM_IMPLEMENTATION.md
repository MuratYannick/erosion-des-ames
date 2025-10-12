# Implémentation du Système de Forum avec Permissions et Visibilité

## Résumé des Modifications

Ce document décrit toutes les modifications apportées pour implémenter le système de forum avec gestion des rôles et des permissions basées sur les factions et clans.

## 1. Système de Rôles

### Modèle Role ([backend/models/game/Role.js](backend/models/game/Role.js))

Création d'un nouveau modèle `Role` pour remplacer l'ENUM dans le modèle User:

- **Rôles disponibles**:
  - `admin` (Administrateur) - Niveau 100
  - `moderator` (Modérateur) - Niveau 50
  - `game_master` (Maître du Jeu) - Niveau 30
  - `player` (Joueur) - Niveau 10

- **Champs**:
  - `name` - Nom unique du rôle
  - `label` - Libellé pour l'affichage
  - `description` - Description des permissions
  - `level` - Niveau hiérarchique (plus élevé = plus de permissions)
  - `is_active` - Statut actif/inactif

### Modifications du Modèle User ([backend/models/game/User.js](backend/models/game/User.js))

- Remplacement du champ `role` ENUM par `role_id` (clé étrangère vers la table `roles`)
- Relation: `User.belongsTo(Role)` et `Role.hasMany(User)`

### Middleware de Permissions ([backend/middleware/permissionMiddleware.js](backend/middleware/permissionMiddleware.js))

Fonctions réutilisables pour vérifier les permissions:

```javascript
// Vérifier un ou plusieurs rôles spécifiques
export const checkRole = (...allowedRoles) => (req, res, next) => { ... }

// Vérifier le niveau hiérarchique minimum
export const checkLevel = (minLevel) => (req, res, next) => { ... }

// Raccourcis prédéfinis
export const isAdmin = checkRole("admin");
export const isModeratorOrAdmin = checkRole("admin", "moderator");
export const isStaff = checkRole("admin", "moderator", "game_master");
```

### Contrôleur Admin ([backend/controllers/adminController.js](backend/controllers/adminController.js))

Nouvelles fonctions pour la gestion des utilisateurs (réservées aux admins):

- `getRoles()` - Récupérer tous les rôles actifs
- `getUsers()` - Récupérer les utilisateurs avec pagination
- `updateUserRole()` - Modifier le rôle d'un utilisateur
- `activateUser()` / `deactivateUser()` - Activer/désactiver un compte

### Routes Admin ([backend/routes/adminRoutes.js](backend/routes/adminRoutes.js))

```javascript
router.get("/roles", protect, getRoles);
router.get("/users", protect, isAdmin, getUsers);
router.put("/users/:id/role", protect, isAdmin, updateUserRole);
router.put("/users/:id/activate", protect, isAdmin, activateUser);
router.put("/users/:id/deactivate", protect, isAdmin, deactivateUser);
```

## 2. Système de Visibilité du Forum

### Utilitaire de Permissions ([backend/utils/forumPermissions.js](backend/utils/forumPermissions.js))

Logique centralisée pour la gestion de la visibilité:

#### Fonction principale: `canAccessSection(user, section, category)`

Implémente les règles de visibilité:

1. **Forum Général** (`category.slug === "general"`)
   - Accessible à tous (anonymes + authentifiés)

2. **Forum HRP** (`category.slug === "hrp"`)
   - Accessible à tous les utilisateurs authentifiés

3. **Forum RP** (`category.slug === "rp"`)
   - Requiert authentification
   - **Staff bypass**: Les rôles admin, moderator et game_master ont accès à tout
   - **Sans restriction** (`!visible_by_faction_id && !visible_by_clan_id`):
     - Accessible aux utilisateurs avec au moins un personnage vivant
   - **Restriction faction** (`visible_by_faction_id`):
     - Accessible aux utilisateurs avec un personnage vivant dans cette faction
   - **Restriction clan** (`visible_by_clan_id`):
     - Accessible aux utilisateurs avec un personnage vivant dans ce clan

#### Fonctions auxiliaires

```javascript
// Vérifier si l'utilisateur a un personnage vivant
hasAliveCharacter(userId)

// Vérifier si l'utilisateur a un personnage dans une faction
hasCharacterInFaction(userId, factionId)

// Vérifier si l'utilisateur a un personnage dans un clan
hasCharacterInClan(userId, clanId)

// Filtrer récursivement un tableau de sections
filterSectionsByAccess(sections, user, category)

// Trouver la catégorie parente d'une section (même imbriquée)
getCategoryFromSection(section)
```

### Modifications du Contrôleur Forum ([backend/controllers/forumController.js](backend/controllers/forumController.js))

Ajout de la vérification de visibilité dans toutes les fonctions pertinentes:

#### Fonctions modifiées pour la lecture

- **getCategories()**: Filtre toutes les sections selon les permissions de l'utilisateur
- **getCategoryBySlug()**: Filtre les sections d'une catégorie spécifique
- **getSectionBySlug()**: Vérifie l'accès à la section et filtre les sous-sections
- **getTopicById()**: Vérifie l'accès via la section parente

#### Fonctions modifiées pour l'écriture

- **createTopic()**: Vérifie que l'utilisateur peut accéder à la section avant de créer un topic
- **createPost()**: Vérifie que l'utilisateur peut accéder au topic avant de créer un post

#### Pattern d'implémentation

```javascript
export const getSomeResource = async (req, res) => {
  const user = req.user || null; // Supporte les utilisateurs anonymes

  // Récupération avec relations nécessaires pour la traversée de hiérarchie
  const resource = await Model.findOne({
    include: [
      { model: Category, as: "category" },
      { model: Section, as: "parentSection", include: [...] }
    ]
  });

  // Vérification de la visibilité
  const category = await getCategoryFromSection(resource.section);
  if (category) {
    const hasAccess = await canAccessSection(user, resource.section, category);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Vous n'avez pas accès à cette ressource"
      });
    }
  }

  // Filtrage récursif des sous-sections
  if (resource.subsections?.length > 0) {
    resource.subsections = await filterSectionsByAccess(
      resource.subsections, user, category
    );
  }

  res.json({ success: true, data: resource });
};
```

### Modifications des Routes Forum ([backend/routes/forumRoutes.js](backend/routes/forumRoutes.js))

Application des middlewares de permission:

```javascript
// Sections CRUD (admin/moderator uniquement)
router.post("/sections", protect, isModeratorOrAdmin, createSection);
router.put("/sections/:id", protect, isModeratorOrAdmin, updateSection);
router.put("/sections/:id/move", protect, isModeratorOrAdmin, moveSection);
router.delete("/sections/:id", protect, isModeratorOrAdmin, deleteSection);

// Topics accessibles à tous les utilisateurs authentifiés
router.post("/topics", protect, createTopic);
router.post("/posts", protect, createPost);
```

## 3. Seed Scripts

### Seed Principal ([backend/utils/seed.js](backend/utils/seed.js))

Ajout de la création des 4 rôles dans la fonction de seeding principale:

```javascript
const roles = await Role.bulkCreate([
  { name: "admin", label: "Administrateur", description: "...", level: 100 },
  { name: "moderator", label: "Modérateur", description: "...", level: 50 },
  { name: "game_master", label: "Maître du Jeu", description: "...", level: 30 },
  { name: "player", label: "Joueur", description: "...", level: 10 },
]);
```

### Seed de Développement ([backend/utils/seedDev.js](backend/utils/seedDev.js))

Mise à jour complète pour supporter les nouveaux systèmes:

#### Utilisateurs de test

Création de 7 comptes de test:
- `admin_test` / `admin@test.com` (Administrateur)
- `moderator_test` / `moderator@test.com` (Modérateur)
- `gm_test` / `gm@test.com` (Maître du Jeu)
- `player_mutant` / `mutant@test.com` (Joueur avec personnages mutants)
- `player_pure` / `pure@test.com` (Joueur avec personnages non-mutants)
- `player_neutral` / `neutral@test.com` (Joueur avec personnages neutres)
- `player_no_char` / `nochar@test.com` (Joueur sans personnage)

Mot de passe: `password123` pour tous

#### Données de test du forum

**6 sections créées**:
1. **Annonces** (Forum Général) - Accessible à tous
2. **Discussions HRP** (Forum HRP) - Accessible aux connectés
3. **Taverne des Survivants** (Forum RP) - Accessible avec personnage vivant
4. **L'Oasis des Transformés** (Forum RP) - Restriction: faction Éveillés
5. **La Citadelle Inaltérée** (Forum RP) - Restriction: faction Inaltérés
6. **Sanctuaire des Symbiotes** (Forum RP) - Restriction: clan Symbiotes

**5 topics créés avec leurs posts**:
- Topic d'annonce dans Forum Général
- Topic de présentation dans Forum HRP
- Topic RP dans la Taverne (avec interactions entre personnages)
- Topic RP dans la section faction mutants
- Topic RP dans la section faction non-mutants

## 4. Flux de Travail

### Authentification et Rôles

1. **Inscription**: L'utilisateur est automatiquement assigné au rôle "player"
2. **Connexion**: Le rôle est chargé avec l'utilisateur et inclus dans `req.user`
3. **Middleware**: `authMiddleware.protect` charge le rôle avec chaque requête authentifiée

### Accès au Forum

1. **Requête anonyme**: `req.user` est `null`
2. **Requête authentifiée**: `req.user` contient l'ID, le username et l'objet `role`
3. **Vérification**: `canAccessSection()` est appelée pour chaque section
4. **Filtrage**: Les sections inaccessibles sont retirées récursivement
5. **Réponse**: Seules les sections accessibles sont retournées

### Création de Contenu

1. **Vérification d'accès**: Avant de créer un topic/post, l'accès à la section/topic est vérifié
2. **Validation**: Les données sont validées
3. **Création**: Le contenu est créé avec les IDs de l'auteur (user et optionnellement character)
4. **Nom d'auteur**: Le nom est préservé dans `author_name` pour éviter les problèmes si le compte/personnage est supprimé

## 5. Tests de Validation

### Scénarios à Tester

#### Utilisateur Anonyme
- ✅ Peut voir Forum Général et ses sections
- ✅ Ne peut pas voir Forum HRP
- ✅ Ne peut pas voir Forum RP
- ✅ Reçoit 403 en tentant d'accéder à une section restreinte

#### Utilisateur Authentifié Sans Personnage
- ✅ Peut voir Forum Général
- ✅ Peut voir Forum HRP
- ✅ Ne peut pas voir Forum RP (pas de personnage vivant)
- ✅ Reçoit 403 en tentant de créer un topic dans une section RP

#### Utilisateur avec Personnage Vivant (Faction Éveillés)
- ✅ Peut voir Forum Général
- ✅ Peut voir Forum HRP
- ✅ Peut voir sections RP sans restriction
- ✅ Peut voir sections RP de sa faction (Éveillés)
- ✅ Ne peut pas voir sections RP de l'autre faction (Inaltérés)
- ✅ Peut voir sections RP de son clan
- ✅ Ne peut pas voir sections RP d'autres clans

#### Staff (Admin/Moderator/Game Master)
- ✅ Peut voir toutes les sections de toutes les catégories
- ✅ Bypass toutes les restrictions de faction/clan
- ✅ Peut gérer les sections (CRUD) selon son niveau

## 6. Structure de Base de Données

### Nouvelles Tables

**roles**
- `id` (PK)
- `name` (UNIQUE)
- `label`
- `description`
- `level`
- `is_active`
- `created_at`, `updated_at`

### Tables Modifiées

**users**
- Ajout: `role_id` (FK vers roles)
- Suppression: `role` (ENUM)
- Contrainte: `ON DELETE RESTRICT` (ne peut pas supprimer un rôle utilisé)

**sections**
- Existant: `visible_by_faction_id` (FK vers factions, nullable)
- Existant: `visible_by_clan_id` (FK vers clans, nullable)

## 7. Points Importants

### Performance
- Les requêtes utilisent l'eager loading pour éviter les problèmes N+1
- La fonction `getCategoryFromSection()` traverse la hiérarchie en mémoire quand possible
- Les vérifications de personnages sont mises en cache par requête via `req.user`

### Sécurité
- Toutes les vérifications sont faites côté serveur
- Le staff ne peut pas modifier/désactiver son propre compte
- Les tokens JWT incluent le role_id pour éviter les requêtes supplémentaires
- Les mots de passe sont hashés avec bcrypt

### Extensibilité
- Le système de niveaux permet d'ajouter facilement de nouveaux rôles
- Les middlewares sont composables (peuvent être combinés)
- La logique de visibilité est centralisée dans un seul fichier

## 8. Commandes Utiles

```bash
# Initialiser la base de données avec rôles, factions, clans et catégories
npm run seed

# Ajouter des données de test (utilisateurs, personnages, forum)
npm run seed:dev

# Démarrer le serveur de développement
npm run dev

# Démarrer le serveur de production
npm start
```

## 9. Fichiers Créés

- `backend/models/game/Role.js` - Modèle Role
- `backend/middleware/permissionMiddleware.js` - Middlewares de permissions
- `backend/controllers/adminController.js` - Contrôleur admin
- `backend/routes/adminRoutes.js` - Routes admin
- `backend/utils/forumPermissions.js` - Logique de visibilité du forum

## 10. Fichiers Modifiés

- `backend/models/game/User.js` - Remplacement ENUM par FK
- `backend/models/index.js` - Ajout relations Role
- `backend/utils/seed.js` - Création des rôles
- `backend/utils/seedDev.js` - Mise à jour complète
- `backend/controllers/authController.js` - Auto-assignation rôle player
- `backend/middleware/authMiddleware.js` - Chargement du rôle
- `backend/controllers/forumController.js` - Ajout vérifications visibilité
- `backend/routes/forumRoutes.js` - Ajout middlewares permissions
- `backend/server.js` - Enregistrement routes admin

## 11. Prochaines Étapes Recommandées

1. **Frontend**:
   - Implémenter l'affichage conditionnel des sections selon les permissions
   - Créer les composants pour la création de topics/posts
   - Ajouter l'interface admin pour la gestion des rôles

2. **Tests**:
   - Tests unitaires pour les fonctions de permission
   - Tests d'intégration pour les routes protégées
   - Tests E2E pour les scénarios utilisateur

3. **Optimisations**:
   - Cache Redis pour les permissions fréquemment vérifiées
   - Pagination des topics et posts
   - Recherche dans le forum

4. **Fonctionnalités supplémentaires**:
   - Notifications de nouveaux posts
   - Système de likes/réactions
   - Modération (édition/suppression par staff)
   - Historique des éditions
