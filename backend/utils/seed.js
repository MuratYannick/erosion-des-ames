import sequelize from "../config/database.js";
import { Role, Faction, Clan, Category, Section, Topic, Post } from "../models/index.js";

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
    // RÔLES
    // ============================

    // 2. Créer les rôles
    console.log("📊 Création des rôles...");
    const roles = await Role.bulkCreate([
      {
        name: "admin",
        label: "Administrateur",
        description: "Accès complet au système, peut gérer tous les aspects du jeu et des utilisateurs",
        level: 100,
        is_active: true,
      },
      {
        name: "moderator",
        label: "Modérateur",
        description: "Peut modérer le forum, gérer les topics/posts, et appliquer les règles",
        level: 50,
        is_active: true,
      },
      {
        name: "game_master",
        label: "Maître du Jeu",
        description: "Peut animer des événements RP, gérer des quêtes et scénarios",
        level: 30,
        is_active: true,
      },
      {
        name: "player",
        label: "Joueur",
        description: "Peut jouer, créer des personnages et participer au forum",
        level: 10,
        is_active: true,
      },
    ], { ignoreDuplicates: true });
    console.log(`✅ ${roles.length} rôles créés\n`);

    // ============================
    // FACTIONS ET CLANS
    // ============================

    // 3. Créer les factions
    console.log("📊 Création des factions...");
    const factions = await Faction.bulkCreate(factionsData, { ignoreDuplicates: true });
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
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${mutantClans.length} clans mutants créés\n`);

    // 6. Créer les clans non-mutants
    console.log("📊 Création des clans non-mutants...");
    const nonMutantClans = await Clan.bulkCreate(
      nonMutantClansData.map((clan) => ({
        ...clan,
        faction_id: factionVeilleurs.id,
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${nonMutantClans.length} clans non-mutants créés\n`);

    // 7. Créer les clans neutres
    console.log("📊 Création des clans neutres...");
    const neutralClans = await Clan.bulkCreate(neutralClansData, { ignoreDuplicates: true });
    console.log(`✅ ${neutralClans.length} clans neutres créés\n`);

    // ============================
    // STRUCTURE DU FORUM
    // ============================

    // 8. Créer les catégories
    console.log("📊 Création des catégories...");
    const categories = await Category.bulkCreate(categoriesData, { ignoreDuplicates: true });
    console.log(`✅ ${categories.length} catégories créées\n`);

    // 9. Récupérer les catégories
    const forumGeneral = await Category.findOne({ where: { slug: "general" } });
    const forumHRP = await Category.findOne({ where: { slug: "hrp" } });
    const forumRP = await Category.findOne({ where: { slug: "rp" } });

    // 10. Créer les sections du Forum Général
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
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${createdSubsectionsFactions.length} sous-sections des factions créées\n`);

    // 13. Créer les sous-sections pour "Les Éclaireurs de l'Aube Nouvelle"
    console.log("📊 Création des sous-sections pour Les Éclaireurs de l'Aube Nouvelle...");
    const sectionEclaireurs = await Section.findOne({
      where: { slug: "eclaireurs-aube-nouvelle" },
    });

    const createdSubsectionsEclaireurs = await Section.bulkCreate(
      subsectionsEclaireurs.map((s) => ({
        name: s.name,
        slug: s.slug,
        description: s.description,
        order: s.order,
        is_active: s.is_active,
        category_id: forumRP.id,
        parent_section_id: sectionEclaireurs.id,
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${createdSubsectionsEclaireurs.length} sous-sections pour Les Éclaireurs créées\n`);

    // 14. Créer les sous-sections pour "Les Veilleurs de l'Ancien Monde"
    console.log("📊 Création des sous-sections pour Les Veilleurs de l'Ancien Monde...");
    const sectionVeilleurs = await Section.findOne({
      where: { slug: "veilleurs-ancien-monde" },
    });

    const createdSubsectionsVeilleurs = await Section.bulkCreate(
      subsectionsVeilleurs.map((s) => ({
        name: s.name,
        slug: s.slug,
        description: s.description,
        order: s.order,
        is_active: s.is_active,
        category_id: forumRP.id,
        parent_section_id: sectionVeilleurs.id,
      })),
      { ignoreDuplicates: true }
    );
    console.log(`✅ ${createdSubsectionsVeilleurs.length} sous-sections pour Les Veilleurs créées\n`);

    // 15. Créer les sous-sections pour "Histoires des clans neutres"
    console.log("📊 Création des sous-sections pour Histoires des clans neutres...");
    const sectionClansNeutres = await Section.findOne({
      where: { slug: "histoires-clans-neutres" },
    });

    const createdSubsectionsClansNeutres = await Section.bulkCreate(
      subsectionsClansNeutres.map((s) => ({
        name: s.name,
        slug: s.slug,
        description: s.description,
        order: s.order,
        is_active: s.is_active,
        category_id: forumRP.id,
        parent_section_id: sectionClansNeutres.id,
      })),
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
