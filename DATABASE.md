# Base de données - L'Érosion des Âmes

Ce document décrit la structure de la base de données, les relations entre les tables et le processus de seeding.

## 🗄️ Configuration

**SGBD** : MySQL 8.0+
**ORM** : Sequelize 6.37.7
**Charset** : utf8mb4 (support complet UTF-8 incluant emojis)
**Collation** : utf8mb4_unicode_ci

**Création de la base** :
```sql
CREATE DATABASE erosion_des_ames
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

**Connection pooling** :
```javascript
{
  max: 5,           // Max 5 connexions simultanées
  min: 0,
  acquire: 30000,   // Timeout acquisition 30s
  idle: 10000       // Libération après 10s inactivité
}
```

## 📊 Modèles de données

### Conventions de nommage

- **Tables** : snake_case pluriel (`users`, `forum_permissions`)
- **Champs** : snake_case (`user_id`, `forum_rules_accepted_at`)
- **Modèles Sequelize** : PascalCase singulier (`User`, `ForumPermission`)
- **Propriétés JS** : camelCase (converti automatiquement via `underscored: true`)

### Timestamps automatiques

Tous les modèles incluent :
- `created_at` (DATETIME) - Date de création
- `updated_at` (DATETIME) - Date de dernière modification
- `deleted_at` (DATETIME, nullable) - Date de suppression (soft delete via `paranoid: true`)

---

## 🎮 Modèles Jeu (game/)

### User (Utilisateur)

Table centrale pour l'authentification et le profil utilisateur.

**Table** : `users`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unique |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Nom d'utilisateur |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | Email |
| `password_hash` | VARCHAR(255) | NOT NULL | Mot de passe hashé (bcrypt) |
| `role` | ENUM | NOT NULL, DEFAULT 'PLAYER' | Rôle (ADMIN, MODERATOR, GAME_MASTER, PLAYER) |
| `email_verified` | BOOLEAN | DEFAULT false | Email vérifié |
| `is_active` | BOOLEAN | DEFAULT true | Compte actif |
| `login_attempts` | INTEGER | DEFAULT 0 | Tentatives de connexion échouées |
| `locked_until` | DATETIME | NULL | Date de fin de verrouillage |
| `terms_accepted` | BOOLEAN | DEFAULT false | CGU acceptées |
| `terms_accepted_at` | DATETIME | NULL | Date d'acceptation CGU |
| `forum_rules_accepted` | BOOLEAN | DEFAULT false | Règlement forum accepté |
| `forum_rules_accepted_at` | DATETIME | NULL | Date d'acceptation règlement |
| `last_login` | DATETIME | NULL | Dernière connexion |

**Relations** :
- `User` 1:N `Character` (hasMany)
- `User` 1:N `Topic` (hasMany, via `author_user_id`)
- `User` 1:N `Post` (hasMany, via `author_user_id`)

**Indexes** :
- `username` (unique)
- `email` (unique)
- `role` (recherche rapide par rôle)

---

### Faction

Factions principales du jeu (Éveillés, Purs, clans neutres).

**Table** : `factions`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unique |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Nom de la faction |
| `ethnic_group` | VARCHAR(100) | NULL | Groupe ethnique (ex: "Les Eveillés") |
| `description` | TEXT | NULL | Description |
| `base_name` | VARCHAR(100) | NULL | Nom de la base |
| `is_playable` | BOOLEAN | DEFAULT true | Faction jouable |
| `leader_clan` | VARCHAR(100) | NULL | Nom du clan dirigeant |
| `leader_id` | INTEGER | FK `users.id`, NULL | Leader actuel (User) |

**Relations** :
- `Faction` 1:N `Clan` (hasMany)
- `Faction` 1:N `Character` (hasMany)
- `Faction` 1:N `Section` (hasMany, sections privées de faction)

**Indexes** :
- `name` (unique)
- `ethnic_group`
- `is_playable`

---

### Clan

Clans/castes au sein des factions (ou clans neutres).

**Table** : `clans`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unique |
| `faction_id` | INTEGER | FK `factions.id`, NULL | Faction parente (NULL pour neutres) |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Nom du clan |
| `ethnic_group` | VARCHAR(100) | NULL | Groupe ethnique |
| `description` | TEXT | NULL | Description |
| `is_playable` | BOOLEAN | DEFAULT true | Clan jouable |
| `is_recruitable` | BOOLEAN | DEFAULT true | Recrutement ouvert |
| `leader_name` | VARCHAR(100) | NULL | Nom du leader |
| `leader_id` | INTEGER | FK `users.id`, NULL | Leader actuel (User) |

**Relations** :
- `Clan` N:1 `Faction` (belongsTo)
- `Clan` 1:N `Character` (hasMany)
- `Clan` 1:N `Section` (hasMany, sections privées de clan)

**Indexes** :
- `name` (unique)
- `faction_id` (FK)
- `is_playable`

---

### Character (Personnage)

Personnages jouables créés par les utilisateurs.

**Table** : `characters`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unique |
| `user_id` | INTEGER | FK `users.id`, NOT NULL | Propriétaire |
| `faction_id` | INTEGER | FK `factions.id`, NOT NULL | Faction |
| `clan_id` | INTEGER | FK `clans.id`, NULL | Clan/caste |
| `name` | VARCHAR(100) | NOT NULL | Nom du personnage |
| `ethnic_group` | VARCHAR(100) | NULL | Groupe ethnique |
| `level` | INTEGER | DEFAULT 1 | Niveau |
| `experience` | INTEGER | DEFAULT 0 | Points d'expérience |
| `health` | INTEGER | DEFAULT 100 | Points de vie actuels |
| `max_health` | INTEGER | DEFAULT 100 | PV maximum |
| `energy` | INTEGER | DEFAULT 100 | Énergie actuelle |
| `max_energy` | INTEGER | DEFAULT 100 | Énergie maximum |
| `strength` | INTEGER | DEFAULT 10 | Force |
| `agility` | INTEGER | DEFAULT 10 | Agilité |
| `intelligence` | INTEGER | DEFAULT 10 | Intelligence |
| `endurance` | INTEGER | DEFAULT 10 | Endurance |
| `position_x` | INTEGER | DEFAULT 0 | Position X |
| `position_y` | INTEGER | DEFAULT 0 | Position Y |
| `current_zone` | VARCHAR(100) | NULL | Zone actuelle |
| `is_alive` | BOOLEAN | DEFAULT true | Vivant/mort |
| `death_count` | INTEGER | DEFAULT 0 | Nombre de morts |
| `last_death_at` | DATETIME | NULL | Date dernière mort |

**Relations** :
- `Character` N:1 `User` (belongsTo)
- `Character` N:1 `Faction` (belongsTo)
- `Character` N:1 `Clan` (belongsTo)
- `Character` 1:N `Topic` (hasMany, via `author_character_id`)
- `Character` 1:N `Post` (hasMany, via `author_character_id`)

**Indexes** :
- `user_id` (FK)
- `faction_id` (FK)
- `clan_id` (FK)
- `is_alive`

---

## 💬 Modèles Forum (forum/)

### Category (Catégorie)

Catégories principales du forum (ex: "Général", "RP", "HRP").

**Table** : `categories`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unique |
| `name` | VARCHAR(100) | UNIQUE, NOT NULL | Nom de la catégorie |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | Slug URL |
| `description` | TEXT | NULL | Description |
| `order` | INTEGER | DEFAULT 0 | Ordre d'affichage |
| `is_active` | BOOLEAN | DEFAULT true | Active/archivée |

**Relations** :
- `Category` 1:N `Section` (hasMany)

**Indexes** :
- `slug` (unique)
- `order`
- `is_active`

---

### Section

Sections du forum avec support hiérarchique (sous-sections).

**Table** : `sections`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unique |
| `category_id` | INTEGER | FK `categories.id`, NOT NULL | Catégorie parente |
| `parent_section_id` | INTEGER | FK `sections.id`, NULL | Section parente (sous-section) |
| `name` | VARCHAR(100) | NOT NULL | Nom de la section |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | Slug URL (vidé si supprimé) |
| `description` | TEXT | NULL | Description |
| `order` | INTEGER | DEFAULT 0 | Ordre d'affichage |
| `is_active` | BOOLEAN | DEFAULT true | Active/archivée |
| `is_public` | BOOLEAN | DEFAULT true | Publique/privée |
| `is_locked` | BOOLEAN | DEFAULT false | Verrouillée (création topics) |
| `faction_id` | INTEGER | FK `factions.id`, NULL | Faction (sections privées) |
| `clan_id` | INTEGER | FK `clans.id`, NULL | Clan (sections privées) |

**Relations** :
- `Section` N:1 `Category` (belongsTo)
- `Section` N:1 `Section` (belongsTo, self-reference pour hiérarchie)
- `Section` 1:N `Section` (hasMany, self-reference pour sous-sections)
- `Section` 1:N `Topic` (hasMany)
- `Section` N:1 `Faction` (belongsTo, optional)
- `Section` N:1 `Clan` (belongsTo, optional)
- `Section` 1:N `ForumPermission` (hasMany)

**Indexes** :
- `slug` (unique)
- `category_id` (FK)
- `parent_section_id` (FK)
- `faction_id` (FK)
- `clan_id` (FK)
- `is_active`
- `order`

**Soft delete** : Le slug est vidé (`slug = null`) lors de la suppression pour permettre sa réutilisation.

---

### Topic (Sujet de discussion)

Topics créés par les utilisateurs dans les sections.

**Table** : `topics`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unique |
| `section_id` | INTEGER | FK `sections.id`, NOT NULL | Section parente |
| `title` | VARCHAR(200) | NOT NULL | Titre du topic |
| `slug` | VARCHAR(200) | UNIQUE, NOT NULL | Slug URL (vidé si supprimé) |
| `author_name` | VARCHAR(100) | NOT NULL | Nom auteur (préservé) |
| `author_user_id` | INTEGER | FK `users.id`, NULL | Auteur (User, HRP) |
| `author_character_id` | INTEGER | FK `characters.id`, NULL | Auteur (Character, RP) |
| `is_pinned` | BOOLEAN | DEFAULT false | Épinglé en haut |
| `is_locked` | BOOLEAN | DEFAULT false | Verrouillé (pas de réponses) |
| `is_active` | BOOLEAN | DEFAULT true | Actif/archivé |
| `views_count` | INTEGER | DEFAULT 0 | Nombre de vues |

**Relations** :
- `Topic` N:1 `Section` (belongsTo)
- `Topic` N:1 `User` (belongsTo, via `author_user_id`)
- `Topic` N:1 `Character` (belongsTo, via `author_character_id`)
- `Topic` 1:N `Post` (hasMany)
- `Topic` 1:N `ForumPermission` (hasMany)

**Indexes** :
- `slug` (unique)
- `section_id` (FK)
- `author_user_id` (FK)
- `author_character_id` (FK)
- `is_pinned`
- `is_active`

**Validation** : Un topic avec le même titre ne peut exister 2x dans la même section (actifs uniquement).

**Soft delete** : Le slug est vidé lors de la suppression.

---

### Post (Message)

Messages/réponses dans les topics.

**Table** : `posts`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unique |
| `topic_id` | INTEGER | FK `topics.id`, NOT NULL | Topic parent |
| `content` | TEXT | NOT NULL | Contenu du message |
| `author_name` | VARCHAR(100) | NOT NULL | Nom auteur (préservé) |
| `author_user_id` | INTEGER | FK `users.id`, NULL | Auteur (User, HRP) |
| `author_character_id` | INTEGER | FK `characters.id`, NULL | Auteur (Character, RP) |
| `is_edited` | BOOLEAN | DEFAULT false | Post édité |
| `edited_at` | DATETIME | NULL | Date d'édition |
| `is_active` | BOOLEAN | DEFAULT true | Actif/supprimé |

**Relations** :
- `Post` N:1 `Topic` (belongsTo)
- `Post` N:1 `User` (belongsTo, via `author_user_id`)
- `Post` N:1 `Character` (belongsTo, via `author_character_id`)

**Indexes** :
- `topic_id` (FK)
- `author_user_id` (FK)
- `author_character_id` (FK)
- `is_active`
- `created_at` (tri chronologique)

---

### ForumPermission (Permissions)

Système de permissions granulaire pour catégories, sections et topics.

**Table** : `forum_permissions`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unique |
| `entity_type` | ENUM | NOT NULL | Type ('category', 'section', 'topic') |
| `entity_id` | INTEGER | NOT NULL | ID de l'entité |
| `operation` | ENUM | NOT NULL | Opération ('view', 'create', 'update', 'delete') |
| **Niveau 1 : Rôle** |
| `role_level` | ENUM | DEFAULT 'everyone' | Niveau de rôle requis |
| **Niveau 2 : Auteur** |
| `allow_author` | BOOLEAN | DEFAULT false | Autoriser l'auteur original |
| **Niveau 3 : Personnage** |
| `character_requirement` | ENUM | DEFAULT 'none' | Exigence de personnage |
| `required_faction_id` | INTEGER | FK `factions.id`, NULL | Faction requise |
| `required_clan_id` | INTEGER | FK `clans.id`, NULL | Clan requis |
| **Niveau 4 : Auteur RP** |
| `character_author_rule_enabled` | BOOLEAN | DEFAULT false | Activer règle auteur RP |
| `character_author_exclusive` | BOOLEAN | DEFAULT false | Mode exclusif |
| **Niveau 5 : Acceptations** |
| `requires_terms` | BOOLEAN | DEFAULT false | Nécessite CGU acceptées |
| `requires_forum_rules` | BOOLEAN | DEFAULT false | Nécessite règlement accepté |

**Valeurs ENUM** :

`entity_type` :
- `'category'` - Catégorie
- `'section'` - Section
- `'topic'` - Topic

`operation` :
- `'view'` - Lecture
- `'create'` - Création
- `'update'` - Modification
- `'delete'` - Suppression

`role_level` :
- `'admin'` - Admin uniquement
- `'admin_moderator'` - Admin + Modérateur
- `'admin_moderator_gm'` - Admin + Modérateur + Game Master
- `'admin_moderator_player'` - Admin + Modérateur + Joueur
- `'admin_moderator_gm_player'` - Admin + Modérateur + GM + Joueur
- `'everyone'` - Tous (par défaut)

`character_requirement` :
- `'none'` - Aucune exigence (par défaut)
- `'alive'` - Personnage vivant requis
- `'clan_member'` - Membre du clan (+ `required_clan_id`)
- `'faction_member'` - Membre de la faction (+ `required_faction_id`)
- `'clan_leader'` - Leader du clan (+ `required_clan_id`)

**Relations** :
- `ForumPermission` polymorphe vers `Category`, `Section`, `Topic` (via `entity_type` + `entity_id`)

**Indexes** :
- `entity_type` + `entity_id` + `operation` (composite, recherche rapide)
- `required_faction_id` (FK)
- `required_clan_id` (FK)

**Logique d'évaluation** :
1. Vérifier `role_level` de l'utilisateur
2. Si échec, vérifier `allow_author` (si utilisateur = auteur)
3. Vérifier `character_requirement` (personnage vivant, membre clan/faction, leader)
4. Si `character_author_rule_enabled`, vérifier règle auteur RP
5. Vérifier `requires_terms` et `requires_forum_rules`

**Héritage** : Les permissions peuvent être héritées depuis l'entité parente (catégorie → section → topic).

---

## 📄 Modèles Contenu (content/)

### Home, Intro, Lore

Tables pour le contenu dynamique des pages statiques du portail.

**Tables** : `homes`, `intros`, `lores`

| Champ | Type | Contraintes | Description |
|-------|------|-------------|-------------|
| `id` | INTEGER | PK, AUTO_INCREMENT | ID unique |
| `content` | TEXT | NOT NULL | Contenu HTML/Markdown |
| `is_active` | BOOLEAN | DEFAULT true | Version active |

**Usage** :
- Une seule entrée active par table
- Permet mise à jour dynamique sans redéploiement
- Versionning possible (multiples entrées, une seule `is_active`)

---

## 🔗 Schéma des relations

```
User ──────┬─→ Character ──┬─→ Faction
           │               └─→ Clan ─→ Faction
           │
           ├─→ Topic ──────┬─→ Section ─┬─→ Category
           │               │            ├─→ Section (parent)
           │               │            ├─→ Faction
           │               │            └─→ Clan
           │               └─→ Post
           │
           └─→ Post ───────→ Topic

ForumPermission ──┬─→ Category (polymorphe)
                  ├─→ Section (polymorphe)
                  ├─→ Topic (polymorphe)
                  ├─→ Faction (required_faction_id)
                  └─→ Clan (required_clan_id)
```

---

## 🌱 Processus de seeding

### Seed Production (`npm run seed`)

**Fichier** : `backend/utils/seed.js`

**Contenu** :
1. ✅ Connexion à la BDD
2. ✅ Désactivation contraintes FK
3. ✅ `sync({ force: true })` - Suppression/recréation tables
4. ✅ Création **Factions** (3) :
   - Les Éclaireurs de l'Aube Nouvelle (mutants)
   - Les Veilleurs de l'Ancien Monde (non-mutants)
   - Clans Neutres
5. ✅ Création **Clans** (13 total) :
   - 5 castes mutantes
   - 5 clans non-mutants
   - 3 clans neutres
6. ✅ Création **Catégories forum** (3) :
   - Forum Général
   - Forum HRP (Hors RP)
   - Forum RP (Roleplay)
7. ✅ Création **Sections** principales (9 sections + 17 sous-sections)
8. ✅ Création **Topics** essentiels (CGU, règlement, bienvenue) avec premiers posts
9. ✅ Réactivation contraintes FK

**Données créées** :
- 3 factions
- 13 clans
- 3 catégories forum
- 26 sections (9 principales + 17 sous-sections)
- ~8 topics essentiels
- ~8 premiers posts

**Temps d'exécution** : ~2-3 secondes

**Usage** :
```bash
cd backend
npm run seed
```

---

### Seed Développement (`npm run seed:dev`)

**Fichier** : `backend/utils/seedDev.js`

**Contenu supplémentaire** :
1. ✅ Tout le contenu du seed production
2. ✅ Création **Utilisateurs de test** (6) :
   - `admin_test` (ADMIN) - Tous droits
   - `moderator_test` (MODERATOR) - Modération
   - `gm_test` (GAME_MASTER) - Maître du jeu
   - `player_mutant` (PLAYER) - Joueur mutant
   - `player_pure` (PLAYER) - Joueur pur (CGU non acceptées)
   - `player_neutral` (PLAYER) - Joueur neutre (règlement non accepté)
3. ✅ Création **Personnages de test** (6) :
   - Xarn le Symbiote (mutant, caste Symbiotes)
   - Lyra la Prophétesse (mutant, Prophètes de l'Harmonie)
   - Marcus le Sentinelle (non-mutant, clan Sentinelles)
   - Elena l'Archiviste (non-mutant, clan Archivistes)
   - Kael le Vagabond (neutre, Vagabonds du Vent)
   - Nyx l'Ombre (neutre, Peuple des Ombres)
4. ✅ Données forum complètes :
   - Topics de test variés (RP, HRP, annonces)
   - Posts de test avec différents auteurs
   - Sections privées avec accès restreint
5. ✅ Données de test pour permissions (permissions par défaut)

**Mot de passe tous comptes** : `password123`

**Données créées** :
- Tout le seed production
- 6 utilisateurs de test
- 6 personnages de test
- ~20-30 topics de test supplémentaires
- ~50-100 posts de test

**Temps d'exécution** : ~5-8 secondes

**Usage** :
```bash
cd backend
npm run seed:dev
```

---

### Structure des fichiers seed

```
backend/utils/
├── seed.js              # Script principal production
├── seedDev.js           # Script développement
└── seedData/            # Données modulaires
    ├── factions.js      # Données factions
    ├── clans.js         # Données clans
    └── forum.js         # Données forum (catégories, sections, topics)
```

**Avantages** :
- Séparation données/logique
- Réutilisabilité
- Maintenance facilitée
- Seed incrémental (prod → dev)

---

### Commandes utiles

```bash
# Seed production (données minimales)
cd backend && npm run seed

# Seed développement (données complètes)
cd backend && npm run seed:dev

# Accéder à MySQL
mysql -u root -p erosion_des_ames

# Voir les tables
SHOW TABLES;

# Compter les enregistrements
SELECT
  (SELECT COUNT(*) FROM users) AS users,
  (SELECT COUNT(*) FROM characters) AS characters,
  (SELECT COUNT(*) FROM factions) AS factions,
  (SELECT COUNT(*) FROM clans) AS clans,
  (SELECT COUNT(*) FROM categories) AS categories,
  (SELECT COUNT(*) FROM sections) AS sections,
  (SELECT COUNT(*) FROM topics) AS topics,
  (SELECT COUNT(*) FROM posts) AS posts,
  (SELECT COUNT(*) FROM forum_permissions) AS permissions;
```

---

**Dernière mise à jour** : 18 janvier 2025
