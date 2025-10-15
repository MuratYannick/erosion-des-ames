import sequelize from "../config/database.js";
import { User, Character, Faction, Clan } from "../models/index.js";
import { hashPassword } from "./auth.js";

/**
 * Script de seeding pour le développement avec comptes de test
 * Crée 12 utilisateurs avec différents rôles et statuts pour tester toutes les permissions
 */

// Données de test pour les 12 utilisateurs
const testUsersData = [
  // 1. ADMIN
  {
    username: "admin_test",
    email: "admin@test.com",
    password: "password123",
    role: "ADMIN",
    email_verified: true,
    terms_accepted: true,
  },

  // 2. MODERATOR avec CGU acceptées
  {
    username: "moderator_test",
    email: "moderator@test.com",
    password: "password123",
    role: "MODERATOR",
    email_verified: true,
    terms_accepted: true,
  },

  // 3. MODERATOR sans CGU acceptées
  {
    username: "moderator_nocgu",
    email: "moderator_nocgu@test.com",
    password: "password123",
    role: "MODERATOR",
    email_verified: true,
    terms_accepted: false,
  },

  // 4. GAME_MASTER avec personnage dans clan non-jouable
  {
    username: "gm_test",
    email: "gm@test.com",
    password: "password123",
    role: "GAME_MASTER",
    email_verified: true,
    terms_accepted: true,
  },

  // 5. PLAYER - Chef de clan jouable faction mutant
  {
    username: "player_clan_leader_mutant",
    email: "leader_mutant@test.com",
    password: "password123",
    role: "PLAYER",
    email_verified: true,
    terms_accepted: true,
  },

  // 6. PLAYER - Chef de clan jouable neutre
  {
    username: "player_clan_leader_neutral",
    email: "leader_neutral@test.com",
    password: "password123",
    role: "PLAYER",
    email_verified: true,
    terms_accepted: true,
  },

  // 7. PLAYER - Membre clan jouable faction
  {
    username: "player_clan_member_faction",
    email: "member_faction@test.com",
    password: "password123",
    role: "PLAYER",
    email_verified: true,
    terms_accepted: true,
  },

  // 8. PLAYER - Membre clan jouable neutre
  {
    username: "player_clan_member_neutral",
    email: "member_neutral@test.com",
    password: "password123",
    role: "PLAYER",
    email_verified: true,
    terms_accepted: true,
  },

  // 9. PLAYER - Sans clan dans une faction
  {
    username: "player_faction_no_clan",
    email: "faction_no_clan@test.com",
    password: "password123",
    role: "PLAYER",
    email_verified: true,
    terms_accepted: true,
  },

  // 10. PLAYER - Sans clan ni faction
  {
    username: "player_no_faction_no_clan",
    email: "no_faction@test.com",
    password: "password123",
    role: "PLAYER",
    email_verified: true,
    terms_accepted: true,
  },

  // 11. PLAYER - Avec personnage mort
  {
    username: "player_dead_character",
    email: "dead_char@test.com",
    password: "password123",
    role: "PLAYER",
    email_verified: true,
    terms_accepted: true,
  },

  // 12. PLAYER - Sans CGU acceptées
  {
    username: "player_nocgu",
    email: "player_nocgu@test.com",
    password: "password123",
    role: "PLAYER",
    email_verified: true,
    terms_accepted: false,
  },
];

// Fonction pour créer les personnages de test
const createTestCharacters = async (users, factions, clans) => {
  // Trouver les factions
  const mutantFaction = factions.find(f => f.ethnic_group === "Les Eveillés");
  const nonMutantFaction = factions.find(f => f.ethnic_group === "Les Inaltérés");

  // Filtrer les clans par type
  const mutantClans = clans.filter(c => c.faction_id === mutantFaction?.id && c.is_playable);
  const nonMutantClans = clans.filter(c => c.faction_id === nonMutantFaction?.id && c.is_playable);
  const neutralClans = clans.filter(c => c.faction_id === null && c.is_playable);
  const nonPlayableClans = clans.filter(c => !c.is_playable);

  // Trouver des clans spécifiques
  const casteSymbiotes = mutantClans.find(c => c.name === "La Caste des Symbiotes");
  const clanSentinelles = nonMutantClans.find(c => c.name === "Le Clan des Sentinelles");
  const vagabondsVent = neutralClans.find(c => c.name === "Les Vagabonds du Vent");
  const artisansReemploi = neutralClans.find(c => c.name === "Les Artisans du Réemploi");
  const prophetesHarmonie = nonPlayableClans.find(c => c.name === "Les Prophètes de l'Harmonie");

  // Récupérer les utilisateurs
  const gmUser = users.find(u => u.username === "gm_test");
  const leaderMutant = users.find(u => u.username === "player_clan_leader_mutant");
  const leaderNeutral = users.find(u => u.username === "player_clan_leader_neutral");
  const memberFaction = users.find(u => u.username === "player_clan_member_faction");
  const memberNeutral = users.find(u => u.username === "player_clan_member_neutral");
  const factionNoClan = users.find(u => u.username === "player_faction_no_clan");
  const noFactionNoClan = users.find(u => u.username === "player_no_faction_no_clan");
  const deadChar = users.find(u => u.username === "player_dead_character");

  const charactersData = [
    // 1. Personnage GM dans clan non-jouable
    {
      name: "Prophète Kael",
      user_id: gmUser.id,
      faction_id: mutantFaction?.id,
      ethnic_group: "Les Eveillés",
      clan_id: prophetesHarmonie?.id,
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

    // 2. Chef de clan jouable - Faction mutant (sera défini comme leader après)
    {
      name: "Xarn le Maître Symbiote",
      user_id: leaderMutant.id,
      faction_id: mutantFaction?.id,
      ethnic_group: "Les Eveillés",
      clan_id: casteSymbiotes?.id,
      level: 8,
      experience: 8500,
      strength: 14,
      agility: 10,
      intelligence: 15,
      endurance: 16,
      health: 160,
      max_health: 160,
      energy: 150,
      max_energy: 150,
      position_x: 10,
      position_y: 10,
      current_zone: "L'Oasis des Transformés",
      is_alive: true,
      is_playable: true,
    },

    // 3. Chef de clan jouable - Neutre (sera défini comme leader après)
    {
      name: "Aria la Guide",
      user_id: leaderNeutral.id,
      faction_id: null,
      ethnic_group: "Les Inaltérés",
      clan_id: vagabondsVent?.id,
      level: 7,
      experience: 6200,
      strength: 10,
      agility: 15,
      intelligence: 14,
      endurance: 12,
      health: 120,
      max_health: 120,
      energy: 140,
      max_energy: 140,
      position_x: 50,
      position_y: 50,
      current_zone: "Les Terres Sauvages",
      is_alive: true,
      is_playable: true,
    },

    // 4. Membre de clan jouable - Faction non-mutant
    {
      name: "Marcus la Sentinelle",
      user_id: memberFaction.id,
      faction_id: nonMutantFaction?.id,
      ethnic_group: "Les Inaltérés",
      clan_id: clanSentinelles?.id,
      level: 5,
      experience: 3200,
      strength: 14,
      agility: 12,
      intelligence: 10,
      endurance: 13,
      health: 130,
      max_health: 130,
      energy: 100,
      max_energy: 100,
      position_x: 100,
      position_y: 100,
      current_zone: "La Citadelle Inaltérée",
      is_alive: true,
      is_playable: true,
    },

    // 5. Membre de clan jouable - Neutre
    {
      name: "Finn l'Artisan",
      user_id: memberNeutral.id,
      faction_id: null,
      ethnic_group: "Les Inaltérés",
      clan_id: artisansReemploi?.id,
      level: 4,
      experience: 1800,
      strength: 11,
      agility: 12,
      intelligence: 14,
      endurance: 11,
      health: 110,
      max_health: 110,
      energy: 140,
      max_energy: 140,
      position_x: 60,
      position_y: 70,
      current_zone: "Les Ruines de l'Ancienne Cité",
      is_alive: true,
      is_playable: true,
    },

    // 6. Sans clan dans une faction
    {
      name: "Zara la Solitaire",
      user_id: factionNoClan.id,
      faction_id: mutantFaction?.id,
      ethnic_group: "Les Eveillés",
      clan_id: null, // Pas de clan
      level: 3,
      experience: 1200,
      strength: 12,
      agility: 11,
      intelligence: 10,
      endurance: 11,
      health: 110,
      max_health: 110,
      energy: 100,
      max_energy: 100,
      position_x: 20,
      position_y: 30,
      current_zone: "L'Oasis des Transformés",
      is_alive: true,
      is_playable: true,
    },

    // 7. Sans clan ni faction
    {
      name: "Raven l'Errant",
      user_id: noFactionNoClan.id,
      faction_id: null, // Pas de faction
      ethnic_group: "Les Inaltérés",
      clan_id: null, // Pas de clan
      level: 2,
      experience: 600,
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

    // 8. Personnage mort
    {
      name: "Ash le Déchu",
      user_id: deadChar.id,
      faction_id: nonMutantFaction?.id,
      ethnic_group: "Les Inaltérés",
      clan_id: clanSentinelles?.id,
      level: 6,
      experience: 4200,
      strength: 13,
      agility: 11,
      intelligence: 9,
      endurance: 12,
      health: 0, // Mort
      max_health: 120,
      energy: 0,
      max_energy: 100,
      position_x: 200,
      position_y: 150,
      current_zone: "Les Ruines Toxiques",
      is_alive: false, // Mort
      is_playable: true,
      death_count: 3,
      last_death_at: new Date(),
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

    // 0. Supprimer les utilisateurs de test existants (et leurs personnages via CASCADE)
    console.log("🗑️  Suppression des anciens comptes de test...");
    const testUsernames = testUsersData.map(u => u.username);
    const deletedCount = await User.destroy({
      where: {
        username: testUsernames
      }
    });
    console.log(`✅ ${deletedCount} anciens comptes supprimés\n`);

    // 1. Créer les utilisateurs de test
    console.log("👥 Création des 12 utilisateurs de test...");
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
        `  ✅ ${userData.username.padEnd(30)} | ${userData.role.padEnd(12)} | ${userData.email.padEnd(30)} | ${userData.terms_accepted ? "CGU ✓" : "CGU ✗"}`
      );
    }
    console.log(`\n✅ ${users.length} utilisateurs créés\n`);

    // 2. Créer les personnages de test
    console.log("🎭 Création des 8 personnages de test...");
    const charactersData = await createTestCharacters(users, factions, clans);
    const characters = await Character.bulkCreate(charactersData);

    console.log("");
    characters.forEach((char) => {
      const userData = users.find((u) => u.id === char.user_id);
      const clanName = char.clan_id ? clans.find(c => c.id === char.clan_id)?.name : "Sans clan";
      const factionName = char.faction_id ? factions.find(f => f.id === char.faction_id)?.name : "Sans faction";
      const status = char.is_alive ? "✓ Vivant" : "✗ Mort";
      console.log(`  ✅ ${char.name.padEnd(25)} | ${userData?.username.padEnd(30)} | ${status.padEnd(10)} | ${clanName || factionName}`);
    });
    console.log(`\n✅ ${characters.length} personnages créés\n`);

    // 3. Définir les chefs de clan
    console.log("👑 Attribution des rôles de chef de clan...");
    const casteSymbiotes = clans.find(c => c.name === "La Caste des Symbiotes");
    const vagabondsVent = clans.find(c => c.name === "Les Vagabonds du Vent");

    const xarn = characters.find(c => c.name === "Xarn le Maître Symbiote");
    const aria = characters.find(c => c.name === "Aria la Guide");

    if (casteSymbiotes && xarn) {
      await casteSymbiotes.update({ leader_id: xarn.id });
      console.log(`  👑 Xarn le Maître Symbiote → Chef de ${casteSymbiotes.name}`);
    }

    if (vagabondsVent && aria) {
      await vagabondsVent.update({ leader_id: aria.id });
      console.log(`  👑 Aria la Guide → Chef de ${vagabondsVent.name}`);
    }
    console.log("");

    // Afficher un résumé final
    console.log("═══════════════════════════════════════════════════════════════");
    console.log("📋 RÉSUMÉ DES COMPTES DE TEST");
    console.log("═══════════════════════════════════════════════════════════════\n");
    console.log("🔑 Tous les mots de passe sont: password123\n");

    console.log("┌─ ADMINISTRATEURS ──────────────────────────────────────────┐");
    console.log("│ 1. admin_test                    | admin@test.com          │");
    console.log("└────────────────────────────────────────────────────────────┘\n");

    console.log("┌─ MODÉRATEURS ──────────────────────────────────────────────┐");
    console.log("│ 2. moderator_test (CGU ✓)        | moderator@test.com      │");
    console.log("│ 3. moderator_nocgu (CGU ✗)       | moderator_nocgu@test.com│");
    console.log("└────────────────────────────────────────────────────────────┘\n");

    console.log("┌─ GAME MASTERS ─────────────────────────────────────────────┐");
    console.log("│ 4. gm_test (clan non-jouable)    | gm@test.com             │");
    console.log("└────────────────────────────────────────────────────────────┘\n");

    console.log("┌─ PLAYERS ──────────────────────────────────────────────────┐");
    console.log("│ 5. player_clan_leader_mutant     | leader_mutant@test.com  │");
    console.log("│    → Chef clan faction (Symbiotes)                         │");
    console.log("│                                                             │");
    console.log("│ 6. player_clan_leader_neutral    | leader_neutral@test.com │");
    console.log("│    → Chef clan neutre (Vagabonds)                          │");
    console.log("│                                                             │");
    console.log("│ 7. player_clan_member_faction    | member_faction@test.com │");
    console.log("│    → Membre clan faction (Sentinelles)                     │");
    console.log("│                                                             │");
    console.log("│ 8. player_clan_member_neutral    | member_neutral@test.com │");
    console.log("│    → Membre clan neutre (Artisans)                         │");
    console.log("│                                                             │");
    console.log("│ 9. player_faction_no_clan        | faction_no_clan@test.com│");
    console.log("│    → Faction sans clan (Éveillés)                          │");
    console.log("│                                                             │");
    console.log("│ 10. player_no_faction_no_clan    | no_faction@test.com     │");
    console.log("│     → Sans faction ni clan                                  │");
    console.log("│                                                             │");
    console.log("│ 11. player_dead_character        | dead_char@test.com      │");
    console.log("│     → Personnage mort (Ash le Déchu)                       │");
    console.log("│                                                             │");
    console.log("│ 12. player_nocgu (CGU ✗)         | player_nocgu@test.com   │");
    console.log("│     → Pas de personnage (CGU non acceptées)                │");
    console.log("└────────────────────────────────────────────────────────────┘\n");

    console.log("═══════════════════════════════════════════════════════════════\n");
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
    console.log("═══════════════════════════════════════════════════════════════");
    console.log("🚀 SCRIPT DE SEED DE DÉVELOPPEMENT");
    console.log("═══════════════════════════════════════════════════════════════\n");

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
