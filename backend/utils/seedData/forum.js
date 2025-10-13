/**
 * Fichier principal pour les données de seed du forum
 * Regroupe les imports des trois catégories de forum
 */

// Import des données des trois catégories de forum
import { sectionsGeneralData, topicsAndPostsGeneral } from "./forumGeneral.js";
import { sectionsHRPData, subsectionsAutourDuJeu, topicsAndPostsHRP } from "./forumHRP.js";
import {
  sectionsRPData,
  subsectionsFactions,
  subsectionsEclaireurs,
  subsectionsVeilleurs,
  subsectionsClansNeutres,
} from "./forumRP.js";

// Catégories du forum
export const categoriesData = [
  {
    name: "Forum Général",
    slug: "general",
    description: "Discussions générales sur le jeu",
    order: 1,
    is_active: true,
  },
  {
    name: "Forum HRP",
    slug: "hrp",
    description: "Discussions Hors Rôle Play",
    order: 2,
    is_active: true,
  },
  {
    name: "Forum RP",
    slug: "rp",
    description: "Zone de jeu Rôle Play",
    order: 3,
    is_active: true,
  },
];

// Réexportation des sections
export { sectionsGeneralData, sectionsHRPData, sectionsRPData };

// Réexportation des sous-sections
export {
  subsectionsAutourDuJeu,
  subsectionsFactions,
  subsectionsEclaireurs,
  subsectionsVeilleurs,
  subsectionsClansNeutres,
};

// Réexportation des topics et posts combinés
export const topicsAndPosts = [
  ...topicsAndPostsGeneral,
  ...topicsAndPostsHRP,
];
