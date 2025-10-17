# Système de vérification des acceptations CGU et Règlement du Forum

## Description

Ce système vérifie automatiquement à chaque connexion d'un utilisateur si les CGU (Conditions Générales d'Utilisation) ou le Règlement du Forum ont été mis à jour depuis la dernière acceptation de l'utilisateur. Si c'est le cas, les acceptations correspondantes sont invalidées et l'utilisateur devra les ré-accepter.

## Fonctionnement

### 1. À la connexion

Lorsqu'un utilisateur se connecte ([authController.js:141](../controllers/authController.js#L141)), le système :

1. Vérifie si l'utilisateur a accepté les CGU (`terms_accepted = true` et `terms_accepted_at` non null)
2. Recherche le topic avec le slug `cgu` et récupère le post le plus récent (basé sur `updated_at`)
3. Compare la date de mise à jour du post avec la date d'acceptation de l'utilisateur
4. Si le post a été mis à jour **après** l'acceptation, met `terms_accepted` à `false` et `terms_accepted_at` à `null`

Le même processus s'applique pour le règlement du forum avec le slug `reglement`.

### 2. Structure des données

**Table `users`** :
- `terms_accepted` : boolean - Indique si l'utilisateur a accepté les CGU
- `terms_accepted_at` : datetime - Date d'acceptation des CGU
- `forum_rules_accepted` : boolean - Indique si l'utilisateur a accepté le règlement
- `forum_rules_accepted_at` : datetime - Date d'acceptation du règlement

**Table `topics`** :
- `slug` : string - Identifiant unique du topic (ex: 'cgu', 'reglement')
- Relation avec `posts` via `topic_id`

**Table `posts`** :
- `updated_at` : datetime - Date de dernière modification du post
- Le système cherche toujours le post le plus récent du topic

### 3. Logique de vérification

```javascript
// Pseudo-code
if (user.terms_accepted && user.terms_accepted_at) {
  const lastCguPost = findMostRecentPost(topic_slug: 'cgu')

  if (lastCguPost.updated_at > user.terms_accepted_at) {
    user.terms_accepted = false
    user.terms_accepted_at = null
  }
}
```

## Fichiers impliqués

### 1. [utils/acceptanceChecker.js](./acceptanceChecker.js)

Contient les fonctions utilitaires :

- `checkAndUpdateAcceptances(user)` : Fonction principale qui vérifie et met à jour les acceptations
  - Paramètre : Instance Sequelize de l'utilisateur
  - Retour : `{ termsUpdated: boolean, forumRulesUpdated: boolean }`

- `getLastUpdateDateForTopic(slug)` : Récupère la date de dernière mise à jour d'un topic
  - Paramètre : Slug du topic (ex: 'cgu', 'reglement')
  - Retour : Date ou null

### 2. [controllers/authController.js](../controllers/authController.js)

Intègre la vérification dans le processus de connexion :

```javascript
// Ligne 141
await checkAndUpdateAcceptances(user);
await user.reload(); // Recharger les données mises à jour
```

### 3. [models/game/User.js](../models/game/User.js)

Définit les colonnes nécessaires dans le modèle User.

### 4. [models/forum/Topic.js](../models/forum/Topic.js) et [models/forum/Post.js](../models/forum/Post.js)

Définissent les modèles pour les topics et posts du forum.

## Configuration requise

### Topics obligatoires

Pour que le système fonctionne, deux topics doivent exister dans la base de données :

1. **CGU** : Topic avec `slug = 'cgu'`
2. **Règlement** : Topic avec `slug = 'reglement'`

Ces topics doivent contenir au moins un post actif (`is_active = true`).

### Mise à jour des CGU ou Règlement

Pour notifier tous les utilisateurs d'une mise à jour :

1. Modifier le contenu du post dans le topic concerné
2. Sequelize mettra automatiquement à jour le champ `updated_at`
3. À la prochaine connexion, tous les utilisateurs dont `terms_accepted_at` ou `forum_rules_accepted_at` est antérieur à cette mise à jour devront ré-accepter

## Tests

Un script de test est disponible : [test-acceptance.js](../test-acceptance.js)

Pour l'exécuter :
```bash
cd backend
node test-acceptance.js
```

Le script teste :
1. Que les acceptations restent valides quand aucun post n'est mis à jour
2. Que l'acceptation CGU est invalidée quand le post CGU est mis à jour
3. Que l'acceptation du règlement est invalidée quand le post du règlement est mis à jour

## Exemple d'utilisation

### Scénario 1 : Première connexion

```
Utilisateur inscrit le 2025-01-01 à 10:00
CGU créées le 2024-12-01 à 09:00
Règlement créé le 2024-12-01 à 09:00

→ Utilisateur doit accepter les deux
```

### Scénario 2 : Connexion après acceptation

```
Utilisateur accepte CGU le 2025-01-01 à 10:05
CGU non modifiées depuis le 2024-12-01 à 09:00

→ L'acceptation reste valide
```

### Scénario 3 : Connexion après mise à jour

```
Utilisateur accepte CGU le 2025-01-01 à 10:05
CGU mises à jour le 2025-01-02 à 14:30
Utilisateur se connecte le 2025-01-03

→ L'acceptation est invalidée, l'utilisateur doit ré-accepter
```

## Notes importantes

- La vérification s'effectue **uniquement à la connexion**, pas en temps réel pendant la session
- Si un utilisateur est déjà connecté lors de la mise à jour des CGU, il ne sera notifié qu'à sa prochaine connexion
- Le système utilise la date `updated_at` du post, qui est mise à jour automatiquement par Sequelize
- Les acceptations sont indépendantes : on peut invalider les CGU sans toucher au règlement et vice-versa
