import sequelize from "../config/database.js";
import {
  Faction,
  Clan,
  Category,
  Section,
  Topic,
  Post,
  Permission,
  RolePermission,
} from "../models/index.js";

// Import des données de seed modulaires
import { factionsData } from "./seedData/factions.js";
import { mutantClansData, nonMutantClansData, neutralClansData } from "./seedData/clans.js";
import {
  categoriesData,
  sectionsGeneralData,
  sectionsHRPData,
  sectionsRPData,
  subsectionsFactions,
  subsectionsEclaireurs,
  subsectionsVeilleurs,
  subsectionsClansNeutres,
  subsectionsAutourDuJeu,
  topicsAndPosts,
} from "./seedData/forum.js";

/**
 * Script de seed pour initialiser la base de données avec des données de test
 */
async function seedDatabase() {
  try {
    console.log("🚀 Script de seed lancé...\n");

    // 1. Synchronisation de la base de données (supprime et recrée les tables)
    console.log("🔄 Synchronisation de la base de données...");
    await sequelize.sync({ force: true });
    console.log("✅ Base de données synchronisée\n");

    // ============================
    // FACTIONS ET CLANS
    // ============================

    // 2. Créer les factions
    console.log("📊 Création des factions...");
    const factions = await Faction.bulkCreate(factionsData, { ignoreDuplicates: true });
    console.log(`✅ ${factions.length} factions créées\n`);

    // 3. Récupérer les factions pour les relations
    const factionEclaireurs = await Faction.findOne({
      where: { name: "Les Éclaireurs de l'Aube Nouvelle" },
    });
    const factionVeilleurs = await Faction.findOne({
      where: { name: "Les Veilleurs de l'Ancien Monde" },
    });

    // 4. Créer les clans mutants
    console.log("📊 Création des clans mutants...");
    const mutantClans = await Clan.bulkCreate(
      mutantClansData.map((clan) => ({
        ...clan,
        faction_id: factionEclaireurs.id,
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${mutantClans.length} clans mutants créés\n`);

    // 5. Créer les clans non-mutants
    console.log("📊 Création des clans non-mutants...");
    const nonMutantClans = await Clan.bulkCreate(
      nonMutantClansData.map((clan) => ({
        ...clan,
        faction_id: factionVeilleurs.id,
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${nonMutantClans.length} clans non-mutants créés\n`);

    // 6. Créer les clans neutres
    console.log("📊 Création des clans neutres...");
    const neutralClans = await Clan.bulkCreate(neutralClansData, { ignoreDuplicates: true });
    console.log(`✅ ${neutralClans.length} clans neutres créés\n`);

    // ============================
    // STRUCTURE DU FORUM
    // ============================

    // 7. Créer les catégories
    console.log("📊 Création des catégories...");
    const categories = await Category.bulkCreate(categoriesData, { ignoreDuplicates: true });
    console.log(`✅ ${categories.length} catégories créées\n`);

    // 8. Récupérer les catégories
    const forumGeneral = await Category.findOne({ where: { slug: "general" } });
    const forumHRP = await Category.findOne({ where: { slug: "hrp" } });
    const forumRP = await Category.findOne({ where: { slug: "rp" } });

    // 9. Créer les sections du Forum Général
    console.log("📊 Création des sections du Forum Général...");
    const sectionsGeneral = await Section.bulkCreate(
      sectionsGeneralData.map((s) => ({ ...s, category_id: forumGeneral.id })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${sectionsGeneral.length} sections du Forum Général créées\n`);

    // 10. Créer les sections du Forum HRP
    console.log("📊 Création des sections HRP...");
    const sectionsHRP = await Section.bulkCreate(
      sectionsHRPData.map((s) => ({ ...s, category_id: forumHRP.id })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${sectionsHRP.length} sections HRP créées\n`);

    // 11. Créer les sections RP
    console.log("📊 Création des sections RP...");
    const sectionsRP = await Section.bulkCreate(
      sectionsRPData.map((s) => ({ ...s, category_id: forumRP.id })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${sectionsRP.length} sections RP créées\n`);

    // ============================
    // SOUS-SECTIONS DU FORUM
    // ============================

    // 12. Créer les sous-sections pour "Histoires des factions"
    console.log("📊 Création des sous-sections des factions...");
    const sectionHistoiresFactions = await Section.findOne({
      where: { slug: "histoires-factions" },
    });

    const createdSubsectionsFactions = await Section.bulkCreate(
      subsectionsFactions.map((s) => ({
        name: s.name,
        slug: s.slug,
        description: s.description,
        order: s.order,
        is_active: s.is_active,
        category_id: forumRP.id,
        parent_section_id: sectionHistoiresFactions.id,
        clan_id: s.clan_id,
        faction_id: s.faction_id,
        is_public: s.is_public,
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${createdSubsectionsFactions.length} sous-sections des factions créées\n`);

    // 13. Créer les sous-sections pour "Les Éclaireurs de l'Aube Nouvelle"
    console.log("📊 Création des sous-sections pour Les Éclaireurs de l'Aube Nouvelle...");
    const sectionEclaireurs = await Section.findOne({
      where: { slug: "eclaireurs-aube-nouvelle" },
    });

    // Récupérer les clans pour les sous-sections privées
    const allClans = await Clan.findAll();

    const createdSubsectionsEclaireurs = await Section.bulkCreate(
      subsectionsEclaireurs.map((s) => {
        let sectionData = {
          name: s.name,
          slug: s.slug,
          description: s.description,
          order: s.order,
          is_active: s.is_active,
          category_id: forumRP.id,
          parent_section_id: sectionEclaireurs.id,
          is_public: s.is_public,
        };

        // Si c'est une section de faction
        if (s.factionName) {
          sectionData.faction_id = factionEclaireurs.id;
          sectionData.clan_id = null;
        }

        // Si c'est une section de clan
        if (s.clanName) {
          const clan = allClans.find(c => c.name === s.clanName);
          sectionData.clan_id = clan ? clan.id : null;
          sectionData.faction_id = null;
        }

        return sectionData;
      }),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${createdSubsectionsEclaireurs.length} sous-sections pour Les Éclaireurs créées\n`);

    // 14. Créer les sous-sections pour "Les Veilleurs de l'Ancien Monde"
    console.log("📊 Création des sous-sections pour Les Veilleurs de l'Ancien Monde...");
    const sectionVeilleurs = await Section.findOne({
      where: { slug: "veilleurs-ancien-monde" },
    });

    const createdSubsectionsVeilleurs = await Section.bulkCreate(
      subsectionsVeilleurs.map((s) => {
        let sectionData = {
          name: s.name,
          slug: s.slug,
          description: s.description,
          order: s.order,
          is_active: s.is_active,
          category_id: forumRP.id,
          parent_section_id: sectionVeilleurs.id,
          is_public: s.is_public,
        };

        // Si c'est une section de faction
        if (s.factionName) {
          sectionData.faction_id = factionVeilleurs.id;
          sectionData.clan_id = null;
        }

        // Si c'est une section de clan
        if (s.clanName) {
          const clan = allClans.find(c => c.name === s.clanName);
          sectionData.clan_id = clan ? clan.id : null;
          sectionData.faction_id = null;
        }

        return sectionData;
      }),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${createdSubsectionsVeilleurs.length} sous-sections pour Les Veilleurs créées\n`);

    // 15. Créer les sous-sections pour "Histoires des clans neutres"
    console.log("📊 Création des sous-sections pour Histoires des clans neutres...");
    const sectionClansNeutres = await Section.findOne({
      where: { slug: "histoires-clans-neutres" },
    });

    const createdSubsectionsClansNeutres = await Section.bulkCreate(
      subsectionsClansNeutres.map((s) => {
        let sectionData = {
          name: s.name,
          slug: s.slug,
          description: s.description,
          order: s.order,
          is_active: s.is_active,
          category_id: forumRP.id,
          parent_section_id: sectionClansNeutres.id,
          is_public: s.is_public,
          faction_id: null,
        };

        // Si c'est une section de clan
        if (s.clanName) {
          const clan = allClans.find(c => c.name === s.clanName);
          sectionData.clan_id = clan ? clan.id : null;
        } else {
          sectionData.clan_id = null;
        }

        return sectionData;
      }),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${createdSubsectionsClansNeutres.length} sous-sections pour Histoires des clans neutres créées\n`);

    // 16. Créer les sous-sections de "Autour du Jeu"
    console.log("📊 Création des sous-sections de 'Autour du Jeu'...");
    const sectionAutourDuJeu = await Section.findOne({
      where: { slug: "autour-du-jeu" },
    });

    const createdSubsectionsAutourDuJeu = await Section.bulkCreate(
      subsectionsAutourDuJeu.map((s) => ({
        name: s.name,
        slug: s.slug,
        description: s.description,
        order: s.order,
        is_active: s.is_active,
        category_id: forumHRP.id,
        parent_section_id: sectionAutourDuJeu.id,
        clan_id: s.clan_id,
        faction_id: s.faction_id,
        is_public: s.is_public,
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${createdSubsectionsAutourDuJeu.length} sous-sections de 'Autour du Jeu' créées\n`);

    // ============================
    // TOPICS ET POSTS
    // ============================

    console.log("📊 Création des topics et posts...");
    for (const item of topicsAndPosts) {
      const section = await Section.findOne({ where: { slug: item.sectionSlug } });

      const topic = await Topic.create({
        ...item.topic,
        section_id: section.id,
        author_user_id: null,
        author_character_id: null,
      });

      await Post.create({
        ...item.post,
        topic_id: topic.id,
        author_user_id: null,
        author_character_id: null,
      });
    }
    console.log(`✅ ${topicsAndPosts.length} topics et posts créés\n`);

    // ============================
    // PERMISSIONS
    // ============================

    console.log("📊 Création des permissions...");

    // Définir toutes les permissions du système
    const permissionsData = [
      // SECTION permissions
      {
        name: "section.view",
        resource_type: "SECTION",
        action: "VIEW",
        description: "Voir une section",
        is_system: true,
      },
      {
        name: "section.create",
        resource_type: "SECTION",
        action: "CREATE",
        description: "Créer une section ou sous-section",
        is_system: true,
      },
      {
        name: "section.edit",
        resource_type: "SECTION",
        action: "EDIT",
        description: "Éditer une section",
        is_system: true,
      },
      {
        name: "section.delete",
        resource_type: "SECTION",
        action: "DELETE",
        description: "Supprimer une section",
        is_system: true,
      },
      {
        name: "section.lock",
        resource_type: "SECTION",
        action: "LOCK",
        description: "Verrouiller une section",
        is_system: true,
      },
      {
        name: "section.unlock",
        resource_type: "SECTION",
        action: "UNLOCK",
        description: "Déverrouiller une section",
        is_system: true,
      },
      {
        name: "section.move",
        resource_type: "SECTION",
        action: "MOVE",
        description: "Déplacer une section",
        is_system: true,
      },
      {
        name: "section.pin",
        resource_type: "SECTION",
        action: "PIN",
        description: "Épingler une section",
        is_system: true,
      },

      // TOPIC permissions
      {
        name: "topic.view",
        resource_type: "TOPIC",
        action: "VIEW",
        description: "Voir un topic",
        is_system: true,
      },
      {
        name: "topic.create",
        resource_type: "TOPIC",
        action: "CREATE",
        description: "Créer un topic",
        is_system: true,
      },
      {
        name: "topic.edit",
        resource_type: "TOPIC",
        action: "EDIT",
        description: "Éditer un topic",
        is_system: true,
      },
      {
        name: "topic.delete",
        resource_type: "TOPIC",
        action: "DELETE",
        description: "Supprimer un topic",
        is_system: true,
      },
      {
        name: "topic.lock",
        resource_type: "TOPIC",
        action: "LOCK",
        description: "Verrouiller un topic",
        is_system: true,
      },
      {
        name: "topic.unlock",
        resource_type: "TOPIC",
        action: "UNLOCK",
        description: "Déverrouiller un topic",
        is_system: true,
      },
      {
        name: "topic.move",
        resource_type: "TOPIC",
        action: "MOVE",
        description: "Déplacer un topic vers une autre section",
        is_system: true,
      },
      {
        name: "topic.pin",
        resource_type: "TOPIC",
        action: "PIN",
        description: "Épingler un topic",
        is_system: true,
      },

      // POST permissions
      {
        name: "post.view",
        resource_type: "POST",
        action: "VIEW",
        description: "Voir un post",
        is_system: true,
      },
      {
        name: "post.create",
        resource_type: "POST",
        action: "CREATE",
        description: "Créer un post",
        is_system: true,
      },
      {
        name: "post.edit",
        resource_type: "POST",
        action: "EDIT",
        description: "Éditer un post",
        is_system: true,
      },
      {
        name: "post.delete",
        resource_type: "POST",
        action: "DELETE",
        description: "Supprimer un post",
        is_system: true,
      },
      {
        name: "post.move",
        resource_type: "POST",
        action: "MOVE",
        description: "Déplacer un post vers un autre topic",
        is_system: true,
      },

      // CATEGORY permissions
      {
        name: "category.view",
        resource_type: "CATEGORY",
        action: "VIEW",
        description: "Voir une catégorie",
        is_system: true,
      },
      {
        name: "category.create",
        resource_type: "CATEGORY",
        action: "CREATE",
        description: "Créer une catégorie",
        is_system: true,
      },
      {
        name: "category.edit",
        resource_type: "CATEGORY",
        action: "EDIT",
        description: "Éditer une catégorie",
        is_system: true,
      },
      {
        name: "category.delete",
        resource_type: "CATEGORY",
        action: "DELETE",
        description: "Supprimer une catégorie",
        is_system: true,
      },
    ];

    const permissions = await Permission.bulkCreate(permissionsData, {
      ignoreDuplicates: true,
    });
    console.log(`✅ ${permissions.length} permissions créées\n`);

    // ============================
    // PERMISSIONS POUR LE RÔLE ADMIN
    // ============================

    console.log("📊 Attribution de toutes les permissions au rôle ADMIN...");

    // Récupérer toutes les permissions créées
    const allPermissions = await Permission.findAll();

    // Créer les relations RolePermission pour ADMIN
    const adminRolePermissions = allPermissions.map((permission) => ({
      role: "ADMIN",
      permission_id: permission.id,
      granted: true,
    }));

    await RolePermission.bulkCreate(adminRolePermissions, {
      ignoreDuplicates: true,
    });
    console.log(`✅ ${adminRolePermissions.length} permissions attribuées au rôle ADMIN\n`);

    console.log("🎉 Seeding terminé avec succès !\n");

    return true;
  } catch (error) {
    console.error("❌ Erreur lors du seeding :", error);
    throw error;
  }
}

// Exécution du script
seedDatabase()
  .then(() => {
    console.log("✅ Script terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script échoué :", error);
    process.exit(1);
  });
