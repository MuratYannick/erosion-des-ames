# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**L'Érosion des Âmes** is a post-apocalyptic text-based RPG where mutants (Les Éveillés) and non-mutants (Les Purs) fight for survival in a devastated world. The game features faction-based gameplay with character progression, clans/castes, and a hostile mutated environment.

## Development Commands

### Backend (Node.js/Express/Sequelize)
```bash
cd backend
npm install                    # Install dependencies
npm run dev                    # Start development server with nodemon (http://localhost:3000)
npm start                      # Start production server
npm run seed                   # Reset database and seed with initial factions/clans/forum data (production)
npm run seed:dev               # Reset database with complete test data (development)
```

### Frontend (React/Vite/TailwindCSS)
```bash
cd frontend
npm install                    # Install dependencies
npm run dev                    # Start dev server (http://localhost:5173)
npm run build                  # Build for production
npm run preview                # Preview production build
npm run lint                   # Run ESLint
```

### Database Setup
```sql
CREATE DATABASE erosion_des_ames CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Create `backend/.env` from `backend/.env.example` and configure MySQL credentials before running the backend.

## Architecture

### Monorepo Structure
- **backend/** - Express 5.1.0 REST API with Sequelize ORM (MySQL)
- **frontend/** - React 19.1.1 SPA with Vite 7.1.7 and TailwindCSS 3.4.18

Both use ES modules (`"type": "module"` in package.json).

### Backend Architecture (MVC Pattern)

**Models** (`backend/models/`):
- Sequelize models with relationships defined in `models/index.js`
- Key models: User, Faction, Clan, Character
- All models use snake_case for database fields (configured via `underscored: true`)

**Model Relationships**:
```javascript
User (1:N) Characters
Faction (1:N) Characters
Faction (1:N) Clans
Clan (1:N) Characters
```

**Controllers** (`backend/controllers/`):
- `authController.js` - Registration, login, user profile
- `characterController.js` - CRUD operations for characters (protected routes)
- `factionController.js` - Read-only faction data
- `clanController.js` - Read-only clan data

**Routes** (`backend/routes/`):
- All routes prefixed with `/api` in `server.js`
- Character routes protected by `authMiddleware.protect`

**Key Configuration Files**:
- `config/database.js` - Sequelize configuration with connection pooling
- `middleware/authMiddleware.js` - JWT token verification middleware
- `utils/auth.js` - JWT signing/verification and bcrypt helpers
- `utils/seed.js` - Database seeding script

### Frontend Architecture

**Routing** (`frontend/src/App.jsx`):
- React Router v7 with BrowserRouter
- Base layout: `PortalLayout` wraps all routes
- Current pages: HomePage, IntroPage, LorePage, RulesPage, WikiPage

**Component Organization**:
- `components/layouts/` - PortalLayout, PortalHeader, PortalBody, PortalFooter
- `components/ui/` - Reusable UI components (Navbar, Card, Buttons, etc.)
- `pages/` - Route-level page components

**Vite Configuration**:
- Dev server on port 5173 with auto-open
- Proxy `/api/*` requests to `http://localhost:3000` (backend)

**TailwindCSS Custom Theme** (`frontend/tailwind.config.js`):
- Custom color palettes:
  - `city` - Grayscale wasteland theme (city-950 for dark backgrounds)
  - `ochre` - Sand/rust/earth tones
  - `nature` - Green/forest tones
  - `mutant` - Green (#22c55e) for mutant faction
  - `pure` - Blue (#3b82f6) for non-mutant faction
  - `neutral` - Gray (#78716c) for neutral clans
- Custom fonts via Google Fonts:
  - `font-titre-Jeu` - "Metal Mania" (game titles)
  - `font-texte-corps` - "Permanent Marker" (body text)

## Authentication Flow

1. **Registration/Login**: POST to `/api/auth/register` or `/api/auth/login` returns JWT token
2. **Token Storage**: Client stores token and includes in requests as `Authorization: Bearer <token>`
3. **Protected Routes**: Backend middleware verifies token and attaches `req.user` (see `authMiddleware.js`)
4. **Token Expiration**: JWT expires after 7 days (configured in `utils/auth.js`)

## Database & Seeding

**Seeding Process** (`npm run seed`):
1. Syncs database schema (force: true drops/recreates tables)
2. Creates 3 factions: Les Éveillés (mutants), Les Purs (non-mutants), Clans Neutres
3. Creates 5 mutant castes, 5 non-mutant castes, and 3 neutral clans
4. All faction/clan data follows game lore (see README.md for details)

**Character System**:
- Characters have stats (strength, agility, intelligence, endurance)
- Health/energy system with max values
- Level/experience progression
- Position tracking (x, y, zone)
- Death tracking (is_alive, death_count, last_death_at)

## Game Context & Lore

Understanding the game world helps with feature development:

**Factions**:
- **Les Éveillés** (mutants) - Base: L'Oasis des Transformés. Believe in nature's purification
- **Les Purs** (non-mutants) - Base: La Citadelle Inaltérée. Seek restoration via technology
- **Clans Neutres** - Independent survivors avoiding the conflict

**Environment**:
- Hostile mutated fauna/flora
- Radioactive zones and unstable ruins
- Post-apocalyptic wasteland aesthetic

## Documentation Structure

The project uses a modular documentation system:

- **README.md** - Main overview, installation, visual theme, scripts (user-facing)
- **PROGRESS.md** - Development progress, completed features, roadmap
- **ARCHITECTURE.md** - Project structure, MVC patterns, component organization
- **DATABASE.md** - Database models, relations, seeding process
- **TECHNICAL.md** - API routes, authentication, permissions system
- **CLAUDE.md** - This file (AI assistant guidance)

### Documentation Update Guidelines

When updating documentation:

1. **Simple update** (`mise à jour` or `mise à jour simple`):
   - Update only README.md
   - Use for: new features added to "Dernières mises à jour", minor corrections

2. **Complete update** (`mise à jour complète`):
   - Update all relevant files (README.md, PROGRESS.md, ARCHITECTURE.md, DATABASE.md, TECHNICAL.md)
   - Use for: major features, architectural changes, new models/routes

Always update CLAUDE.md when development workflows or conventions change.

## Important Conventions

- **Ports**: Backend runs on 3000, frontend on 5173
- **CORS**: Backend configured to accept requests from `http://localhost:5173`
- **Database**: Uses underscored naming (e.g., `user_id`, not `userId`) in DB, but Sequelize models use camelCase
- **Error Handling**: Global error middleware in `server.js` shows detailed errors only in development
- **Logging**: Request logging middleware active in development mode
