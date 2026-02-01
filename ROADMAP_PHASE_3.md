# Phase 3: Backend - Base utilisateurs et authentification

**Branche**: `feature/phase-3-auth`

---

## Vue d'ensemble

Cette phase consiste à implémenter le système d'authentification complet :
- Modèle utilisateur avec Sequelize
- API d'authentification (register, login, logout, password reset)
- Validation par email
- Pages frontend de connexion/inscription
- Gestion du state d'authentification

### Stack technique utilisée
- **Backend**: Express 5 + Sequelize ORM + MySQL
- **Sécurité**: bcrypt (hashage), jsonwebtoken (JWT)
- **Email**: nodemailer (validation email, reset password)
- **Frontend**: React 19 + Context API (auth state)

---

## 3.1 Table User - Modèle Sequelize

### Structure des fichiers
```
backend/
├── models/
│   └── User.js                    # Modèle Sequelize User
├── migrations/
│   └── XXXXXX-create-user.js      # Migration création table users
├── seeders/
│   └── XXXXXX-demo-users.js       # Seeders utilisateurs de test
```

### Modèle User
- [ ] Créer le modèle `User.js`
  ```javascript
  {
    id: UUID (primary key, auto-generated),
    username: STRING(50), unique, not null,
    email: STRING(255), unique, not null,
    password: STRING(255), not null (hashé bcrypt),
    avatar: STRING(255), nullable (URL ou chemin),
    role: ENUM('user', 'moderator', 'admin'), default 'user',
    isEmailVerified: BOOLEAN, default false,
    emailVerificationToken: STRING(255), nullable,
    emailVerificationExpires: DATE, nullable,
    passwordResetToken: STRING(255), nullable,
    passwordResetExpires: DATE, nullable,
    lastLoginAt: DATE, nullable,
    createdAt: DATE,
    updatedAt: DATE
  }
  ```
- [ ] Ajouter les hooks Sequelize :
  - `beforeCreate`: Hasher le mot de passe avec bcrypt
  - `beforeUpdate`: Hasher le mot de passe si modifié
- [ ] Ajouter les méthodes d'instance :
  - `validatePassword(password)`: Compare le password avec le hash
  - `generateAuthToken()`: Génère un JWT
  - `generateEmailVerificationToken()`: Token de validation email
  - `generatePasswordResetToken()`: Token de reset password
- [ ] Ajouter les scopes Sequelize :
  - `withoutPassword`: Exclut le champ password des requêtes

### Migration
- [ ] Créer la migration `create-user.js`
- [ ] Ajouter les index sur `email` et `username`
- [ ] Ajouter les contraintes d'unicité

### Seeders
- [ ] Créer le seeder `demo-users.js` avec :
  - 1 admin (admin@erosion.local / Admin123!)
  - 1 moderator (mod@erosion.local / Mod123!)
  - 2-3 utilisateurs test (user1@erosion.local / User123!)

---

## 3.2 Configuration sécurité backend

### Structure des fichiers
```
backend/
├── config/
│   └── auth.js                    # Configuration JWT et sécurité
├── middlewares/
│   ├── auth.js                    # Middleware d'authentification JWT
│   ├── validate.js                # Middleware de validation des requêtes
│   └── rateLimit.js               # Rate limiting (optionnel)
├── utils/
│   ├── jwt.js                     # Helpers JWT (sign, verify)
│   ├── password.js                # Helpers bcrypt
│   └── email.js                   # Service d'envoi d'emails
```

### Dépendances à installer
- [ ] `bcrypt` - Hashage des mots de passe
- [ ] `jsonwebtoken` - Génération et vérification JWT
- [ ] `nodemailer` - Envoi d'emails
- [ ] `express-validator` - Validation des requêtes
- [ ] `express-rate-limit` - Protection contre le brute force (optionnel)

### Configuration
- [ ] Créer `config/auth.js` avec les constantes :
  ```javascript
  {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '7d',
    jwtRefreshExpiresIn: '30d',
    bcryptSaltRounds: 12,
    emailVerificationExpiresIn: 24 * 60 * 60 * 1000, // 24h
    passwordResetExpiresIn: 60 * 60 * 1000, // 1h
  }
  ```

### Variables d'environnement (.env)
- [ ] Mettre à jour `.env.example` avec :
  ```
  # JWT
  JWT_SECRET=your-super-secret-jwt-key-change-in-production
  JWT_EXPIRES_IN=7d

  # Email (SMTP)
  SMTP_HOST=smtp.example.com
  SMTP_PORT=587
  SMTP_USER=your-email@example.com
  SMTP_PASS=your-email-password
  EMAIL_FROM=noreply@erosion-des-ames.com

  # Frontend URL (pour les liens dans les emails)
  FRONTEND_URL=http://localhost:5173
  ```

### Middlewares
- [ ] Créer `middlewares/auth.js` :
  - `authenticate`: Vérifie le JWT et attache `req.user`
  - `authorize(...roles)`: Vérifie le rôle de l'utilisateur
  - `optionalAuth`: Authentification optionnelle (attach user if token present)

- [ ] Créer `middlewares/validate.js` :
  - Wrapper pour express-validator
  - Gestion centralisée des erreurs de validation

### Utilitaires
- [ ] Créer `utils/jwt.js` :
  - `signToken(userId)`: Génère un JWT
  - `verifyToken(token)`: Vérifie et décode un JWT

- [ ] Créer `utils/password.js` :
  - `hashPassword(password)`: Hash avec bcrypt
  - `comparePassword(password, hash)`: Compare password et hash

- [ ] Créer `utils/email.js` :
  - `sendEmail(to, subject, html)`: Envoi d'email générique
  - `sendVerificationEmail(user, token)`: Email de vérification
  - `sendPasswordResetEmail(user, token)`: Email de reset password
  - `sendWelcomeEmail(user)`: Email de bienvenue après vérification

---

## 3.3 Routes API authentification

### Structure des fichiers
```
backend/
├── routes/
│   ├── index.js                   # Router principal
│   └── auth.js                    # Routes d'authentification
├── controllers/
│   └── authController.js          # Logique métier authentification
├── validators/
│   └── authValidators.js          # Règles de validation
```

### Routes à implémenter

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| POST | `/api/auth/register` | Inscription | Non |
| POST | `/api/auth/login` | Connexion | Non |
| POST | `/api/auth/logout` | Déconnexion | Oui |
| GET | `/api/auth/me` | Utilisateur connecté | Oui |
| POST | `/api/auth/verify-email` | Vérifier email | Non |
| POST | `/api/auth/resend-verification` | Renvoyer email vérification | Non |
| POST | `/api/auth/forgot-password` | Demande reset password | Non |
| POST | `/api/auth/reset-password` | Reset password avec token | Non |
| PUT | `/api/auth/change-password` | Changer password (connecté) | Oui |
| PUT | `/api/auth/update-profile` | Modifier profil | Oui |

### Détail des endpoints

#### POST /api/auth/register
- [ ] Implémenter l'inscription
- [ ] Validation : username (3-50 chars, alphanum), email (valide), password (min 8 chars, 1 maj, 1 chiffre)
- [ ] Vérifier unicité email et username
- [ ] Hasher le password
- [ ] Générer token de vérification email
- [ ] Envoyer email de vérification
- [ ] Retourner user (sans password) + message

#### POST /api/auth/login
- [ ] Implémenter la connexion
- [ ] Validation : email, password
- [ ] Vérifier email existe
- [ ] Vérifier password correct
- [ ] Vérifier email vérifié (optionnel selon config)
- [ ] Générer JWT
- [ ] Mettre à jour lastLoginAt
- [ ] Retourner user + token

#### POST /api/auth/logout
- [ ] Implémenter la déconnexion
- [ ] Invalider le token côté client (pas de blacklist pour v1)
- [ ] Retourner success

#### GET /api/auth/me
- [ ] Retourner l'utilisateur connecté (sans password)
- [ ] Middleware authenticate requis

#### POST /api/auth/verify-email
- [ ] Vérifier le token de validation
- [ ] Marquer isEmailVerified = true
- [ ] Effacer les tokens de vérification
- [ ] Envoyer email de bienvenue
- [ ] Retourner success

#### POST /api/auth/resend-verification
- [ ] Vérifier que l'email existe et n'est pas vérifié
- [ ] Générer nouveau token
- [ ] Renvoyer email de vérification
- [ ] Rate limiting (1 email / 2 min)

#### POST /api/auth/forgot-password
- [ ] Vérifier que l'email existe
- [ ] Générer token de reset
- [ ] Envoyer email avec lien de reset
- [ ] Retourner success (même si email n'existe pas - sécurité)

#### POST /api/auth/reset-password
- [ ] Vérifier le token de reset
- [ ] Vérifier que le token n'est pas expiré
- [ ] Hasher le nouveau password
- [ ] Effacer les tokens de reset
- [ ] Retourner success

#### PUT /api/auth/change-password
- [ ] Middleware authenticate requis
- [ ] Vérifier ancien password correct
- [ ] Hasher et sauvegarder nouveau password
- [ ] Retourner success

#### PUT /api/auth/update-profile
- [ ] Middleware authenticate requis
- [ ] Permettre modification de username et avatar
- [ ] Vérifier unicité du nouveau username
- [ ] Retourner user mis à jour

---

## 3.4 Frontend - Pages d'authentification

### Structure des fichiers
```
frontend/src/
├── contexts/
│   └── AuthContext.jsx            # Context d'authentification
├── hooks/
│   └── useAuth.js                 # Hook custom pour auth
├── services/
│   └── authService.js             # Appels API authentification
├── pages/
│   ├── Auth/
│   │   ├── Login.jsx              # Page de connexion
│   │   ├── Login.css
│   │   ├── Register.jsx           # Page d'inscription
│   │   ├── Register.css
│   │   ├── ForgotPassword.jsx     # Page mot de passe oublié
│   │   ├── ForgotPassword.css
│   │   ├── ResetPassword.jsx      # Page réinitialisation
│   │   ├── ResetPassword.css
│   │   ├── VerifyEmail.jsx        # Page vérification email
│   │   ├── VerifyEmail.css
│   │   ├── components/
│   │   │   ├── AuthLayout.jsx     # Layout pages auth
│   │   │   ├── AuthLayout.css
│   │   │   └── index.js
│   │   └── index.js
├── components/
│   └── ProtectedRoute.jsx         # HOC pour routes protégées
```

### AuthContext et useAuth
- [ ] Créer `AuthContext.jsx` :
  - State: user, isAuthenticated, isLoading, error
  - Actions: login, register, logout, updateUser
  - Persistance du token (localStorage)
  - Récupération auto de l'utilisateur au chargement

- [ ] Créer `useAuth.js` :
  - Hook wrapper pour accéder au context
  - Helpers: isAdmin, isModerator, etc.

### Service API
- [ ] Créer `authService.js` :
  - Configuration axios avec intercepteurs (token, refresh)
  - Fonctions pour chaque endpoint API
  - Gestion des erreurs centralisée

### Page de connexion (Login)
- [ ] Formulaire : email, password, "Se souvenir de moi"
- [ ] Lien vers inscription
- [ ] Lien vers mot de passe oublié
- [ ] Validation côté client
- [ ] Affichage des erreurs
- [ ] Redirection après connexion
- [ ] **Thématique tribal**: Style cohérent avec le reste du site

### Page d'inscription (Register)
- [ ] Formulaire : username, email, password, confirmation password
- [ ] Indicateur de force du mot de passe
- [ ] Checkbox acceptation CGU
- [ ] Lien vers connexion
- [ ] Validation côté client
- [ ] Message succès avec instruction vérification email
- [ ] **Thématique tribal**: Style cohérent

### Page mot de passe oublié (ForgotPassword)
- [ ] Formulaire : email
- [ ] Message de confirmation (envoi si email existe)
- [ ] Lien retour connexion
- [ ] **Thématique tribal**: Style cohérent

### Page réinitialisation (ResetPassword)
- [ ] Récupération du token depuis l'URL
- [ ] Formulaire : nouveau password, confirmation
- [ ] Indicateur de force du mot de passe
- [ ] Message succès avec redirection connexion
- [ ] Gestion token invalide/expiré
- [ ] **Thématique tribal**: Style cohérent

### Page vérification email (VerifyEmail)
- [ ] Récupération du token depuis l'URL
- [ ] Appel API automatique à l'affichage
- [ ] État: loading, success, error
- [ ] Lien vers connexion si succès
- [ ] Option renvoyer email si erreur
- [ ] **Thématique tribal**: Style cohérent

### ProtectedRoute
- [ ] Composant HOC pour protéger les routes
- [ ] Redirection vers login si non authentifié
- [ ] Affichage loader pendant vérification
- [ ] Option pour rôles spécifiques (admin only, etc.)

### Configuration des routes
- [ ] Ajouter les routes dans `App.jsx` :
  - `/connexion` → Login
  - `/inscription` → Register
  - `/mot-de-passe-oublie` → ForgotPassword
  - `/reinitialiser-mot-de-passe/:token` → ResetPassword
  - `/verifier-email/:token` → VerifyEmail

### Intégration Header
- [ ] Afficher boutons Login/Register si non connecté
- [ ] Afficher avatar + dropdown si connecté :
  - Mon profil
  - Mes personnages
  - Paramètres
  - Déconnexion
  - (Admin) Panel admin

---

## 3.5 Tests et validation

### Tests backend (optionnel pour v1)
- [ ] Tests unitaires pour les utils (jwt, password, email)
- [ ] Tests d'intégration pour les routes auth
- [ ] Tests des middlewares

### Tests manuels requis
- [ ] Inscription complète avec vérification email
- [ ] Connexion avec compte vérifié
- [ ] Connexion refusée si email non vérifié
- [ ] Déconnexion et perte d'accès
- [ ] Reset password complet
- [ ] Protection des routes privées
- [ ] Persistance de session (refresh page)
- [ ] Expiration du token

---

## Ordre de réalisation suggéré

1. **Backend - Base**
   - Installer dépendances (bcrypt, jwt, nodemailer, express-validator)
   - Créer modèle User + migration + seeders
   - Configurer variables d'environnement

2. **Backend - Sécurité**
   - Créer utils (jwt, password)
   - Créer middlewares (auth, validate)
   - Configurer nodemailer (email)

3. **Backend - Routes**
   - Créer routes/controllers register + login
   - Tester avec Postman/Insomnia
   - Ajouter les autres endpoints

4. **Frontend - Base**
   - Créer AuthContext + useAuth
   - Créer authService
   - Créer ProtectedRoute

5. **Frontend - Pages**
   - Page Login
   - Page Register
   - Pages ForgotPassword + ResetPassword
   - Page VerifyEmail

6. **Intégration**
   - Mise à jour Header
   - Configuration routes
   - Tests end-to-end manuels

---

## Critères de validation

- [ ] Un utilisateur peut s'inscrire et reçoit un email de vérification
- [ ] Un utilisateur peut vérifier son email via le lien reçu
- [ ] Un utilisateur vérifié peut se connecter
- [ ] Un utilisateur non vérifié ne peut pas se connecter (ou warning)
- [ ] Le token JWT est stocké et envoyé avec les requêtes
- [ ] Les routes protégées redirigent vers login si non authentifié
- [ ] Le mot de passe peut être réinitialisé via email
- [ ] Le Header affiche l'état de connexion correctement
- [ ] La session persiste après refresh de la page
- [ ] Les mots de passe sont correctement hashés en BDD

---

## Notes techniques

- Utiliser des UUID pour les tokens (crypto.randomUUID ou uuid package)
- Ne jamais renvoyer le password dans les réponses API
- Utiliser HTTPS en production pour les cookies/tokens
- Prévoir un système de refresh token pour la v2
- Logger les tentatives de connexion échouées (sécurité)
- Rate limiting sur les endpoints sensibles (login, register, forgot-password)

---

## Templates d'emails

### Email de vérification
```
Sujet: Vérifie ton inscription - Érosion des Âmes

Bienvenue dans les ruines, {username} !

Clique sur le lien ci-dessous pour vérifier ton adresse email :
{verification_link}

Ce lien expire dans 24 heures.

Si tu n'as pas créé de compte, ignore cet email.

— Les Gardiens des Cendres
```

### Email de reset password
```
Sujet: Réinitialisation de ton mot de passe - Érosion des Âmes

Salutations, {username}.

Une demande de réinitialisation de mot de passe a été effectuée.
Clique sur le lien ci-dessous pour choisir un nouveau mot de passe :
{reset_link}

Ce lien expire dans 1 heure.

Si tu n'as pas fait cette demande, ignore cet email.

— Les Gardiens des Cendres
```

### Email de bienvenue
```
Sujet: Bienvenue parmi les Âmes Érodées !

{username},

Ton âme a été acceptée dans les ruines.
Tu peux maintenant te connecter et commencer ton voyage.

Que les braises guident tes pas.

— Les Gardiens des Cendres
```
