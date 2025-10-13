/**
 * Données de seed pour le Forum Général
 */

// Sections du Forum Général
export const sectionsGeneralData = [
  {
    name: "Annonces",
    slug: "annonces",
    description: "Annonces officielles de l'équipe",
    order: 1,
    is_active: true,
    clan_id: null,
    faction_id: null,
    is_public: 1,
  },
  {
    name: "Règlement et CGU",
    slug: "reglement-cgu",
    description: "Règles du jeu et conditions d'utilisation",
    order: 2,
    is_active: true,
    clan_id: null,
    faction_id: null,
    is_public: 1,
  },
  {
    name: "Règles du Jeu",
    slug: "regles-jeu",
    description: "Mécanique de jeu et règles RP",
    order: 3,
    is_active: true,
    clan_id: null,
    faction_id: null,
    is_public: 1,
  },
];

// Topics et posts pour le Forum Général
export const topicsAndPostsGeneral = [
  {
    sectionSlug: "annonces",
    topic: {
      title: "Bienvenue sur L'Érosion des Âmes !",
      slug: "bienvenue",
      is_pinned: true,
      is_locked: true,
      author_name: "L'équipe de développement",
    },
    post: {
      content: `# Bienvenue sur L'Érosion des Âmes ! 🌍

Nous sommes ravis de vous accueillir dans cet univers post-apocalyptique où chaque choix compte.

## Qu'est-ce que L'Érosion des Âmes ?

**L'Érosion des Âmes** est un jeu de rôle textuel en ligne se déroulant dans un monde dévasté par un cataclysme. Vous incarnerez un survivant appartenant à l'une des deux grandes factions :

- **Les Éclaireurs de l'Aube Nouvelle (Les Éveillés)** : Mutants qui embrassent leur transformation comme une évolution
- **Les Veilleurs de l'Ancien Monde (Les Inaltérés)** : Non-mutants qui préservent l'humanité d'origine
- **Clans Neutres** : Groupes indépendants refusant de prendre parti dans le conflit

## Par où commencer ?

1. Consultez le [Règlement](#) pour comprendre les règles de la communauté
2. Lisez les [Règles du Jeu](#) pour découvrir les mécaniques de jeu
3. Créez votre personnage et choisissez votre faction
4. Rejoignez-nous sur le forum pour commencer votre aventure !

## Besoin d'aide ?

N'hésitez pas à poser vos questions dans la section [Entraide](#) du forum HRP. Notre communauté est là pour vous aider !

Bon jeu à tous ! 🎮

*L'équipe de développement*`,
      author_name: "L'équipe de développement",
    },
  },
  {
    sectionSlug: "reglement-cgu",
    topic: {
      title: "Conditions Générales d'Utilisation",
      slug: "cgu",
      is_pinned: true,
      is_locked: true,
      author_name: "L'équipe de développement",
    },
    post: {
      content: `# Conditions Générales d'Utilisation

**Dernière mise à jour : [Date]**

## 1. Acceptation des conditions

En accédant à ce jeu et en l'utilisant, vous acceptez d'être lié par les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le jeu.

## 2. Inscription et compte utilisateur

### 2.1 Création de compte
- Vous devez avoir au moins 16 ans pour créer un compte
- Les informations fournies doivent être exactes et à jour
- Vous êtes responsable de la confidentialité de votre mot de passe

### 2.2 Sécurité du compte
- Ne partagez jamais vos identifiants
- Informez immédiatement l'équipe en cas de compromission de votre compte
- L'équipe ne vous demandera jamais votre mot de passe

## 3. Utilisation du service

### 3.1 Comportement attendu
- Respectez les autres joueurs et l'équipe
- Pas de harcèlement, discrimination ou propos offensants
- Pas de spam ou de publicité non autorisée
- Respectez l'univers du jeu dans les zones RP

### 3.2 Comportements interdits
- Tricher ou exploiter des bugs
- Usurpation d'identité
- Perturbation du jeu pour les autres joueurs
- Contournement des sanctions

## 4. Contenu utilisateur

### 4.1 Propriété
- Vous conservez la propriété de votre contenu
- Vous accordez au jeu une licence d'utilisation de votre contenu
- Le contenu doit respecter les lois en vigueur

### 4.2 Modération
- L'équipe se réserve le droit de modérer tout contenu
- Le contenu inapproprié sera supprimé
- Les récidives peuvent entraîner des sanctions

## 5. Données personnelles

Consultez notre [Politique de Confidentialité](#) pour en savoir plus sur la gestion de vos données personnelles.

## 6. Sanctions

En cas de non-respect des CGU :
- Avertissement
- Suspension temporaire
- Bannissement définitif

## 7. Modifications des CGU

L'équipe se réserve le droit de modifier ces CGU à tout moment. Les modifications seront annoncées sur le forum.

## 8. Contact

Pour toute question concernant ces CGU, contactez l'équipe via [contact@erosion-des-ames.fr]

---

*En utilisant ce service, vous acceptez ces conditions.*`,
      author_name: "L'équipe de développement",
    },
  },
  {
    sectionSlug: "reglement-cgu",
    topic: {
      title: "Règlement du Forum et du Jeu",
      slug: "reglement",
      is_pinned: true,
      is_locked: true,
      author_name: "L'équipe de développement",
    },
    post: {
      content: `# Règlement du Forum et du Jeu

**Version 1.0 - [Date]**

Ce règlement s'applique à l'ensemble du forum et du jeu. Son non-respect peut entraîner des sanctions.

## 1. Règles générales du forum

### 1.1 Respect et courtoisie
- Soyez respectueux envers tous les membres
- Pas d'insultes, de propos discriminatoires ou offensants
- Pas de harcèlement sous quelque forme que ce soit
- Les débats sont autorisés mais doivent rester constructifs

### 1.2 Communication
- Utilisez un langage correct et compréhensible
- Pas de flood, spam ou double-post excessif
- Les messages en MAJUSCULES sont à éviter
- Restez dans le sujet du topic

### 1.3 Contenu inapproprié
- Pas de contenu pornographique, violent ou choquant
- Pas de liens vers des sites illégaux ou dangereux
- Pas de publicité sans autorisation
- Respectez les droits d'auteur

## 2. Règles spécifiques au RP

### 2.1 Respect de l'univers
- Restez cohérent avec le contexte post-apocalyptique
- Respectez les caractéristiques de votre faction/clan
- Pas de personnage tout-puissant (god-moding)
- Pas de méta-gaming (utilisation d'informations HRP en RP)

### 2.2 Interactions RP
- Respectez les actions des autres personnages
- Demandez l'accord pour les actions majeures sur d'autres personnages
- Laissez le temps aux autres de répondre
- Acceptez les conséquences des actions de votre personnage

### 2.3 Contenu mature
- Les scènes violentes doivent rester raisonnables
- Les scènes à caractère sexuel doivent rester suggestives
- Attention aux sujets sensibles (trigger warning si nécessaire)

## 3. Organisation du forum

### 3.1 Catégories
- **Forum Général** : Annonces et règles
- **Forum HRP** : Discussions hors-jeu
- **Forum RP** : Zone de jeu en rôle-play

### 3.2 Utilisation des sections
- Postez dans la section appropriée
- Utilisez des titres clairs et descriptifs
- Respectez les topics épinglés et verrouillés

## 4. Système de jeu

### 4.1 Création de personnage
- Un personnage par compte
- Respectez les contraintes de votre faction/clan
- Les caractéristiques doivent être cohérentes

### 4.2 Progression
- La progression se fait par le jeu actif
- Pas de triche ou d'exploitation de bugs
- Les récompenses sont attribuées équitablement

## 5. Modération

### 5.1 Rôle des modérateurs
- Faire respecter le règlement
- Aider les joueurs
- Gérer les conflits
- Maintenir un environnement sain

### 5.2 Sanctions
En cas de non-respect du règlement :
1. **Avertissement** : Rappel du règlement
2. **Avertissement formel** : Enregistré dans le dossier
3. **Suspension temporaire** : De quelques jours à plusieurs semaines
4. **Bannissement** : Permanent en cas de récidive grave

### 5.3 Contestation
- Vous pouvez contester une sanction en MP à un administrateur
- Restez courtois dans votre contestation
- La décision finale revient à l'équipe d'administration

## 6. Signalement

Si vous constatez un comportement inapproprié :
- Utilisez la fonction de signalement
- Contactez un modérateur en MP
- Ne prenez pas la justice en main

## 7. Modifications du règlement

Ce règlement peut être modifié à tout moment. Les changements seront annoncés et une période d'adaptation sera accordée si nécessaire.

---

**En jouant, vous acceptez ce règlement et vous engagez à le respecter.**

*Pour toute question, n'hésitez pas à contacter l'équipe de modération.*`,
      author_name: "L'équipe de développement",
    },
  },
];
