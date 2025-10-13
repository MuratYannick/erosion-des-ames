/**
 * Données de seed pour le Forum HRP (Hors Rôle Play)
 */

// Sections du Forum HRP
export const sectionsHRPData = [
  {
    name: "Autour du Jeu",
    slug: "autour-du-jeu",
    description: "Discussions sur le développement du jeu",
    order: 1,
    is_active: true,
    clan_id: null,
    faction_id: null,
    is_public: 1,
  },
  {
    name: "Au Feu de Camps",
    slug: "au-feu-de-camps",
    description: "Discussions libres entre joueurs",
    order: 2,
    is_active: true,
    clan_id: null,
    faction_id: null,
    is_public: 1,
  },
];

// Sous-sections pour "Autour du Jeu"
export const subsectionsAutourDuJeu = [
  {
    name: "Suggestions pour améliorer le jeu",
    slug: "suggestions",
    description: "Une idée à nous proposer ? Faites-nous en part... Votre avis compte !",
    order: 1,
    is_active: true,
    parentSlug: "autour-du-jeu",
    clan_id: null,
    faction_id: null,
    is_public: 1, // Section publique
  },
  {
    name: "Entraide",
    slug: "entraide",
    description: "Un conseil à donner, une question à soumettre à la communauté ? C'est par ici...",
    order: 2,
    is_active: true,
    parentSlug: "autour-du-jeu",
    clan_id: null,
    faction_id: null,
    is_public: 1, // Section publique
  },
];

// Topics et posts pour le Forum HRP
export const topicsAndPostsHRP = [
  {
    sectionSlug: "au-feu-de-camps",
    topic: {
      title: "Vous écoutez quoi en ce moment ?",
      slug: "musique-du-moment",
      is_pinned: false,
      is_locked: false,
      author_name: "L'équipe de développement",
    },
    post: {
      content: `Wasteland - Générative Modular Longform Ambiant de State Azure. Excellent pour vous mettre dans l'ambiance du jeu.

Lien YouTube : https://www.youtube.com/watch?v=FFzIStvJ5co`,
      author_name: "L'équipe de développement",
    },
  },
  {
    sectionSlug: "au-feu-de-camps",
    topic: {
      title: "Partagez nous vos lectures du moment",
      slug: "lectures-du-moment",
      is_pinned: false,
      is_locked: false,
      author_name: "L'équipe de développement",
    },
    post: {
      content: `Le Guide du voyageur galactique (The Hitchhiker's Guide to the Galaxy) de Douglas Adams :

Une œuvre de science-fiction absurde et déjantée. Fortement conseillé pour les amateurs d'humour anglais à la Monty Python.`,
      author_name: "L'équipe de développement",
    },
  },
];
