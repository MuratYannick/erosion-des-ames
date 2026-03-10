# Guide de déploiement — Érosion des Âmes

Hébergement cible : **O2Switch** (mutualisé, Node.js via Passenger, MySQL 8.0)

---

## Sommaire

1. [Prérequis](#1-prérequis)
2. [Premier déploiement](#2-premier-déploiement)
3. [Variables d'environnement](#3-variables-denvironnement)
4. [Déploiement automatique (CI/CD)](#4-déploiement-automatique-cicd)
5. [Déploiement manuel](#5-déploiement-manuel)
6. [Base de données](#6-base-de-données)
7. [Emails (SMTP)](#7-emails-smtp)
8. [Vérifications post-déploiement](#8-vérifications-post-déploiement)
9. [Rollback](#9-rollback)
10. [Maintenance](#10-maintenance)

---

## 1. Prérequis

### Sur le serveur O2Switch

- Node.js ≥ 20 activé via le **manager Node.js** du cPanel
- Base de données MySQL créée dans **MySQL Databases** (cPanel)
- Accès SSH activé (cPanel > SSH Access)
- Domaine ou sous-domaine pointant vers le répertoire `public_html`

### En local / CI

- Node.js ≥ 22
- Accès SSH avec une clé Ed25519 ou RSA ≥ 4096 bits

---

## 2. Premier déploiement

### 2.1 Générer une clé SSH dédiée au déploiement

```bash
ssh-keygen -t ed25519 -C "deploy-erosion-des-ames" -f ~/.ssh/erosion_deploy
```

Ajouter la **clé publique** (`~/.ssh/erosion_deploy.pub`) dans cPanel > **SSH Access > Manage SSH Keys > Import Key**.

### 2.2 Structure sur le serveur

```
~/
├── app/
│   └── backend/          ← code Node.js (REMOTE_BACKEND_PATH)
│       ├── .env           ← créé manuellement, jamais versionné
│       ├── tmp/
│       │   └── restart.txt  ← Passenger redémarre l'app quand ce fichier est modifié
│       └── uploads/       ← fichiers uploadés, persistant entre déploiements
└── public_html/           ← build frontend (REMOTE_FRONTEND_PATH)
    └── (dist Vite)
```

### 2.3 Créer les répertoires

```bash
ssh user@host "mkdir -p ~/app/backend/tmp ~/app/backend/uploads"
```

### 2.4 Créer le `.env` backend sur le serveur

```bash
ssh user@host "nano ~/app/backend/.env"
```

Contenu minimal (voir section [Variables d'environnement](#3-variables-denvironnement)).

### 2.5 Déploiement initial

Lancer le workflow **Deploy** depuis GitHub Actions (`Actions > Deploy > Run workflow`) ou pousser sur `main`.

### 2.6 Exécuter les seeders de production (une seule fois)

```bash
ssh user@host "cd ~/app/backend && node scripts/db-seed-production.js"
```

---

## 3. Variables d'environnement

### Backend — `~/app/backend/.env`

| Variable | Description | Exemple |
|---|---|---|
| `PORT` | Port Node.js (Passenger l'ignore, mettre 3001) | `3001` |
| `NODE_ENV` | Environnement | `production` |
| `DB_HOST` | Hôte MySQL | `127.0.0.1` |
| `DB_PORT` | Port MySQL | `3306` |
| `DB_NAME` | Nom de la base | `user_erosion` |
| `DB_USER` | Utilisateur MySQL | `user_dbuser` |
| `DB_PASSWORD` | Mot de passe MySQL | *(générer)* |
| `FRONTEND_URL` | URL publique du frontend | `https://erosion-des-ames.fr` |
| `JWT_SECRET` | Secret JWT access token (≥ 64 chars) | *(générer)* |
| `JWT_REFRESH_SECRET` | Secret JWT refresh token (≥ 64 chars) | *(générer)* |
| `JWT_EXPIRES_IN` | Durée du token | `24h` |
| `SMTP_HOST` | Serveur SMTP | `mail.erosion-des-ames.fr` |
| `SMTP_PORT` | Port SMTP | `465` |
| `SMTP_SECURE` | SSL/TLS | `true` |
| `SMTP_USER` | Adresse email SMTP | `noreply@erosion-des-ames.fr` |
| `SMTP_PASS` | Mot de passe SMTP | *(cPanel Email)* |
| `EMAIL_FROM` | Nom affiché dans les emails | `"Érosion des Âmes" <noreply@...>` |

Générer des secrets forts :
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend — Secrets GitHub Actions

| Secret / Variable | Description |
|---|---|
| `VITE_API_URL` | URL de l'API backend | `https://api.erosion-des-ames.fr/api` |

### GitHub Actions — Secrets de déploiement

Configurer dans **GitHub > Settings > Secrets and variables > Actions** :

| Secret | Description |
|---|---|
| `SSH_HOST` | Hostname ou IP du serveur |
| `SSH_PORT` | Port SSH (souvent `22`) |
| `SSH_USER` | Utilisateur SSH O2Switch |
| `SSH_KEY` | Contenu complet de la clé privée (`~/.ssh/erosion_deploy`) |
| `VITE_API_URL` | URL de l'API en production |
| `REMOTE_BACKEND_PATH` | Chemin absolu backend, ex: `/home/user/app/backend` |
| `REMOTE_FRONTEND_PATH` | Chemin absolu public_html, ex: `/home/user/public_html` |

---

## 4. Déploiement automatique (CI/CD)

### Pipeline CI (`ci.yml`)

Déclenché sur **tout push** et **toute Pull Request vers `main`** :

```
Frontend                    Backend
────────────────────        ────────────────────
npm ci                      npm ci
eslint --max-warnings=0     sequelize-cli db:migrate
vitest run                  jest
vite build
```

### Pipeline Deploy (`deploy.yml`)

Déclenché uniquement sur **push vers `main`** :

```
1. Build frontend (vite build)
2. rsync backend → serveur  (exclut .env, node_modules, uploads)
3. npm ci --omit=dev  (sur le serveur)
4. sequelize-cli db:migrate  (sur le serveur)
5. rsync dist/ → public_html
6. touch tmp/restart.txt  → Passenger redémarre l'app
```

---

## 5. Déploiement manuel

En cas de besoin de déployer sans GitHub Actions :

```bash
# Variables à adapter
HOST=user@hostname
SSH_PORT=22
BACKEND_PATH=/home/user/app/backend
FRONTEND_PATH=/home/user/public_html

# Build frontend
cd frontend && npm ci && npm run build

# Déployer le backend
rsync -az --delete \
  --exclude='.env' --exclude='node_modules/' \
  --exclude='uploads/' --exclude='logs/' --exclude='coverage/' --exclude='tests/' \
  -e "ssh -p $SSH_PORT" \
  backend/ $HOST:$BACKEND_PATH/

# Installer les dépendances de production
ssh -p $SSH_PORT $HOST "cd $BACKEND_PATH && npm ci --omit=dev"

# Migrations
ssh -p $SSH_PORT $HOST "cd $BACKEND_PATH && npx sequelize-cli db:migrate"

# Déployer le frontend
rsync -az --delete -e "ssh -p $SSH_PORT" frontend/dist/ $HOST:$FRONTEND_PATH/

# Redémarrer l'application
ssh -p $SSH_PORT $HOST "touch $BACKEND_PATH/tmp/restart.txt"
```

---

## 6. Base de données

### Migrations

Les migrations sont appliquées automatiquement à chaque déploiement.

Pour les exécuter manuellement :
```bash
ssh user@host "cd ~/app/backend && npx sequelize-cli db:migrate"
```

Pour annuler la dernière migration :
```bash
ssh user@host "cd ~/app/backend && npx sequelize-cli db:migrate:undo"
```

### Seeders de production

À exécuter **une seule fois** après le premier déploiement :
```bash
ssh user@host "cd ~/app/backend && node scripts/db-seed-production.js"
```

> Les seeders de production créent les catégories, sous-catégories, topics épinglés (Règlement, CGU) et le compte administrateur initial.

---

## 7. Emails (SMTP)

O2Switch fournit un serveur SMTP sur le domaine hébergé.

1. Créer l'adresse email `noreply@erosion-des-ames.fr` dans **cPanel > Email Accounts**
2. Récupérer les paramètres SMTP : hôte, port (`465` SSL ou `587` STARTTLS), identifiants
3. Renseigner les variables `SMTP_*` dans le `.env` du serveur

Tester la configuration SMTP :
```bash
ssh user@host "cd ~/app/backend && node -e \"
const { sendEmail } = require('./services/emailService');
sendEmail({ to: 'test@example.com', subject: 'Test', html: '<p>OK</p>' })
  .then(() => console.log('Email envoyé'))
  .catch(console.error);
\""
```

---

## 8. Vérifications post-déploiement

```bash
# 1. Health check API
curl https://api.erosion-des-ames.fr/api/health

# 2. Vérifier les logs Passenger (cPanel > Node.js > Logs)

# 3. Vérifier que le frontend charge (navigateur)
#    https://erosion-des-ames.fr

# 4. Tester l'inscription et la connexion

# 5. Vérifier les emails (mot de passe oublié)
```

Réponse attendue du health check :
```json
{ "status": "ok", "message": "API is running" }
```

---

## 9. Rollback

### Via GitHub Actions

Re-déclencher le workflow **Deploy** sur un commit antérieur :
```
GitHub > Actions > Deploy > (sélectionner le run d'un commit précédent) > Re-run
```

### Via git en local + déploiement manuel

```bash
git checkout <commit-hash>
# Puis suivre la procédure de déploiement manuel (section 5)
```

### Rollback de migration

```bash
ssh user@host "cd ~/app/backend && npx sequelize-cli db:migrate:undo"
```

---

## 10. Maintenance

### Mettre le site en maintenance

Ajouter un fichier `maintenance.flag` à la racine du backend :
```bash
ssh user@host "touch ~/app/backend/maintenance.flag"
```

L'API retourne automatiquement un statut `503` tant que ce fichier est présent (si le middleware de maintenance est activé).

### Sauvegardes

Voir `ROADMAP_RELEASE_1_01.md` — étape 13 pour les scripts de backup automatisés.

Sauvegarde manuelle de la base de données :
```bash
ssh user@host "mysqldump -u DB_USER -p DB_NAME > ~/backups/dump_\$(date +%Y%m%d_%H%M%S).sql"
```

### Consulter les logs

```bash
# Logs Passenger (redémarrages, erreurs fatales)
# cPanel > Node.js Apps > Logs

# Logs Morgan (requêtes HTTP) — si configuré dans un fichier
ssh user@host "tail -f ~/app/backend/logs/access.log"
```
