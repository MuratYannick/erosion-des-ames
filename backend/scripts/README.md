# Scripts de gestion de la base de données

Ce dossier contient les scripts de gestion de la base de données pour le projet Erosion des Ames.

## Scripts disponibles

### 1. `npm run db:migrate`
Lance toutes les migrations Sequelize pour créer/mettre à jour les tables.

```bash
npm run db:migrate
```

**Utilisation:** À exécuter après avoir créé de nouvelles migrations pour mettre à jour le schéma de la base de données.

---

### 2. `npm run db:seed`
Exécute uniquement les seeders de **production** (données de référence).

```bash
npm run db:seed
```

**Utilisation:**
- En production pour insérer les données indispensables au fonctionnement de l'application
- Les seeders doivent être placés dans `seeders/production/`
- Actuellement, aucun seeder de production n'existe (le dossier est vide)

---

### 3. `npm run db:seed:dev`
Exécute les seeders de **développement** (données de test).

```bash
npm run db:seed:dev
```

**Comportement:**
1. Exécute d'abord tous les seeders du dossier `seeders/production/`
2. Puis exécute tous les seeders du dossier `seeders/`
3. **Ne fonctionne PAS en production** (vérifie `NODE_ENV`)

**Utilisation:** Pour peupler la base de développement avec des utilisateurs de test, etc.

---

### 4. `npm run db:clear`
Vide toutes les tables (TRUNCATE) sans les supprimer.

```bash
npm run db:clear
```

**Comportement:**
- Désactive temporairement les contraintes de foreign key
- Vide toutes les tables sauf `SequelizeMeta`
- Réactive les contraintes de foreign key
- Affiche un rapport détaillé

**Utilisation:** Pour nettoyer la base de données tout en gardant la structure des tables.

---

### 5. `npm run db:drop`
Supprime toutes les tables (annule toutes les migrations).

```bash
npm run db:drop
```

**Comportement:**
- Exécute `sequelize-cli db:migrate:undo:all`
- Supprime toutes les tables de la base de données

**Utilisation:** Pour repartir de zéro. Ensuite, exécutez `npm run db:migrate` pour recréer les tables.

---

## Workflow recommandé

### Développement initial
```bash
# 1. Créer les tables
npm run db:migrate

# 2. Peupler avec des données de test
npm run db:seed:dev
```

### Reset complet de la base de développement
```bash
# Option 1: Vider les tables (garde la structure)
npm run db:clear
npm run db:seed:dev

# Option 2: Supprimer et recréer (plus propre)
npm run db:drop
npm run db:migrate
npm run db:seed:dev
```

### Production
```bash
# 1. Créer/mettre à jour les tables
npm run db:migrate

# 2. Insérer les données de référence
npm run db:seed
```

---

## Organisation des seeders

```
backend/
├── seeders/
│   ├── production/          # Seeders de production uniquement
│   │   └── .gitkeep
│   └── 20260201120001-demo-users.js  # Seeders de développement
```

### Seeders de production
- Placés dans `seeders/production/`
- Contiennent les données **indispensables** au fonctionnement de l'application
- Exemples: rôles par défaut, paramètres système, catégories prédéfinies
- Exécutés avec `npm run db:seed`

### Seeders de développement
- Placés dans `seeders/` (racine)
- Contiennent les données de **test et développement**
- Exemples: utilisateurs de démo, données de test
- Exécutés avec `npm run db:seed:dev`

---

## Sécurité

- Le script `db:seed:dev` refuse de s'exécuter si `NODE_ENV=production`
- Le script `db:clear` désactive/réactive automatiquement les contraintes de foreign key
- Tous les scripts gèrent proprement les erreurs et ferment la connexion DB

---

## Messages de log

Tous les scripts affichent des messages clairs en français:
- ✅ Succès
- ❌ Erreurs
- ⚠️ Avertissements
- 🔄 En cours
- 📦 Informations
