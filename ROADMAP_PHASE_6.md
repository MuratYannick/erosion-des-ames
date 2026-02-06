# Phase 6: Système de personnages joueurs

**Branche**: `feature/phase-6-characters`

---

## Vue d'ensemble

Cette phase consiste à créer le système complet de gestion des personnages joueurs, incluant :
- Base de données avec modèles Sequelize
- API REST pour les opérations CRUD
- Interface frontend pour créer, visualiser et gérer ses personnages
- Formulaire multi-étapes pour la création de personnage
- Système de validation par les administrateurs (optionnel)

### Stack technique
- **Backend**: Express 5 + Sequelize ORM + MySQL
- **Frontend**: React 19 + TailwindCSS + React Router
- **Validation**: Joi (backend) + validation custom (frontend)
- **Upload**: Multer pour les avatars

---

## 6.1 Structure des fichiers Backend

```
backend/
├── models/
│   ├── Character.js              # Modèle principal personnage
│   ├── CharacterStats.js         # Stats optionnelles
│   └── index.js                  # Export et associations
├── migrations/
│   ├── XXXXXX-create-character.js
│   └── XXXXXX-create-character-stats.js
├── seeders/
│   └── XXXXXX-demo-characters.js
├── controllers/
│   └── characterController.js    # Logique métier
├── routes/
│   └── characters.js             # Routes API
├── validators/
│   └── characterValidator.js     # Validation Joi
└── uploads/
    └── avatars/                  # Stockage avatars
```

---

## 6.2 Modèle Character

### Schema de la table `characters`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| user_id | INTEGER | FK (users), NOT NULL | Propriétaire du personnage |
| name | VARCHAR(100) | NOT NULL, UNIQUE per user | Nom du personnage |
| avatar | VARCHAR(255) | NULL | Chemin vers l'image avatar |
| age | INTEGER | NULL | Âge du personnage |
| race | VARCHAR(50) | NOT NULL | Race (Humain, Elfe, etc.) |
| classe | VARCHAR(50) | NULL | Classe/métier du personnage |
| origin | VARCHAR(100) | NULL | Lieu d'origine |
| appearance | TEXT | NULL | Description physique |
| personality | TEXT | NULL | Traits de personnalité |
| background | TEXT | NULL | Histoire/passé du personnage |
| goals | TEXT | NULL | Objectifs et motivations |
| status | ENUM | DEFAULT 'draft' | draft, pending, approved, rejected |
| rejection_reason | TEXT | NULL | Raison du rejet (si rejeté) |
| is_active | BOOLEAN | DEFAULT true | Personnage actif/archivé |
| approved_at | DATETIME | NULL | Date d'approbation |
| approved_by | INTEGER | FK (users), NULL | Admin qui a approuvé |
| created_at | DATETIME | AUTO | Date de création |
| updated_at | DATETIME | AUTO | Date de modification |

### Character.js - Modèle Sequelize

```javascript
- [ ] Créer le modèle Character :
  - Définir tous les champs avec leurs types et validations
  - Hooks beforeCreate/beforeUpdate pour validation
  - Scopes : byUser, approved, pending, draft
  - Méthodes d'instance : approve(), reject(), archive()
  - Association belongsTo User
  - Association hasOne CharacterStats (optionnel)
```

### Statuts du personnage

| Statut | Description |
|--------|-------------|
| `draft` | Brouillon, en cours de création |
| `pending` | Soumis pour validation |
| `approved` | Validé par un admin, peut être utilisé en jeu |
| `rejected` | Rejeté, nécessite des modifications |

---

## 6.3 Modèle CharacterStats (optionnel)

### Schema de la table `character_stats`

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Identifiant unique |
| character_id | INTEGER | FK, UNIQUE, NOT NULL | Lien vers le personnage |
| strength | INTEGER | DEFAULT 10 | Force |
| dexterity | INTEGER | DEFAULT 10 | Dextérité |
| constitution | INTEGER | DEFAULT 10 | Constitution |
| intelligence | INTEGER | DEFAULT 10 | Intelligence |
| wisdom | INTEGER | DEFAULT 10 | Sagesse |
| charisma | INTEGER | DEFAULT 10 | Charisme |
| health_max | INTEGER | DEFAULT 100 | Points de vie max |
| health_current | INTEGER | DEFAULT 100 | Points de vie actuels |
| experience | INTEGER | DEFAULT 0 | Points d'expérience |
| level | INTEGER | DEFAULT 1 | Niveau |
| created_at | DATETIME | AUTO | Date de création |
| updated_at | DATETIME | AUTO | Date de modification |

```javascript
- [ ] Créer le modèle CharacterStats :
  - Définir les stats de base
  - Association belongsTo Character
  - Méthodes : calculateLevel(), heal(), takeDamage()
```

---

## 6.4 Migrations

### Migration create-character.js
- [ ] Créer la migration pour la table `characters` :
  - Tous les champs du schema
  - Index sur user_id
  - Index sur status
  - Contrainte UNIQUE sur (user_id, name)
  - Foreign key vers users

### Migration create-character-stats.js
- [ ] Créer la migration pour la table `character_stats` :
  - Tous les champs du schema
  - Foreign key vers characters (ON DELETE CASCADE)

---

## 6.5 Seeders

### Seeder demo-characters.js
- [ ] Créer des personnages de démonstration :
  - 2-3 personnages pour chaque utilisateur de test
  - Différents statuts (draft, pending, approved)
  - Données variées pour tester l'affichage

---

## 6.6 Routes API

### Routes CRUD de base

| Méthode | Route | Description | Auth | Rôle |
|---------|-------|-------------|------|------|
| GET | `/api/characters` | Liste tous les personnages approuvés | Optionnel | - |
| GET | `/api/characters/:id` | Détail d'un personnage | Optionnel | - |
| POST | `/api/characters` | Créer un personnage | Requis | User |
| PUT | `/api/characters/:id` | Modifier un personnage | Requis | Owner |
| DELETE | `/api/characters/:id` | Supprimer un personnage | Requis | Owner |
| GET | `/api/users/:id/characters` | Personnages d'un utilisateur | Optionnel | - |
| GET | `/api/me/characters` | Mes personnages | Requis | User |

### Routes de gestion

| Méthode | Route | Description | Auth | Rôle |
|---------|-------|-------------|------|------|
| POST | `/api/characters/:id/submit` | Soumettre pour validation | Requis | Owner |
| POST | `/api/characters/:id/approve` | Approuver un personnage | Requis | Admin/Mod |
| POST | `/api/characters/:id/reject` | Rejeter un personnage | Requis | Admin/Mod |
| POST | `/api/characters/:id/archive` | Archiver un personnage | Requis | Owner |
| POST | `/api/characters/:id/avatar` | Upload avatar | Requis | Owner |

### Implémentation

```javascript
- [ ] Créer characterController.js :
  - getAll(req, res) - Liste paginée avec filtres
  - getById(req, res) - Détail avec stats
  - create(req, res) - Création avec validation
  - update(req, res) - Modification partielle
  - delete(req, res) - Suppression (soft delete?)
  - getByUser(req, res) - Personnages d'un user
  - getMyCharacters(req, res) - Mes personnages
  - submit(req, res) - Soumettre pour validation
  - approve(req, res) - Approuver (admin)
  - reject(req, res) - Rejeter avec raison (admin)
  - archive(req, res) - Archiver
  - uploadAvatar(req, res) - Upload image

- [ ] Créer routes/characters.js :
  - Définir toutes les routes
  - Appliquer middlewares auth/authorize
  - Appliquer validation
```

### Validation des données

```javascript
- [ ] Créer characterValidator.js :
  - createSchema : validation création
  - updateSchema : validation modification
  - Règles :
    - name: 2-100 chars, alphanumérique + espaces
    - age: 1-999
    - race: liste prédéfinie ou libre
    - classe: liste prédéfinie ou libre
    - appearance: max 2000 chars
    - background: max 5000 chars
```

---

## 6.7 Structure des fichiers Frontend

```
frontend/src/
├── pages/
│   └── characters/
│       ├── CharacterList.jsx       # Liste de mes personnages
│       ├── CharacterDetail.jsx     # Fiche détaillée
│       ├── CharacterCreate.jsx     # Page création (wizard)
│       ├── CharacterEdit.jsx       # Page édition
│       ├── CharacterGallery.jsx    # Galerie publique (optionnel)
│       └── index.js
├── components/
│   └── characters/
│       ├── CharacterCard.jsx       # Card preview personnage
│       ├── CharacterCard.css
│       ├── CharacterSheet.jsx      # Fiche complète
│       ├── CharacterSheet.css
│       ├── CharacterForm/
│       │   ├── CharacterForm.jsx   # Formulaire multi-étapes
│       │   ├── CharacterForm.css
│       │   ├── StepIdentity.jsx    # Étape 1: Identité
│       │   ├── StepAppearance.jsx  # Étape 2: Apparence
│       │   ├── StepBackground.jsx  # Étape 3: Histoire
│       │   ├── StepReview.jsx      # Étape 4: Récapitulatif
│       │   ├── FormProgress.jsx    # Indicateur de progression
│       │   └── index.js
│       ├── CharacterAvatar.jsx     # Composant avatar avec upload
│       ├── CharacterStatus.jsx     # Badge de statut
│       ├── CharacterStats.jsx      # Affichage des stats
│       └── index.js
├── hooks/
│   └── useCharacters.js            # Hook pour API characters
└── services/
    └── characterService.js         # Appels API
```

---

## 6.8 Pages Frontend

### CharacterList.jsx - Liste de mes personnages
- [ ] Créer la page liste :
  - Afficher tous mes personnages (cards)
  - Filtrer par statut (tous, brouillons, en attente, approuvés)
  - Tri par date, nom
  - Bouton "Créer un personnage"
  - Actions rapides (éditer, supprimer, soumettre)
  - Message si aucun personnage
  - Responsive grid (1-2-3 colonnes)

### CharacterDetail.jsx - Fiche détaillée
- [ ] Créer la page détail :
  - Affichage complet de la fiche
  - Avatar en grand
  - Toutes les informations
  - Stats si disponibles
  - Actions si propriétaire (éditer, supprimer)
  - Badge de statut
  - Historique des modifications (optionnel)

### CharacterCreate.jsx - Création
- [ ] Créer la page création :
  - Intégrer le formulaire multi-étapes
  - Sauvegarde automatique en brouillon
  - Navigation entre étapes
  - Validation avant soumission

### CharacterEdit.jsx - Édition
- [ ] Créer la page édition :
  - Charger les données existantes
  - Même formulaire que création
  - Préserver le statut si brouillon
  - Repasser en brouillon si modifié après approbation?

### CharacterGallery.jsx - Galerie publique (optionnel)
- [ ] Créer la galerie :
  - Tous les personnages approuvés
  - Filtres par race, classe
  - Recherche par nom
  - Pagination
  - Vue carte ou liste

---

## 6.9 Composants Frontend

### CharacterCard.jsx
- [ ] Créer le composant card :
  - Props : character, onEdit, onDelete, onSubmit, showActions
  - Affichage : avatar, nom, race, classe, statut
  - Design tribal cohérent
  - Hover effects
  - Actions en overlay ou dropdown

### CharacterSheet.jsx
- [ ] Créer la fiche complète :
  - Props : character, editable
  - Layout type "fiche de JDR"
  - Sections : identité, apparence, histoire, stats
  - Design parchemin/tribal
  - Responsive

### CharacterAvatar.jsx
- [ ] Créer le composant avatar :
  - Props : src, onUpload, editable, size
  - Preview de l'image
  - Upload avec AvatarUpload existant
  - Placeholder tribal si pas d'image
  - Crop circulaire ou carré

### CharacterStatus.jsx
- [ ] Créer le badge de statut :
  - Props : status
  - Couleurs : draft (gris), pending (orange), approved (vert), rejected (rouge)
  - Icône + texte
  - Tooltip avec détails

---

## 6.10 CharacterForm - Formulaire multi-étapes

### Structure du wizard

```
Étape 1: Identité
├── Nom du personnage
├── Âge
├── Race (select)
├── Classe (select)
└── Origine

Étape 2: Apparence
├── Avatar (upload)
├── Description physique (textarea)
└── Traits distinctifs

Étape 3: Histoire
├── Background / Histoire (rich text)
├── Personnalité (textarea)
├── Objectifs et motivations (textarea)
└── Secrets (optionnel, visible uniquement par MJ)

Étape 4: Récapitulatif
├── Preview de la fiche complète
├── Vérification des champs requis
├── Choix : Sauvegarder brouillon / Soumettre pour validation
└── Conditions d'utilisation
```

### CharacterForm.jsx
- [ ] Créer le formulaire wizard :
  - State : currentStep, formData, errors, isDirty
  - Navigation : next, previous, goToStep
  - Validation par étape
  - Sauvegarde auto en localStorage (brouillon)
  - API save draft / submit
  - Animation de transition entre étapes

### FormProgress.jsx
- [ ] Créer l'indicateur de progression :
  - Affiche les 4 étapes
  - Étape actuelle mise en évidence
  - Étapes complétées avec checkmark
  - Cliquable pour navigation directe
  - Design tribal (runes, symboles)

### StepIdentity.jsx
- [ ] Créer l'étape identité :
  - Champs : name, age, race, classe, origin
  - Validation : name requis, age optionnel mais valide
  - Select pour race avec options prédéfinies
  - Select pour classe avec options prédéfinies
  - Possibilité de saisie libre (autre)

### StepAppearance.jsx
- [ ] Créer l'étape apparence :
  - Upload avatar avec preview
  - Textarea pour description physique
  - Compteur de caractères
  - Suggestions/prompts pour aider

### StepBackground.jsx
- [ ] Créer l'étape histoire :
  - RichTextEditor pour le background
  - Textarea pour personnalité
  - Textarea pour objectifs
  - Conseils d'écriture

### StepReview.jsx
- [ ] Créer l'étape récapitulatif :
  - Affichage complet type CharacterSheet
  - Liste des erreurs/champs manquants
  - Checkbox acceptation des règles
  - Boutons : Sauvegarder brouillon / Soumettre

---

## 6.11 Services et Hooks

### characterService.js
- [ ] Créer le service API :
  ```javascript
  - getAll(params) - Liste avec filtres/pagination
  - getById(id) - Détail
  - getMyCharacters() - Mes personnages
  - create(data) - Créer
  - update(id, data) - Modifier
  - delete(id) - Supprimer
  - submit(id) - Soumettre pour validation
  - uploadAvatar(id, file) - Upload avatar
  ```

### useCharacters.js
- [ ] Créer le hook :
  ```javascript
  - characters - Liste des personnages
  - isLoading - État de chargement
  - error - Erreur éventuelle
  - fetchCharacters(params) - Charger la liste
  - createCharacter(data) - Créer
  - updateCharacter(id, data) - Modifier
  - deleteCharacter(id) - Supprimer
  - submitCharacter(id) - Soumettre
  ```

---

## 6.12 Intégration Router

### Routes à ajouter dans App.jsx

```jsx
// Routes publiques
<Route path="/personnages" element={<CharacterGallery />} />
<Route path="/personnages/:id" element={<CharacterDetail />} />

// Routes protégées
<Route path="/mes-personnages" element={
  <ProtectedRoute>
    <CharacterList />
  </ProtectedRoute>
} />
<Route path="/mes-personnages/nouveau" element={
  <ProtectedRoute>
    <CharacterCreate />
  </ProtectedRoute>
} />
<Route path="/mes-personnages/:id/editer" element={
  <ProtectedRoute>
    <CharacterEdit />
  </ProtectedRoute>
} />
```

---

## Ordre de réalisation suggéré

### Backend (Priorité 1)
1. [ ] Modèle Character + migration
2. [ ] Modèle CharacterStats + migration (optionnel)
3. [ ] Seeders avec données de test
4. [ ] Validators (Joi)
5. [ ] Controller avec toutes les méthodes
6. [ ] Routes avec middlewares
7. [ ] Tests API

### Frontend - Base (Priorité 2)
8. [ ] characterService.js
9. [ ] useCharacters.js hook
10. [ ] CharacterCard composant
11. [ ] CharacterStatus composant
12. [ ] CharacterList page

### Frontend - Détail (Priorité 3)
13. [ ] CharacterSheet composant
14. [ ] CharacterDetail page
15. [ ] CharacterAvatar composant

### Frontend - Création (Priorité 4)
16. [ ] FormProgress composant
17. [ ] StepIdentity composant
18. [ ] StepAppearance composant
19. [ ] StepBackground composant
20. [ ] StepReview composant
21. [ ] CharacterForm wizard
22. [ ] CharacterCreate page
23. [ ] CharacterEdit page

### Intégration (Priorité 5)
24. [ ] Routes dans App.jsx
25. [ ] Liens dans la navigation
26. [ ] Tests end-to-end

---

## Critères de validation

### Backend
- [ ] Toutes les routes API fonctionnent
- [ ] Validation des données correcte
- [ ] Permissions respectées (owner, admin)
- [ ] Upload avatar fonctionne
- [ ] Pagination fonctionnelle

### Frontend
- [ ] Liste des personnages s'affiche
- [ ] Création de personnage complète
- [ ] Édition fonctionne
- [ ] Suppression avec confirmation
- [ ] Upload avatar fonctionne
- [ ] Formulaire multi-étapes fluide
- [ ] Sauvegarde brouillon fonctionne
- [ ] Responsive sur mobile

### UX
- [ ] Messages de succès/erreur clairs
- [ ] Chargement indiqué (loaders)
- [ ] Navigation intuitive
- [ ] Design tribal cohérent

---

## Données de référence

### Races suggérées
- Humain
- Elfe
- Nain
- Orc
- Demi-elfe
- Halfelin
- Autre (saisie libre)

### Classes suggérées
- Guerrier
- Mage
- Voleur
- Prêtre
- Ranger
- Barde
- Paladin
- Druide
- Autre (saisie libre)

---

## Notes techniques

- Utiliser les composants de formulaire existants (Phase 4)
- Respecter le design system tribal
- Prévoir la gestion des erreurs avec les pages d'erreur (Phase 5)
- Utiliser l'intercepteur Axios pour les appels API
- Penser à l'accessibilité (ARIA, navigation clavier)
- Optimiser les images avatar (compression, dimensions max)

---

## Tests à effectuer

### Tests Backend
1. Créer un personnage (tous les champs)
2. Créer un personnage (champs minimum)
3. Modifier un personnage
4. Supprimer un personnage
5. Lister mes personnages
6. Soumettre pour validation
7. Approuver/Rejeter (admin)
8. Upload avatar
9. Permissions (ne pas modifier le personnage d'un autre)

### Tests Frontend
1. Afficher la liste vide
2. Créer un personnage étape par étape
3. Sauvegarder en brouillon
4. Reprendre un brouillon
5. Soumettre pour validation
6. Voir le statut changer
7. Éditer un personnage existant
8. Supprimer avec confirmation
9. Responsive mobile
10. Navigation entre pages
