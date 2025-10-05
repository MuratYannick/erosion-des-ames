import sequelize from "../config/database.js";
import { Faction, Clan } from "../models/index.js";

// Données initiales pour les factions
const factionsData = [
  {
    name: "Les Éveillés",
    type: "mutant",
    description:
      "Mutants ayant évolué suite au cataclysme. Ils croient être les élus d'un nouveau monde purifié par la nature.",
    base_name: "L'Oasis des Transformés",
    ideology:
      "Le grand cataclysme a été lancé par leur dieu pour purifier la terre de l'homme et de sa technologie. Ils sont les élus et tous les non-mutants doivent périr.",
    is_playable: true,
  },
  {
    name: "Les Purs",
    type: "non_mutant",
    description:
      "Non-mutants préservant l'héritage de l'ancien monde. Ils cherchent à restaurer la civilisation par la technologie.",
    base_name: "La Citadelle Inaltérée",
    ideology:
      "La technologie est le seul moyen de reprendre le dessus sur cette nature dégénérée. Les mutants font partie de cette dégénérescence et doivent être exterminés.",
    is_playable: true,
  },
  {
    name: "Clans Neutres",
    type: "neutre",
    description:
      "Groupes indépendants refusant de prendre parti dans le conflit. Ils cherchent à survivre par leurs propres moyens.",
    base_name: null,
    ideology:
      "La survie avant tout. Éviter le conflit et trouver sa propre voie dans ce monde dévasté.",
    is_playable: true,
  },
];

// Données initiales pour les clans mutants (castes)
const mutantClansData = [
  {
    name: "Les Symbiotes",
    type: "caste_mutant",
    description:
      "Mutants connectés à la nature environnante, experts en exploitation des ressources du monde muté.",
    specialization: "Ressources & Adaptation",
  },
  {
    name: "Les Sensitifs",
    type: "caste_mutant",
    description:
      "Mutants aux sens aiguisés, excellents éclaireurs et pisteurs.",
    specialization: "Exploration & Perception",
  },
  {
    name: "Les Forgerons de Chair",
    type: "caste_mutant",
    description:
      "Guérisseurs et biologistes utilisant les propriétés des espèces mutées.",
    specialization: "Guérison & Évolution",
  },
  {
    name: "Les Sentinelles du Chaos",
    type: "caste_mutant",
    description:
      "Guerriers mutants formant l'avant-garde martiale de la faction.",
    specialization: "Défense & Combat",
  },
  {
    name: "Les Scrutateurs",
    type: "caste_mutant",
    description:
      "Explorateurs des ruines de l'ancien monde, récupérateurs d'artefacts.",
    specialization: "Connaissance & Mystères",
  },
];

// Données initiales pour les clans non-mutants
const nonMutantClansData = [
  {
    name: "Les Sentinelles",
    type: "caste_non_mutant",
    description:
      "Guerriers assurant la défense de l'avant-poste et le maintien de l'ordre.",
    specialization: "Défense & Ordre",
  },
  {
    name: "Les Pourvoyeurs",
    type: "caste_non_mutant",
    description:
      "Responsables de la collecte et production des ressources essentielles.",
    specialization: "Ressources & Production",
  },
  {
    name: "Les Archivistes",
    type: "caste_non_mutant",
    description:
      "Gardiens de l'héritage de l'Ancien Monde, érudits et historiens.",
    specialization: "Savoir & Tradition",
  },
  {
    name: "Les Purificateurs",
    type: "caste_non_mutant",
    description:
      "Spécialistes de la santé veillant à la pureté biologique du clan.",
    specialization: "Santé & Hygiène",
  },
  {
    name: "Les Explorateurs",
    type: "caste_non_mutant",
    description: "Cartographes et éclaireurs s'aventurant au-delà des murs.",
    specialization: "Reconnaissance & Découverte",
  },
];

// Données pour quelques clans neutres
const neutralClansData = [
  {
    name: "Les Veilleurs des Ruines",
    type: "clan_neutre",
    description: "Explorateurs et archivistes des ruines de l'Ancien Monde.",
    specialization: "Exploration & Savoir",
    faction_id: null,
  },
  {
    name: "Les Vagabonds du Vent",
    type: "clan_neutre",
    description: "Marchands ambulants et transporteurs entre les avant-postes.",
    specialization: "Commerce & Transport",
    faction_id: null,
  },
  {
    name: "Les Artisans du Réemploi",
    type: "clan_neutre",
    description:
      "Spécialistes de la récupération et de la réparation d'équipements.",
    specialization: "Artisanat & Réparation",
    faction_id: null,
  },
];

// Fonction principale de seed
export const seedDatabase = async () => {
  try {
    console.log("🌱 Début du seeding de la base de données...\n");

    // 1. Créer les factions
    console.log("📊 Création des factions...");
    const factions = await Faction.bulkCreate(factionsData, {
      ignoreDuplicates: true,
    });
    console.log(`✅ ${factions.length} factions créées\n`);

    // 2. Récupérer les IDs des factions
    const mutantFaction = await Faction.findOne({ where: { type: "mutant" } });
    const nonMutantFaction = await Faction.findOne({
      where: { type: "non_mutant" },
    });

    // 3. Créer les clans mutants
    console.log("📊 Création des castes mutantes...");
    const mutantClans = await Clan.bulkCreate(
      mutantClansData.map((clan) => ({
        ...clan,
        faction_id: mutantFaction.id,
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${mutantClans.length} castes mutantes créées\n`);

    // 4. Créer les clans non-mutants
    console.log("📊 Création des clans non-mutants...");
    const nonMutantClans = await Clan.bulkCreate(
      nonMutantClansData.map((clan) => ({
        ...clan,
        faction_id: nonMutantFaction.id,
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${nonMutantClans.length} clans non-mutants créés\n`);

    // 5. Créer les clans neutres
    console.log("📊 Création des clans neutres...");
    const neutralClans = await Clan.bulkCreate(neutralClansData, {
      ignoreDuplicates: true,
    });
    console.log(`✅ ${neutralClans.length} clans neutres créés\n`);

    console.log("🎉 Seeding terminé avec succès !\n");

    return true;
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    return false;
  }
};

// Exécuter le seed automatiquement
(async () => {
  try {
    console.log("🚀 Script de seed lancé...\n");

    // Synchroniser les tables (force: true = recréer les tables)
    console.log("🔄 Synchronisation de la base de données...");
    await sequelize.sync({ force: true });
    console.log("✅ Tables créées/recréées\n");

    // Lancer le seeding
    const success = await seedDatabase();

    if (success) {
      console.log("🏁 Script terminé avec succès");
      process.exit(0);
    } else {
      console.log("❌ Échec du seeding");
      process.exit(1);
    }
  } catch (error) {
    console.error("💥 ERREUR FATALE:", error);
    process.exit(1);
  }
})();
