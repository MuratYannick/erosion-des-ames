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

## Phase 2: Pages de contenu statique

### 2.1 Page Home (Accueil)
- [ ] Section hero avec bannière/image d'accroche
- [ ] Section présentation du jeu (texte d'immersion)
- [ ] Section actualités/annonces récentes
- [ ] Section liens rapides (inscription, règlement, etc.)
- [ ] Intégration des assets visuels (ImageCard)
- [ ] Style de mise en page pour texte long

### 2.2 Page Foreword (Avant-propos/Règlement)
- [ ] Structure de la page
- [ ] Contenu des règles du forum
- [ ] Navigation interne (ancres)
- [ ] Intégration des assets visuels (ImageCard)
- [ ] Style de mise en page pour texte long

### 2.3 Page Univers
- [ ] Présentation du monde/lore
- [ ] Sections thématiques (histoire, géographie, factions, etc.)
- [ ] Intégration des assets visuels (ImageCard)
- [ ] Style de mise en page pour texte long
- [ ] Navigation dans le contenu + aside

### 2.4 Page Character (Personnages prédéfinis/exemples) -> à remanier
- [ ] Liste des personnages types ou prédéfinis
- [ ] Fiches de présentation
- [ ] Filtres par catégorie si nécessaire

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

### 6.4 Composants de formulaire spécialisés
- [x] **MyCharacterCreate** - Formulaire multi-sections pour création de personnage
  - Sections : Identité > Apparence > Personnalité > Histoire > Objectifs
  - Barre de progression dynamique
  - Sauvegarde brouillon
  - Soumission directe pour validation

---

## Phase 7: Forum - Fondations

### 7.1 Composants forum réutilisables
- [ ] **ForumCategory** - Affichage d'une catégorie
- [ ] **ForumTopic** - Affichage d'un sujet dans une liste
- [ ] **ForumPost** - Affichage d'un message
- [ ] **ForumBreadcrumb** - Fil d'Ariane
- [ ] **ForumStats** - Statistiques (messages, membres, etc.)
- [ ] **UserCard** - Carte utilisateur dans les posts (avatar, pseudo, rang, etc.)
- [ ] **QuoteBlock** - Citation d'un message
- [ ] **PostActions** - Boutons d'action (répondre, éditer, signaler, etc.)

### 7.2 Layout forum
- [ ] **Header forum** - Navigation spécifique au forum
- [ ] **Footer forum** - Si différent du footer principal
- [ ] **Layout forum** - Structure globale des pages forum
- [ ] **Sidebar forum** - Informations latérales (stats, qui est en ligne, etc.)

### 7.3 Composants de formulaire spécialisés (cf. Phase 4.6)
- [ ] **TopicForm** - Formulaire de création de sujet forum
  - Sélection catégorie, titre + contenu riche, options modération
- [ ] **PostForm** - Formulaire de réponse à un sujet
  - Citation de message, éditeur riche, sélection de personnage (si RP)

---

## Phase 8: Forum - Base de données -> à remanier

### 8.1 Tables principales du forum
- [ ] Modèle `ForumCategory`
  - id, name, description, order, parent_id, icon, created_at, updated_at
- [ ] Modèle `ForumTopic`
  - id, category_id, user_id, character_id, title, is_pinned, is_locked, views, created_at, updated_at
- [ ] Modèle `ForumPost`
  - id, topic_id, user_id, character_id, content, is_first_post, edited_at, created_at, updated_at
- [ ] Migrations correspondantes
- [ ] Seeders pour catégories et données de test

### 8.2 Tables complémentaires
- [ ] Modèle `TopicRead` - Suivi des sujets lus par utilisateur
- [ ] Modèle `TopicSubscription` - Abonnements aux sujets
- [ ] Modèle `PostLike` - Système de likes (optionnel)
- [ ] Modèle `PostReport` - Signalements

---

## Phase 9: Forum - Permissions -> à remanier

### 9.1 Tables de permissions
- [ ] Modèle `Role`
  - id, name, color, is_staff, order, created_at, updated_at
- [ ] Modèle `Permission`
  - id, name, description
- [ ] Modèle `RolePermission`
  - role_id, permission_id
- [ ] Modèle `CategoryPermission`
  - category_id, role_id, can_view, can_post, can_create_topic, can_moderate
- [ ] Migrations correspondantes
- [ ] Seeders pour rôles par défaut (Admin, Modérateur, Membre, Invité)

### 9.2 Middleware de permissions backend
- [ ] Middleware vérification des permissions
- [ ] Helpers pour vérifier les droits
- [ ] Intégration dans les routes existantes

---

## Phase 10: Forum - Routes API -> à remanier

### 10.1 Routes catégories
- [ ] `GET /api/forum/categories` - Liste des catégories
- [ ] `GET /api/forum/categories/:id` - Détail catégorie avec sujets
- [ ] `POST /api/forum/categories` - Créer catégorie (admin)
- [ ] `PUT /api/forum/categories/:id` - Modifier catégorie (admin)
- [ ] `DELETE /api/forum/categories/:id` - Supprimer catégorie (admin)

### 10.2 Routes sujets
- [ ] `GET /api/forum/topics` - Liste des sujets récents
- [ ] `GET /api/forum/topics/:id` - Détail sujet avec posts
- [ ] `POST /api/forum/topics` - Créer un sujet
- [ ] `PUT /api/forum/topics/:id` - Modifier un sujet
- [ ] `DELETE /api/forum/topics/:id` - Supprimer un sujet
- [ ] `POST /api/forum/topics/:id/lock` - Verrouiller (modération)
- [ ] `POST /api/forum/topics/:id/pin` - Épingler (modération)

### 10.3 Routes posts
- [ ] `GET /api/forum/posts/:id` - Détail d'un post
- [ ] `POST /api/forum/topics/:id/posts` - Répondre à un sujet
- [ ] `PUT /api/forum/posts/:id` - Modifier un post
- [ ] `DELETE /api/forum/posts/:id` - Supprimer un post
- [ ] `POST /api/forum/posts/:id/report` - Signaler un post

---

## Phase 11: Forum - Pages Frontend

### 11.1 Pages principales
- [ ] Page index forum (liste des catégories)
- [ ] Page catégorie (liste des sujets)
- [ ] Page sujet (liste des posts avec pagination)
- [ ] Page création de sujet
- [ ] Page édition de post

### 11.2 Fonctionnalités avancées
- [ ] Recherche dans le forum
- [ ] Filtres et tri des sujets
- [ ] Marquage lu/non-lu
- [ ] Notifications de nouvelles réponses
- [ ] Preview avant publication

---

## Phase 12: Administration et modération

### 12.1 Panel d'administration
- [ ] Dashboard admin (statistiques générales)
- [ ] Gestion des utilisateurs (liste, ban, édition)
- [ ] Gestion des rôles et permissions
- [ ] Gestion des catégories forum
- [ ] Gestion des personnages (validation, suppression)

### 12.2 Outils de modération
- [ ] File des signalements
- [ ] Historique des actions de modération
- [ ] Outils de ban/mute utilisateur
- [ ] Déplacement/fusion de sujets

---

## Phase 13: Finitions et optimisations

### 13.1 Profil utilisateur
- [ ] Page profil public
- [ ] Page paramètres du compte
- [ ] Historique des posts
- [ ] Liste des personnages

### 13.2 Optimisations
- [ ] Lazy loading des composants
- [ ] Optimisation des images
- [ ] Mise en cache des requêtes fréquentes
- [ ] SEO (meta tags, sitemap)

### 13.3 Tests et qualité
- [ ] Tests unitaires backend
- [ ] Tests d'intégration API
- [ ] Tests composants React
- [ ] Tests end-to-end (optionnel)

### 13.4 Déploiement
- [ ] Configuration environnement production
- [ ] CI/CD pipeline
- [ ] Documentation déploiement
- [ ] Backup base de données

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
| 7 | Phase 7-8 | Forum fondations + BDD | |
| 8 | Phase 9 | Permissions - Sécurité du forum | |
| 9 | Phase 10-11 | Forum complet | |
| 10 | Phase 12 | Administration | |
| 11 | Phase 13 | Finitions | |

---

## Notes techniques

- Chaque modèle Sequelize doit avoir sa migration associée
- Utiliser des transactions pour les opérations critiques
- Implémenter la pagination côté serveur dès le début
- Prévoir le responsive design dès la conception des composants
- Documenter les routes API (Swagger/OpenAPI recommandé)
