/**
 * Données de seed pour le Forum RP (Rôle Play)
 */

// Sections du Forum RP
export const sectionsRPData = [
  {
    name: "Histoires des terres abandonnées",
    slug: "histoires-terres-abandonnees",
    description: "Retrouvez ici tout ce qui se passe à l'extérieur des clans et des factions.",
    order: 1,
    is_active: true,
    clan_id: null,
    faction_id: null,
    is_public: 1,
  },
  {
    name: "Histoires des factions",
    slug: "histoires-factions",
    description: "Retrouvez ici tout ce qui se passe au sein des factions.",
    order: 2,
    is_active: true,
    clan_id: null,
    faction_id: null,
    is_public: 1,
  },
  {
    name: "Histoires des clans neutres",
    slug: "histoires-clans-neutres",
    description: "Retrouvez ici tout ce qui se passe au sein des clans neutres.",
    order: 3,
    is_active: true,
    clan_id: null,
    faction_id: null,
    is_public: 1,
  },
];

// Sous-sections pour "Histoires des factions"
export const subsectionsFactions = [
  {
    name: "Les Éclaireurs de l'Aube Nouvelle",
    slug: "eclaireurs-aube-nouvelle",
    description: "Histoires et récits des Éveillés, la faction mutante.",
    order: 1,
    is_active: true,
    parentSlug: "histoires-factions",
    clan_id: null,
    faction_id: null, // Sera défini dans seed.js
    is_public: 1, // Section parente publique
    factionName: "Les Éclaireurs de l'Aube Nouvelle", // Pour référence dans seed.js
  },
  {
    name: "Les Veilleurs de l'Ancien Monde",
    slug: "veilleurs-ancien-monde",
    description: "Histoires et récits des Inaltérés, la faction non-mutante.",
    order: 2,
    is_active: true,
    parentSlug: "histoires-factions",
    clan_id: null,
    faction_id: null, // Sera défini dans seed.js
    is_public: 1, // Section parente publique
    factionName: "Les Veilleurs de l'Ancien Monde", // Pour référence dans seed.js
  },
];

// Sous-sections pour "Les Éclaireurs de l'Aube Nouvelle"
export const subsectionsEclaireurs = [
  {
    name: "Affaires publiques",
    slug: "eclaireurs-affaires-publiques",
    description: "Discussions publiques et annonces officielles des Éclaireurs de l'Aube Nouvelle.",
    order: 1,
    is_active: true,
    parentSlug: "eclaireurs-aube-nouvelle",
    clan_id: null,
    faction_id: null, // Sera défini dans seed.js
    is_public: 1, // Section publique
    factionName: "Les Éclaireurs de l'Aube Nouvelle",
  },
  {
    name: "Affaires privées",
    slug: "eclaireurs-affaires-privees",
    description: "Discussions privées et confidentielles des Éclaireurs de l'Aube Nouvelle.",
    order: 2,
    is_active: true,
    parentSlug: "eclaireurs-aube-nouvelle",
    clan_id: null,
    faction_id: null, // Sera défini dans seed.js
    is_public: 0, // Section privée réservée à la faction
    factionName: "Les Éclaireurs de l'Aube Nouvelle",
  },
  {
    name: "La Caste des Symbiotes",
    slug: "eclaireurs-caste-symbiotes",
    description: "Section dédiée aux membres de La Caste des Symbiotes.",
    order: 3,
    is_active: true,
    parentSlug: "eclaireurs-aube-nouvelle",
    clan_id: null, // Sera défini dans seed.js
    faction_id: null,
    is_public: 0, // Section privée réservée au clan
    clanName: "La Caste des Symbiotes",
  },
];

// Sous-sections pour "Les Veilleurs de l'Ancien Monde"
export const subsectionsVeilleurs = [
  {
    name: "Affaires publiques",
    slug: "veilleurs-affaires-publiques",
    description: "Discussions publiques et annonces officielles des Veilleurs de l'Ancien Monde.",
    order: 1,
    is_active: true,
    parentSlug: "veilleurs-ancien-monde",
    clan_id: null,
    faction_id: null, // Sera défini dans seed.js
    is_public: 1, // Section publique
    factionName: "Les Veilleurs de l'Ancien Monde",
  },
  {
    name: "Affaires privées",
    slug: "veilleurs-affaires-privees",
    description: "Discussions privées et confidentielles des Veilleurs de l'Ancien Monde.",
    order: 2,
    is_active: true,
    parentSlug: "veilleurs-ancien-monde",
    clan_id: null,
    faction_id: null, // Sera défini dans seed.js
    is_public: 0, // Section privée réservée à la faction
    factionName: "Les Veilleurs de l'Ancien Monde",
  },
  {
    name: "Le Clan des Sentinelles",
    slug: "veilleurs-clan-sentinelles",
    description: "Section dédiée aux membres du Clan des Sentinelles.",
    order: 3,
    is_active: true,
    parentSlug: "veilleurs-ancien-monde",
    clan_id: null, // Sera défini dans seed.js
    faction_id: null,
    is_public: 0, // Section privée réservée au clan
    clanName: "Le Clan des Sentinelles",
  },
];

// Sous-sections pour "Histoires des clans neutres"
export const subsectionsClansNeutres = [
  {
    name: "Affaires publiques",
    slug: "clans-neutres-affaires-publiques",
    description: "Discussions publiques et annonces des clans neutres.",
    order: 1,
    is_active: true,
    parentSlug: "histoires-clans-neutres",
    clan_id: null,
    faction_id: null,
    is_public: 1, // Section publique
  },
  {
    name: "Le Peuple des Ombres",
    slug: "clans-neutres-peuple-ombres",
    description: "Section dédiée aux membres du Peuple des Ombres.",
    order: 2,
    is_active: true,
    parentSlug: "histoires-clans-neutres",
    clan_id: null, // Sera défini dans seed.js
    faction_id: null,
    is_public: 0, // Section privée réservée au clan
    clanName: "Le Peuple des Ombres",
  },
  {
    name: "Les Frères de la Terre Brûlée",
    slug: "clans-neutres-freres-terre-brulee",
    description: "Section dédiée aux membres des Frères de la Terre Brûlée.",
    order: 3,
    is_active: true,
    parentSlug: "histoires-clans-neutres",
    clan_id: null, // Sera défini dans seed.js
    faction_id: null,
    is_public: 0, // Section privée réservée au clan
    clanName: "Les Frères de la Terre Brûlée",
  },
  {
    name: "Les Vagabonds du Vent",
    slug: "clans-neutres-vagabonds-vent",
    description: "Section dédiée aux membres des Vagabonds du Vent.",
    order: 4,
    is_active: true,
    parentSlug: "histoires-clans-neutres",
    clan_id: null, // Sera défini dans seed.js
    faction_id: null,
    is_public: 0, // Section privée réservée au clan
    clanName: "Les Vagabonds du Vent",
  },
];
