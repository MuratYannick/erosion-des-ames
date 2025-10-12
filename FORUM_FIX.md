# Correction de l'Accès aux Forums HRP et RP

## Problème Initial

Les utilisateurs ne pouvaient pas accéder aux sous-catégories et topics des forums HRP et RP, quels que soient leurs rôles ou personnages.

## Cause

Les routes de lecture GET (`/categories`, `/categories/:slug`, `/sections/:slug`, `/topics/:id`) n'utilisaient pas de middleware d'authentification. Cela signifiait que `req.user` était toujours `undefined` dans les contrôleurs, même pour les utilisateurs authentifiés.

Le système de visibilité dans `forumPermissions.js` vérifiait `req.user`, mais comme celui-ci était toujours `undefined`, les vérifications échouaient systématiquement pour les forums HRP et RP qui nécessitent une authentification.

## Solution Implémentée

### 1. Création du Middleware `optionalAuth`

Ajout d'un nouveau middleware dans [backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js:73-129):

```javascript
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Récupérer le token depuis l'en-tête Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Si pas de token, continuer sans utilisateur
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      // Vérifier et décoder le token
      const decoded = verifyToken(token);

      if (decoded) {
        // Récupérer l'utilisateur avec son rôle
        const user = await User.findByPk(decoded.id, {
          attributes: { exclude: ["password_hash"] },
          include: [
            {
              model: Role,
              as: "role",
              attributes: ["id", "name", "label", "level"],
            },
          ],
        });

        // Si l'utilisateur existe et est actif, l'attacher à la requête
        if (user && user.is_active) {
          req.user = user;
        } else {
          req.user = null;
        }
      } else {
        req.user = null;
      }
    } catch (tokenError) {
      // Si le token est invalide, continuer sans utilisateur
      req.user = null;
    }

    next();
  } catch (error) {
    console.error("Erreur dans optionalAuth:", error);
    req.user = null;
    next();
  }
};
```

**Fonctionnement**:
- Si un token valide est présent → charge l'utilisateur dans `req.user`
- Si pas de token ou token invalide → `req.user = null` et continue
- Ne retourne **jamais d'erreur 401**, contrairement au middleware `protect`

### 2. Mise à Jour des Routes du Forum

Modification de [backend/routes/forumRoutes.js](backend/routes/forumRoutes.js:18-29):

```javascript
import { protect, optionalAuth } from "../middleware/authMiddleware.js";

// Routes publiques avec authentification optionnelle (lecture seule)
router.get("/categories", optionalAuth, getCategories);
router.get("/categories/:slug", optionalAuth, getCategoryBySlug);
router.get("/sections", optionalAuth, getSections);
router.get("/sections/:slug", optionalAuth, getSectionBySlug);
router.get("/topics/:id", optionalAuth, getTopicById);
```

## Résultat

### Comportement Attendu

#### Utilisateur Anonyme
- `req.user = null`
- Peut voir **Forum Général** uniquement
- Reçoit 403 pour HRP et RP

#### Utilisateur Authentifié Sans Personnage
- `req.user` contient l'utilisateur + rôle
- Peut voir **Forum Général** + **Forum HRP**
- Reçoit 403 pour sections RP (nécessite personnage vivant)

#### Utilisateur avec Personnage Vivant
- `req.user` contient l'utilisateur + rôle
- Peut voir **Forum Général** + **Forum HRP**
- Peut voir sections **Forum RP** selon faction/clan:
  - Sections sans restriction ✅
  - Sections de sa faction ✅
  - Sections de son clan ✅
  - Sections d'autres factions/clans ❌

#### Staff (Admin/Moderator/Game Master)
- `req.user` contient l'utilisateur + rôle
- Peut voir **tous les forums et sections** (bypass complet)

## Tests à Effectuer

Utilisez les comptes créés par `npm run seed:dev`:

### Test 1: Anonyme
```bash
curl http://localhost:3000/api/forum/categories
# Doit montrer uniquement Forum Général avec ses sections
```

### Test 2: Utilisateur sans personnage
```bash
# Se connecter avec player_no_char / password123
# GET /api/forum/categories avec token JWT
# Doit montrer Forum Général + Forum HRP
```

### Test 3: Utilisateur avec personnage mutant
```bash
# Se connecter avec player_mutant_clan / password123
# GET /api/forum/categories avec token JWT
# Doit montrer Forum Général + Forum HRP + sections RP mutantes
```

### Test 4: Staff
```bash
# Se connecter avec admin_test / password123
# GET /api/forum/categories avec token JWT
# Doit montrer tous les forums et toutes les sections
```

## Fichiers Modifiés

1. **[backend/middleware/authMiddleware.js](backend/middleware/authMiddleware.js)**
   - Ajout du middleware `optionalAuth` (lignes 73-129)

2. **[backend/routes/forumRoutes.js](backend/routes/forumRoutes.js)**
   - Import de `optionalAuth` (ligne 18)
   - Application sur les routes GET de lecture (lignes 25-29)

## Notes Techniques

- Le middleware `protect` reste inchangé et continue d'être utilisé pour les routes d'écriture (POST, PUT, DELETE)
- Le middleware `optionalAuth` ne ralentit pas les requêtes anonymes car il n'effectue aucune requête DB si pas de token
- La logique de visibilité dans `forumPermissions.js` n'a pas besoin d'être modifiée
- Les contrôleurs (`forumController.js`) fonctionnent maintenant correctement avec `req.user` défini

## Système de Visibilité Rappel

Le système implémenté dans [backend/utils/forumPermissions.js](backend/utils/forumPermissions.js) vérifie:

1. **Catégorie "général"** → Accessible à tous (user peut être null)
2. **Catégorie "hrp"** → Nécessite `user !== null`
3. **Catégorie "rp"** → Nécessite `user !== null` ET:
   - Staff bypass (admin, moderator, game_master)
   - OU personnage vivant (pour sections sans restriction)
   - OU personnage vivant dans la faction (pour sections avec `visible_by_faction_id`)
   - OU personnage vivant dans le clan (pour sections avec `visible_by_clan_id`)

La fonction `canAccessSection(user, section, category)` est appelée pour chaque section et retourne `true/false`.
