# État d'avancement - L'Érosion des Âmes

Ce document trace l'évolution du développement du projet.

## ✅ Fonctionnalités complétées

### Backend (API Express + Sequelize)

#### Configuration et Infrastructure
- [x] Configuration Express 5.1.0 avec ES Modules
- [x] Configuration Sequelize 6.37.7 avec MySQL
- [x] Architecture modulaire (game/forum/content)
- [x] Middleware de gestion d'erreurs globale
- [x] Configuration CORS pour développement
- [x] Variables d'environnement (.env)
- [x] Scripts de démarrage (dev/production)

#### Authentification et Sécurité
- [x] Système d'authentification JWT complet
- [x] Hashage des mots de passe (bcryptjs)
- [x] Middleware de protection des routes (`authMiddleware.protect`)
- [x] Système de rôles (ADMIN, MODERATOR, GAME_MASTER, PLAYER)
- [x] Gestion des tentatives de connexion échouées
- [x] Verrouillage de compte après tentatives multiples
- [x] Système d'acceptation des CGU (`terms_accepted`)
- [x] Système d'acceptation du règlement du forum (`forum_rules_accepted`)
- [x] Vérification automatique des acceptations à la connexion

#### Modèles de données
**Game Models** :
- [x] User (utilisateur avec rôles et acceptations)
- [x] Faction (factions jouables et non-jouables)
- [x] Clan (clans/castes avec spécialisations)
- [x] Character (personnages avec stats et progression)

**Forum Models** :
- [x] Category (catégories de forum)
- [x] Section (sections hiérarchiques avec sous-sections)
- [x] Topic (sujets de discussion avec pinning/locking)
- [x] Post (messages dans les topics)
- [x] ForumPermission (système de permissions granulaire)

**Content Models** :
- [x] Home (contenu page d'accueil)
- [x] Intro (contenu page d'introduction)
- [x] Lore (contenu page lore/univers)

#### Routes API

**Authentification** (`/api/auth`) :
- [x] POST `/register` - Inscription
- [x] POST `/login` - Connexion
- [x] GET `/me` - Profil utilisateur (protégé)
- [x] POST `/accept-terms` - Acceptation CGU (protégé)
- [x] POST `/accept-forum-rules` - Acceptation règlement forum (protégé)

**Personnages** (`/api/characters`) - Toutes protégées :
- [x] POST `/` - Créer un personnage
- [x] GET `/` - Liste des personnages de l'utilisateur
- [x] GET `/:id` - Détails d'un personnage
- [x] PUT `/:id` - Modifier un personnage
- [x] DELETE `/:id` - Supprimer un personnage

**Factions** (`/api/factions`) :
- [x] GET `/` - Liste des factions
- [x] GET `/playable` - Factions jouables
- [x] GET `/:id` - Détails d'une faction

**Clans** (`/api/clans`) :
- [x] GET `/` - Liste des clans
- [x] GET `/type/:type` - Clans par type
- [x] GET `/faction/:factionId` - Clans par faction
- [x] GET `/:id` - Détails d'un clan

**Portail** (`/api/portal`) :
- [x] GET `/home` - Contenu page d'accueil
- [x] GET `/intro` - Contenu introduction
- [x] GET `/lore` - Contenu lore
- [x] GET `/rules` - Règles et CGU
- [x] GET `/wiki` - Wiki

**Forum** (`/api/forum`) :
- [x] **Categories** : GET (liste, détail par slug)
- [x] **Sections** : CRUD complet + move + hiérarchie
- [x] **Topics** : CRUD complet + move + pin + lock
- [x] **Posts** : CRUD complet + move
- [x] **Permissions** : GET/PUT permissions + héritage

#### Fonctionnalités Forum Backend
- [x] Structure hiérarchique (Category > Section > Subsection > Topic > Post)
- [x] Slugs uniques avec génération automatique
- [x] Validation des doublons (noms de sections, titres de topics)
- [x] Système de soft-delete avec réutilisation des slugs
- [x] Déplacement de sections (vers catégorie ou sous-section)
- [x] Déplacement de topics (vers autre section avec validation)
- [x] Déplacement de posts (vers autre topic)
- [x] Topic pinning (épinglage en haut)
- [x] Topic locking (verrouillage des réponses)
- [x] Compteur de vues sur topics
- [x] Suivi des éditions de posts (`edited_at`)
- [x] Auteurs multiples (User + Character pour RP)
- [x] Protection contre boucles infinies (déplacement sections)
- [x] Système de permissions à 5 couches (voir détails ci-dessous)

#### Système de Permissions Avancé
- [x] Modèle ForumPermission avec 4 types d'opérations (view, create, update, delete)
- [x] 5 niveaux de permissions par opération :
  1. [x] Permissions par rôle (6 niveaux : admin → tous)
  2. [x] Exception auteur (autorisation spéciale)
  3. [x] Exigences de personnage (vivant, membre clan/faction, leader)
  4. [x] Règles personnage auteur (exclusif/inclusif)
  5. [x] Exigences d'acceptation (CGU + règlement forum)
- [x] Application aux catégories, sections et topics
- [x] Héritage de permissions depuis entités parentes
- [x] API complète (GET/PUT permissions, POST inherit)
- [x] Permissions par défaut pour entités sans règles

#### Scripts et Utilitaires
- [x] Script de seeding production (`npm run seed`)
  - Factions et clans de base
  - Catégories forum minimales
- [x] Script de seeding développement (`npm run seed:dev`)
  - Utilisateurs de test (admin, modérateur, joueurs)
  - Personnages de test
  - Forum complet (catégories, sections, topics, posts)
  - Données de test pour permissions
- [x] Utilitaires JWT (sign, verify)
- [x] Utilitaires bcrypt (hash, compare)

### Frontend (React + Vite + TailwindCSS)

#### Configuration et Infrastructure
- [x] Configuration Vite 7.1.7 avec React 19.1.1
- [x] Configuration TailwindCSS 3.4.18 personnalisée
- [x] Thème visuel post-apocalyptique (palettes city/ochre/blood/nature)
- [x] Polices personnalisées (Metal Mania, Permanent Marker)
- [x] React Router 7.9.3 pour la navigation
- [x] Proxy API vers backend (port 3000)
- [x] Configuration ESLint

#### Contextes et État Global
- [x] AuthContext complet avec :
  - Connexion/déconnexion
  - Stockage JWT dans localStorage
  - Vérification automatique du profil au chargement
  - Fonction centralisée `authenticatedFetch`
  - Déconnexion automatique sur erreur 401
  - Acceptation CGU et règlement forum
  - Mise à jour du state utilisateur

#### Layouts
- [x] PortalLayout (pages statiques)
  - PortalHeader avec navigation responsive
  - PortalBody avec styles unifiés
  - PortalFooter
  - Menu burger animé
  - ConnectBar dynamique (connecté/déconnecté)
- [x] ForumLayout (pages forum)
  - ForumHeader avec UserBar
  - ForumBody avec système de styles exporté
  - ForumFooter
  - Breadcrumb (fil d'Ariane)

#### Pages Portail
- [x] HomePage - Page d'accueil avec containers thématiques
- [x] IntroPage - Introduction/présentation
- [x] LorePage - Lore et univers du jeu
- [x] RulesPage - Règles du jeu et CGU
- [x] WikiPage - Wiki des objets/lieux
- [x] LoginPage - Connexion avec validation
- [x] RegisterPage - Inscription avec validation

#### Pages Forum
- [x] ForumGeneralPage - Vue générale (liste des sections)
- [x] ForumCategoryPage - Vue catégorie avec sections
- [x] ForumSectionPage - Vue section avec topics et sous-sections
- [x] ForumTopicPage - Vue topic avec posts

#### Composants UI Réutilisables
**Base** :
- [x] Card - Carte modulaire
- [x] InputField - Champ de formulaire
- [x] PrimaryButton / SecondaryButton
- [x] Modal - Modal générique
- [x] ConfirmDialog - Dialogue de confirmation (3 types)
- [x] Breadcrumb - Fil d'Ariane hiérarchique
- [x] Navbar / UserBar / ConnectBar
- [x] BurgerButton / BurgerPanel
- [x] CloseButton
- [x] Aside - Barre latérale

**Système CGU** :
- [x] TermsAcceptance - Alerte sur forum
- [x] TermsAcceptanceBox - Boîte de validation
- [x] TermsGuard - Protection de routes
- [x] TermsModal - Modal CGU complètes

**Système Règlement Forum** :
- [x] ForumRulesAcceptance - Alerte sur forum
- [x] ForumRulesAcceptanceBox - Boîte de validation
- [x] ForumRulesGuard - Protection de routes
- [x] ForumRulesModal - Modal règlement en 7 sections

#### Composants Forum (CRUD)
**Sections** :
- [x] CreateSectionForm - Création section/sous-section
- [x] EditSectionForm - Édition avec confirmation
- [x] MoveSectionForm - Déplacement avec validation

**Topics** :
- [x] CreateTopicForm - Création avec premier post
- [x] EditTopicForm - Édition + verrouillage
- [x] MoveTopicForm - Déplacement entre sections

**Posts** :
- [x] CreatePostForm - Réponse à un topic
- [x] MovePostForm - Déplacement entre topics

**Permissions** :
- [x] PermissionsForm - Gestion des permissions avec onglets (view/create/update/delete)

#### Fonctionnalités Forum Frontend
- [x] Affichage hiérarchique (catégories > sections > topics > posts)
- [x] Fil d'Ariane dynamique (breadcrumb)
- [x] CRUD complet sections (créer, éditer, déplacer, supprimer)
- [x] CRUD complet topics (créer, éditer, déplacer, supprimer)
- [x] Support sous-sections (hiérarchie récursive)
- [x] Verrouillage de topics (désactive réponses)
- [x] Épinglage de topics (affichage prioritaire)
- [x] Poster en tant qu'utilisateur ou personnage (RP)
- [x] Dialogues de confirmation (warning, danger, info)
- [x] Gestion d'erreurs avec messages explicites
- [x] Validation côté client (champs requis, longueurs)
- [x] Interface de gestion des permissions (par opération)
- [x] Héritage de permissions (bouton dédié)

#### Effets Visuels
- [x] Effet sépia dynamique au hover (images)
- [x] Transitions fluides (500ms-1000ms)
- [x] Hover effects (scale, shadow, color)
- [x] Animations menu burger
- [x] Design responsive (breakpoints Tailwind)

## 🚧 En développement

### Backend
- [ ] Modèles de contenu pour Rules et Wiki (actuellement statiques)
- [ ] Système de modération (rapports, bannissements)
- [ ] Édition/suppression de posts individuels
- [ ] Système de notifications
- [ ] Pagination des résultats (topics longs, posts)
- [ ] Recherche dans le forum
- [ ] Upload d'avatars utilisateur
- [ ] Système de badges/récompenses

### Frontend
- [ ] Page de création de personnage
- [ ] Tableau de bord des personnages
- [ ] Affichage avatar/signature utilisateur
- [ ] Système de pagination (topics/posts)
- [ ] Bouton "Citer" pour répondre à un post spécifique
- [ ] Système de likes/upvotes
- [ ] Recherche forum (UI)
- [ ] Éditeur riche pour posts (markdown, BBCode)
- [ ] Prévisualisation posts avant publication
- [ ] Historique d'édition des posts

## 📋 Planifié

### Fonctionnalités Jeu
- [ ] Système d'inventaire
- [ ] Système de combat
- [ ] Exploration des zones
- [ ] Carte du monde interactive
- [ ] Quêtes et missions
- [ ] Système de crafting
- [ ] Économie/Commerce entre joueurs
- [ ] Marketplace

### Fonctionnalités Sociales
- [ ] Chat en temps réel (WebSocket)
- [ ] Système de guildes/alliances
- [ ] Messages privés entre joueurs
- [ ] Système d'amis/blocage
- [ ] Profils utilisateur publics

### Fonctionnalités Communautaires
- [ ] Événements dynamiques
- [ ] Classements (leaderboards)
- [ ] Statistiques utilisateur/forum
- [ ] Wiki collaboratif
- [ ] Galerie d'images/fan art
- [ ] Système de vote (sondages)

### Administration
- [ ] Panel d'administration complet
- [ ] Outils de modération (ban, mute, warnings)
- [ ] Logs d'activité
- [ ] Statistiques du serveur
- [ ] Gestion des rôles/permissions UI
- [ ] Système de backup automatique

### Optimisation et Qualité
- [ ] Tests unitaires (backend)
- [ ] Tests d'intégration (API)
- [ ] Tests E2E (frontend)
- [ ] Documentation API (Swagger/OpenAPI)
- [ ] Optimisation des requêtes SQL
- [ ] Cache Redis
- [ ] CDN pour assets statiques
- [ ] Monitoring et alertes

## 🔄 Dernières mises à jour importantes

### Janvier 2025
- ✅ Implémentation du système de permissions avancé (5 couches)
- ✅ Composant PermissionsForm avec interface par onglets
- ✅ API de gestion et héritage des permissions
- ✅ Intégration UI sur pages forum (catégorie, section, topic)

### Décembre 2024
- ✅ Amélioration validation sections/topics (doublons, slugs)
- ✅ Système d'acceptation du règlement du forum
- ✅ Composants ForumRules (Acceptance, Box, Guard, Modal)
- ✅ Correction authentification forum (authenticatedFetch)
- ✅ Fix déconnexion lors d'opérations CRUD

---

**Dernière mise à jour** : 18 janvier 2025
