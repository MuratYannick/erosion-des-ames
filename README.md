# L'Érosion des Âmes

Jeu de rôle post-apocalyptique en ligne où mutants et non-mutants s'affrontent dans un monde dévasté par le cataclysme.

> **🆕 Dernières mises à jour** :
> - **🔧 Amélioration gestion des sections et topics** : Validation avancée des noms et slugs
>   - **Sections** :
>     - Empêche la création de sections avec le même nom au même niveau (même parent direct ou catégorie)
>     - Validation lors de la création, édition et déplacement de sections
>     - Génération automatique de slugs uniques avec suffixe incrémental (`section-1`, `section-2`, etc.)
>     - Soft-delete avec vidage du slug pour permettre la réutilisation après suppression
>   - **Topics** :
>     - Empêche la création de topics avec le même titre dans la même section
>     - Validation lors de la création, édition et déplacement de topics
>     - Génération automatique de slugs uniques avec suffixe incrémental (`topic-1`, `topic-2`, etc.)
>     - Soft-delete avec vidage du slug pour permettre la réutilisation après suppression
>     - Empêche le déplacement d'un topic vers une section contenant déjà un topic avec le même titre
>   - Messages d'erreur explicites : "Une section avec ce nom existe déjà au même niveau" / "Un topic avec ce titre existe déjà dans cette section"
> - **📜 Système d'acceptation du règlement du forum** : Implémentation complète en parallèle des CGU
>   - Ajout de `forum_rules_accepted` et `forum_rules_accepted_at` dans le modèle User
>   - Nouvelle route `POST /api/auth/accept-forum-rules` pour accepter le règlement
>   - Fonction `acceptForumRules()` dans AuthContext avec mise à jour du state utilisateur
>   - 4 nouveaux composants UI : ForumRulesAcceptance, ForumRulesAcceptanceBox, ForumRulesGuard, ForumRulesModal
>   - Règlement complet en 7 sections : respect, contenu, organisation, roleplay, modération, signalement, modifications
>   - Bandeau d'alerte sur toutes les pages forum (ForumGeneralPage, ForumCategoryPage, ForumTopicPage)
>   - Boîte d'acceptation dédiée sur le topic du règlement (slug: "reglement")
>   - Mise à jour du seedDev avec données de test (player_neutral n'a pas accepté le règlement)
> - **🔐 Correction authentification forum** : Refactorisation complète de la gestion des tokens JWT
>   - Nouvelle fonction `authenticatedFetch` dans `AuthContext` pour centraliser toutes les requêtes authentifiées
>   - Déconnexion automatique en cas de token invalide/expiré (erreur 401)
>   - Mise à jour de tous les formulaires forum (7 composants) pour utiliser `authenticatedFetch`
>   - Mise à jour des pages forum (ForumTopicPage, ForumSectionPage, ForumCategoryPage)
>   - **Fix critique** : L'utilisateur n'est plus déconnecté lors des opérations CRUD sur le forum

## 📖 Description

Dans un monde ravagé par un mystérieux cataclysme, l'humanité s'est scindée en deux factions ennemies : les **Éveillés** (mutants) et les **Purs** (non-mutants). Entre eux, des **clans neutres** tentent de survivre en refusant de prendre parti. Ce jeu de rôle textuel propose une expérience immersive dans un univers post-apocalyptique sombre et hostile.

## 🌍 Univers du jeu

### Les Factions

#### Les Éveillés (Mutants)
- **Base** : L'Oasis des Transformés
- **Idéologie** : Évolution naturelle, purification de la terre par la nature
- **Organisation** : 5 castes spécialisées (Symbiotes, Sensitifs, Forgerons de Chair, Sentinelles du Chaos, Scrutateurs)

#### Les Purs (Non-Mutants)
- **Base** : La Citadelle Inaltérée
- **Idéologie** : Préservation de l'humanité, restauration par la technologie
- **Organisation** : 5 clans hiérarchisés (Sentinelles, Pourvoyeurs, Archivistes, Purificateurs, Explorateurs)

#### Clans Neutres
- Groupes indépendants refusant le conflit
- Exemples : Veilleurs des Ruines, Vagabonds du Vent, Artisans du Réemploi

### Environnement Hostile

- **Faune mutée** : Stridents (canidés soniques), Fouisseurs (rongeurs géants), Écorcheurs (prédateurs aériens)
- **Flore mutée** : Vigne Étreignante, Arbre Cendré, Champignon Pulsant
- **Dangers** : Zones radioactives, ruines instables, créatures hostiles

## 🛠️ Technologies utilisées

### Frontend
- **Framework** : React 19.1.1
- **Build Tool** : Vite 7.1.7
- **Routing** : React Router 7.9.3
- **Styling** : TailwindCSS 3.4.18
- **CSS Processing** : PostCSS 8.5.6 + Autoprefixer 10.4.21
- **Langage** : JavaScript (ES6+)

### Backend
- **Runtime** : Node.js 22.19.0
- **Framework** : Express 5.1.0
- **ORM** : Sequelize 6.37.7
- **Base de données** : MySQL 8.0+ (driver mysql2 3.15.1)
- **Authentification** : 
  - JWT : jsonwebtoken 9.0.2
  - Hash : bcryptjs 3.0.2
- **CORS** : cors 2.8.5
- **Variables d'environnement** : dotenv 17.2.3
- **Dev Tool** : nodemon 3.1.10
- **Langage** : JavaScript (ES Modules)

### Outils de développement
- **Version Control** : Git 2.51.0
- **Package Manager** : npm 11.6.0
- **IDE** : VS Code 1.104
- **Linting** : ESLint 9.36.0
- **API Testing** : Postman / Thunder Client

## 📁 Architecture du projet

```
erosion-des-ames/
├── .vscode/
│   └── settings.json             # Configuration VS Code (TailwindCSS)
├── frontend/                     # Application React
│   ├── public/
│   │   ├── images/               # Images (bannière)
│   │   ├── illustrations/        # Illustrations (feu de camp)
│   │   ├── logos/                # Logo du jeu
│   │   └── masks/                # Masques pour effets visuels
│   ├── src/
│   │   ├── components/
│   │   │   ├── layouts/          # Composants de mise en page
│   │   │   │   ├── PortalLayout.jsx    # Layout portail (pages statiques)
│   │   │   │   ├── PortalHeader.jsx    # En-tête portail avec navigation
│   │   │   │   ├── PortalBody.jsx      # Corps portail
│   │   │   │   ├── PortalFooter.jsx    # Pied de page portail
│   │   │   │   ├── ForumLayout.jsx     # Layout forum
│   │   │   │   ├── ForumHeader.jsx     # En-tête forum avec UserBar
│   │   │   │   ├── ForumBody.jsx       # Corps forum (styles unifiés)
│   │   │   │   └── ForumFooter.jsx     # Pied de page forum
│   │   │   ├── forum/            # Composants spécifiques au forum
│   │   │   │   ├── CreateSectionForm.jsx   # Formulaire création section
│   │   │   │   ├── EditSectionForm.jsx     # Formulaire édition section
│   │   │   │   ├── MoveSectionForm.jsx     # Formulaire déplacement section
│   │   │   │   ├── CreateTopicForm.jsx     # Formulaire création topic
│   │   │   │   ├── EditTopicForm.jsx       # Formulaire édition topic
│   │   │   │   ├── MoveTopicForm.jsx       # Formulaire déplacement topic
│   │   │   │   ├── CreatePostForm.jsx      # Formulaire réponse (post)
│   │   │   │   └── MovePostForm.jsx        # Formulaire déplacement post
│   │   │   └── ui/               # Composants UI réutilisables
│   │   │       ├── BurgerButton.jsx        # Menu hamburger
│   │   │       ├── BurgerPanel.jsx         # Panneau mobile
│   │   │       ├── Navbar.jsx              # Navigation desktop
│   │   │       ├── ConnectBar.jsx          # Barre connexion/inscription
│   │   │       ├── UserBar.jsx             # Barre utilisateur forum
│   │   │       ├── PrimaryButton.jsx       # Bouton principal
│   │   │       ├── SecondaryButton.jsx     # Bouton secondaire
│   │   │       ├── Card.jsx                # Carte de contenu (modulaire)
│   │   │       ├── InputField.jsx          # Champ de formulaire réutilisable
│   │   │       ├── CloseButton.jsx         # Bouton fermeture (X)
│   │   │       ├── Aside.jsx               # Barre latérale
│   │   │       ├── Breadcrumb.jsx          # Fil d'Ariane
│   │   │       ├── Modal.jsx               # Modal réutilisable
│   │   │       ├── ConfirmDialog.jsx       # Dialogue de confirmation
│   │   │       ├── TermsAcceptance.jsx     # Alerte CGU (wrapper)
│   │   │       ├── TermsAcceptanceBox.jsx  # Boîte d'acceptation CGU
│   │   │       ├── TermsGuard.jsx          # Protection routes par CGU
│   │   │       ├── TermsModal.jsx          # Modal CGU
│   │   │       ├── ForumRulesAcceptance.jsx     # Alerte règlement forum
│   │   │       ├── ForumRulesAcceptanceBox.jsx  # Boîte d'acceptation règlement
│   │   │       ├── ForumRulesGuard.jsx          # Protection routes par règlement
│   │   │       └── ForumRulesModal.jsx          # Modal règlement forum
│   │   ├── pages/
│   │   │   ├── HomePage.jsx              # Page d'accueil
│   │   │   ├── IntroPage.jsx             # Page d'introduction
│   │   │   ├── LorePage.jsx              # Page lore/univers
│   │   │   ├── RulesPage.jsx             # Page règles
│   │   │   ├── WikiPage.jsx              # Page wiki
│   │   │   ├── LoginPage.jsx             # Page de connexion
│   │   │   ├── RegisterPage.jsx          # Page d'inscription
│   │   │   ├── ForumGeneralPage.jsx      # Vue générale forum (sections)
│   │   │   ├── ForumCategoryPage.jsx     # Vue catégorie
│   │   │   ├── ForumSectionPage.jsx      # Vue section (topics)
│   │   │   └── ForumTopicPage.jsx        # Vue topic (posts)
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx           # Contexte d'authentification
│   │   ├── App.jsx               # Composant principal avec routes
│   │   ├── index.css             # Styles TailwindCSS
│   │   └── main.jsx              # Point d'entrée
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js        # Configuration TailwindCSS personnalisée
│   └── vite.config.js            # Configuration Vite
│
├── backend/                      # API Express
│   ├── config/
│   │   └── database.js           # Configuration Sequelize/MySQL
│   ├── controllers/
│   │   ├── authController.js     # Authentification & profil (+ acceptTerms, acceptForumRules)
│   │   ├── characterController.js # Gestion des personnages
│   │   ├── clanController.js     # Gestion des clans
│   │   ├── factionController.js  # Gestion des factions
│   │   ├── forumController.js    # Ancien contrôleur monolithique (deprecated)
│   │   └── forum/                # Contrôleurs forum modulaires
│   │       ├── categoryController.js  # Gestion des catégories
│   │       ├── sectionController.js   # Gestion des sections
│   │       ├── topicController.js     # Gestion des topics
│   │       └── postController.js      # Gestion des posts
│   ├── middleware/
│   │   └── authMiddleware.js     # Protection des routes (JWT)
│   ├── models/
│   │   ├── game/                 # Modèles du jeu
│   │   │   ├── User.js           # Utilisateur (+ terms_accepted + forum_rules_accepted)
│   │   │   ├── Character.js      # Personnage
│   │   │   ├── Faction.js        # Faction
│   │   │   └── Clan.js           # Clan/Caste
│   │   ├── forum/                # Modèles du forum
│   │   │   ├── Category.js       # Catégorie forum
│   │   │   ├── Section.js        # Section (hiérarchique avec sous-sections)
│   │   │   ├── Topic.js          # Sujet de discussion
│   │   │   └── Post.js           # Message dans un topic
│   │   ├── content/              # Modèles de contenu statique
│   │   │   ├── Home.js           # Contenu page d'accueil
│   │   │   ├── Intro.js          # Contenu page d'introduction
│   │   │   └── Lore.js           # Contenu page lore
│   │   └── index.js              # Relations entre modèles
│   ├── routes/
│   │   ├── authRoutes.js         # Routes authentification
│   │   ├── characterRoutes.js    # Routes personnages
│   │   ├── clanRoutes.js         # Routes clans
│   │   ├── factionRoutes.js      # Routes factions
│   │   ├── portalRoutes.js       # Routes portail (intro, lore, etc.)
│   │   └── forumRoutes.js        # Routes forum
│   ├── utils/
│   │   ├── auth.js               # Utilitaires JWT/bcrypt
│   │   ├── seed.js               # Script de seeding production
│   │   └── seedDev.js            # Script de seeding développement (+ forum)
│   ├── .env                      # Variables d'environnement
│   ├── package.json
│   └── server.js                 # Serveur Express
│
├── .gitignore
└── README.md
```

## 🗄️ Base de données

### Modèle de données

#### Modèles de jeu (game/)

**Users (Utilisateurs)**
- `id` (PK)
- `username` (unique)
- `email` (unique)
- `password_hash`
- `is_active`
- `terms_accepted` (boolean, défaut: false)
- `terms_accepted_at` (datetime)
- `forum_rules_accepted` (boolean, défaut: false)
- `forum_rules_accepted_at` (datetime)
- `last_login`

**Factions**
- `id` (PK)
- `name` (unique)
- `type` (mutant/non_mutant/neutre)
- `description`
- `base_name`
- `ideology`
- `is_playable`

**Clans**
- `id` (PK)
- `faction_id` (FK → Factions, nullable pour clans neutres)
- `name` (unique)
- `type` (caste_mutant/caste_non_mutant/clan_neutre)
- `description`
- `specialization`
- `max_members`
- `is_recruitable`

**Characters (Personnages)**
- `id` (PK)
- `user_id` (FK → Users)
- `faction_id` (FK → Factions)
- `clan_id` (FK → Clans, nullable)
- `name`
- `level`, `experience`
- `health`, `max_health`
- `energy`, `max_energy`
- Statistiques : `strength`, `agility`, `intelligence`, `endurance`
- Position : `position_x`, `position_y`, `current_zone`
- `is_alive`, `death_count`, `last_death_at`

#### Modèles de forum (forum/)

**Categories**
- `id` (PK)
- `name` (unique)
- `description`
- `slug` (unique)
- `display_order` (int, défaut: 0)
- `is_visible` (boolean, défaut: true)

**Sections**
- `id` (PK)
- `category_id` (FK → Categories)
- `parent_section_id` (FK → Sections, nullable - pour sous-sections)
- `name`
- `description`
- `slug` (unique)
- `display_order` (int, défaut: 0)
- `is_visible` (boolean, défaut: true)
- `requires_terms` (boolean, défaut: false)

**Topics**
- `id` (PK)
- `section_id` (FK → Sections)
- `title`
- `slug` (unique)
- `author_user_id` (FK → Users, nullable)
- `author_character_id` (FK → Characters, nullable)
- `is_pinned` (boolean, défaut: false)
- `is_locked` (boolean, défaut: false)
- `is_visible` (boolean, défaut: true)
- `view_count` (int, défaut: 0)

**Posts**
- `id` (PK)
- `topic_id` (FK → Topics)
- `author_user_id` (FK → Users, nullable)
- `author_character_id` (FK → Characters, nullable)
- `content` (TEXT)
- `is_first_post` (boolean, défaut: false)
- `is_visible` (boolean, défaut: true)
- `edited_at` (datetime)

#### Modèles de contenu (content/)

**Home, Intro, Lore**
- Modèles Sequelize pour contenu dynamique des pages statiques

### Relations principales
- User 1:N Characters
- Faction 1:N Characters
- Faction 1:N Clans
- Clan 1:N Characters
- Category 1:N Sections
- Section 1:N Sections (hiérarchique)
- Section 1:N Topics
- Topic 1:N Posts
- User 1:N Topics (auteur)
- User 1:N Posts (auteur)
- Character 1:N Topics (auteur RP)
- Character 1:N Posts (auteur RP)

## 🚀 Installation et démarrage

### Prérequis
- Node.js v22.19.0+
- npm 11.6.0+
- MySQL 8.0+
- Git 2.51.0+

### Installation

#### 1. Cloner le repository
```bash
git clone https://github.com/votre-username/erosion-des-ames.git
cd erosion-des-ames
```

#### 2. Configuration de la base de données
```sql
CREATE DATABASE erosion_des_ames CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### 3. Configuration du Backend
```bash
cd backend
npm install

# Créer le fichier .env
cp .env.example .env
# Puis éditer .env avec vos identifiants MySQL

# Initialiser la base de données avec les données de base
npm run seed

# Démarrer le serveur backend
npm run dev
```

Le backend démarre sur **http://localhost:3000**

#### 4. Configuration du Frontend
```bash
cd ../frontend
npm install

# Démarrer le serveur frontend
npm run dev
```

Le frontend démarre sur **http://localhost:5173**

## 📡 API Endpoints

### Portail (Pages publiques)
- `GET /api/portal/home` - Page d'accueil
- `GET /api/portal/intro` - Page d'introduction
- `GET /api/portal/lore` - Page lore/univers
- `GET /api/portal/rules` - Page règles et CGU
- `GET /api/portal/wiki` - Wiki

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/profile` - Profil utilisateur (protégé)
- `POST /api/auth/accept-terms` - Accepter les CGU (protégé)
- `POST /api/auth/accept-forum-rules` - Accepter le règlement du forum (protégé)

### Factions
- `GET /api/factions` - Toutes les factions (avec clans)
- `GET /api/factions/playable` - Factions jouables
- `GET /api/factions/:id` - Une faction spécifique

### Clans
- `GET /api/clans` - Tous les clans
- `GET /api/clans/type/:type` - Clans par type
- `GET /api/clans/faction/:factionId` - Clans d'une faction
- `GET /api/clans/:id` - Un clan spécifique

### Personnages (Routes protégées - nécessitent un token JWT)
- `POST /api/characters` - Créer un personnage
- `GET /api/characters` - Mes personnages
- `GET /api/characters/:id` - Un personnage spécifique
- `PUT /api/characters/:id` - Modifier un personnage
- `DELETE /api/characters/:id` - Supprimer un personnage

### Forum (Routes publiques pour lecture, protégées pour écriture)

**Catégories**
- `GET /api/forum/categories` - Liste des catégories avec leurs sections
- `GET /api/forum/categories/:slug` - Une catégorie par slug

**Sections**
- `GET /api/forum/sections` - Liste de toutes les sections
- `GET /api/forum/sections/:slug` - Une section par slug (avec sous-sections et topics)
- `POST /api/forum/sections` - Créer une section (protégé)
- `PUT /api/forum/sections/:id` - Modifier une section (protégé)
- `PUT /api/forum/sections/:id/move` - Déplacer une section (protégé)
- `DELETE /api/forum/sections/:id` - Supprimer une section (protégé, avec vérifications)

**Topics**
- `GET /api/forum/topics/:id` - Un topic par ID (avec posts)
- `POST /api/forum/topics` - Créer un topic avec premier post (protégé)
- `PUT /api/forum/topics/:id` - Modifier un topic (titre, verrouillage) (protégé, auteur uniquement)
- `PUT /api/forum/topics/:id/move` - Déplacer un topic vers une autre section (protégé, auteur uniquement)
- `DELETE /api/forum/topics/:id` - Supprimer un topic et tous ses posts (protégé, auteur uniquement)

**Posts**
- `POST /api/forum/posts` - Créer un post/réponse dans un topic (protégé, interdit si topic verrouillé)

### Exemple de requête authentifiée
```bash
# Headers
Authorization: Bearer <votre_token_jwt>

# Body (POST /api/characters)
{
  "name": "Guerrier des Ombres",
  "faction_id": 1,
  "clan_id": 4
}

# Body (POST /api/forum/topics)
{
  "section_id": 1,
  "title": "Bienvenue dans le Wasteland",
  "content": "Contenu du premier post...",
  "author_user_id": 1
}
```

## 🎨 Thème visuel

### Palette de couleurs personnalisée

#### City (Tons urbains post-apocalyptiques)
- `city-50` à `city-950` : Du blanc cassé (#f8f9fa) au noir profond (#010409)
- Utilisé pour les fonds, cartes, et éléments structurels

#### Ochre (Teintes sable, terre, rouille)
- `ochre-50` : #fffbeb (Sable pâle)
- `ochre-300` : #fcd34d (Jaune sable)
- `ochre-500` : #f97316 (Orange rouille)
- `ochre-700` : #c2410c (Ocre foncé/terre cuite)
- `ochre-900` : #7c2d12 (Rouille profonde)

#### Blood (Rouge sang)
- `blood-700` : #991b1b (Rouge sang principal)
- Utilisé pour les accents dramatiques (titre du jeu, bordures, liens actifs)

#### Nature (Tons verts verdure/forêt)
- `nature-500` : #22c55e (Vert herbe)
- `nature-700` : #15803d (Vert forêt)
- `nature-900` : #052e16 (Vert très foncé/mousse)

#### Factions
- **Mutants** : `mutant` #22c55e (Vert)
- **Purs** : `pure` #3b82f6 (Bleu)
- **Neutres** : `neutral` #78716c (Gris)

### Polices (Google Fonts)

- **Titre du jeu** : Metal Mania (cursive dramatique) - `font-titre-Jeu`
- **Corps de texte** : Permanent Marker (écriture manuscrite) - `font-texte-corps`
- **Alternatives** : Bangers, Creepster

### Effets visuels

- **Effet sépia dynamique** : Les images passent de sépia(65%) à sépia(0%) au hover (transition 5s ease-in-out)
- **Animations** : Menu burger avec transitions fluides (duration-500ms à 1000ms)
- **Hover effects** : Scale-105, shadow transitions, color shifts
- **Bouton fermeture** : SVG text "X" en Permanent Marker (ochre-400 → blood-700)
- **Responsive** : Design adaptatif avec breakpoints Tailwind (sm, md, lg, xl, 2xl)

## ✅ État d'avancement

### Backend (En cours 🚧)
- [x] Configuration Express + Sequelize
- [x] Architecture modulaire (game/forum/content)
- [x] Modèles de jeu (User, Faction, Clan, Character)
- [x] Modèles de forum (Category, Section, Topic, Post)
- [x] Modèles de contenu (Home, Intro, Lore)
- [x] Système d'authentification JWT complet
- [x] Routes API jeu complètes (auth, characters, factions, clans)
- [x] Routes API forum complètes (CRUD)
- [x] Routes portail (intro, lore, rules, wiki)
- [x] Middleware de protection JWT
- [x] Script de seeding production (`seed.js`)
- [x] Script de seeding développement (`seedDev.js` avec forum)
- [x] Système d'acceptation des CGU (champ `terms_accepted`)
- [x] Système d'acceptation du règlement du forum (champ `forum_rules_accepted`)
- [ ] Modèles de contenu pour rules, wiki
- [ ] Système de rôles/permissions (admin, modérateur)

### Frontend (En cours 🚧)

**Portail (Pages statiques) ✅**
- [x] Configuration Vite + React + TailwindCSS personnalisé
- [x] PortalLayout avec header/body/footer responsive
- [x] Menu burger animé + navigation desktop
- [x] ConnectBar dynamique (connecté/déconnecté)
- [x] Pages : Home, Intro, Lore, Login, Register
- [x] Système d'authentification complet (Context API + JWT)
- [x] Composants UI réutilisables (Card, Buttons, InputField, etc.)
- [x] Effets visuels (sépia hover, transitions fluides)

**Forum (Opérationnel ✅)**
- [x] ForumLayout avec header/body/footer dédié
- [x] ForumHeader avec UserBar (profil + déconnexion)
- [x] ForumBody avec système de styles unifiés
- [x] Composant Breadcrumb (fil d'Ariane)
- [x] Système d'acceptation des CGU
  - [x] TermsAcceptance (alerte sur forum)
  - [x] TermsAcceptanceBox (boîte de validation)
  - [x] TermsGuard (protection de routes)
  - [x] TermsModal (modal CGU)
- [x] Système d'acceptation du règlement du forum
  - [x] ForumRulesAcceptance (alerte sur forum)
  - [x] ForumRulesAcceptanceBox (boîte de validation)
  - [x] ForumRulesGuard (protection de routes)
  - [x] ForumRulesModal (modal règlement en 7 sections)
- [x] Pages forum complètes
  - [x] ForumGeneralPage (liste des sections)
  - [x] ForumCategoryPage (sections par catégorie)
  - [x] ForumSectionPage (topics d'une section + sous-sections)
  - [x] ForumTopicPage (posts d'un topic)
- [x] **CRUD complet Sections**
  - [x] Création de sections et sous-sections (CreateSectionForm)
  - [x] Édition de sections (EditSectionForm avec confirmation)
  - [x] Déplacement de sections (MoveSectionForm - vers catégorie ou sous-section)
  - [x] Suppression de sections (avec protection si contient sous-sections/topics)
- [x] **CRUD complet Topics**
  - [x] Création de topics avec premier post (CreateTopicForm)
  - [x] Édition de topics avec verrouillage (EditTopicForm avec confirmation)
  - [x] Déplacement de topics entre sections (MoveTopicForm)
  - [x] Suppression de topics avec tous les posts (avec confirmation)
  - [x] Système de verrouillage (is_locked bloque les réponses)
- [x] **Système de posts**
  - [x] Bouton "Répondre" avec formulaire (CreatePostForm)
  - [x] Création de posts/réponses (bloqué si topic verrouillé)
  - [x] Support personnages (poster en RP avec son personnage)
- [x] **Composants UI avancés**
  - [x] Modal réutilisable
  - [x] ConfirmDialog (3 types : warning, danger, info)
  - [x] Formulaires avec validation et gestion d'erreurs
  - [x] Protections contre boucles infinies (déplacement sections)
- [ ] Édition/suppression de posts individuels
- [ ] Système de pagination pour topics/posts longs
- [ ] Bouton "Citer" pour répondre à un post spécifique
- [ ] Affichage avatar/signature utilisateur
- [ ] Système de likes/upvotes
- [ ] Recherche dans le forum

**Jeu (À venir 📋)**
- [ ] Interface de création de personnage
- [ ] Tableau de bord des personnages
- [ ] Pages rules, wiki avec contenu dynamique
- [ ] Système de jeu (combat, exploration, etc.)

### Fonctionnalités futures 📋
- [ ] Système d'inventaire
- [ ] Système de combat
- [ ] Exploration des zones
- [ ] Quêtes et missions
- [ ] Chat en temps réel
- [ ] Système de guildes/alliances
- [ ] Marketplace/Commerce
- [ ] Événements dynamiques
- [ ] Système de notifications
- [ ] Recherche forum/wiki
- [ ] Système de modération (rapport, ban)
- [ ] Statistiques utilisateur/forum

## 🗨️ Système de forum

### Architecture hiérarchique
Le forum utilise une structure à 4 niveaux :
1. **Catégories** : Regroupements thématiques (ex: "Général", "RP (rôle-play)", "Hors-RP")
2. **Sections** : Espaces de discussion (ex: "Règlement", "Lore", "Taverne")
   - Support des **sous-sections** (hiérarchie récursive)
   - Chaque section peut avoir un slug unique pour URL propres
   - **Déplacement** : Une section peut être déplacée vers une catégorie ou comme sous-section
3. **Topics** : Sujets de discussion créés par les utilisateurs
   - Support topic épinglé (`is_pinned`)
   - Support topic verrouillé (`is_locked`) - empêche les nouvelles réponses
   - Compteur de vues (`views_count`)
   - **Déplacement** : Un topic peut être déplacé vers n'importe quelle section
4. **Posts** : Messages dans un topic
   - Premier post créé automatiquement avec le topic
   - Suivi des éditions (`is_edited`, `edited_at`)

### Fonctionnalités interactives complètes

**Pour les sections/sous-sections** :
- ✅ **Créer** : Bouton "+ Créer une section" (dans catégories) et "+ Sous-section" (dans sections)
- ✅ **Éditer** : Modifier nom, description, ordre d'affichage
- ✅ **Déplacer** : Déplacer vers une autre catégorie ou comme sous-section d'une autre section
- ✅ **Supprimer** : Avec protection (impossible si contient des sous-sections ou topics)

**Pour les topics** :
- ✅ **Créer** : Bouton "+ Nouveau sujet" avec titre et premier message
- ✅ **Éditer** : Modifier titre, verrouiller/déverrouiller le topic
- ✅ **Déplacer** : Déplacer vers une autre section (liste hiérarchique organisée)
- ✅ **Supprimer** : Supprime le topic et tous ses posts associés
- ✅ **Verrouiller** : Case à cocher pour empêcher les réponses

**Pour les posts** :
- ✅ **Répondre** : Bouton "Répondre à ce sujet" (masqué si topic verrouillé)
- ✅ **Poster en RP** : Sélection de personnage pour poster avec son personnage
- 🔄 **Éditer/Supprimer** : À venir

### Auteurs multiples (User & Character)
Chaque topic/post peut avoir deux types d'auteurs :
- **`author_user_id`** : L'utilisateur réel (pour discussions HRP)
- **`author_character_id`** : Le personnage (pour RP in-game)
- **`author_name`** : Nom préservé même si compte/personnage supprimé

Cela permet une séparation claire entre contenu roleplay et hors-roleplay.

### Sécurité et validations

**Confirmations obligatoires** :
- Modification de section/topic → Dialogue de confirmation (⚠️ warning)
- Suppression → Dialogue de confirmation (🔴 danger) avec avertissement
- Déplacement → Dialogue de confirmation avec aperçu de la destination

**Protections backend** :
- Vérification d'autorisation (seul l'auteur peut modifier/supprimer son topic)
- Protection contre les boucles infinies (déplacement de sections)
- Blocage de suppression si section contient du contenu
- Blocage des réponses sur topics verrouillés
- **Validation des doublons** :
  - Empêche deux sections actives avec le même nom au même niveau (même parent/catégorie)
  - Empêche deux topics actifs avec le même titre dans la même section
  - Validation lors de la création, édition et déplacement
  - Messages d'erreur explicites pour guider l'utilisateur
- **Gestion des slugs** :
  - Génération automatique avec suffixe incrémental pour garantir l'unicité
  - Vidage du slug lors du soft-delete pour permettre la réutilisation
  - URLs propres et prévisibles
- Validation des données (champs requis, longueurs max)

**Interface utilisateur** :
- Messages d'erreur clairs et contextuels
- Désactivation de la section/topic actuel dans les listes de déplacement
- Affichage hiérarchique des destinations (catégories > sections > sous-sections)
- Icônes distinctives (✏️ Éditer, 📦 Déplacer, 🔒 Verrouillé)

### Système de CGU et Règlement du Forum

#### CGU (Conditions Générales d'Utilisation)
- Champs `terms_accepted` + `terms_accepted_at` dans le modèle User
- Route `POST /api/auth/accept-terms` pour l'acceptation
- Composants frontend :
  - **TermsAcceptance** : Alerte rouge affichée sur le forum si non accepté
  - **TermsAcceptanceBox** : Boîte avec checkbox pour valider sur topic CGU (slug: "cgu")
  - **TermsGuard** : HOC pour protéger les routes nécessitant acceptation
  - **TermsModal** : Modal d'affichage des CGU complètes
- Les sections peuvent exiger l'acceptation (`requires_terms`)

#### Règlement du Forum
- Champs `forum_rules_accepted` + `forum_rules_accepted_at` dans le modèle User
- Route `POST /api/auth/accept-forum-rules` pour l'acceptation
- Composants frontend :
  - **ForumRulesAcceptance** : Alerte rouge affichée sur le forum si non accepté
  - **ForumRulesAcceptanceBox** : Boîte avec checkbox pour valider sur topic règlement (slug: "reglement")
  - **ForumRulesGuard** : HOC pour protéger les routes nécessitant acceptation
  - **ForumRulesModal** : Modal d'affichage du règlement complet en 7 sections
- Règlement en 7 sections : respect, contenu approprié, organisation, roleplay, modération, signalement, modifications
- Systèmes indépendants : un utilisateur peut accepter l'un sans l'autre

### Composants UI forum
- **Breadcrumb** : Fil d'Ariane avec séparateurs "/"
- **UserBar** : Barre utilisateur (avatar, username, bouton déconnexion)
- **ForumBody.styles** : Système de styles unifiés exporté pour cohérence visuelle

## 🔒 Sécurité

- **Mots de passe** : Hashés avec bcryptjs (10 rounds)
- **Authentification JWT** :
  - Token expire après 7 jours
  - Fonction centralisée `authenticatedFetch` dans AuthContext
  - Déconnexion automatique en cas de token invalide/expiré (401)
  - Token stocké dans localStorage
- **Protection des routes** :
  - Middleware authMiddleware pour les routes API protégées
  - Vérification automatique du profil au chargement de l'app
- **Validation des données** : Côté serveur et client
- **CORS** : Configuré pour localhost:5173 et 5174
- **Variables sensibles** : Fichier `.env` (non commité)
- **CGU** : Système d'acceptation obligatoire des CGU avant participation forum

## 📝 Scripts disponibles

### Backend
```bash
npm start         # Démarrer en production
npm run dev       # Démarrer en développement (nodemon)
npm run seed      # Réinitialiser et remplir la BDD (production - données minimales)
npm run seed:dev  # Réinitialiser et remplir la BDD (dev - avec données forum de test)
```

### Frontend
```bash
npm run dev       # Démarrer le serveur de développement
npm run build     # Build de production
npm run preview   # Prévisualiser le build
npm run lint      # Vérifier le code avec ESLint
```

## 🤝 Contribution

Ce projet est actuellement en développement actif. Les contributions seront bientôt les bienvenues.

## 📄 Licence

À définir

## 👨‍💻 Auteur

Yannick MURAT

## 🙏 Remerciements

- Laurent BEDU et l'AFPA Territoire Digital pour les connaissances
- Les communautés VsCode, TailwindCSS, React et Node.js pour leurs outils
- Claude pour l'assistance au développement et Gemini pour sa bonne conscience

---

**Note** : Ce projet est un jeu de rôle fictif dans un univers post-apocalyptique. Toute ressemblance avec des événements réels serait fortuite.