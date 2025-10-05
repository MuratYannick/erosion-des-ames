# L'Érosion des Âmes

Jeu de rôle post-apocalyptique en ligne où mutants et non-mutants s'affrontent dans un monde dévasté par le cataclysme.

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
│   └── settings.json              # Configuration VS Code (TailwindCSS)
├── frontend/                      # Application React
│   ├── public/
│   │   ├── images/               # Images (bannière)
│   │   ├── illustrations/        # Illustrations (feu de camp)
│   │   ├── logos/                # Logo du jeu
│   │   └── masks/                # Masques pour effets visuels
│   ├── src/
│   │   ├── components/
│   │   │   ├── layouts/          # Composants de mise en page
│   │   │   │   ├── PortalLayout.jsx  # Layout principal
│   │   │   │   ├── PortalHeader.jsx  # En-tête avec navigation
│   │   │   │   ├── PortalBody.jsx    # Corps principal
│   │   │   │   └── PortalFooter.jsx  # Pied de page
│   │   │   └── ui/               # Composants UI réutilisables
│   │   │       ├── BurgerButton.jsx  # Menu hamburger
│   │   │       ├── BurgerPanel.jsx   # Panneau mobile
│   │   │       ├── Navbar.jsx        # Navigation desktop
│   │   │       ├── ConnectBar.jsx    # Boutons connexion/inscription
│   │   │       ├── PrimaryButton.jsx # Bouton principal
│   │   │       ├── SecondaryButton.jsx # Bouton secondaire
│   │   │       ├── Card.jsx          # Carte de contenu
│   │   │       └── Aside.jsx         # Barre latérale
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Page d'accueil
│   │   │   ├── IntroPage.jsx     # Page d'introduction
│   │   │   ├── LorePage.jsx      # Page lore/univers
│   │   │   ├── RulesPage.jsx     # Page règles
│   │   │   └── WikiPage.jsx      # Page wiki
│   │   ├── App.jsx               # Composant principal avec routes
│   │   ├── index.css             # Styles TailwindCSS
│   │   └── main.jsx              # Point d'entrée
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js        # Configuration TailwindCSS personnalisée
│   └── vite.config.js            # Configuration Vite
│
├── backend/                       # API Express
│   ├── config/
│   │   └── database.js           # Configuration Sequelize/MySQL
│   ├── controllers/
│   │   ├── authController.js     # Authentification
│   │   ├── characterController.js # Gestion des personnages
│   │   ├── clanController.js     # Gestion des clans
│   │   └── factionController.js  # Gestion des factions
│   ├── middleware/
│   │   └── authMiddleware.js     # Protection des routes (JWT)
│   ├── models/
│   │   ├── Character.js          # Modèle Personnage
│   │   ├── Clan.js               # Modèle Clan
│   │   ├── Faction.js            # Modèle Faction
│   │   ├── User.js               # Modèle Utilisateur
│   │   ├── IntroModel.js         # Contenu page Intro
│   │   └── index.js              # Relations entre modèles
│   ├── routes/
│   │   ├── authRoutes.js         # Routes authentification
│   │   ├── characterRoutes.js    # Routes personnages
│   │   ├── clanRoutes.js         # Routes clans
│   │   ├── factionRoutes.js      # Routes factions
│   │   └── portalRoutes.js       # Routes portail (intro, lore, etc.)
│   ├── utils/
│   │   ├── auth.js               # Utilitaires JWT/bcrypt
│   │   └── seed.js               # Script de seeding
│   ├── .env                      # Variables d'environnement
│   ├── package.json
│   └── server.js                 # Serveur Express
│
├── .gitignore
└── README.md
```

## 🗄️ Base de données

### Modèle de données

#### Users (Utilisateurs)
- `id` (PK)
- `username` (unique)
- `email` (unique)
- `password_hash`
- `is_active`
- `last_login`

#### Factions
- `id` (PK)
- `name` (unique)
- `type` (mutant/non_mutant/neutre)
- `description`
- `base_name`
- `ideology`
- `is_playable`

#### Clans
- `id` (PK)
- `faction_id` (FK → Factions, nullable pour clans neutres)
- `name` (unique)
- `type` (caste_mutant/caste_non_mutant/clan_neutre)
- `description`
- `specialization`
- `max_members`
- `is_recruitable`

#### Characters (Personnages)
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

### Relations
- User 1:N Characters
- Faction 1:N Characters
- Faction 1:N Clans
- Clan 1:N Characters

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
- `GET /api/auth/me` - Profil utilisateur (protégé)

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

### Polices

- **Titre du jeu** : Metal Mania (cursive dramatique)
- **Corps de texte** : Permanent Marker (écriture manuscrite)
- **Alternatives** : Bangers, Creepster

### Effets visuels

- **Effet sépia dynamique** : Les images passent de sépia(65%) à sépia(0%) au hover (transition 5s)
- **Animations** : Menu burger avec transitions fluides (duration-500ms à 1000ms)
- **Responsive** : Design adaptatif avec breakpoints Tailwind (sm, md, lg, xl, 2xl)

## ✅ État d'avancement

### Backend (En cours 🚧)
- [x] Configuration Express + Sequelize
- [x] Modèles de données (User, Faction, Clan, Character)
- [x] Système d'authentification JWT
- [x] Routes API complètes
- [x] Middleware de protection
- [x] Script de seeding
- [x] Gestion des personnages
- [x] Routes portail (intro, lore, rules, wiki)
- [x] Modèle de contenu statique (IntroModel)
- [ ] Modèles de contenu pour lore, rules, wiki

### Frontend (En cours 🚧)
- [x] Configuration Vite + React
- [x] Configuration TailwindCSS v3 avec palette personnalisée
- [x] Routing avec React Router v7
- [x] Architecture composants (layouts + ui)
- [x] Header avec navigation responsive
  - [x] Menu burger animé pour mobile
  - [x] Navigation desktop avec liens actifs
  - [x] Barre de connexion/inscription
- [x] Système de Cards modulaires
- [x] Page d'introduction complète avec contenu dynamique
- [x] Effets visuels (sépia hover, transitions)
- [ ] Pages lore, rules, wiki
- [ ] Formulaires inscription/connexion
- [ ] Interface de création de personnage
- [ ] Tableau de bord des personnages
- [ ] Système de jeu (combat, exploration, etc.)

### À venir 📋
- [ ] Système d'inventaire
- [ ] Système de combat
- [ ] Exploration des zones
- [ ] Quêtes et missions
- [ ] Chat en temps réel
- [ ] Système de guildes/alliances
- [ ] Marketplace/Commerce
- [ ] Événements dynamiques

## 🔒 Sécurité

- Mots de passe hashés avec bcryptjs (10 rounds)
- Authentification par JWT (expire après 7 jours)
- Routes API protégées par middleware
- Validation des données côté serveur
- CORS configuré
- Variables sensibles dans `.env` (non commité)

## 📝 Scripts disponibles

### Backend
```bash
npm start         # Démarrer en production
npm run dev       # Démarrer en développement (nodemon)
npm run seed      # Réinitialiser et remplir la BDD
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