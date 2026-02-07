# Phase 4: Composants de formulaires avancés

**Branche**: `feature/phase-4-forms`

---

## Vue d'ensemble

Cette phase consiste à créer les composants de formulaire avancés nécessaires pour :
- La création et édition de personnages
- La rédaction de posts sur le forum
- Les formulaires d'administration
- L'upload d'images (avatars, illustrations)

### Stack technique
- **Frontend**: React 19 + TailwindCSS
- **Validation**: Validation client-side custom + intégration avec react-hook-form (optionnel)
- **Rich Text**: TipTap ou Lexical (éditeur moderne)
- **Upload**: Gestion locale + prévisualisation

---

## 4.1 Composants de base améliorés

### Structure des fichiers
```
frontend/src/components/ui/
├── Form/
│   ├── Form.jsx                 # Wrapper de formulaire avec validation
│   ├── Form.css
│   ├── FormField.jsx            # Wrapper pour champ + label + erreur
│   ├── FormGroup.jsx            # Groupe de champs liés
│   └── index.js
├── Select/
│   ├── Select.jsx               # Select stylisé natif
│   ├── Select.css
│   ├── SelectMultiple.jsx       # Select multiple (tags)
│   └── index.js
├── Checkbox/
│   ├── Checkbox.jsx             # Case à cocher stylisée
│   ├── Checkbox.css
│   ├── CheckboxGroup.jsx        # Groupe de checkboxes
│   ├── Radio.jsx                # Bouton radio stylisé
│   ├── RadioGroup.jsx           # Groupe de radios
│   └── index.js
├── FileUpload/
│   ├── FileUpload.jsx           # Upload simple
│   ├── FileUpload.css
│   ├── ImageUpload.jsx          # Upload image avec preview
│   ├── AvatarUpload.jsx         # Upload avatar (crop circulaire)
│   └── index.js
├── DatePicker/
│   ├── DatePicker.jsx           # Sélecteur de date
│   ├── DatePicker.css
│   └── index.js
├── RichTextEditor/
│   ├── RichTextEditor.jsx       # Éditeur de texte riche
│   ├── RichTextEditor.css
│   ├── Toolbar.jsx              # Barre d'outils de l'éditeur
│   ├── extensions/              # Extensions custom (mentions, etc.)
│   └── index.js
└── Textarea/
    ├── Textarea.jsx             # Textarea amélioré (auto-resize)
    ├── Textarea.css
    └── index.js
```

### Form - Wrapper de formulaire
- [x] Créer `Form.jsx` :
  - Props : `onSubmit`, `initialValues`, `validate`, `children`
  - Gestion du state des valeurs
  - Gestion du state des erreurs
  - Gestion du state de soumission (isSubmitting)
  - Context pour accès aux valeurs/erreurs dans les enfants
- [x] Créer `FormField.jsx` :
  - Props : `name`, `label`, `required`, `error`, `hint`, `children`
  - Affichage label avec indicateur requis (*)
  - Affichage erreur sous le champ
  - Affichage hint/aide si fourni
- [x] Créer `FormGroup.jsx` :
  - Props : `title`, `description`, `children`
  - Regroupement visuel de champs liés
  - Style tribal cohérent
- [x] **Thématique tribal** : Bordures gravées, labels stylisés

### Select - Liste déroulante
- [x] Créer `Select.jsx` :
  - Props : `options`, `value`, `onChange`, `placeholder`, `disabled`, `error`
  - Options : `[{ value, label, disabled?, icon? }]`
  - Style natif amélioré (arrow custom, hover states)
  - Support du placeholder
  - État disabled et error
- [x] Créer `SelectMultiple.jsx` :
  - Props : `options`, `value` (array), `onChange`, `max`
  - Affichage en tags/chips
  - Suppression individuelle des tags
  - Limite de sélection optionnelle
- [x] **Thématique tribal** : Arrow tribale, border glow on focus

### Checkbox et Radio
- [x] Créer `Checkbox.jsx` :
  - Props : `checked`, `onChange`, `label`, `disabled`, `error`
  - Custom checkbox avec SVG checkmark tribal
  - États : default, checked, disabled, error
  - Animation de transition
- [x] Créer `CheckboxGroup.jsx` :
  - Props : `options`, `value` (array), `onChange`, `orientation`
  - Gestion multiple checkboxes liées
  - Layout vertical ou horizontal
- [x] Créer `Radio.jsx` :
  - Props : `checked`, `onChange`, `label`, `disabled`, `name`
  - Custom radio avec dot tribal
  - États similaires à Checkbox
- [x] Créer `RadioGroup.jsx` :
  - Props : `options`, `value`, `onChange`, `name`, `orientation`
  - Gestion groupe de radios mutuellement exclusifs
- [x] **Thématique tribal** : Symboles tribaux au lieu de checkmarks standards

### Textarea amélioré
- [x] Créer `Textarea.jsx` (déjà existant) :
  - Props : `value`, `onChange`, `minRows`, `maxRows`, `maxLength`, `showCount`
  - Auto-resize basé sur le contenu
  - Compteur de caractères optionnel (RuneTally)
  - Support du maxLength avec feedback visuel
- [x] **Thématique tribal** : Style cohérent avec Input existant

---

## 4.2 FileUpload - Gestion des fichiers

### Upload simple
- [x] Créer `FileUpload.jsx` :
  - Props : `accept`, `maxSize`, `onChange`, `value`, `disabled`
  - Zone de drop (drag & drop)
  - Bouton de sélection classique
  - Validation type de fichier
  - Validation taille maximale
  - Affichage nom du fichier sélectionné
  - Bouton de suppression

### Upload image avec preview
- [x] Créer `ImageUpload.jsx` :
  - Props : `accept` (images), `maxSize`, `onChange`, `value`, `aspectRatio`
  - Preview de l'image sélectionnée
  - Dimensions recommandées affichées
  - Validation dimensions min/max (optionnel)
  - Compression côté client (optionnel)
- [x] **États** : empty, preview, loading, error

### Upload avatar
- [x] Créer `AvatarUpload.jsx` :
  - Props : `currentAvatar`, `onChange`, `size`
  - Preview circulaire
  - Overlay au hover avec icône d'édition
  - Intégration avec composant Avatar existant
  - Crop circulaire (optionnel, peut utiliser une lib)

### Validation et feedback
- [x] Messages d'erreur pour :
  - Fichier trop volumineux
  - Type de fichier non supporté
  - Erreur de lecture du fichier
- [x] Indicateur de progression (pour futures uploads serveur)

---

## 4.3 DatePicker - Sélecteur de date

### Composant DatePicker
- [x] Créer `DatePicker.jsx` :
  - Props : `value`, `onChange`, `min`, `max`, `disabled`, `placeholder`
  - Input avec icône calendrier
  - Popup calendrier au clic
  - Navigation mois/année
  - Sélection du jour
  - Support des dates min/max
  - Format d'affichage configurable
- [x] **Implémenté en vanilla JS** (sans librairie externe)
- [x] **Thématique tribal** : Calendrier stylisé, icônes tribales

### Fonctionnalités
- [x] Fermeture au clic extérieur
- [x] Navigation clavier (accessibilité)
- [x] Highlight de la date actuelle
- [x] Désactivation des dates hors plage

---

## 4.4 RichTextEditor - Éditeur de texte riche

### Choix technologique
**Recommandation** : TipTap (basé sur ProseMirror)
- Moderne, extensible, bien maintenu
- Support React natif
- Personnalisation facile

### Installation
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
npm install @tiptap/extension-link @tiptap/extension-image @tiptap/extension-text-align
```

### Composant RichTextEditor
- [x] Créer `RichTextEditor.jsx` :
  - Props : `content`, `onChange`, `placeholder`, `editable`, `minHeight`
  - Intégration TipTap
  - Barre d'outils personnalisée
  - Output en HTML
- [x] Créer `Toolbar.jsx` :
  - Boutons de formatage de base :
    - **Gras**, *Italique*, ~~Barré~~
    - Titres (H2, H3)
    - Listes (à puces, numérotées)
    - Citations
    - Liens
    - Alignement (gauche, centre, droite)
  - Séparateurs visuels entre groupes
  - États actifs des boutons
- [x] Créer `LinkModal.jsx` : Popup d'édition de liens

### Fonctionnalités de base
- [x] Formatage texte (bold, italic, strike)
- [x] Titres (H2, H3 pour structure)
- [x] Listes (ul, ol)
- [x] Citations (blockquote)
- [x] Liens (avec popup d'édition)
- [x] Alignement texte

### Fonctionnalités avancées (optionnel Phase 4)
- [x] Insertion d'images (depuis URL via ImageModal)
- [x] Mentions (@utilisateur) - structure de base prête
- [x] Émojis (picker avec 40 emojis en 4 catégories)
- [x] Code inline et blocs de code (lowlight)
- [x] Tableaux simples (3x3 avec header)

### Thématique tribal
- [x] Icônes de toolbar personnalisées
- [x] Style des éléments formatés cohérent
- [x] Bordure et focus tribal

---

## 4.5 Système de validation

### Validation côté client
- [x] Créer `utils/validation.js` :
  ```javascript
  // Validateurs de base
  required(value)           // Champ requis
  minLength(min)(value)     // Longueur minimale
  maxLength(max)(value)     // Longueur maximale
  pattern(regex)(value)     // Expression régulière
  email(value)              // Format email
  url(value)                // Format URL
  min(n)(value)             // Valeur numérique min
  max(n)(value)             // Valeur numérique max

  // Validateurs composés
  compose(...validators)    // Combine plusieurs validateurs

  // Validateurs custom
  matchField(fieldName)     // Correspond à un autre champ
  fileSize(maxBytes)        // Taille de fichier
  fileType(types[])         // Type de fichier
  ```

### Messages d'erreur
- [x] Créer `utils/validationMessages.js` :
  - Messages en français
  - Support des paramètres (ex: "Minimum {min} caractères")
  - Messages thématiques optionnels ("Ce sceau est trop court")

### Intégration avec Form
- [x] Hook `useField` (intégré dans Form.jsx) :
  - Validation au blur (par champ)
  - Validation au submit (tous les champs)
  - Gestion des erreurs async (ex: vérification unicité)

### Affichage des erreurs
- [x] Style des messages d'erreur cohérent
- [x] Animation d'apparition
- [x] Icône d'alerte tribale
- [x] Scroll vers la première erreur au submit

---

## 4.6 Composants de formulaire spécialisés (optionnel)

### CharacterForm (préparation Phase 6) - DONE (implémenté en Phase 6.3)
- [x] Formulaire multi-sections pour création de personnage (`MyCharacterCreate.jsx`)
- [x] Sections : Identité > Apparence > Personnalité > Histoire > Objectifs (avec barre de progression)
- [x] Sauvegarde brouillon
- [x] Édition pré-remplie draft/rejected (`MyCharacterEdit.jsx`)

### TopicForm (préparation Phase 7)
- [ ] Formulaire de création de sujet forum
- [ ] Sélection catégorie
- [ ] Titre + contenu riche
- [ ] Options (épinglé, verrouillé - si modérateur)

### PostForm (préparation Phase 7)
- [ ] Formulaire de réponse à un sujet
- [ ] Citation de message
- [ ] Éditeur riche
- [ ] Sélection de personnage (si RP)

---

## Ordre de réalisation suggéré

1. **Base**
   - [x] Form, FormField, FormGroup
   - [x] Système de validation (utils)

2. **Composants simples**
   - [x] Textarea (auto-resize) - déjà existant
   - [x] Checkbox, CheckboxGroup
   - [x] Radio, RadioGroup

3. **Select**
   - [x] Select simple
   - [x] SelectMultiple

4. **FileUpload**
   - [x] FileUpload basique
   - [x] ImageUpload avec preview
   - [x] AvatarUpload

5. **DatePicker**
   - [x] DatePicker (vanilla JS, sans librairie externe)

6. **RichTextEditor**
   - [x] Installation TipTap
   - [x] Éditeur de base
   - [x] Toolbar personnalisée
   - [x] Thématique tribal

---

## Critères de validation

- [x] Tous les composants sont accessibles (clavier, ARIA)
- [x] Tous les composants supportent les états : default, focus, disabled, error
- [x] La validation affiche des messages clairs en français
- [x] Les composants sont responsive
- [x] Le style est cohérent avec le design system tribal existant
- [ ] Les composants sont documentés (props, exemples)
- [ ] Preview fonctionnelle dans une page de test/démo

---

## Notes techniques

- Privilégier les composants contrôlés (value + onChange)
- Utiliser des refs forwarding pour l'accessibilité
- Garder les composants le plus simple possible (composition > configuration)
- Tester l'accessibilité avec un lecteur d'écran
- Prévoir le support du mode sombre (si implémenté plus tard)

---

## Dépendances installées

```bash
# Éditeur de texte riche (TipTap) ✅
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
npm install @tiptap/extension-link @tiptap/extension-text-align
npm install @tiptap/extension-image @tiptap/extension-mention
npm install @tiptap/extension-code-block-lowlight lowlight
npm install @tiptap/extension-table @tiptap/extension-table-row
npm install @tiptap/extension-table-cell @tiptap/extension-table-header

# DatePicker ✅ implémenté en vanilla JS (pas de dépendance externe)
```

---

## Exemples d'utilisation prévus

### Formulaire de personnage
```jsx
<Form onSubmit={handleSubmit} validate={characterValidation}>
  <FormGroup title="Identité">
    <FormField name="name" label="Nom du personnage" required>
      <Input name="name" placeholder="Ex: Kael le Vagabond" />
    </FormField>
    <FormField name="race" label="Race" required>
      <Select name="race" options={raceOptions} />
    </FormField>
  </FormGroup>

  <FormGroup title="Apparence">
    <FormField name="avatar" label="Avatar">
      <AvatarUpload name="avatar" />
    </FormField>
    <FormField name="description" label="Description physique">
      <Textarea name="description" minRows={3} maxLength={1000} showCount />
    </FormField>
  </FormGroup>

  <FormGroup title="Histoire">
    <FormField name="background" label="Background">
      <RichTextEditor name="background" placeholder="Raconte l'histoire de ton personnage..." />
    </FormField>
  </FormGroup>
</Form>
```

### Formulaire de post forum
```jsx
<Form onSubmit={handleSubmit}>
  <FormField name="character" label="Poster en tant que">
    <Select name="character" options={myCharacters} />
  </FormField>
  <FormField name="content" label="Message">
    <RichTextEditor name="content" />
  </FormField>
  <Button type="submit">Publier</Button>
</Form>
```
