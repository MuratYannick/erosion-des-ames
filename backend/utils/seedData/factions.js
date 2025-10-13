/**
 * Données de seed pour les factions
 */

export const factionsData = [ // pas de faction pour les clans neutres (faction_id = null dans la table clans)
  // Factions jouables pour les mutants
  {
    name: "Les Éclaireurs de l'Aube Nouvelle",
    ethnic_group: "Les Eveillés",
    description:
      "Faction des mutants qui considèrent leur transformation comme une évolution nécessaire. Ils croient que le cataclysme était la purification de la Terre par la nature elle-même, et que les mutations sont des dons permettant aux survivants de prospérer dans ce nouveau monde. Ils vivent en symbiose avec l'environnement muté, cherchant à comprendre et à maîtriser ses forces.",
    base_name: "L'Oasis des Transformés",
    is_playable: true,
  },
  // Factions jouables pour les non-mutants
  {
    name: "Les Veilleurs de l'Ancien Monde",
    ethnic_group: "Les Inaltérés",
    description:
      "Faction des non-mutants qui s'accrochent aux vestiges de l'humanité d'avant. Ils considèrent les mutants comme une aberration et croient que la survie de l'espèce humaine dépend de la préservation de leur génétique pure. Ils ont construit des avant-postes fortifiés, utilisant les technologies retrouvées de l'Ancien Monde pour se défendre et maintenir leur mode de vie.",
    base_name: "La Citadelle Inaltérée",
    is_playable: true,
  },
];
