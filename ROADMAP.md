# Roadmap - Erosion des Ames

## Vue d'ensemble du projet

**Stack technique:**
- Frontend: React 19 + Vite + TailwindCSS + React Router
- Backend: Express 5 + Sequelize ORM
- Base de données: MySQL

---

## Phase 1: Fondations UI

### 1.1 Configuration du système de design
- [x] Définir la palette de couleurs dans `tailwind.config.js`
- [x] Définir la typographie (fonts, tailles)
- [x] Définir les espacements et breakpoints responsive
- [x] Créer les variables CSS custom si nécessaire

### 1.2 Composants principaux réutilisables
- [x] **Button** - Variantes: primary, secondary, outline, danger, disabled
- [x] **MenuBurgerButton**
- [x] **Input** - Text, email, password, textarea avec états (error, success, disabled)
- [x] **Card** - Container réutilisable avec variantes
- [x] **ImageCard** - container pour image réutilisable avec FX variants
- [x] **Modal** - Fenêtre modale avec overlay
- [x] **Loader/Spinner** - Indicateur de chargement
- [x] **Alert/Toast** - Messages de notification (success, error, warning, info)
- [x] **Avatar** - Affichage d'image utilisateur avec fallback
- [x] **Badge** - Labels et tags
- [x] **Dropdown** - Menu déroulant
- [x] **Pagination** - Navigation entre pages
- [x] **Tooltip** - Info-bulles

### 1.3 Layouts - Header et Footer communs
- [x] **Header principal** - Logo, navigation, liens connexion/inscription, menu burger, banière (dans `/temp`)
- [x] **Footer principal** - Liens utiles, mentions légales, réseaux sociaux
- [x] **Layout principal** - Wrapper avec Header + Footer + contenu
- [x] **Sidebar** (optionnel) - Navigation latérale si nécessaire

---

## Phase 2: Pages de contenu statique ✅

> Détails complets : voir `ROADMAP_PHASE_2.md` et `ROADMAP_PHASE_2BIS.md`

### 2.1 Page Home (Accueil)
- [x] Section hero avec bannière/image d'accroche (images responsives, effet parallax)
- [x] Section présentation du jeu (texte d'immersion avec ImageCard)
- [x] Section actualités/annonces (cards tribales avec badges)
- [x] Section liens rapides (5 liens avec icônes SVG tribales, glow hover)
- [x] Responsive design complet + scroll fluide (Intersection Observer)

### 2.2 Page Foreword (Avant-propos/Règlement)
- [x] TableOfContents sticky avec scroll spy (Intersection Observer)
- [x] 7 sections de règles complètes (conduite, RP, personnages, système, modération, mentions légales)
- [x] Composants TribalCorner, TribalDivider, TribalMarker, TribalBullet
- [x] Layout sidebar + contenu, collapse sur mobile

### 2.3 Page Univers
- [x] UniverseHero avec overlay mystique et particules de cendre
- [x] LoreSection - 5 chapitres style "Codex des Anciens" (tablettes de pierre)
- [x] FactionSection - 5 factions avec emblèmes SVG et couleurs propres
- [x] GeographySection + WorldMap SVG interactif (6 marqueurs, rose des vents, routes tribales)
- [x] LocationSection - Cards de lieux avec type, niveau de danger, filtres
- [x] TimelineSection - "Le Fleuve des Âges" (4 ères, strates géologiques, runes de navigation)
- [x] DawnTransition entre sections, ScrollToTop

### 2.4 Page Characters (Personnages prédéfinis) - "Les Âmes Marquées"
- [x] CharacterGrid responsive avec cards hexagonales cristallines (Soul Shard)
- [x] CharacterFilters - "Autel de Sélection" (race, classe, faction, difficulté RP)
- [x] CharacterModal - "Codex de l'Âme" (fiche complète avec traits, capacités, équipement)
- [x] 8 personnages exemples variés (presetCharacters.js)
- [x] Éléments SVG tribaux (SoulShardBorder, DifficultyRunes, RaceSymbol, etc.)

### Composants partagés
- [x] PageHeader, SectionTitle, TextBlock, ImageGallery, Breadcrumb, ScrollToTop
- [x] ScrollToTopOnNavigate pour changements de route
- [x] Routes configurées : `/`, `/avant-propos`, `/univers`, `/personnages`

### Phase 2bis - Correctifs
- [x] Double scroll page Home, images hero responsives, alignement header mobile
- [x] Navbar aux bords de la fenêtre, tremblement marqueurs carte, nettoyage code

---

## Phase 3: Backend - Base utilisateurs et authentification ✅

### 3.1 Table User
- [x] Créer le modèle Sequelize `User` (20 colonnes, hooks bcrypt, scopes, validations)
- [x] Créer la migration correspondante
- [x] Créer les seeders pour données de test (admin, modérateur, game master, 2 joueurs)

### 3.2 Configuration sécurité backend
- [x] Installer et configurer `bcrypt` pour le hashage des mots de passe
- [x] Installer et configurer `jsonwebtoken` (JWT) pour l'authentification
- [x] Créer les middlewares d'authentification (authenticate, authorize, optionalAuth)
- [x] Configurer les variables d'environnement (JWT_SECRET, SMTP, etc.)
- [x] Configurer `nodemailer` pour l'envoi d'emails

### 3.3 Routes API authentification
- [x] `POST /api/auth/register` - Inscription + email de vérification
- [x] `POST /api/auth/login` - Connexion (email ou username)
- [x] `POST /api/auth/logout` - Déconnexion
- [x] `GET /api/auth/me` - Récupérer l'utilisateur connecté
- [x] `POST /api/auth/verify-email` - Vérification email
- [x] `POST /api/auth/resend-verification` - Renvoyer email de vérification
- [x] `POST /api/auth/forgot-password` - Mot de passe oublié
- [x] `POST /api/auth/reset-password` - Réinitialisation mot de passe
- [x] `PUT /api/auth/change-password` - Changer mot de passe (connecté)
- [x] `PUT /api/auth/update-profile` - Modifier profil

### 3.4 Frontend - Authentification
- [x] Page de connexion (email ou username)
- [x] Page d'inscription (avec indicateur force mot de passe)
- [x] Page mot de passe oublié
- [x] Page réinitialisation mot de passe
- [x] Page vérification email
- [x] Gestion du state d'authentification (AuthContext + useAuth)
- [x] Protection des routes privées (ProtectedRoute)
- [x] Stockage du token (localStorage + vérification expiration)

### 3.5 Tests
- [x] Tests unitaires backend (utils, middlewares, validators)
- [x] Tests d'intégration API (routes auth)
- [x] Tests manuels complets validés

---

## Phase 4: Formulaires ✅

### 4.1 Composants de formulaire avancés
- [x] **Form** - Wrapper avec gestion de validation (Form, FormField, FormGroup)
- [x] **Select** - Liste déroulante stylisée (Select, SelectMultiple)
- [x] **Checkbox/Radio** - Cases à cocher et boutons radio (Checkbox, CheckboxGroup, Radio, RadioGroup)
- [x] **FileUpload** - Upload d'images/fichiers (FileUpload, ImageUpload, AvatarUpload)
- [x] **DatePicker** - Sélecteur de date (vanilla JS)
- [x] **RichTextEditor** - Éditeur de texte riche avec TipTap

### 4.2 Validation et gestion d'erreurs
- [x] Système de validation côté client (utils/validation.js)
- [x] Affichage des erreurs inline
- [x] Messages d'erreur standardisés (utils/validationMessages.js)

---

## Phase 5: Pages d'erreur HTTP personnalisées ✅

### 5.1 Pages d'erreur
- [x] **Page 404** - "Chemin Perdu" avec boussole tribale brisée
- [x] **Page 403** - "Territoire Interdit" avec totem gardien
- [x] **Page 500** - "Perturbation Spirituelle" avec vortex chaotique
- [x] **Page de maintenance** - "Rituel en Cours" avec autel rituel

### 5.2 Gestion des erreurs
- [x] Composant ErrorBoundary React
- [x] Redirection automatique vers les pages d'erreur (Axios interceptor)
- [x] Style cohérent avec le reste du site (design tribal)
- [x] Hook useNavigateToError pour navigation programmatique
- [x] Middleware backend errorHandler.js (ApiError, format standardisé)

---

## Phase 6: Système de personnages joueurs ✅

> Détails complets : voir `ROADMAP_PHASE_6.md`

### 6.1 Tables de référence (pré-requis)
- [x] Table `ethnicities` - 2 ethnies (Les Inaltérés, Les Éveillés)
- [x] Table `factions` - 2 factions avec workflow d'approbation
- [x] Table `clans` - 9 clans avec FK vers ethnies/factions
- [x] Modèles Sequelize, controllers, validators, routes, seeders (dev + prod)

### 6.2 Table et API personnages
- [x] Table `characters` - FK vers users (UUID), ethnicities, factions, clans
- [x] Workflow d'approbation : draft → pending → approved/rejected
- [x] `GET /api/characters` - Liste (public: active+approved, staff: tous+filtres)
- [x] `GET /api/characters/:id` - Détail d'un personnage
- [x] `POST /api/characters` - Créer un personnage (staff)
- [x] `PUT /api/characters/:id` - Modifier un personnage (staff)
- [x] `PATCH /api/characters/:id/submit` - Soumettre pour approbation
- [x] `PATCH /api/characters/:id/approve` - Approuver (ADMIN, MODERATOR)
- [x] `PATCH /api/characters/:id/reject` - Rejeter avec raison
- [x] `DELETE /api/characters/:id` - Supprimer (ADMIN)

### 6.3 Frontend - Gestion des personnages
- [x] Services API (`characterService.js`, `referenceService.js`)
- [x] 10 hooks React (`useCharacters`, `useMyCharacters`, `useCreateCharacter`, etc.)
- [x] Page liste des personnages (`/mes-personnages`) avec filtres et stats
- [x] Page création (`/mes-personnages/creer`) - formulaire multi-sections avec progression
- [x] Page détail (`/mes-personnages/:id`) - fiche complète avec bannière de statut
- [x] Page édition (`/mes-personnages/:id/modifier`) - pré-remplie, draft/rejected uniquement
- [x] Composants : CharacterCard, CharacterSheet, CharacterStatusBadge, CharacterAvatar
- [x] Routes protégées dans App.jsx

---

## Phase 7: Système de forum complet ✅

> Détails complets : voir `ROADMAP_PHASE_7.md`

### 7.1 Backend - Base de données
- [x] 6 migrations (forum_categories, forum_topics, forum_posts, topic_reads, topic_subscriptions, post_reports)
- [x] 6 modèles Sequelize avec associations complètes
- [x] Seeders dev (catégories, sujets, posts) + prod (catégories de base)

### 7.2 Backend - API REST
- [x] Controllers : catégories (CRUD + reorder), sujets (CRUD + pin/lock/read/subscribe), posts (CRUD + report), signalements (list + review)
- [x] Validators express-validator pour toutes les routes
- [x] Routes montées dans `/api/forum/*` avec auth/authorize middlewares
- [x] Recherche full-text dans titres et contenus (`/api/forum/search`)
- [x] Support slug ou ID numérique pour les catégories

### 7.3 Frontend - Services et Hooks
- [x] `forumService.js` - 22 méthodes API (catégories, sujets, posts, signalements, recherche)
- [x] `useForum.js` - 15 hooks React (queries + mutations) avec extraction correcte des données backend

### 7.4 Frontend - Composants
- [x] Composants d'affichage : ForumCategoryCard, TopicRow, PostCard, AuthorSidebar, QuoteBlock, PostActions, TopicStatusBadge, ForumBreadcrumb, ForumPagination, ForumStats
- [x] Composants de formulaire : TopicForm, PostForm, ReportModal

### 7.5 Frontend - Pages
- [x] ForumIndex (`/forum`) - catégories en arbre + sujets récents + stats
- [x] ForumCategory (`/forum/:categorySlug`) - sous-catégories + sujets paginés avec tri
- [x] ForumTopic (`/forum/:categorySlug/:topicId`) - posts paginés + réponse + modération
- [x] ForumCreateTopic, ForumEditTopic, ForumEditPost - formulaires CRUD
- [x] ForumSearch (`/forum/recherche`) - recherche dans sujets et posts
- [x] ForumModeration (`/forum/moderation`) - signalements staff

### 7.6 Fonctionnalités avancées
- [x] Système lu/non-lu avec compteur par catégorie + "Tout marquer comme lu"
- [x] Abonnements aux sujets
- [x] Recherche full-text avec filtres
- [x] Panel de modération (signalements)

---

## Phase 8: Administration et modération ✅

### 8.1 Backend - Base de données
- [x] 3 migrations (moderation_actions, user_sanctions, category_permissions)
- [x] 3 modèles Sequelize : ModerationAction (22 types d'actions), UserSanction (ban/mute), CategoryPermission
- [x] Seeders dev pour les permissions de catégories

### 8.2 Panel d'administration
- [x] Dashboard admin avec statistiques (users, personnages, forum, modération)
- [x] Gestion des utilisateurs (liste paginée, filtres, détail, changement de rôle, activation/désactivation)
- [x] Gestion des personnages (file d'approbation, approve/reject, suppression)
- [x] Gestion des catégories forum (CRUD, réorganisation, déplacement/fusion de sujets)
- [x] Journal d'audit (historique des actions de modération avec filtres)

### 8.3 Outils de modération
- [x] File des signalements de posts (review, accept/reject, suppression optionnelle)
- [x] Historique des actions de modération (22 types d'actions, filtrage par type/modérateur/cible)
- [x] Ban/unban utilisateur (temporaire ou permanent, avec raison)
- [x] Mute/unmute utilisateur (temporaire ou permanent)
- [x] Déplacement de sujets entre catégories (avec vérification permissions)
- [x] Fusion de sujets (transfert des posts, recalcul compteurs)

### 8.4 Système de permissions par catégorie
- [x] 8 types de permissions : access_category, edit_category, create_subcategory, move_category, create_topic, edit_topic, move_topic, merge_topic
- [x] 10 types de bénéficiaires : public, player, player_accepted_rules, player_with_character, player_character_faction, player_character_clan, specific_user, specific_character, game_master, moderator
- [x] Héritage des permissions parent → enfant avec résolution récursive
- [x] Cache en mémoire avec TTL (60s) et invalidation
- [x] API admin : CRUD permissions, permissions effectives (directes + héritées)
- [x] Middleware `requireCategoryPermission` intégré dans les routes forum
- [x] Rétrocompatibilité : accès autorisé si aucune permission définie

### 8.5 Frontend admin
- [x] 7 pages admin : Dashboard, Users, UserDetail, Characters, Forum, Moderation, Logs
- [x] Hooks React (useAdmin.js) : queries paginées + mutations pour toutes les actions
- [x] Services API (adminService.js) : 30+ endpoints couverts
- [x] Design dark theme cohérent, icônes SVG, skeletons de chargement

---

## Phase 9: Sélection de personnage et permissions ✅

> Détails complets : voir `ROADMAP_PHASE_9.md`

### 9.1 Backend - Personnage actif
- [x] Migration : ajout `selected_character_id` (FK nullable) sur table `users`
- [x] Modèle User : champ `selectedCharacterId` + association `belongsTo Character`
- [x] `PUT /api/auth/select-character` - Sélectionner un personnage approuvé
- [x] `DELETE /api/auth/select-character` - Désélectionner le personnage actif
- [x] Eager-loading du personnage sélectionné dans `GET /api/auth/me` et `POST /api/auth/login`
- [x] Hook afterUpdate sur Character : auto-désélection si rejeté/archivé

### 9.2 Frontend - Interface de sélection
- [x] Service + hooks (`useSelectCharacter`, `useDeselectCharacter`)
- [x] Bouton "Sélectionner" sur les CharacterCard approuvées (page Mes Personnages)
- [x] Indicateur visuel "Actif" (badge + bordure dorée) sur le personnage sélectionné
- [x] Affichage du nom du personnage actif dans le Header (desktop + mobile)

### 9.3 Intégration permissions
- [x] `req.user.selectedCharacterId` disponible automatiquement via le middleware `authenticate`
- [x] Compatible avec les grantee types existants : `player_with_character`, `player_character_faction`, `player_character_clan`, `specific_character`

---

## Phase 10: Finitions et optimisations

> Détails complets : voir `ROADMAP_PHASE_10.md`

### 10.1 Profil utilisateur ✅
- [x] Backend API : routes publiques utilisateurs (profil, personnages, posts, sujets)
- [x] Frontend : `userService.js` + 5 hooks (`useUserProfile`, `useUserCharacters`, `useUserPosts`, `useUserTopics`, `useUpdateProfile`)
- [x] Page profil public (`/profil/:id`) — composants ProfileHeader, ProfileTabs, ProfileActivityRow
- [x] Page paramètres du compte (`/profil/parametres`) — ProtectedRoute
- [x] Mise à jour Header : lien "Mon profil" dynamique + lien "Paramètres"
- [x] Usernames cliquables dans le forum (AuthorSidebar, TopicRow)

### 10.2 Optimisations ✅
- [x] Lazy loading des composants (React.lazy + code splitting Vite, SuspenseFallback)
- [x] Optimisation des images (multer + sharp, upload avatar WebP 200×200)
- [x] Mise en cache des requêtes fréquentes (queryCache frontend + Cache-Control/ETag backend)
- [x] SEO : react-helmet-async + composant SEO + sitemap.xml + robots.txt

### 10.3 Tests et qualité ✅
- [x] Tests unitaires backend (18 suites, 479 tests — Jest)
- [x] Tests d'intégration API (4 fichiers — Jest + Supertest)
- [x] Tests composants React (8 suites, 256 tests — Vitest)
- [ ] Tests end-to-end (optionnel — non réalisé)

### 10.4 Déploiement ✅
- [x] Configuration production : `.env.production.example`, helmet, compression, CORS, Vite build optimisé (manualChunks)
- [x] Déployé sur O2Switch (Apache + Passenger Node.js 20, MariaDB 11.4)
- [x] Rate limiting global (100 req/15min) + morgan logging + Sequelize pool (max: 10)
- [x] CI/CD pipeline GitHub Actions (lint + tests + build + deploy)
- [x] Documentation déploiement (`DEPLOYMENT.md`)
- [x] Scripts backup base de données + cron job quotidien (node-cron, 02:00 Europe/Paris)

---

## Ordre de priorité suggéré

| Priorité | Phase | Description | Statut |
|----------|-------|-------------|--------|
| 1 | Phase 1 | Fondations UI - Indispensable pour tout le reste | ✅ |
| 2 | Phase 2 | Pages statiques - Donne vie au site | ✅ |
| 3 | Phase 3 | Auth - Nécessaire pour les fonctionnalités utilisateur | ✅ |
| 4 | Phase 4 | Formulaires - Base pour création de contenu | ✅ |
| 5 | Phase 5 | Pages d'erreur - UX professionnelle | ✅ |
| 6 | Phase 6 | Personnages - Coeur du RP | ✅ |
| 7 | Phase 7 | Forum complet (BDD + API + Frontend + Recherche + Modération) | ✅ |
| 8 | Phase 8 | Administration et modération | ✅ |
| 9 | Phase 9 | Sélection de personnage et permissions | ✅ |
| 10 | Phase 10 | Finitions et optimisations | ✅ |

---

## Notes techniques

- Chaque modèle Sequelize doit avoir sa migration associée
- Utiliser des transactions pour les opérations critiques
- Implémenter la pagination côté serveur dès le début
- Prévoir le responsive design dès la conception des composants
- Documenter les routes API (Swagger/OpenAPI recommandé)
