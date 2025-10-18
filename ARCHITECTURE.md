# Architecture du projet - L'Érosion des Âmes

Ce document décrit l'organisation et la structure du projet.

## 📁 Structure des répertoires

```
erosion-des-ames/
├── .vscode/
│   └── settings.json                 # Configuration VS Code (TailwindCSS)
├── frontend/                         # Application React (SPA)
│   ├── public/                       # Assets publics
│   │   ├── images/                   # Images (bannière)
│   │   ├── illustrations/            # Illustrations (feu de camp)
│   │   ├── logos/                    # Logo du jeu
│   │   └── masks/                    # Masques pour effets visuels
│   ├── src/
│   │   ├── components/               # Composants React
│   │   │   ├── layouts/              # Composants de mise en page
│   │   │   ├── forum/                # Composants spécifiques au forum
│   │   │   └── ui/                   # Composants UI réutilisables
│   │   ├── pages/                    # Pages/routes de l'application
│   │   ├── contexts/                 # Contextes React (state global)
│   │   ├── App.jsx                   # Composant racine avec routing
│   │   ├── index.css                 # Styles TailwindCSS
│   │   └── main.jsx                  # Point d'entrée
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js            # Configuration TailwindCSS personnalisée
│   └── vite.config.js                # Configuration Vite
│
├── backend/                          # API Express (REST)
│   ├── config/
│   │   └── database.js               # Configuration Sequelize/MySQL
│   ├── controllers/                  # Contrôleurs (logique métier)
│   │   ├── authController.js
│   │   ├── characterController.js
│   │   ├── clanController.js
│   │   ├── factionController.js
│   │   └── forum/                    # Contrôleurs forum modulaires
│   │       ├── categoryController.js
│   │       ├── sectionController.js
│   │       ├── topicController.js
│   │       ├── postController.js
│   │       └── permissionController.js
│   ├── middleware/
│   │   └── authMiddleware.js         # Protection JWT des routes
│   ├── models/                       # Modèles Sequelize
│   │   ├── game/                     # Modèles du jeu
│   │   │   ├── User.js
│   │   │   ├── Character.js
│   │   │   ├── Faction.js
│   │   │   └── Clan.js
│   │   ├── forum/                    # Modèles du forum
│   │   │   ├── Category.js
│   │   │   ├── Section.js
│   │   │   ├── Topic.js
│   │   │   ├── Post.js
│   │   │   └── ForumPermission.js
│   │   ├── content/                  # Modèles de contenu statique
│   │   │   ├── Home.js
│   │   │   ├── Intro.js
│   │   │   └── Lore.js
│   │   └── index.js                  # Relations entre modèles
│   ├── routes/                       # Routes API
│   │   ├── authRoutes.js
│   │   ├── characterRoutes.js
│   │   ├── clanRoutes.js
│   │   ├── factionRoutes.js
│   │   ├── portalRoutes.js
│   │   └── forumRoutes.js
│   ├── utils/                        # Utilitaires
│   │   ├── auth.js                   # Helpers JWT/bcrypt
│   │   ├── seed.js                   # Seeding production
│   │   └── seedDev.js                # Seeding développement
│   ├── .env                          # Variables d'environnement
│   ├── .env.example                  # Template .env
│   ├── package.json
│   └── server.js                     # Point d'entrée Express
│
├── .gitignore
├── README.md                         # Documentation principale
├── PROGRESS.md                       # État d'avancement
├── ARCHITECTURE.md                   # Ce fichier
├── DATABASE.md                       # Documentation BDD
├── TECHNICAL.md                      # Documentation technique
└── CLAUDE.md                         # Instructions pour Claude Code
```

## 🏗️ Architecture Backend (MVC Pattern)

### Pattern MVC (Model-View-Controller)

Le backend suit une architecture MVC classique :
- **Models** : Modèles Sequelize définissant la structure de données
- **Views** : API REST (JSON) - pas de vues HTML
- **Controllers** : Logique métier et traitement des requêtes

### Organisation modulaire

#### 1. Models (`backend/models/`)

**Organisation par domaine** :
```
models/
├── game/           # Modèles du jeu (User, Character, Faction, Clan)
├── forum/          # Modèles du forum (Category, Section, Topic, Post, Permission)
├── content/        # Modèles de contenu (Home, Intro, Lore)
└── index.js        # Fichier central définissant toutes les relations
```

**Conventions** :
- Noms de fichiers en PascalCase (`User.js`, `ForumPermission.js`)
- Noms de modèles en PascalCase singulier (`User`, `Character`)
- Noms de tables en snake_case pluriel (`users`, `characters`)
- Champs en snake_case en BDD, camelCase en JS (via `underscored: true`)
- Relations définies dans `models/index.js`

**Exemple de modèle** :
```javascript
// backend/models/game/User.js
import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    // ...
  }, {
    tableName: 'users',
    underscored: true,  // Convertit camelCase → snake_case en BDD
    paranoid: true,     // Soft delete (deleted_at)
  });

  return User;
};
```

#### 2. Controllers (`backend/controllers/`)

**Organisation** :
- Un contrôleur par ressource principale
- Contrôleurs forum séparés dans un sous-dossier
- Logique métier encapsulée
- Gestion d'erreurs avec try/catch

**Responsabilités** :
- Valider les données d'entrée
- Appeler les modèles Sequelize
- Gérer les erreurs
- Retourner les réponses HTTP

**Exemple** :
```javascript
// backend/controllers/characterController.js
export const createCharacter = async (req, res) => {
  try {
    const { name, faction_id, clan_id } = req.body;
    const character = await Character.create({
      user_id: req.user.id,  // Ajouté par authMiddleware
      name,
      faction_id,
      clan_id,
    });
    res.status(201).json(character);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### 3. Routes (`backend/routes/`)

**Organisation** :
- Un fichier de routes par domaine
- Préfixe `/api` global dans `server.js`
- Protection JWT via `authMiddleware.protect`

**Structure des routes** :
```javascript
// backend/routes/characterRoutes.js
import express from 'express';
import * as characterController from '../controllers/characterController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Toutes les routes protégées
router.use(protect);

router.post('/', characterController.createCharacter);
router.get('/', characterController.getMyCharacters);
router.get('/:id', characterController.getCharacterById);
router.put('/:id', characterController.updateCharacter);
router.delete('/:id', characterController.deleteCharacter);

export default router;
```

**Montage dans server.js** :
```javascript
// backend/server.js
app.use('/api/auth', authRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/factions', factionRoutes);
app.use('/api/forum', forumRoutes);
// ...
```

#### 4. Middleware (`backend/middleware/`)

**authMiddleware.js** :
- Fonction `protect` : vérifie le token JWT
- Extrait et vérifie le token depuis `Authorization: Bearer <token>`
- Attache `req.user` pour les contrôleurs
- Renvoie 401 si token invalide/absent

**Exemple d'utilisation** :
```javascript
import { protect } from '../middleware/authMiddleware.js';

// Route protégée
router.get('/profile', protect, (req, res) => {
  // req.user est disponible ici
  res.json({ user: req.user });
});
```

#### 5. Utils (`backend/utils/`)

**auth.js** :
- `hashPassword(password)` : Hash bcrypt
- `comparePassword(password, hash)` : Vérification
- `generateToken(userId)` : Génère JWT (expire 7j)
- `verifyToken(token)` : Vérifie JWT

**seed.js** :
- Seeding production (données minimales)
- Factions et clans de base
- Catégories forum essentielles

**seedDev.js** :
- Seeding développement (données complètes)
- Utilisateurs de test (admin, modérateurs, joueurs)
- Personnages de test
- Forum complet (sections, topics, posts)
- Données de test pour permissions

### Configuration

**database.js** :
```javascript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
    logging: false,
  }
);

export default sequelize;
```

**Variables d'environnement (.env)** :
```env
# Base de données
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=votre_password
DB_NAME=erosion_des_ames

# JWT
JWT_SECRET=votre_secret_long_et_securise
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

## 🎨 Architecture Frontend (React SPA)

### Organisation des composants

#### 1. Pages (`frontend/src/pages/`)

**Composants de niveau route** :
- Correspondent aux routes React Router
- Deux catégories : Portail (statique) et Forum (dynamique)

**Pages Portail** :
```
pages/
├── HomePage.jsx          # Route: /
├── IntroPage.jsx         # Route: /intro
├── LorePage.jsx          # Route: /lore
├── RulesPage.jsx         # Route: /rules
├── WikiPage.jsx          # Route: /wiki
├── LoginPage.jsx         # Route: /login
└── RegisterPage.jsx      # Route: /register
```

**Pages Forum** :
```
pages/
├── ForumGeneralPage.jsx      # Route: /forum
├── ForumCategoryPage.jsx     # Route: /forum/category/:slug
├── ForumSectionPage.jsx      # Route: /forum/section/:slug
└── ForumTopicPage.jsx        # Route: /forum/topic/:id
```

#### 2. Layouts (`frontend/src/components/layouts/`)

**Deux layouts distincts** :

**PortalLayout** : Pages statiques
```jsx
<PortalLayout>
  <PortalHeader />    {/* Navigation, burger menu, ConnectBar */}
  <PortalBody>        {/* Wrapper avec styles */}
    {children}
  </PortalBody>
  <PortalFooter />    {/* Pied de page */}
</PortalLayout>
```

**ForumLayout** : Pages forum
```jsx
<ForumLayout>
  <ForumHeader />     {/* UserBar avec profil/déconnexion */}
  <ForumBody>         {/* Wrapper avec styles exportés */}
    {children}
  </ForumBody>
  <ForumFooter />     {/* Pied de page forum */}
</ForumLayout>
```

#### 3. Composants UI (`frontend/src/components/ui/`)

**Composants réutilisables** :
```
ui/
├── Card.jsx                      # Carte modulaire
├── InputField.jsx                # Champ de formulaire
├── PrimaryButton.jsx             # Bouton principal
├── SecondaryButton.jsx           # Bouton secondaire
├── Modal.jsx                     # Modal générique
├── ConfirmDialog.jsx             # Dialogue de confirmation
├── Breadcrumb.jsx                # Fil d'Ariane
├── Navbar.jsx                    # Navigation desktop
├── UserBar.jsx                   # Barre utilisateur forum
├── ConnectBar.jsx                # Barre connexion portail
├── BurgerButton.jsx              # Menu hamburger
├── BurgerPanel.jsx               # Panneau mobile
├── CloseButton.jsx               # Bouton fermeture (X)
├── Aside.jsx                     # Barre latérale
├── TermsAcceptance.jsx           # Alerte CGU
├── TermsAcceptanceBox.jsx        # Boîte acceptation CGU
├── TermsGuard.jsx                # Protection routes CGU
├── TermsModal.jsx                # Modal CGU
├── ForumRulesAcceptance.jsx      # Alerte règlement
├── ForumRulesAcceptanceBox.jsx   # Boîte acceptation règlement
├── ForumRulesGuard.jsx           # Protection routes règlement
└── ForumRulesModal.jsx           # Modal règlement
```

#### 4. Composants Forum (`frontend/src/components/forum/`)

**CRUD Sections** :
- `CreateSectionForm.jsx` - Création section/sous-section
- `EditSectionForm.jsx` - Édition
- `MoveSectionForm.jsx` - Déplacement

**CRUD Topics** :
- `CreateTopicForm.jsx` - Création + premier post
- `EditTopicForm.jsx` - Édition + verrouillage
- `MoveTopicForm.jsx` - Déplacement

**Posts** :
- `CreatePostForm.jsx` - Réponse
- `MovePostForm.jsx` - Déplacement

**Permissions** :
- `PermissionsForm.jsx` - Gestion permissions (onglets par opération)

#### 5. Contextes (`frontend/src/contexts/`)

**AuthContext** :
```jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Fonction centralisée pour requêtes authentifiées
  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });

    // Déconnexion automatique si 401
    if (response.status === 401) {
      logout();
      throw new Error('Session expirée');
    }

    return response;
  };

  const login = async (credentials) => { /* ... */ };
  const logout = () => { /* ... */ };
  const acceptTerms = async () => { /* ... */ };
  const acceptForumRules = async () => { /* ... */ };

  return (
    <AuthContext.Provider value={{
      user, token, login, logout, acceptTerms, acceptForumRules, authenticatedFetch
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Routing (React Router)

**App.jsx** :
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Pages Portail */}
          <Route path="/" element={<HomePage />} />
          <Route path="/intro" element={<IntroPage />} />
          <Route path="/lore" element={<LorePage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/wiki" element={<WikiPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Pages Forum */}
          <Route path="/forum" element={<ForumGeneralPage />} />
          <Route path="/forum/category/:slug" element={<ForumCategoryPage />} />
          <Route path="/forum/section/:slug" element={<ForumSectionPage />} />
          <Route path="/forum/topic/:id" element={<ForumTopicPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### Configuration TailwindCSS

**tailwind.config.js** :
```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        city: { /* 50-950 */ },
        ochre: { /* 50-950 */ },
        blood: { 700: '#991b1b' },
        nature: { /* 500-900 */ },
        mutant: '#22c55e',
        pure: '#3b82f6',
        neutral: '#78716c',
      },
      fontFamily: {
        'titre-Jeu': ['Metal Mania', 'cursive'],
        'texte-corps': ['Permanent Marker', 'cursive'],
      },
    },
  },
  plugins: [],
};
```

**Utilisation** :
```jsx
<div className="bg-city-900 text-ochre-300 font-texte-corps">
  <h1 className="text-blood-700 font-titre-Jeu text-4xl">L'Érosion des Âmes</h1>
</div>
```

### Configuration Vite

**vite.config.js** :
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

**Avantages** :
- HMR (Hot Module Replacement) ultra-rapide
- Proxy API transparent (pas de CORS en dev)
- Build optimisé pour production

## 🔄 Flux de données

### Authentification

```
1. User → Login Form (LoginPage)
2. Form → POST /api/auth/login
3. Backend → Verify credentials
4. Backend → Generate JWT (7d expiration)
5. Backend → Response { token, user }
6. Frontend → Store token in localStorage
7. Frontend → Update AuthContext (user, token)
8. Frontend → Redirect to /forum
```

### Requête protégée

```
1. Component → useAuth().authenticatedFetch(url)
2. AuthContext → Add Authorization header
3. Backend → authMiddleware.protect
4. Middleware → Verify JWT
5. Middleware → Attach req.user
6. Controller → Process request
7. Backend → Response data
8. Frontend → Update UI

Si 401 :
- AuthContext → logout()
- Clear localStorage
- Redirect to /login
```

### CRUD Forum (exemple : créer un topic)

```
1. User → Click "Nouveau sujet"
2. ForumSectionPage → Show CreateTopicForm
3. User → Fill form (title, content, character?)
4. Form → Submit
5. Frontend → authenticatedFetch('/api/forum/topics', { POST })
6. Backend → topicController.createTopic
7. Controller → Validate data
8. Controller → Check permissions (ForumPermission)
9. Controller → Create Topic + first Post (transaction)
10. Backend → Response { topic, post }
11. Frontend → Navigate to /forum/topic/:id
```

## 🔐 Sécurité

### Backend

**Protection des routes** :
```javascript
// Route publique
router.get('/factions', factionController.getAll);

// Route protégée (JWT requis)
router.get('/characters', protect, characterController.getMyCharacters);
```

**Hashage des mots de passe** :
```javascript
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hashedPassword);
```

**JWT** :
```javascript
import jwt from 'jsonwebtoken';

const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
  expiresIn: '7d'
});

const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Frontend

**Protection des routes sensibles** :
```jsx
// Dans la page
import { TermsGuard } from '../components/ui/TermsGuard';
import { ForumRulesGuard } from '../components/ui/ForumRulesGuard';

export default function SensitivePage() {
  return (
    <TermsGuard>
      <ForumRulesGuard>
        <div>Contenu protégé</div>
      </ForumRulesGuard>
    </TermsGuard>
  );
}
```

**Stockage sécurisé** :
- Token JWT dans localStorage (pas de cookies pour SPA)
- Pas de données sensibles en clair
- Expiration automatique après 7 jours

## 📊 Performance

### Backend

**Connection pooling** :
```javascript
pool: {
  max: 5,           // Max 5 connexions simultanées
  min: 0,
  acquire: 30000,   // Timeout 30s
  idle: 10000       // Libération après 10s inactivité
}
```

**Indexation BDD** :
- Indexes sur clés étrangères
- Indexes sur slugs (recherche rapide)
- Unique indexes (username, email, slugs)

### Frontend

**Code splitting** :
- Routes chargées à la demande
- Build optimisé par Vite
- Tree-shaking automatique

**Optimisations React** :
- Context API (évite prop drilling)
- Composants fonctionnels purs
- Pas de re-renders inutiles

---

**Dernière mise à jour** : 18 janvier 2025
