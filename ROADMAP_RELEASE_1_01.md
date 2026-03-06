# Roadmap Release 1.0.1

## Corrections

### Formulaire d'inscription — mot de passe

- Les navigateurs suggèrent automatiquement des mots de passe sans caractères spéciaux, ce qui ne passe pas la validation backend. Adapter le comportement (attribut `autocomplete`, attribut `pattern`, ou assouplir la règle de validation).

### Messages d'erreur de validation des formulaires

- Remplacer les messages génériques ("Mot de passe invalide", "Nom d'utilisateur invalide", etc.) par des messages précis indiquant la règle non respectée (ex: "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial").
