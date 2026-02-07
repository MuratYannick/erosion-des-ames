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

### Tables créées

| Table | Description |
|-------|-------------|
| `ethnicities` | Ethnies des personnages (Les Inaltérés, Les Éveillés) |
| `factions` | Factions rattachées à une ethnie (Veilleurs, Éclaireurs) |
| `clans` | Clans rattachés à une faction et/ou ethnie (9 clans) |

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

## 6.3 Frontend - TODO

### Services et Hooks
- [ ] `services/characterService.js` - Appels API
- [ ] `hooks/useCharacters.js` - Hook React

### Pages
- [ ] `pages/characters/CharacterList.jsx` - Liste de mes personnages
- [ ] `pages/characters/CharacterDetail.jsx` - Fiche détaillée
- [ ] `pages/characters/CharacterCreate.jsx` - Page création
- [ ] `pages/characters/CharacterEdit.jsx` - Page édition

### Composants
- [ ] `components/characters/CharacterCard.jsx` - Card preview
- [ ] `components/characters/CharacterSheet.jsx` - Fiche complète
- [ ] `components/characters/CharacterStatus.jsx` - Badge de statut
- [ ] `components/characters/CharacterAvatar.jsx` - Composant avatar

### Intégration Router
- [ ] Routes dans App.jsx
- [ ] Liens dans la navigation

---

## Notes techniques

- Les FK vers `users` sont de type UUID (users.id est UUID)
- Les FK vers ethnicities/factions/clans sont de type INTEGER
- Workflow d'approbation : draft -> pending -> approved/rejected
- Soft delete via `paranoid: true` (colonne deleted_at)
- Filtrage automatique par rôle : public voit uniquement active+approved, staff voit tout
- Seeders dev et prod indépendants (scripts séparés)
