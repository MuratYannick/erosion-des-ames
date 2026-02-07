# Phase 6: Système de personnages joueurs

**Branche**: `feature/phase-6-characters`

---

## Vue d'ensemble

Cette phase consiste à créer le système complet de gestion des personnages joueurs, incluant :
- Tables de référence (ethnies, factions, clans)
- Table des personnages avec modèle Sequelize
- API REST pour les opérations CRUD et workflow d'approbation
- Interface frontend pour créer, visualiser et gérer ses personnages

### Stack technique
- **Backend**: Express + Sequelize ORM + MySQL
- **Frontend**: React + TailwindCSS + React Router
- **Validation**: express-validator (backend)

---

## 6.1 Tables de référence (pré-requis) - DONE

### Schema de la table `ethnicities`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| name | VARCHAR(50) | NOT NULL, UNIQUE | Nom de l'ethnie |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de modification |
| deleted_at | DATETIME | NULL | Soft delete (paranoid) |

### Schema de la table `factions`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| ethnicity_id | INTEGER | FK (ethnicities), NOT NULL, ON DELETE RESTRICT | Ethnie de la faction |
| name | VARCHAR(50) | NOT NULL, UNIQUE | Nom de la faction |
| emblem | VARCHAR(255) | NULL | Chemin vers l'emblème |
| is_playable | BOOLEAN | NOT NULL, DEFAULT false | Faction jouable |
| background | TEXT | NULL | Histoire de la faction |
| goals | TEXT | NULL | Objectifs de la faction |
| status | ENUM | NOT NULL, DEFAULT 'draft' | draft, pending, approved, rejected |
| rejection_reason | TEXT | NULL | Raison du rejet |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Faction active/archivée |
| approved_at | DATETIME | NULL | Date d'approbation |
| approved_by | UUID | FK (users), NULL, ON DELETE SET NULL | Staff qui a approuvé |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de modification |
| deleted_at | DATETIME | NULL | Soft delete (paranoid) |

### Schema de la table `clans`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| ethnicity_id | INTEGER | FK (ethnicities), NULL, ON DELETE SET NULL | Ethnie du clan, NULL si mixte |
| faction_id | INTEGER | FK (factions), NULL, ON DELETE SET NULL | Faction du clan, NULL si neutre |
| name | VARCHAR(50) | NOT NULL, UNIQUE | Nom du clan |
| emblem | VARCHAR(255) | NULL | Chemin vers l'emblème |
| is_playable | BOOLEAN | NOT NULL, DEFAULT false | Clan jouable |
| background | TEXT | NULL | Histoire du clan |
| goals | TEXT | NULL | Objectifs du clan |
| status | ENUM | NOT NULL, DEFAULT 'draft' | draft, pending, approved, rejected |
| rejection_reason | TEXT | NULL | Raison du rejet |
| is_active | BOOLEAN | NOT NULL, DEFAULT true | Clan actif/archivé |
| approved_at | DATETIME | NULL | Date d'approbation |
| approved_by | UUID | FK (users), NULL, ON DELETE SET NULL | Staff qui a approuvé |
| created_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de création |
| updated_at | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Date de modification |
| deleted_at | DATETIME | NULL | Soft delete (paranoid) |

### Fichiers Backend

#### Migrations
- [x] `migrations/20260207100000-create-ethnicities.js`
- [x] `migrations/20260207100001-create-factions.js`
- [x] `migrations/20260207100002-create-clans.js`

#### Modèles
- [x] `models/Ethnicity.js` - Modèle simple, hasMany Faction/Clan
- [x] `models/Faction.js` - Scopes (active/approved/pending/draft/playable), instance methods (approve/reject/archive), belongsTo Ethnicity/User
- [x] `models/Clan.js` - Même structure que Faction, FK nullable (ethnicity, faction)

#### Validators
- [x] `validators/ethnicityValidators.js` - create/update
- [x] `validators/factionValidators.js` - create/update/reject
- [x] `validators/clanValidators.js` - create/update/reject

#### Controllers
- [x] `controllers/ethnicityController.js` - CRUD simple
- [x] `controllers/factionController.js` - CRUD + workflow (submit/approve/reject), filtrage par rôle
- [x] `controllers/clanController.js` - Même structure que factionController

#### Routes
- [x] `routes/ethnicities.js` - GET public, POST/PUT ADMIN+MODERATOR, DELETE ADMIN
- [x] `routes/factions.js` - GET optionalAuth, CRUD ADMIN+MODERATOR+GAME_MASTER, approve/reject ADMIN+MODERATOR
- [x] `routes/clans.js` - Même schéma que factions

#### Seeders
- [x] `seeders/seed-test-x1-ethnicities.js` (dev)
- [x] `seeders/seed-test-x2-factions.js` (dev)
- [x] `seeders/seed-test-x3-clans.js` (dev)
- [x] `seeders/production/seed-prod-01-ethnicities.js` (prod)
- [x] `seeders/production/seed-prod-02-factions.js` (prod)
- [x] `seeders/production/seed-prod-03-clans.js` (prod)

---

## 6.2 Modèle Character - DONE

### Schema de la table `characters`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| user_id | UUID | FK (users), NULL | Propriétaire, NULL si NPC staff |
| ethnicity_id | INTEGER | FK (ethnicities), NOT NULL | Ethnie du personnage |
| faction_id | INTEGER | FK (factions), NULL | Faction, NULL si neutre |
| clan_id | INTEGER | FK (clans), NULL | Clan, NULL si sans clan |
| name | VARCHAR(50) | NOT NULL, UNIQUE | Nom du personnage |
| avatar | VARCHAR(255) | NULL | Chemin vers l'image avatar |
| age | INTEGER | NULL | Âge du personnage |
| appearance | TEXT | NULL | Description physique |
| personality | TEXT | NULL | Traits de personnalité |
| background | TEXT | NULL | Histoire/passé du personnage |
| goals | TEXT | NULL | Objectifs et motivations |
| status | ENUM | DEFAULT 'draft' | draft, pending, approved, rejected |
| rejection_reason | TEXT | NULL | Raison du rejet |
| is_active | BOOLEAN | DEFAULT true | Personnage actif/archivé |
| approved_at | DATETIME | NULL | Date d'approbation |
| approved_by | UUID | FK (users), NULL | Staff qui a approuvé |
| created_at | DATETIME | AUTO | Date de création |
| updated_at | DATETIME | AUTO | Date de modification |
| deleted_at | DATETIME | NULL | Soft delete (paranoid) |

### Statuts du personnage

| Statut | Description |
|--------|-------------|
| `draft` | Brouillon, en cours de création |
| `pending` | Soumis pour validation |
| `approved` | Validé par le staff, peut être utilisé en jeu |
| `rejected` | Rejeté, nécessite des modifications |

### Fichiers Backend

#### Migration & Modèle
- [x] `migrations/20260207100003-create-characters.js` - 7 index (user_id, ethnicity_id, faction_id, clan_id, status, is_active, approved_by)
- [x] `models/Character.js` - Scopes (active/approved/pending/draft/playersCharacters), instance methods (approve/reject/archive), 5 associations

#### Validator, Controller, Routes
- [x] `validators/characterValidators.js` - create/update/reject
- [x] `controllers/characterController.js` - CRUD + workflow (submit/approve/reject), filtrage par rôle, vérification FK
- [x] `routes/characters.js` - GET optionalAuth, CRUD staff, approve/reject ADMIN+MODERATOR

#### Routes API

| Méthode | Route | Auth | Rôle |
|---------|-------|------|------|
| GET | `/api/characters` | optionalAuth | Public (active+approved) / Staff (tous+filtres) |
| GET | `/api/characters/:id` | optionalAuth | Idem |
| POST | `/api/characters` | Requis | ADMIN, MODERATOR, GAME_MASTER |
| PUT | `/api/characters/:id` | Requis | ADMIN, MODERATOR, GAME_MASTER |
| PATCH | `/api/characters/:id/submit` | Requis | ADMIN, MODERATOR, GAME_MASTER |
| PATCH | `/api/characters/:id/approve` | Requis | ADMIN, MODERATOR |
| PATCH | `/api/characters/:id/reject` | Requis | ADMIN, MODERATOR |
| DELETE | `/api/characters/:id` | Requis | ADMIN |

#### Seeders
- [x] `seeders/seed-test-x4-characters.js` (dev) - 4 personnages test
- [x] `seeders/production/seed-prod-04-characters.js` (prod) - 1 NPC staff

#### Montage routes
- [x] `routes/index.js` - Mounts: /ethnicities, /factions, /clans, /characters

---

## 6.3 Frontend - DONE

### Services et Hooks
- [x] `services/characterService.js` - Appels API (CRUD + workflow)
- [x] `services/referenceService.js` - Données de référence (ethnies, factions, clans)
- [x] `hooks/useCharacters.js` - 10 hooks React (useCharacters, useCharacter, useMyCharacters, useCreateCharacter, useUpdateCharacter, useSubmitCharacter, useApproveCharacter, useRejectCharacter, useDeleteCharacter, useReferenceData)

### Pages (`pages/MyCharacters/`)
- [x] `MyCharactersList.jsx` - Liste des personnages avec filtres, stats, CTA, modal de suppression
- [x] `MyCharacterDetail.jsx` - Fiche détaillée avec bannière de statut, actions, CharacterSheet
- [x] `MyCharacterCreate.jsx` - Formulaire multi-sections avec barre de progression
- [x] `MyCharacterEdit.jsx` - Édition pré-remplie (draft/rejected uniquement)

### Composants (`components/characters/`)
- [x] `CharacterCard.jsx` - Card avec avatar, statut, actions contextuelles
- [x] `CharacterSheet.jsx` - Fiche complète style parchemin (4 sections)
- [x] `CharacterStatusBadge.jsx` - Badge de statut (draft/pending/approved/rejected)
- [x] `CharacterAvatar.jsx` - Avatar hexagonal avec glow de faction

### Intégration Router
- [x] Routes dans App.jsx (`/mes-personnages`, `/mes-personnages/creer`, `/mes-personnages/:id`, `/mes-personnages/:id/modifier`)
- [x] Liens dans la navigation (déjà existants dans Header.jsx)

### Routes Frontend

| Route | Composant | Auth |
|-------|-----------|------|
| `/mes-personnages` | MyCharactersList | ProtectedRoute |
| `/mes-personnages/creer` | MyCharacterCreate | ProtectedRoute |
| `/mes-personnages/:id` | MyCharacterDetail | ProtectedRoute |
| `/mes-personnages/:id/modifier` | MyCharacterEdit | ProtectedRoute |

---

## Notes techniques

- Les FK vers `users` sont de type UUID (users.id est UUID)
- Les FK vers ethnicities/factions/clans sont de type INTEGER
- Workflow d'approbation : draft -> pending -> approved/rejected
- Soft delete via `paranoid: true` (colonne deleted_at)
- Filtrage automatique par rôle : public voit uniquement active+approved, staff voit tout
- Seeders dev et prod indépendants (scripts séparés)
