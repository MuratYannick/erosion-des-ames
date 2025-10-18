import sequelize from "../config/database.js";
import { Faction, Clan, Category, Section, Topic, Post, ForumPermission } from "../models/index.js";

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
import { forumGeneralPermissions, forumHRPPermissions, forumRPPermissions } from "./seedData/forumPermissions.js";

/**
 * Script de seed pour initialiser la base de données avec des données de test
 */
async function seedDatabase() {
  try {
    console.log("🚀 Script de seed lancé...\n");

    // 1. Test de connexion à la base de données
    console.log("🔌 Test de connexion à la base de données...");
    await sequelize.authenticate();
    console.log("✅ Connexion établie\n");

    // 2. Désactiver les contraintes de clés étrangères
    console.log("🔓 Désactivation des contraintes de clés étrangères...");
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    console.log("✅ Contraintes désactivées\n");

    try {
      // 3. Suppression et recréation de TOUTES les tables
      console.log("⚠️  SUPPRESSION ET RECRÉATION DE TOUTES LES TABLES...");
      await sequelize.sync({ force: true });
      console.log("✅ Toutes les tables ont été supprimées et recréées\n");

    // ============================
    // FACTIONS ET CLANS
    // ============================

    // 3. Créer les factions
    console.log("📊 Création des factions...");
    const factions = await Faction.bulkCreate(factionsData);
    console.log(`✅ ${factions.length} factions créées\n`);

    // 4. Récupérer les factions pour les relations
    const factionEclaireurs = await Faction.findOne({
      where: { name: "Les Éclaireurs de l'Aube Nouvelle" },
    });
    const factionVeilleurs = await Faction.findOne({
      where: { name: "Les Veilleurs de l'Ancien Monde" },
    });

    // 5. Créer les clans mutants
    console.log("📊 Création des clans mutants...");
    const mutantClans = await Clan.bulkCreate(
      mutantClansData.map((clan) => ({
        ...clan,
        faction_id: factionEclaireurs.id,
      }))
    );
    console.log(`✅ ${mutantClans.length} clans mutants créés\n`);

    // 6. Créer les clans non-mutants
    console.log("📊 Création des clans non-mutants...");
    const nonMutantClans = await Clan.bulkCreate(
      nonMutantClansData.map((clan) => ({
        ...clan,
        faction_id: factionVeilleurs.id,
      }))
    );
    console.log(`✅ ${nonMutantClans.length} clans non-mutants créés\n`);

    // 7. Créer les clans neutres
    console.log("📊 Création des clans neutres...");
    const neutralClans = await Clan.bulkCreate(neutralClansData);
    console.log(`✅ ${neutralClans.length} clans neutres créés\n`);

    // ============================
    // STRUCTURE DU FORUM
    // ============================

    // 8. Créer les catégories
    console.log("📊 Création des catégories...");
    const categories = await Category.bulkCreate(categoriesData);
    console.log(`✅ ${categories.length} catégories créées\n`);

    // 9. Récupérer les catégories
    const forumGeneral = await Category.findOne({ where: { slug: "general" } });
    const forumHRP = await Category.findOne({ where: { slug: "hrp" } });
    const forumRP = await Category.findOne({ where: { slug: "rp" } });

    // 10. Créer les sections du Forum Général
    console.log("📊 Création des sections du Forum Général...");
    const sectionsGeneral = await Section.bulkCreate(
      sectionsGeneralData.map((s) => ({ ...s, category_id: forumGeneral.id }))
    );
    console.log(`✅ ${sectionsGeneral.length} sections du Forum Général créées\n`);

    // 11. Créer les sections du Forum HRP
    console.log("📊 Création des sections HRP...");
    const sectionsHRP = await Section.bulkCreate(
      sectionsHRPData.map((s) => ({ ...s, category_id: forumHRP.id }))
    );
    console.log(`✅ ${sectionsHRP.length} sections HRP créées\n`);

    // 12. Créer les sections RP
    console.log("📊 Création des sections RP...");
    const sectionsRP = await Section.bulkCreate(
      sectionsRPData.map((s) => ({ ...s, category_id: forumRP.id }))
    );
    console.log(`✅ ${sectionsRP.length} sections RP créées\n`);

    // ============================
    // SOUS-SECTIONS DU FORUM
    // ============================

    // 13. Créer les sous-sections pour "Histoires des factions"
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
      }))
    );
    console.log(`✅ ${createdSubsectionsFactions.length} sous-sections des factions créées\n`);

    // 14. Assigner la faction aux Éclaireurs et créer leurs sous-sections
    console.log("📊 Assignation de la faction aux Éclaireurs...");
    const sectionEclaireurs = await Section.findOne({
      where: { slug: "eclaireurs-aube-nouvelle" },
    });

    // Assigner la faction_id aux Éclaireurs
    await sectionEclaireurs.update({
      faction_id: factionEclaireurs.id,
      is_public: true,
    });

    // Récupérer les clans des Éclaireurs pour les sections privées
    const clanSymbiotes = await Clan.findOne({
      where: { name: "La Caste des Symbiotes" },
    });

    console.log("📊 Création des sous-sections pour Les Éclaireurs de l'Aube Nouvelle...");
    const createdSubsectionsEclaireurs = await Section.bulkCreate(
      subsectionsEclaireurs.map((s) => {
        const isPrivate = s.slug.includes('privees');
        const isClanSection = s.slug.includes('caste-symbiotes');

        return {
          name: s.name,
          slug: s.slug,
          description: s.description,
          order: s.order,
          is_active: s.is_active,
          category_id: forumRP.id,
          parent_section_id: sectionEclaireurs.id,
          faction_id: factionEclaireurs.id,
          clan_id: isClanSection ? clanSymbiotes.id : null,
          is_public: !isPrivate && !isClanSection,
        };
      })
    );
    console.log(`✅ ${createdSubsectionsEclaireurs.length} sous-sections pour Les Éclaireurs créées\n`);

    // 15. Assigner la faction aux Veilleurs et créer leurs sous-sections
    console.log("📊 Assignation de la faction aux Veilleurs...");
    const sectionVeilleurs = await Section.findOne({
      where: { slug: "veilleurs-ancien-monde" },
    });

    // Assigner la faction_id aux Veilleurs
    await sectionVeilleurs.update({
      faction_id: factionVeilleurs.id,
      is_public: true,
    });

    // Récupérer les clans des Veilleurs pour les sections privées
    const clanSentinelles = await Clan.findOne({
      where: { name: "Le Clan des Sentinelles" },
    });

    console.log("📊 Création des sous-sections pour Les Veilleurs de l'Ancien Monde...");
    const createdSubsectionsVeilleurs = await Section.bulkCreate(
      subsectionsVeilleurs.map((s) => {
        const isPrivate = s.slug.includes('privees');
        const isClanSection = s.slug.includes('clan-sentinelles');

        return {
          name: s.name,
          slug: s.slug,
          description: s.description,
          order: s.order,
          is_active: s.is_active,
          category_id: forumRP.id,
          parent_section_id: sectionVeilleurs.id,
          faction_id: factionVeilleurs.id,
          clan_id: isClanSection ? clanSentinelles.id : null,
          is_public: !isPrivate && !isClanSection,
        };
      })
    );
    console.log(`✅ ${createdSubsectionsVeilleurs.length} sous-sections pour Les Veilleurs créées\n`);

    // 16. Créer les sous-sections pour "Histoires des clans neutres"
    console.log("📊 Création des sous-sections pour Histoires des clans neutres...");
    const sectionClansNeutres = await Section.findOne({
      where: { slug: "histoires-clans-neutres" },
    });

    // Récupérer les clans neutres pour les sections privées
    const clanPeupleOmbres = await Clan.findOne({
      where: { name: "Le Peuple des Ombres" },
    });
    const clanFreresTerre = await Clan.findOne({
      where: { name: "Les Frères de la Terre Brûlée" },
    });
    const clanVagabonds = await Clan.findOne({
      where: { name: "Les Vagabonds du Vent" },
    });

    const createdSubsectionsClansNeutres = await Section.bulkCreate(
      subsectionsClansNeutres.map((s) => {
        let clanId = null;
        let isPublic = true;

        if (s.slug.includes('peuple-ombres')) {
          clanId = clanPeupleOmbres.id;
          isPublic = false;
        } else if (s.slug.includes('freres-terre-brulee')) {
          clanId = clanFreresTerre.id;
          isPublic = false;
        } else if (s.slug.includes('vagabonds-vent')) {
          clanId = clanVagabonds.id;
          isPublic = false;
        }

        return {
          name: s.name,
          slug: s.slug,
          description: s.description,
          order: s.order,
          is_active: s.is_active,
          category_id: forumRP.id,
          parent_section_id: sectionClansNeutres.id,
          faction_id: null,
          clan_id: clanId,
          is_public: isPublic,
        };
      })
    );
    console.log(`✅ ${createdSubsectionsClansNeutres.length} sous-sections pour Histoires des clans neutres créées\n`);

    // 17. Créer les sous-sections de "Autour du Jeu"
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
      }))
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
    // PERMISSIONS DU FORUM
    // ============================

    // 18. Créer les permissions pour la catégorie "Forum Général"
    console.log("📊 Création des permissions pour la catégorie 'Forum Général'...");
    const createdForumGeneralPermissions = await ForumPermission.bulkCreate(
      forumGeneralPermissions.map((p) => ({
        ...p,
        entity_id: forumGeneral.id,
      }))
    );
    console.log(`✅ ${createdForumGeneralPermissions.length} permissions pour 'Forum Général' créées\n`);

    // 19. Créer les permissions pour la catégorie "Forum HRP"
    console.log("📊 Création des permissions pour la catégorie 'Forum HRP'...");
    const createdForumHRPPermissions = await ForumPermission.bulkCreate(
      forumHRPPermissions.map((p) => ({
        ...p,
        entity_id: forumHRP.id,
      }))
    );
    console.log(`✅ ${createdForumHRPPermissions.length} permissions pour 'Forum HRP' créées\n`);

    // 20. Créer les permissions pour la catégorie "Forum RP"
    console.log("📊 Création des permissions pour la catégorie 'Forum RP'...");
    const createdForumRPPermissions = await ForumPermission.bulkCreate(
      forumRPPermissions.map((p) => ({
        ...p,
        entity_id: forumRP.id,
      }))
    );
    console.log(`✅ ${createdForumRPPermissions.length} permissions pour 'Forum RP' créées\n`);

      console.log("🎉 Seeding terminé avec succès !\n");

      return true;
    } finally {
      // 4. Réactiver les contraintes de clés étrangères (même en cas d'erreur)
      console.log("🔒 Réactivation des contraintes de clés étrangères...");
      await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
      console.log("✅ Contraintes réactivées\n");
    }
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
