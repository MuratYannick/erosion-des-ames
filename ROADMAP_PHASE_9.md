# Phase 9 : Sélection de personnage et permissions

## Contexte

Le système de permissions par catégorie (`categoryPermission`) attend `req.user.selectedCharacterId` pour les vérifications de type `player_with_character`, `player_character_faction`, `player_character_clan` et `specific_character`. Ce champ n'existe pas encore dans le modèle User ni en base de données. Cette phase implémente la sélection d'un personnage actif depuis la page "Mes Personnages", condition nécessaire pour tester et utiliser les permissions basées sur les personnages.

## Approche

Stockage de `selected_character_id` (INTEGER, nullable, FK vers `characters`) dans la table `users`. Le middleware `authenticate` charge déjà le User complet depuis la DB, donc `req.user.selectedCharacterId` sera automatiquement disponible sans modification du middleware d'authentification.

---

## Étapes d'implémentation

### Étape 1 — Migration : ajout `selected_character_id` sur `users`

**Fichier à créer :** `backend/migrations/20260212100000-add-selected-character-id-to-users.js`

- `addColumn('users', 'selected_character_id', { type: INTEGER, allowNull: true, references: { model: 'characters', key: 'id' }, onDelete: 'SET NULL', onUpdate: 'CASCADE' })`
- `addIndex('users', ['selected_character_id'])`
- Down : `removeIndex` + `removeColumn`

`onDelete: 'SET NULL'` garantit que si un personnage est supprimé, la sélection est automatiquement réinitialisée.

---

### Étape 2 — Modèle User : champ + association

**Fichier à modifier :** `backend/models/User.js`

- Ajouter le champ `selectedCharacterId` dans la définition du modèle :
  ```js
  selectedCharacterId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  }
  ```
- Ajouter la méthode `User.associate` (appelée automatiquement par `models/index.js`) :
  ```js
  User.associate = (models) => {
    User.belongsTo(models.Character, {
      foreignKey: 'selectedCharacterId',
      as: 'selectedCharacter',
    });
  };
  ```

Le `defaultScope` du modèle exclut `password` mais inclut toutes les autres colonnes, donc `selectedCharacterId` sera automatiquement chargé par le middleware `authenticate`.

---

### Étape 3 — Validateur pour la sélection

**Fichier à modifier :** `backend/validators/authValidators.js`

- Ajouter `selectCharacterValidation` :
  ```js
  const selectCharacterValidation = [
    body('characterId')
      .notEmpty()
      .withMessage('L\'identifiant du personnage est requis')
      .isInt({ min: 1 })
      .withMessage('L\'identifiant du personnage doit être un entier positif'),
  ];
  ```
- Ajouter à `module.exports`

---

### Étape 4 — Contrôleur : `selectCharacter` et `deselectCharacter`

**Fichier à modifier :** `backend/controllers/authController.js`

**Imports à ajouter :** `Character`, `Faction` depuis `../models`

**Helper réutilisable :**
```js
async function getUserWithSelectedCharacter(userId) {
  return User.findByPk(userId, {
    include: [{
      model: Character,
      as: 'selectedCharacter',
      attributes: ['id', 'name', 'avatar', 'factionId'],
      include: [{ model: Faction, as: 'faction', attributes: ['id', 'name', 'color'] }],
    }],
  });
}
```

**`selectCharacter` (PUT /api/auth/select-character) :**
- Valider que le personnage existe (404 sinon)
- Valider qu'il appartient à l'utilisateur courant (`character.userId === req.user.id`, 403 sinon)
- Valider qu'il est approuvé (`character.status === 'approved'`, 400 sinon)
- `user.update({ selectedCharacterId: characterId })`
- Retourner l'user avec selectedCharacter eager-loaded

**`deselectCharacter` (DELETE /api/auth/select-character) :**
- `user.update({ selectedCharacterId: null })`
- Retourner l'user

**Modifier `me` :**
- Utiliser `getUserWithSelectedCharacter(req.user.id)` pour inclure les données du personnage sélectionné

**Modifier `login` :**
- Utiliser `getUserWithSelectedCharacter(user.id)` pour la réponse (au lieu du simple `User.findByPk`)

---

### Étape 5 — Routes

**Fichier à modifier :** `backend/routes/auth.js`

```
PUT    /api/auth/select-character   — authenticate, selectCharacterValidation, validate, selectCharacter
DELETE /api/auth/select-character   — authenticate, deselectCharacter
```

---

### Étape 6 — Hook afterUpdate sur Character (auto-désélection)

**Fichier à modifier :** `backend/models/Character.js`

Si le `status` d'un personnage change vers une valeur non-approved ou si `isActive` passe à false, désélectionner automatiquement ce personnage pour tous les utilisateurs :

```js
Character.afterUpdate(async (character) => {
  if (
    (character.changed('status') && character.status !== 'approved') ||
    (character.changed('isActive') && !character.isActive)
  ) {
    const { User } = require('./index');
    await User.update(
      { selectedCharacterId: null },
      { where: { selectedCharacterId: character.id } }
    );
  }
});
```

---

### Étape 7 — Frontend : service API

**Fichier à modifier :** `frontend/src/services/characterService.js`

```js
export const selectCharacter = async (characterId) => {
  const response = await api.put('/auth/select-character', { characterId }, { skipErrorRedirect: true });
  return response.data;
};

export const deselectCharacter = async () => {
  const response = await api.delete('/auth/select-character', { skipErrorRedirect: true });
  return response.data;
};
```

---

### Étape 8 — Frontend : hooks mutation

**Fichier à modifier :** `frontend/src/hooks/useCharacters.js`

```js
export const useSelectCharacter = (options = {}) => {
  return useMutation((characterId) => characterService.selectCharacter(characterId), options);
};

export const useDeselectCharacter = (options = {}) => {
  return useMutation(() => characterService.deselectCharacter(), options);
};
```

**Fichier à modifier :** `frontend/src/hooks/index.js`
- Ajouter `useSelectCharacter`, `useDeselectCharacter` aux exports

---

### Étape 9 — Frontend : hook useAuth étendu

**Fichier à modifier :** `frontend/src/hooks/useAuth.js`

Ajouter des propriétés dérivées :
```js
const selectedCharacterId = user?.selectedCharacterId || null;
const hasSelectedCharacter = !!selectedCharacterId;
```

Les exposer dans le return du hook.

---

### Étape 10 — Frontend : CharacterCard avec sélection

**Fichier à modifier :** `frontend/src/components/characters/CharacterCard.jsx`

- Nouvelles props : `onSelect` (function), `isSelected` (boolean)
- Si `isSelected` : border `border-secondary-500` + `ring-2 ring-secondary-500/30 shadow-glow`
- Badge "Actif" en haut à gauche (checkmark + texte)
- Bouton "Sélectionner" / "Désélectionner" visible uniquement pour les personnages `approved` et si `onSelect` est fourni
- Style du bouton : doré plein pour "Sélectionner", outline pour "Désélectionner"
- Mise à jour des propTypes

---

### Étape 11 — Frontend : page MyCharactersList

**Fichier à modifier :** `frontend/src/pages/MyCharacters/MyCharactersList.jsx`

- Importer `useSelectCharacter`, `useDeselectCharacter`
- Destructurer `updateUser` depuis `useAuth()`
- Hooks mutation avec `onSuccess` → `updateUser(data.user)` + toast succès
- Handler `handleSelect(character)` : toggle sélection/désélection
- Passer `onSelect={handleSelect}` et `isSelected={user?.selectedCharacterId === character.id}` à chaque `CharacterCard`

Le `useMutation` de `useApi.js` extrait `response.data?.data || response.data` comme `responseData`. Notre API retourne `{ success, data: { user }, message }`, donc `onSuccess` reçoit `{ user: {...} }`. Appeler `updateUser(data.user)` pour merger le user complet dans AuthContext.

---

### Étape 12 — Frontend : Header avec personnage actif

**Fichier à modifier :** `frontend/src/layouts/MainLayout/Header.jsx`

- **Desktop** (dropdown trigger) : afficher `user?.selectedCharacter?.name` sous le username en `text-xs text-secondary-600 font-ui`
- **Mobile** (menu burger, section user) : idem, afficher le nom du personnage sous le username

Pas besoin d'appel API supplémentaire : les endpoints `me` et `login` retournent déjà `selectedCharacter` eager-loaded (étape 4).

---

## Fichiers impactés (résumé)

| # | Fichier | Action |
|---|---------|--------|
| 1 | `backend/migrations/20260212100000-add-selected-character-id-to-users.js` | Créer |
| 2 | `backend/models/User.js` | Modifier |
| 3 | `backend/models/Character.js` | Modifier |
| 4 | `backend/validators/authValidators.js` | Modifier |
| 5 | `backend/controllers/authController.js` | Modifier |
| 6 | `backend/routes/auth.js` | Modifier |
| 7 | `frontend/src/services/characterService.js` | Modifier |
| 8 | `frontend/src/hooks/useCharacters.js` | Modifier |
| 9 | `frontend/src/hooks/index.js` | Modifier |
| 10 | `frontend/src/hooks/useAuth.js` | Modifier |
| 11 | `frontend/src/components/characters/CharacterCard.jsx` | Modifier |
| 12 | `frontend/src/pages/MyCharacters/MyCharactersList.jsx` | Modifier |
| 13 | `frontend/src/layouts/MainLayout/Header.jsx` | Modifier |

---

## Vérification

1. **Migration** : `npx sequelize-cli db:migrate` — vérifier colonne `selected_character_id` dans `users`
2. **API me** : `GET /api/auth/me` → `selectedCharacterId: null`, `selectedCharacter: null`
3. **Sélection** : `PUT /api/auth/select-character` avec un personnage approuvé → 200 + user mis à jour
4. **Validations** :
   - Personnage inexistant → 404
   - Personnage d'un autre utilisateur → 403
   - Personnage non approuvé → 400
5. **Désélection** : `DELETE /api/auth/select-character` → 200 + `selectedCharacterId: null`
6. **UI** : bouton "Sélectionner" visible uniquement sur cartes approuvées, badge "Actif" + bordure dorée sur le personnage sélectionné
7. **Header** : nom du personnage affiché sous le username
8. **Auto-désélection** : rejeter un personnage sélectionné → `selectedCharacterId` remis à null
9. **Permissions** : avec un personnage sélectionné, les grantee types `player_with_character`, `player_character_faction` etc. fonctionnent dans le middleware `categoryPermission`
