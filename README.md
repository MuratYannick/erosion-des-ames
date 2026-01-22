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
npm run dev            # Lance frontend + backend
npm run dev:frontend   # Frontend uniquement (port 5173)
npm run dev:backend    # Backend uniquement (port 3001)
npm run build          # Build production du frontend
npm run db:migrate     # Exécuter les migrations
npm run db:seed        # Exécuter les seeders
```

## Arborescence

```
erosion-des-ames/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   ├── migrations/
│   ├── seeders/
│   ├── server.js
│   └── package.json
├── package.json
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
```
