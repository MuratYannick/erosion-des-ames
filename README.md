# L'Érosion des Âmes

Jeu de rôle post-apocalyptique en ligne où mutants et non-mutants s'affrontent dans un monde dévasté par le cataclysme.

> **🆕 Dernières mises à jour** :
> - **🔐 Système de gestion des permissions avancé** : Implémentation d'un système de permissions granulaire à 5 couches
>   - **Modèle ForumPermission** : Base de données avec support de permissions par opération (view, create, update, delete)
>   - **5 niveaux de permissions** :
>     1. Permissions par rôle (admin seul → tous les utilisateurs)
>     2. Exception auteur (autorisation spéciale pour l'auteur d'origine)
>     3. Exigences de personnage (personnage vivant, membre de clan/faction, leader de clan)
>     4. Règles pour personnage auteur (mode exclusif ou inclusif)
>     5. Exigences d'acceptation (CGU et règlement du forum)
>   - **Permissions par entité** : Application aux catégories, sections et topics
>   - **Héritage de permissions** : Possibilité d'hériter des permissions parentes
>   - **Interface de gestion** : Composant PermissionsForm avec onglets par opération
>   - **API complète** : Routes GET/PUT pour gérer et hériter les permissions
>   - **Intégration UI** : Boutons de gestion ajoutés sur ForumCategoryPage, ForumSectionPage, ForumTopicPage
> - **🔧 Amélioration gestion des sections et topics** : Validation avancée des noms et slugs
>   - **Sections** :
>     - Empêche la création de sections avec le même nom au même niveau (même parent direct ou catégorie)
>     - Validation lors de la création, édition et déplacement de sections
>     - Génération automatique de slugs uniques avec suffixe incrémental (`section-1`, `section-2`, etc.)
>     - Soft-delete avec vidage du slug pour permettre la réutilisation après suppression
>   - **Topics** :
>     - Empêche la création de topics avec le même titre dans la même section
>     - Validation lors de la création, édition et déplacement de topics
>     - Génération automatique de slugs uniques avec suffixe incrémental (`topic-1`, `topic-2`, etc.)
>     - Soft-delete avec vidage du slug pour permettre la réutilisation après suppression
>     - Empêche le déplacement d'un topic vers une section contenant déjà un topic avec le même titre
>   - Messages d'erreur explicites : "Une section avec ce nom existe déjà au même niveau" / "Un topic avec ce titre existe déjà dans cette section"
> - **📜 Système d'acceptation du règlement du forum** : Implémentation complète en parallèle des CGU
>   - Ajout de `forum_rules_accepted` et `forum_rules_accepted_at` dans le modèle User
>   - Nouvelle route `POST /api/auth/accept-forum-rules` pour accepter le règlement
>   - Fonction `acceptForumRules()` dans AuthContext avec mise à jour du state utilisateur
>   - 4 nouveaux composants UI : ForumRulesAcceptance, ForumRulesAcceptanceBox, ForumRulesGuard, ForumRulesModal
>   - Règlement complet en 7 sections : respect, contenu, organisation, roleplay, modération, signalement, modifications
>   - Bandeau d'alerte sur toutes les pages forum (ForumGeneralPage, ForumCategoryPage, ForumTopicPage)
>   - Boîte d'acceptation dédiée sur le topic du règlement (slug: "reglement")
>   - Mise à jour du seedDev avec données de test (player_neutral n'a pas accepté le règlement)
> - **🔐 Correction authentification forum** : Refactorisation complète de la gestion des tokens JWT
>   - Nouvelle fonction `authenticatedFetch` dans `AuthContext` pour centraliser toutes les requêtes authentifiées
>   - Déconnexion automatique en cas de token invalide/expiré (erreur 401)
>   - Mise à jour de tous les formulaires forum (7 composants) pour utiliser `authenticatedFetch`
>   - Mise à jour des pages forum (ForumTopicPage, ForumSectionPage, ForumCategoryPage)
>   - **Fix critique** : L'utilisateur n'est plus déconnecté lors des opérations CRUD sur le forum

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

# OU pour le développement avec données de test complètes (forum inclus)
npm run seed:dev

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

### Polices (Google Fonts)

- **Titre du jeu** : Metal Mania (cursive dramatique) - `font-titre-Jeu`
- **Corps de texte** : Permanent Marker (écriture manuscrite) - `font-texte-corps`
- **Alternatives** : Bangers, Creepster

### Effets visuels

- **Effet sépia dynamique** : Les images passent de sépia(65%) à sépia(0%) au hover (transition 5s ease-in-out)
- **Animations** : Menu burger avec transitions fluides (duration-500ms à 1000ms)
- **Hover effects** : Scale-105, shadow transitions, color shifts
- **Bouton fermeture** : SVG text "X" en Permanent Marker (ochre-400 → blood-700)
- **Responsive** : Design adaptatif avec breakpoints Tailwind (sm, md, lg, xl, 2xl)

## 📝 Scripts disponibles

### Backend
```bash
npm start         # Démarrer en production
npm run dev       # Démarrer en développement (nodemon)
npm run seed      # Réinitialiser et remplir la BDD (production - données minimales)
npm run seed:dev  # Réinitialiser et remplir la BDD (dev - avec données forum de test)
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
