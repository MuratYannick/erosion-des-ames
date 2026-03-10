# Erosion des Ames — Frontend

Application React pour le forum et site communautaire du jeu de rôle *Érosion des Âmes*.

## Stack

- React 19 + Vite
- TailwindCSS 3
- React Router 7
- Axios (appels API)
- react-helmet-async (SEO)
- @fontsource (polices auto-hébergées)
- Vitest + Testing Library (tests)

## Commandes

```bash
npm run dev          # Serveur de développement (port 5173)
npm run build        # Build production (génère dist/)
npm run lint         # ESLint --max-warnings=0
npm run test         # Vitest
npm run test:ui      # Interface Vitest
npm run test:coverage # Rapport de couverture
```

## Variable d'environnement

```env
VITE_API_URL=http://localhost:3001
```

## Structure

```
src/
├── components/
│   ├── common/     # SEO, SuspenseFallback, ScrollToTop, ErrorBoundary
│   └── ui/         # Button, Card, Modal, Avatar, Toast, FileUpload, etc.
├── hooks/          # useApi, useAuth, useForum, useAdmin, useUser, etc.
├── layouts/        # MainLayout (Header + Footer)
├── pages/          # Home, Foreword, Universe, Characters, Forum, Profile, Admin, errors
├── services/       # api.js + services par ressource (auth, character, forum, etc.)
├── App.jsx         # Routes (React.lazy + Suspense)
├── main.jsx        # Point d'entrée
└── index.css       # Variables CSS globales + styles de base
```
