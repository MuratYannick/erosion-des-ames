# Roadmap - Erosion des Ames

## Vue d'ensemble du projet

**Stack technique:**
- Frontend: React 19 + Vite + TailwindCSS + React Router
- Backend: Express 5 + Sequelize ORM
- Base de données: MySQL

---

## Phase 1: Fondations UI

### 1.1 Configuration du système de design
- [ ] Définir la palette de couleurs dans `tailwind.config.js`
- [ ] Définir la typographie (fonts, tailles)
- [ ] Définir les espacements et breakpoints responsive
- [ ] Créer les variables CSS custom si nécessaire

### 1.2 Composants principaux réutilisables
- [ ] **Button** - Variantes: primary, secondary, outline, danger, disabled
- [ ] **MenuBurgerButton**
- [ ] **Input** - Text, email, password, textarea avec états (error, success, disabled)
- [ ] **Card** - Container réutilisable avec variantes
- [ ] **ImageCard** - container pour image réutilisable avec FX variants
- [ ] **Modal** - Fenêtre modale avec overlay
- [ ] **Loader/Spinner** - Indicateur de chargement
- [ ] **Alert/Toast** - Messages de notification (success, error, warning, info)
- [ ] **Avatar** - Affichage d'image utilisateur avec fallback
- [ ] **Badge** - Labels et tags
- [ ] **Dropdown** - Menu déroulant
- [ ] **Pagination** - Navigation entre pages
- [ ] **Tooltip** - Info-bulles

### 1.3 Layouts - Header et Footer communs
- [ ] **Header principal** - Logo, navigation, liens connexion/inscription, menu burger, banière (dans `/temp`)
- [ ] **Footer principal** - Liens utiles, mentions légales, réseaux sociaux
- [ ] **Layout principal** - Wrapper avec Header + Footer + contenu
- [ ] **Sidebar** (optionnel) - Navigation latérale si nécessaire

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

## Phase 3: Backend - Base utilisateurs et authentification -> validation email

### 3.1 Table User
- [ ] Créer le modèle Sequelize `User`
  - id, username, email, password (hashé), avatar, role, created_at, updated_at
- [ ] Créer la migration correspondante
- [ ] Créer les seeders pour données de test (admin, utilisateurs test)

### 3.2 Configuration sécurité backend
- [ ] Installer et configurer `bcrypt` pour le hashage des mots de passe
- [ ] Installer et configurer `jsonwebtoken` (JWT) pour l'authentification
- [ ] Créer les middlewares d'authentification
- [ ] Configurer les variables d'environnement (JWT_SECRET, etc.)

### 3.3 Routes API authentification
- [ ] `POST /api/auth/register` - Inscription
- [ ] `POST /api/auth/login` - Connexion
- [ ] `POST /api/auth/logout` - Déconnexion
- [ ] `GET /api/auth/me` - Récupérer l'utilisateur connecté
- [ ] `POST /api/auth/forgot-password` - Mot de passe oublié
- [ ] `POST /api/auth/reset-password` - Réinitialisation mot de passe

### 3.4 Frontend - Login/Sign-up
- [ ] Page de connexion
- [ ] Page d'inscription
- [ ] Page mot de passe oublié
- [ ] Gestion du state d'authentification (Context API ou autre)
- [ ] Protection des routes privées
- [ ] Stockage du token (localStorage/cookies)

---

## Phase 4: Formulaires

### 4.1 Composants de formulaire avancés
- [ ] **Form** - Wrapper avec gestion de validation
- [ ] **Select** - Liste déroulante stylisée
- [ ] **Checkbox/Radio** - Cases à cocher et boutons radio
- [ ] **FileUpload** - Upload d'images/fichiers
- [ ] **DatePicker** - Sélecteur de date (si nécessaire)
- [ ] **RichTextEditor** - Éditeur de texte riche pour les posts

### 4.2 Validation et gestion d'erreurs
- [ ] Système de validation côté client
- [ ] Affichage des erreurs inline
- [ ] Messages d'erreur standardisés

---

## Phase 5: Pages d'erreur HTTP personnalisées

### 5.1 Pages d'erreur
- [ ] **Page 404** - Page non trouvée
- [ ] **Page 403** - Accès interdit
- [ ] **Page 500** - Erreur serveur
- [ ] **Page de maintenance** (optionnel)

### 5.2 Gestion des erreurs
- [ ] Composant ErrorBoundary React
- [ ] Redirection automatique vers les pages d'erreur
- [ ] Style cohérent avec le reste du site

---

## Phase 6: Système de personnages joueurs  -> à remanier

### 6.1 Tables pour les personnages
- [ ] Modèle `Character`
  - id, user_id, name, avatar, age, race, class, background, description, status, created_at, updated_at
- [ ] Modèle `CharacterStats` (si système de stats)
- [ ] Modèle `CharacterInventory` (si système d'inventaire)
- [ ] Migrations correspondantes
- [ ] Relations avec User (un user peut avoir plusieurs personnages)

### 6.2 Routes API personnages
- [ ] `GET /api/characters` - Liste des personnages (avec pagination)
- [ ] `GET /api/characters/:id` - Détail d'un personnage
- [ ] `POST /api/characters` - Créer un personnage
- [ ] `PUT /api/characters/:id` - Modifier un personnage
- [ ] `DELETE /api/characters/:id` - Supprimer un personnage
- [ ] `GET /api/users/:id/characters` - Personnages d'un utilisateur

### 6.3 Frontend - Gestion des personnages
- [ ] Page liste des personnages de l'utilisateur
- [ ] Page création de personnage (formulaire multi-étapes?)
- [ ] Page détail/fiche de personnage
- [ ] Page édition de personnage
- [ ] Validation du personnage par un admin (si nécessaire)

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

| Priorité | Phase | Description |
|----------|-------|-------------|
| 1 | Phase 1 | Fondations UI - Indispensable pour tout le reste |
| 2 | Phase 2 | Pages statiques - Donne vie au site |
| 3 | Phase 3 | Auth - Nécessaire pour les fonctionnalités utilisateur |
| 4 | Phase 4 | Formulaires - Base pour création de contenu |
| 5 | Phase 5 | Pages d'erreur - UX professionnelle |
| 6 | Phase 6 | Personnages - Coeur du RP |
| 7 | Phase 7-8 | Forum fondations + BDD |
| 8 | Phase 9 | Permissions - Sécurité du forum |
| 9 | Phase 10-11 | Forum complet |
| 10 | Phase 12 | Administration |
| 11 | Phase 13 | Finitions |

---

## Notes techniques

- Chaque modèle Sequelize doit avoir sa migration associée
- Utiliser des transactions pour les opérations critiques
- Implémenter la pagination côté serveur dès le début
- Prévoir le responsive design dès la conception des composants
- Documenter les routes API (Swagger/OpenAPI recommandé)
