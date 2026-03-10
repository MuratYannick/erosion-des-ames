# Roadmap Prérelease

## Éléments non terminés

### Phase 8 — Critères de validation non réalisés

1. [x] Expiration automatique des sanctions temporaires (ban/mute avec durée)
2. [x] Recalcul des compteurs de posts/topics après déplacement ou fusion de sujets
3. [x] Les modérateurs ne peuvent pas modifier les comptes admins
4. [x] Vérification que les routes admin sont accessibles uniquement aux rôles corrects
5. [x] Panel d'administration responsive sur mobile

### Phase 10.1 — Pages profil (en cours)

6. [x] `ProfilePage.jsx` (`/profil/:id`) — composants ProfileHeader, ProfileTabs, ProfileActivityRow
7. [x] `ProfileSettings.jsx` (`/profil/parametres`) — ProtectedRoute
8. [x] Mise à jour Header : lien "Mon profil" dynamique (`/profil/${user.id}`) + lien "Paramètres"
9. [x] Usernames cliquables dans AuthorSidebar et TopicRow

### Phase 10.4 — Déploiement (partiel)

10. [x] Rate limiting global (100 req/15min) + morgan logging + Sequelize pool max:10
11. [x] CI/CD GitHub Actions (lint + tests + build + deploy)
12. [x] `DEPLOYMENT.md` — documentation pour mise en production
13. [ ] Scripts `backup-db.sh` / `restore-db.sh` + cron job quotidien

## Éléments reportés (hors périmètre, non bloquants)

- Modal détail faction (page Univers) — optionnel
- Images lieux et portraits personnages prédéfinis — assets à fournir
- Documentation des composants UI (Phase 4) — non critique
- "Mes abonnements" dans le profil (Phase 7) — marqué "Phase future"
- Tests E2E Playwright/Cypress — optionnel

---

# Roadmap Release 1.0.1

## Corrections

### Formulaire d'inscription — mot de passe

- Les navigateurs suggèrent automatiquement des mots de passe sans caractères spéciaux, ce qui ne passe pas la validation backend. Adapter le comportement (attribut `autocomplete`, attribut `pattern`, ou assouplir la règle de validation).

### Messages d'erreur de validation des formulaires

- Remplacer les messages génériques ("Mot de passe invalide", "Nom d'utilisateur invalide", etc.) par des messages précis indiquant la règle non respectée (ex: "Le mot de passe doit contenir au moins 8 caractères, une majuscule et un caractère spécial").

---

## Évolutions

### Page "Avant-propos" — rappel Règlement et CGU

- Ajouter un encart dans la section "Introduction & Bienvenue" invitant l'utilisateur à lire et accepter le "Règlement du Forum" et les "Conditions Générales d'Utilisation", avec liens directs vers les topics correspondants dans la sous-catégorie "Règlement et CGU".

### Seeders de production — sous-catégories et topics

- Ajouter les sous-catégories suivantes dans les seeders de production :
  - Catégorie **Générale** : "Annonces", "Règlement et CGU", "Informations Générales"
  - Catégorie **Hors Role-Play** : "Discussions Autour du Jeu", "Discussions Libres"
  - Catégorie **Role-Play** : "Les Veilleurs de l'Ancien Monde", "Les Éclaireurs de l'Aube Nouvelle", "Les Terres Abandonnées"
- Ajouter les permissions associées à chaque sous-catégorie dans les seeders de production.
- Ajouter dans la sous-catégorie "Règlement et CGU" les deux topics suivants, verrouillés et épinglés :
  - "Règlement du Forum"
  - "Conditions Générales d'Utilisation"

### Acceptation du Règlement et des CGU — flux post-inscription

- Supprimer les cases à cocher "Accepter le règlement" et "Accepter les CGU" du formulaire d'inscription.
- Ajouter sur chacun des deux topics "Règlement du Forum" et "Conditions Générales d'Utilisation" une case à cocher d'acceptation, visible uniquement pour les utilisateurs connectés n'ayant pas encore accepté le document correspondant.

### Formulaire d'inscription — date de naissance et âge minimum

- Ajouter un sélecteur de date de naissance dans le formulaire d'inscription.
- Ajouter une validation : âge minimum de 16 ans (frontend + backend).
