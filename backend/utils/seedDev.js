import sequelize from "../config/database.js";
import { User, Character, Faction, Clan } from "../models/index.js";
import { hashPassword } from "./auth.js";

// Données de test pour les utilisateurs
const testUsersData = [
  {
    username: "admin_test",
    email: "admin@test.com",
    password: "password123",
    role: "ADMIN",
    email_verified: true,
    terms_accepted: true,
  },
  {
    username: "moderator_test",
    email: "moderator@test.com",
    password: "password123",
    role: "MODERATOR",
    email_verified: true,
    terms_accepted: true,
  },
  {
    username: "gm_test",
    email: "gm@test.com",
    password: "password123",
    role: "GAME_MASTER",
    email_verified: true,
    terms_accepted: true,
  },
  {
    username: "player_mutant",
    email: "mutant@test.com",
    password: "password123",
    role: "PLAYER",
    email_verified: true,
    terms_accepted: true,
  },
  {
    username: "player_pure",
    email: "pure@test.com",
    password: "password123",
    role: "PLAYER",
    email_verified: true,
    terms_accepted: false, // Utilisateur qui n'a pas encore accepté les CGU
  },
  {
    username: "player_neutral",
    email: "neutral@test.com",
    password: "password123",
    role: "PLAYER",
    email_verified: true,
    terms_accepted: true,
  },
];

// Fonction pour créer des personnages de test
const createTestCharacters = async (users, factions, clans) => {
  const mutantFaction = factions.find(
    (f) => f.ethnic_group === "Les Eveillés"
  );
  const nonMutantFaction = factions.find(
    (f) => f.ethnic_group === "Les Inaltérés"
  );

  const mutantClans = clans.filter((c) => c.faction_id === mutantFaction?.id);
  const nonMutantClans = clans.filter(
    (c) => c.faction_id === nonMutantFaction?.id
  );
  const neutralClans = clans.filter((c) => c.faction_id === null);

  const playerMutant = users.find((u) => u.username === "player_mutant");
  const playerPure = users.find((u) => u.username === "player_pure");
  const playerNeutral = users.find((u) => u.username === "player_neutral");
  const gameMaster = users.find((u) => u.username === "gm_test");

  // Trouver les clans jouables et non jouables
  const casteSymbiotes = mutantClans.find((c) => c.name === "La Caste des Symbiotes");
  const prophetesHarmonie = mutantClans.find((c) => c.name === "Les Prophètes de l'Harmonie");
  const clanSentinelles = nonMutantClans.find((c) => c.name === "Le Clan des Sentinelles");
  const vagabonds = neutralClans.find((c) => c.name === "Les Vagabonds du Vent");
  const peupleOmbres = neutralClans.find((c) => c.name === "Le Peuple des Ombres");

  const charactersData = [
    // Personnage mutant dans une faction
    {
      name: "Xarn le Symbiote",
      user_id: playerMutant.id,
      faction_id: mutantFaction?.id,
      ethnic_group: "Les Eveillés",
      clan_id: casteSymbiotes?.id,
      level: 5,
      experience: 2500,
      strength: 12,
      agility: 8,
      intelligence: 10,
      endurance: 14,
      health: 140,
      max_health: 140,
      energy: 100,
      max_energy: 100,
      position_x: 0,
      position_y: 0,
      current_zone: "L'Oasis des Transformés",
      is_alive: true,
      is_playable: true,
    },
    // Personnage non-mutant dans une faction
    {
      name: "Marcus le Sentinelle",
      user_id: playerPure.id,
      faction_id: nonMutantFaction?.id,
      ethnic_group: "Les Inaltérés",
      clan_id: clanSentinelles?.id,
      level: 4,
      experience: 1800,
      strength: 14,
      agility: 10,
      intelligence: 8,
      endurance: 12,
      health: 120,
      max_health: 120,
      energy: 80,
      max_energy: 80,
      position_x: 100,
      position_y: 100,
      current_zone: "La Citadelle du Renouveau",
      is_alive: true,
      is_playable: true,
    },
    // Personnage neutre (mutant, sans faction)
    {
      name: "Lyra la Vagabonde",
      user_id: playerNeutral.id,
      faction_id: null,
      ethnic_group: "Les Inaltérés",
      clan_id: vagabonds?.id,
      level: 3,
      experience: 1200,
      strength: 8,
      agility: 14,
      intelligence: 12,
      endurance: 10,
      health: 100,
      max_health: 100,
      energy: 120,
      max_energy: 120,
      position_x: 50,
      position_y: 50,
      current_zone: "Les Terres Sauvages",
      is_alive: true,
      is_playable: true,
    },
    // Deuxième personnage neutre (mutant)
    {
      name: "Kira l'Ombre",
      user_id: playerMutant.id,
      faction_id: null,
      ethnic_group: "Les Eveillés",
      clan_id: peupleOmbres?.id,
      level: 2,
      experience: 500,
      strength: 6,
      agility: 16,
      intelligence: 12,
      endurance: 8,
      health: 80,
      max_health: 80,
      energy: 140,
      max_energy: 140,
      position_x: 5,
      position_y: 5,
      current_zone: "Les Zones Sombres",
      is_alive: true,
      is_playable: true,
    },
    // Personnage mort (pour tester la mécanique de mort)
    {
      name: "Ash le Déchu",
      user_id: playerPure.id,
      faction_id: nonMutantFaction?.id,
      ethnic_group: "Les Inaltérés",
      clan_id: clanSentinelles?.id,
      level: 6,
      experience: 3200,
      strength: 10,
      agility: 12,
      intelligence: 10,
      endurance: 10,
      health: 0,
      max_health: 120,
      energy: 0,
      max_energy: 100,
      position_x: 200,
      position_y: 150,
      current_zone: "Les Ruines Toxiques",
      is_alive: false,
      is_playable: true,
      death_count: 2,
      last_death_at: new Date(),
    },
    // Personnage dans une faction SANS clan
    {
      name: "Zara la Solitaire",
      user_id: playerMutant.id,
      faction_id: mutantFaction?.id,
      ethnic_group: "Les Eveillés",
      clan_id: null, // Aucun clan
      level: 3,
      experience: 900,
      strength: 10,
      agility: 12,
      intelligence: 11,
      endurance: 10,
      health: 100,
      max_health: 100,
      energy: 110,
      max_energy: 110,
      position_x: 25,
      position_y: 30,
      current_zone: "L'Oasis des Transformés",
      is_alive: true,
      is_playable: true,
    },
    // Personnage SANS faction et SANS clan (neutre total)
    {
      name: "Raven l'Errant",
      user_id: playerNeutral.id,
      faction_id: null, // Aucune faction
      ethnic_group: "Les Inaltérés",
      clan_id: null, // Aucun clan
      level: 2,
      experience: 400,
      strength: 10,
      agility: 10,
      intelligence: 10,
      endurance: 10,
      health: 100,
      max_health: 100,
      energy: 100,
      max_energy: 100,
      position_x: 75,
      position_y: 80,
      current_zone: "Les Terres Désolées",
      is_alive: true,
      is_playable: true,
    },
    // Personnage dans un clan non-jouable (pour le Game Master)
    {
      name: "Prophète Kael",
      user_id: gameMaster.id,
      faction_id: mutantFaction?.id,
      ethnic_group: "Les Eveillés",
      clan_id: prophetesHarmonie?.id, // Clan non-jouable
      level: 10,
      experience: 15000,
      strength: 15,
      agility: 10,
      intelligence: 18,
      endurance: 14,
      health: 180,
      max_health: 180,
      energy: 200,
      max_energy: 200,
      position_x: 0,
      position_y: 0,
      current_zone: "L'Oasis des Transformés",
      is_alive: true,
      is_playable: false, // PNJ géré par le GM
    },
  ];

  return charactersData;
};

// Fonction principale de seed de développement
export const seedDevelopment = async () => {
  try {
    console.log("🌱 Début du seeding de développement...\n");

    // Vérifier que les factions et clans existent
    const factions = await Faction.findAll();
    const clans = await Clan.findAll();

    if (factions.length === 0 || clans.length === 0) {
      console.log(
        "⚠️  Aucune faction ou clan trouvé. Veuillez d'abord exécuter 'npm run seed'"
      );
      return false;
    }

    // 1. Créer les utilisateurs de test
    console.log("👥 Création des utilisateurs de test...");
    const users = [];
    for (const userData of testUsersData) {
      const passwordHash = await hashPassword(userData.password);
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password_hash: passwordHash,
        role: userData.role,
        email_verified: userData.email_verified,
        terms_accepted: userData.terms_accepted,
        terms_accepted_at: userData.terms_accepted ? new Date() : null,
      });
      users.push(user);
      console.log(
        `  ✅ ${userData.username} (${userData.role}) - ${userData.email} / ${userData.password}${userData.terms_accepted ? "" : " [CGU non acceptées]"}`
      );
    }
    console.log(`✅ ${users.length} utilisateurs créés\n`);

    // 2. Créer les personnages de test
    console.log("🎭 Création des personnages de test...");
    const charactersData = await createTestCharacters(users, factions, clans);
    const characters = await Character.bulkCreate(charactersData);
    characters.forEach((char) => {
      const userData = users.find((u) => u.id === char.user_id);
      console.log(`  ✅ ${char.name} (${char.ethnic_group}) - ${userData?.username}`);
    });
    console.log(`✅ ${characters.length} personnages créés\n`);

    // Afficher un résumé
    console.log("📋 RÉSUMÉ DES COMPTES DE TEST\n");
    console.log("Tous les mots de passe sont: password123\n");
    console.log("Rôle           | Username         | Email");
    console.log("---------------|------------------|-------------------");
    testUsersData.forEach((user) => {
      console.log(
        `${user.role.padEnd(14)} | ${user.username.padEnd(16)} | ${user.email}`
      );
    });
    console.log("\n");

    console.log("🎉 Seeding de développement terminé avec succès !\n");

    return true;
  } catch (error) {
    console.error("❌ Erreur lors du seeding de développement:", error);
    return false;
  }
};

// Exécuter le seed de développement automatiquement
(async () => {
  try {
    console.log("🚀 Script de seed de développement lancé...\n");

    // Synchroniser les tables sans les recréer
    console.log("🔄 Vérification de la connexion à la base de données...");
    await sequelize.authenticate();
    console.log("✅ Connexion établie\n");

    // Lancer le seeding
    const success = await seedDevelopment();

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
