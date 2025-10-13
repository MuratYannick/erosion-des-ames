import sequelize from "../config/database.js";
import {
  Permission,
  RolePermission,
  SectionPermission,
  Section,
  Category,
} from "../models/index.js";

/**
 * Script de configuration des permissions pour le rôle GAME_MASTER
 *
 * Règles globales:
 * - Voir toutes les sections, topics et posts
 * - Peut gérer les sous-sections (créer, éditer, lock, pin, supprimer, déplacer) sauf dans certaines catégories/sections
 * - NE PEUT PAS créer de sections directement dans une catégorie
 * - Peut gérer tous les topics et posts avec des restrictions sur certaines sections
 *
 * Restrictions:
 * 1. Catégorie "Forum Général" (toutes sections et sous-sections):
 *    - AUCUNE permission de modification sur sections, topics et posts
 *
 * 2. Section "Au Feu de Camps" (Forum HRP):
 *    - Peut créer topics/posts
 *    - NE peut éditer/supprimer/déplacer QUE son propre contenu (géré au niveau du code)
 *    - AUCUNE permission de modification sur les sous-sections
 */
async function setupGameMasterPermissions() {
  try {
    console.log("🚀 Configuration des permissions GAME_MASTER...\n");

    // ============================
    // PERMISSIONS GLOBALES
    // ============================

    console.log("📊 Configuration des permissions globales pour GAME_MASTER...");

    // Récupérer toutes les permissions
    const allPermissions = await Permission.findAll();
    const permissionMap = {};
    allPermissions.forEach((p) => {
      permissionMap[p.name] = p;
    });

    // Définir les permissions globales du GAME_MASTER
    const gameMasterGlobalPermissions = [
      // SECTIONS - Vue uniquement
      { name: "section.view", granted: true },

      // SOUS-SECTIONS - Toutes les permissions (seront limitées par les sections restreintes)
      { name: "section.create", granted: true },
      { name: "section.edit", granted: true },
      { name: "section.delete", granted: true },
      { name: "section.lock", granted: true },
      { name: "section.unlock", granted: true },
      { name: "section.move", granted: true },
      { name: "section.pin", granted: true },

      // TOPICS - Toutes les permissions (seront limitées par les sections restreintes)
      { name: "topic.view", granted: true },
      { name: "topic.create", granted: true },
      { name: "topic.edit", granted: true },
      { name: "topic.delete", granted: true },
      { name: "topic.lock", granted: true },
      { name: "topic.unlock", granted: true },
      { name: "topic.move", granted: true },
      { name: "topic.pin", granted: true },

      // POSTS - Toutes les permissions (seront limitées par les sections restreintes)
      { name: "post.view", granted: true },
      { name: "post.create", granted: true },
      { name: "post.edit", granted: true },
      { name: "post.delete", granted: true },
      { name: "post.move", granted: true },

      // CATEGORIES - Vue uniquement
      { name: "category.view", granted: true },
    ];

    // Supprimer les permissions existantes du GAME_MASTER
    await RolePermission.destroy({ where: { role: "GAME_MASTER" } });

    // Créer les nouvelles permissions globales
    const rolePermissionsToCreate = gameMasterGlobalPermissions
      .filter((p) => permissionMap[p.name])
      .map((p) => ({
        role: "GAME_MASTER",
        permission_id: permissionMap[p.name].id,
        granted: p.granted,
      }));

    await RolePermission.bulkCreate(rolePermissionsToCreate);
    console.log(
      `✅ ${rolePermissionsToCreate.length} permissions globales configurées pour GAME_MASTER\n`
    );

    // ============================
    // RESTRICTIONS PAR CATÉGORIE/SECTION
    // ============================

    console.log("📊 Configuration des restrictions pour sections/catégories spécifiques...");

    // Récupérer la catégorie Forum Général
    const forumGeneral = await Category.findOne({ where: { slug: "general" } });
    if (!forumGeneral) {
      console.warn("⚠️  Catégorie 'Forum Général' non trouvée");
      return;
    }

    // Récupérer toutes les sections de Forum Général
    const sectionsForumGeneral = await Section.findAll({
      where: { category_id: forumGeneral.id },
    });

    console.log(`   Sections du Forum Général trouvées: ${sectionsForumGeneral.length}`);

    // Récupérer aussi toutes les sous-sections de ces sections
    const allForumGeneralSections = [...sectionsForumGeneral];
    for (const section of sectionsForumGeneral) {
      const subsections = await Section.findAll({
        where: { parent_section_id: section.id },
      });
      allForumGeneralSections.push(...subsections);
    }

    console.log(`   Total sections + sous-sections du Forum Général: ${allForumGeneralSections.length}`);

    // Récupérer la catégorie Forum HRP
    const forumHRP = await Category.findOne({ where: { slug: "hrp" } });
    if (!forumHRP) {
      console.warn("⚠️  Catégorie 'Forum HRP' non trouvée");
      return;
    }

    // Récupérer la section "Au Feu de Camps"
    const sectionFeuCamps = await Section.findOne({
      where: { slug: "au-feu-de-camps", category_id: forumHRP.id },
    });

    const restrictedSections = [];
    if (sectionFeuCamps) {
      restrictedSections.push(sectionFeuCamps);

      // Récupérer aussi toutes les sous-sections
      const subsectionsFeuCamps = await Section.findAll({
        where: { parent_section_id: sectionFeuCamps.id },
      });
      restrictedSections.push(...subsectionsFeuCamps);
    }

    console.log(`   Sections "Au Feu de Camps" trouvées: ${restrictedSections.length}`);

    // ============================
    // PERMISSIONS REFUSÉES - FORUM GÉNÉRAL
    // ============================

    // Permissions à bloquer pour toutes les sections du Forum Général
    const forumGeneralBlockedPermissions = [
      "section.create",
      "section.edit",
      "section.delete",
      "section.lock",
      "section.unlock",
      "section.move",
      "section.pin",
      "topic.create",
      "topic.edit",
      "topic.delete",
      "topic.lock",
      "topic.unlock",
      "topic.move",
      "topic.pin",
      "post.create",
      "post.edit",
      "post.delete",
      "post.move",
    ];

    // Supprimer les permissions spécifiques existantes pour les sections du Forum Général
    const forumGeneralSectionIds = allForumGeneralSections.map((s) => s.id);
    await SectionPermission.destroy({
      where: {
        section_id: forumGeneralSectionIds,
        role: "GAME_MASTER",
      },
    });

    // Créer les permissions spécifiques (refusées) pour chaque section du Forum Général
    const forumGeneralPermissionsToCreate = [];
    for (const section of allForumGeneralSections) {
      for (const permName of forumGeneralBlockedPermissions) {
        if (permissionMap[permName]) {
          forumGeneralPermissionsToCreate.push({
            section_id: section.id,
            role: "GAME_MASTER",
            user_id: null,
            permission_id: permissionMap[permName].id,
            granted: false, // REFUSÉE
            inherit_to_subsections: true,
          });
        }
      }
    }

    if (forumGeneralPermissionsToCreate.length > 0) {
      await SectionPermission.bulkCreate(forumGeneralPermissionsToCreate);
      console.log(
        `✅ ${forumGeneralPermissionsToCreate.length} permissions refusées pour Forum Général\n`
      );
    }

    // ============================
    // PERMISSIONS REFUSÉES - AU FEU DE CAMPS
    // ============================

    // Permissions à bloquer pour "Au Feu de Camps"
    // Note: Les permissions d'édition/suppression des topics/posts sont gérées au niveau du code
    // (vérification de l'auteur), mais on bloque quand même les permissions sur les sous-sections
    const feuCampsBlockedPermissions = [
      "section.create",
      "section.edit",
      "section.delete",
      "section.lock",
      "section.unlock",
      "section.move",
      "section.pin",
      // Les topics et posts peuvent être créés, mais edit/delete/move sont gérés par le code
      // en vérifiant l'auteur (hasPermission dans permissionHelper.js fait déjà ça)
    ];

    // Supprimer les permissions spécifiques existantes pour "Au Feu de Camps"
    const feuCampsSectionIds = restrictedSections.map((s) => s.id);
    if (feuCampsSectionIds.length > 0) {
      await SectionPermission.destroy({
        where: {
          section_id: feuCampsSectionIds,
          role: "GAME_MASTER",
        },
      });

      // Créer les permissions spécifiques (refusées) pour "Au Feu de Camps"
      const feuCampsPermissionsToCreate = [];
      for (const section of restrictedSections) {
        for (const permName of feuCampsBlockedPermissions) {
          if (permissionMap[permName]) {
            feuCampsPermissionsToCreate.push({
              section_id: section.id,
              role: "GAME_MASTER",
              user_id: null,
              permission_id: permissionMap[permName].id,
              granted: false, // REFUSÉE
              inherit_to_subsections: true,
            });
          }
        }
      }

      if (feuCampsPermissionsToCreate.length > 0) {
        await SectionPermission.bulkCreate(feuCampsPermissionsToCreate);
        console.log(
          `✅ ${feuCampsPermissionsToCreate.length} permissions refusées pour Au Feu de Camps\n`
        );
      }
    }

    // ============================
    // RÉSUMÉ
    // ============================

    console.log("📋 Résumé de la configuration:");
    console.log(`   ✅ Permissions globales: ${rolePermissionsToCreate.length}`);
    console.log(`   ✅ Sections Forum Général restreintes: ${allForumGeneralSections.length}`);
    console.log(`   ✅ Permissions refusées Forum Général: ${forumGeneralPermissionsToCreate.length}`);
    console.log(`   ✅ Sections Au Feu de Camps restreintes: ${restrictedSections.length}`);
    console.log(`   ✅ Permissions refusées Au Feu de Camps: ${feuCampsBlockedPermissions.length * restrictedSections.length}`);
    console.log(`   ℹ️  Note: Les permissions edit/delete sur topics/posts dans "Au Feu de Camps"`);
    console.log(`      sont gérées dynamiquement (vérification de l'auteur)`);
    console.log("");
    console.log("🎉 Configuration des permissions GAME_MASTER terminée avec succès !\n");

    return true;
  } catch (error) {
    console.error("❌ Erreur lors de la configuration:", error);
    throw error;
  }
}

// Fonction principale
async function main() {
  try {
    // Tester la connexion
    await sequelize.authenticate();
    console.log("✅ Connexion à la base de données établie\n");

    // Configurer les permissions
    await setupGameMasterPermissions();

    console.log("✅ Script terminé avec succès");
    process.exit(0);
  } catch (error) {
    console.error("❌ Script échoué:", error);
    process.exit(1);
  }
}

// Exécuter le script
main();
