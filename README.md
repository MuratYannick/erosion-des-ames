# Erosion des Ames

## Technologies

| Frontend | Backend | Base de données |
|----------|---------|-----------------|
| React 19 | Node.js | MySQL |
| Vite | Express 5 | |
| TailwindCSS 3 | Sequelize 6 | |
| React-Router 7 | | |

## Installation

```bash
# Cloner le repository
git clone https://github.com/MuratYannick/erosion-des-ames.git
cd erosion-des-ames

# Installer toutes les dépendances
npm run install:all

# Configurer l'environnement backend
cp backend/.env.example backend/.env
# Éditer backend/.env avec vos identifiants MySQL
```

## Commandes

```bash
npm run dev            # Lance frontend + backend en parallèle
npm run dev:frontend   # Frontend uniquement (port 5173)
npm run dev:backend    # Backend uniquement (port 3001)
npm run build          # Build production du frontend

# Base de données (depuis la racine)
npm run db:migrate     # Exécuter toutes les migrations
npm run db:seed        # Seeders de production uniquement
npm run db:seed:dev    # Seeders de développement (données de test)
npm run db:clear       # Vider les tables (garde la structure)
npm run db:drop        # Annuler toutes les migrations

# Tests
npm run test:backend   # Jest (backend)
npm run test:frontend  # Vitest (frontend)
```

## Arborescence

```
erosion-des-ames/
├── frontend/
│   ├── public/               # Fichiers statiques (sitemap, robots, images)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/       # SEO, SuspenseFallback, ScrollToTop…
│   │   │   └── ui/           # Button, Card, Modal, Avatar, Toast, FileUpload…
│   │   ├── hooks/            # useApi, useAuth, useForum, useAdmin, useUser…
│   │   ├── layouts/          # MainLayout (Header + Footer)
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Foreword/
│   │   │   ├── Universe/
│   │   │   ├── Characters/
│   │   │   ├── auth/         # Login, Register, ForgotPassword…
│   │   │   ├── MyCharacters/ # Liste, création, détail, édition
│   │   │   ├── Forum/        # Index, catégorie, sujet, modération, recherche
│   │   │   ├── Profile/      # ProfilePage, ProfileSettings
│   │   │   ├── Admin/        # Dashboard, Users, Characters, Forum, Logs
│   │   │   └── errors/       # 404, 403, 500, Maintenance
│   │   ├── services/         # api.js, authService, characterService, forumService…
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── eslint.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── config/
│   │   └── database.js       # Sequelize config (pool, dialecte)
│   ├── controllers/          # authController, characterController, forumController…
│   ├── jobs/
│   │   └── backupJob.js      # Cron backup DB quotidien (02:00 Europe/Paris)
│   ├── middlewares/          # auth, errorHandler, upload, categoryPermission
│   ├── migrations/           # Migrations Sequelize (snake_case)
│   ├── models/               # User, Character, ForumTopic, ForumPost…
│   ├── routes/               # index.js + auth, users, characters, forum, admin, upload
│   ├── scripts/              # backup-db.sh, restore-db.sh, db-clear.js…
│   ├── seeders/
│   │   └── production/       # Seeders de production (données de référence)
│   ├── tests/                # Jest : unit (controllers, models, middlewares) + integration
│   ├── utils/                # imageProcessor, validators helpers
│   ├── validators/           # express-validator chains par ressource
│   ├── app.js                # Express app (CORS, helmet, rate-limit, routes)
│   ├── server.js             # Démarrage serveur + backup job
│   └── package.json
├── .github/
│   └── workflows/
│       ├── ci.yml            # Lint + tests + build sur chaque push
│       └── deploy.yml        # Déploiement automatique sur push main
├── package.json              # Scripts racine (dev, build, install:all)
├── DEPLOYMENT.md             # Guide de déploiement production
├── ROADMAP.md
├── .gitignore
└── README.md
```

## Configuration

### Variables d'environnement (backend/.env)

```env
PORT=3001
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=erosion_des_ames
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
FRONTEND_URL=http://localhost:5173
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@example.com
SMTP_PASS=votre_mot_de_passe_smtp
EMAIL_FROM=noreply@example.com
```

Voir `backend/.env.example` pour la liste complète. Pour la production, consulter `DEPLOYMENT.md`.
