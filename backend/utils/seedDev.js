import sequelize from "../config/database.js";
import { User, Character, Faction, Clan, Role } from "../models/index.js";
import { hashPassword } from "./auth.js";

// Données de test pour les utilisateurs
const testUsersData = [
  {
    username: "admin_test",
    email: "admin@test.com",
    password: "password123",
    roleName: "admin",
    email_verified: true,
    terms_accepted: true,
    characterConfig: null, // Pas de personnage
  },
  {
    username: "moderator_test",
    email: "moderator@test.com",
    password: "password123",
    roleName: "moderator",
    email_verified: true,
    terms_accepted: true,
    characterConfig: null, // Pas de personnage
  },
  {
    username: "gm_test",
    email: "gm@test.com",
    password: "password123",
    roleName: "game_master",
    email_verified: true,
    terms_accepted: true,
    characterConfig: {
      type: "nonPlayableClan", // Personnage dans clan non-jouable
      name: "Prophète Kael",
      level: 10,
      isAlive: true,
    },
  },
  {
    username: "player_no_terms",
    email: "noterms@test.com",
    password: "password123",
    roleName: "player",
    email_verified: true,
    terms_accepted: false, // N'a pas accepté les CGU
    characterConfig: null,
  },
  {
    username: "player_no_char",
    email: "nochar@test.com",
    password: "password123",
    roleName: "player",
    email_verified: true,
    terms_accepted: true,
    characterConfig: null, // Pas de personnage
  },
  {
    username: "player_dead_char",
    email: "deadchar@test.com",
    password: "password123",
    roleName: "player",
    email_verified: true,
    terms_accepted: true,
    characterConfig: {
      type: "dead", // Personnage mort
      name: "Ash le Déchu",
      level: 6,
      isAlive: false,
    },
  },
  {
    username: "player_mutant_clan",
    email: "mutantclan@test.com",
    password: "password123",
    roleName: "player",
    email_verified: true,
    terms_accepted: true,
    characterConfig: {
      type: "mutantPlayableClan", // Faction mutante + clan jouable
      name: "Xarn le Symbiote",
      level: 5,
      isAlive: true,
    },
  },
  {
    username: "player_pure_clan",
    email: "pureclan@test.com",
    password: "password123",
    roleName: "player",
    email_verified: true,
    terms_accepted: true,
    characterConfig: {
      type: "purePlayableClan", // Faction non-mutante + clan jouable
      name: "Marcus le Sentinelle",
      level: 4,
      isAlive: true,
    },
  },
  {
    username: "player_mutant_no_clan",
    email: "mutantnoclan@test.com",
    password: "password123",
    roleName: "player",
    email_verified: true,
    terms_accepted: true,
    characterConfig: {
      type: "mutantNoClan", // Faction mutante sans clan
      name: "Zara la Solitaire",
      level: 3,
      isAlive: true,
    },
  },
  {
    username: "player_pure_no_clan",
    email: "purenoclan@test.com",
    password: "password123",
    roleName: "player",
    email_verified: true,
    terms_accepted: true,
    characterConfig: {
      type: "pureNoClan", // Faction non-mutante sans clan
      name: "Elena l'Indépendante",
      level: 3,
      isAlive: true,
    },
  },
  {
    username: "player_neutral_clan",
    email: "neutralclan@test.com",
    password: "password123",
    roleName: "player",
    email_verified: true,
    terms_accepted: true,
    characterConfig: {
      type: "neutralClan", // Clan neutre (sans faction)
      name: "Lyra la Vagabonde",
      level: 3,
      isAlive: true,
    },
  },
  {
    username: "player_no_faction_no_clan",
    email: "nofactnoclan@test.com",
    password: "password123",
    roleName: "player",
    email_verified: true,
    terms_accepted: true,
    characterConfig: {
      type: "noFactionNoClan", // Sans faction ni clan
      name: "Raven l'Errant",
      level: 2,
      isAlive: true,
    },
  },
];

// Fonction pour créer les personnages selon la configuration
const createCharacterForUser = async (userData, user, factions, clans) => {
  if (!userData.characterConfig) {
    return null;
  }

  const config = userData.characterConfig;
  const mutantFaction = factions.find((f) => f.ethnic_group === "Les Eveillés");
  const nonMutantFaction = factions.find((f) => f.ethnic_group === "Les Inaltérés");

  const mutantClans = clans.filter((c) => c.faction_id === mutantFaction?.id);
  const nonMutantClans = clans.filter((c) => c.faction_id === nonMutantFaction?.id);
  const neutralClans = clans.filter((c) => c.faction_id === null);

  let characterData = {
    name: config.name,
    user_id: user.id,
    level: config.level,
    experience: config.level * 500,
    strength: 10,
    agility: 10,
    intelligence: 10,
    endurance: 10,
    health: config.isAlive ? 100 : 0,
    max_health: 100,
    energy: config.isAlive ? 100 : 0,
    max_energy: 100,
    position_x: 0,
    position_y: 0,
    current_zone: "Zone de départ",
    is_alive: config.isAlive,
    is_playable: true,
    death_count: config.isAlive ? 0 : 1,
    last_death_at: config.isAlive ? null : new Date(),
  };

  // Configurer selon le type
  switch (config.type) {
    case "nonPlayableClan":
      // Clan non-jouable de la faction mutante
      const nonPlayableClan = mutantClans.find((c) => !c.is_playable);
      characterData.faction_id = mutantFaction.id;
      characterData.ethnic_group = "Les Eveillés";
      characterData.clan_id = nonPlayableClan?.id || null;
      characterData.is_playable = false;
      characterData.current_zone = "L'Oasis des Transformés";
      break;

    case "dead":
      // Personnage mort dans faction non-mutante
      const deadClan = nonMutantClans.find((c) => c.is_playable);
      characterData.faction_id = nonMutantFaction.id;
      characterData.ethnic_group = "Les Inaltérés";
      characterData.clan_id = deadClan?.id || null;
      characterData.current_zone = "Les Ruines Toxiques";
      break;

    case "mutantPlayableClan":
      // Faction mutante + clan jouable
      const mutantPlayableClan = mutantClans.find((c) => c.is_playable);
      characterData.faction_id = mutantFaction.id;
      characterData.ethnic_group = "Les Eveillés";
      characterData.clan_id = mutantPlayableClan?.id || null;
      characterData.current_zone = "L'Oasis des Transformés";
      break;

    case "purePlayableClan":
      // Faction non-mutante + clan jouable
      const purePlayableClan = nonMutantClans.find((c) => c.is_playable);
      characterData.faction_id = nonMutantFaction.id;
      characterData.ethnic_group = "Les Inaltérés";
      characterData.clan_id = purePlayableClan?.id || null;
      characterData.current_zone = "La Citadelle du Renouveau";
      break;

    case "mutantNoClan":
      // Faction mutante sans clan
      characterData.faction_id = mutantFaction.id;
      characterData.ethnic_group = "Les Eveillés";
      characterData.clan_id = null;
      characterData.current_zone = "L'Oasis des Transformés";
      break;

    case "pureNoClan":
      // Faction non-mutante sans clan
      characterData.faction_id = nonMutantFaction.id;
      characterData.ethnic_group = "Les Inaltérés";
      characterData.clan_id = null;
      characterData.current_zone = "La Citadelle du Renouveau";
      break;

    case "neutralClan":
      // Clan neutre (sans faction)
      const neutralClan = neutralClans.find((c) => c.is_playable);
      characterData.faction_id = null;
      characterData.ethnic_group = "Les Inaltérés";
      characterData.clan_id = neutralClan?.id || null;
      characterData.current_zone = "Les Terres Sauvages";
      break;

    case "noFactionNoClan":
      // Sans faction ni clan
      characterData.faction_id = null;
      characterData.ethnic_group = "Les Inaltérés";
      characterData.clan_id = null;
      characterData.current_zone = "Les Terres Désolées";
      break;
  }

  return characterData;
};


// Fonction principale de seed de développement
export const seedDevelopment = async () => {
  try {
    console.log("🌱 Début du seeding de développement...\n");

    // Vérifier que les rôles, factions et clans existent
    const roles = await Role.findAll();
    const factions = await Faction.findAll();
    const clans = await Clan.findAll();

    if (roles.length === 0) {
      console.log(
        "⚠️  Aucun rôle trouvé. Veuillez d'abord exécuter 'npm run seed'"
      );
      return false;
    }

    if (factions.length === 0 || clans.length === 0) {
      console.log(
        "⚠️  Aucune faction ou clan trouvé. Veuillez d'abord exécuter 'npm run seed'"
      );
      return false;
    }

    // 1. Supprimer les utilisateurs de test existants
    console.log("🗑️  Suppression des données de test existantes...");
    const testUsernames = testUsersData.map(u => u.username);
    await User.destroy({
      where: {
        username: testUsernames
      }
    });
    console.log("✅ Données de test supprimées\n");

    // 2. Créer les utilisateurs de test
    console.log("👥 Création des utilisateurs de test...");
    const users = [];
    const usersWithCharacters = [];

    for (const userData of testUsersData) {
      const passwordHash = await hashPassword(userData.password);
      const role = roles.find((r) => r.name === userData.roleName);

      if (!role) {
        console.log(`⚠️  Rôle ${userData.roleName} non trouvé pour ${userData.username}`);
        continue;
      }

      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password_hash: passwordHash,
        role_id: role.id,
        email_verified: userData.email_verified,
        terms_accepted: userData.terms_accepted,
        terms_accepted_at: userData.terms_accepted ? new Date() : null,
      });

      users.push(user);
      console.log(
        `  ✅ ${userData.username} (${role.label}) - ${userData.email} / ${userData.password}${userData.terms_accepted ? "" : " [CGU non acceptées]"}${userData.characterConfig ? " [avec personnage]" : ""}`
      );

      // Stocker les utilisateurs qui ont besoin d'un personnage
      if (userData.characterConfig) {
        usersWithCharacters.push({ userData, user });
      }
    }
    console.log(`✅ ${users.length} utilisateurs créés\n`);

    // 3. Créer les personnages de test
    console.log("🎭 Création des personnages de test...");
    let characterCount = 0;

    for (const { userData, user } of usersWithCharacters) {
      const characterData = await createCharacterForUser(userData, user, factions, clans);
      if (characterData) {
        const character = await Character.create(characterData);
        characterCount++;

        const statusStr = character.is_alive ? "vivant" : "mort";
        const factionStr = character.faction_id
          ? factions.find(f => f.id === character.faction_id)?.name || "?"
          : "sans faction";
        const clanStr = character.clan_id
          ? clans.find(c => c.id === character.clan_id)?.name || "?"
          : "sans clan";

        console.log(`  ✅ ${character.name} (${statusStr}) - ${factionStr} / ${clanStr} - ${user.username}`);
      }
    }
    console.log(`✅ ${characterCount} personnages créés\n`);

    // Afficher un résumé
    console.log("📋 RÉSUMÉ DES COMPTES DE TEST\n");
    console.log("Tous les mots de passe sont: password123\n");
    console.log("Type de compte                                  | Username                 | Email");
    console.log("------------------------------------------------|--------------------------|---------------------------");

    testUsersData.forEach((userData) => {
      const role = roles.find((r) => r.name === userData.roleName);
      let accountType = role.label;

      if (userData.characterConfig) {
        const config = userData.characterConfig;
        if (!config.isAlive) {
          accountType += " - Personnage mort";
        } else {
          switch (config.type) {
            case "nonPlayableClan":
              accountType += " - PNJ clan non-jouable";
              break;
            case "mutantPlayableClan":
              accountType += " - Mutant avec clan";
              break;
            case "purePlayableClan":
              accountType += " - Non-mutant avec clan";
              break;
            case "mutantNoClan":
              accountType += " - Mutant sans clan";
              break;
            case "pureNoClan":
              accountType += " - Non-mutant sans clan";
              break;
            case "neutralClan":
              accountType += " - Clan neutre";
              break;
            case "noFactionNoClan":
              accountType += " - Sans faction ni clan";
              break;
          }
        }
      } else if (!userData.terms_accepted) {
        accountType += " - CGU non acceptées";
      } else {
        accountType += " - Sans personnage";
      }

      console.log(
        `${accountType.padEnd(47)} | ${userData.username.padEnd(24)} | ${userData.email}`
      );
    });
    console.log("\n");

    console.log("🎉 Seeding de développement terminé avec succès !\n");
    console.log("💡 Utilisez ces comptes pour tester les différents cas d'accès au forum.\n");

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
