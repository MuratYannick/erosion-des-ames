import sequelize from "../config/database.js";
import {
  Permission,
  RolePermission,
  SectionPermission,
  Section,
  Category,
} from "../models/index.js";

/**
 * Script de configuration des permissions pour le rôle MODERATOR
 *
 * Règles globales:
 * - Voir toutes les sections, topics et posts
 * - Peut gérer les sous-sections (créer, éditer, lock, pin, supprimer, déplacer)
 * - NE PEUT PAS créer de sections directement dans une catégorie
 * - NE PEUT PAS déplacer des sections (seulement sous-sections)
 * - Peut gérer tous les topics et posts
 *
 * Exceptions (sections restreintes):
 * - "Règlement et CGU" et ses sous-sections: AUCUNE permission de modification
 * - "Règles du Jeu" et ses sous-sections: AUCUNE permission de modification
 */
async function setupModeratorPermissions() {
  try {
    console.log("🚀 Configuration des permissions MODERATOR...\n");

    // ============================
    // PERMISSIONS GLOBALES
    // ============================

    console.log("📊 Configuration des permissions globales pour MODERATOR...");

    // Récupérer toutes les permissions
    const allPermissions = await Permission.findAll();
    const permissionMap = {};
    allPermissions.forEach((p) => {
      permissionMap[p.name] = p;
    });

    // Définir les permissions globales du MODERATOR
    const moderatorGlobalPermissions = [
      // SECTIONS - Vue uniquement
      { name: "section.view", granted: true },
      // PAS de section.create (ne peut pas créer dans une catégorie directement)
      // PAS de section.edit, section.delete, section.move, etc. (seulement sous-sections via permissions spécifiques)

      // SOUS-SECTIONS - Toutes les permissions sauf create qui sera géré différemment
      { name: "section.create", granted: true }, // Peut créer des sous-sections
      { name: "section.edit", granted: true }, // Sera limité par les sections restreintes
      { name: "section.delete", granted: true },
      { name: "section.lock", granted: true },
      { name: "section.unlock", granted: true },
      { name: "section.move", granted: true }, // Peut déplacer des sous-sections
      { name: "section.pin", granted: true },

      // TOPICS - Toutes les permissions
      { name: "topic.view", granted: true },
      { name: "topic.create", granted: true },
      { name: "topic.edit", granted: true },
      { name: "topic.delete", granted: true },
      { name: "topic.lock", granted: true },
      { name: "topic.unlock", granted: true },
      { name: "topic.move", granted: true },
      { name: "topic.pin", granted: true },

      // POSTS - Toutes les permissions
      { name: "post.view", granted: true },
      { name: "post.create", granted: true },
      { name: "post.edit", granted: true },
      { name: "post.delete", granted: true },
      { name: "post.move", granted: true },

      // CATEGORIES - Vue uniquement
      { name: "category.view", granted: true },
    ];

    // Supprimer les permissions existantes du MODERATOR
    await RolePermission.destroy({ where: { role: "MODERATOR" } });

    // Créer les nouvelles permissions globales
    const rolePermissionsToCreate = moderatorGlobalPermissions
      .filter((p) => permissionMap[p.name])
      .map((p) => ({
        role: "MODERATOR",
        permission_id: permissionMap[p.name].id,
        granted: p.granted,
      }));

    await RolePermission.bulkCreate(rolePermissionsToCreate);
    console.log(
      `✅ ${rolePermissionsToCreate.length} permissions globales configurées pour MODERATOR\n`
    );

    // ============================
    // SECTIONS RESTREINTES
    // ============================

    console.log("📊 Configuration des restrictions pour sections spécifiques...");

    // Récupérer la catégorie Forum Général
    const forumGeneral = await Category.findOne({ where: { slug: "general" } });
    if (!forumGeneral) {
      console.warn("⚠️  Catégorie 'Forum Général' non trouvée");
      return;
    }

    // Récupérer les sections restreintes
    const sectionReglementCGU = await Section.findOne({
      where: { slug: "reglement-cgu", category_id: forumGeneral.id },
    });

    const sectionReglesJeu = await Section.findOne({
      where: { slug: "regles-jeu", category_id: forumGeneral.id },
    });

    const restrictedSections = [];
    if (sectionReglementCGU) restrictedSections.push(sectionReglementCGU);
    if (sectionReglesJeu) restrictedSections.push(sectionReglesJeu);

    if (restrictedSections.length === 0) {
      console.warn("⚠️  Aucune section restreinte trouvée");
      return;
    }

    // Récupérer aussi toutes les sous-sections de ces sections
    const allRestrictedSections = [...restrictedSections];
    for (const section of restrictedSections) {
      const subsections = await Section.findAll({
        where: { parent_section_id: section.id },
      });
      allRestrictedSections.push(...subsections);
    }

    console.log(
      `   Sections restreintes trouvées: ${allRestrictedSections.length}`
    );

    // Permissions à bloquer pour les sections restreintes
    const restrictedPermissions = [
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

    // Supprimer les permissions spécifiques existantes pour ces sections
    const restrictedSectionIds = allRestrictedSections.map((s) => s.id);
    await SectionPermission.destroy({
      where: {
        section_id: restrictedSectionIds,
        role: "MODERATOR",
      },
    });

    // Créer les permissions spécifiques (refusées) pour chaque section restreinte
    const sectionPermissionsToCreate = [];
    for (const section of allRestrictedSections) {
      for (const permName of restrictedPermissions) {
        if (permissionMap[permName]) {
          sectionPermissionsToCreate.push({
            section_id: section.id,
            role: "MODERATOR",
            user_id: null,
            permission_id: permissionMap[permName].id,
            granted: false, // REFUSÉE
            inherit_to_subsections: true, // Hérite aux sous-sections
          });
        }
      }
    }

    if (sectionPermissionsToCreate.length > 0) {
      await SectionPermission.bulkCreate(sectionPermissionsToCreate);
      console.log(
        `✅ ${sectionPermissionsToCreate.length} permissions de section restreintes configurées\n`
      );
    }

    // ============================
    // RÉSUMÉ
    // ============================

    console.log("📋 Résumé de la configuration:");
    console.log(`   ✅ Permissions globales: ${rolePermissionsToCreate.length}`);
    console.log(`   ✅ Sections restreintes: ${allRestrictedSections.length}`);
    console.log(
      `   ✅ Permissions spécifiques refusées: ${sectionPermissionsToCreate.length}`
    );
    console.log("");
    console.log("🎉 Configuration des permissions MODERATOR terminée avec succès !\n");

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
    await setupModeratorPermissions();

    console.log("✅ Script terminé avec succès");
    process.exit(0);
  } catch (error) {
    console.error("❌ Script échoué:", error);
    process.exit(1);
  }
}

// Exécuter le script
main();
