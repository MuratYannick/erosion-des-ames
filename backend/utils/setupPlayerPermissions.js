import sequelize from "../config/database.js";
import { Permission, RolePermission } from "../models/index.js";

/**
 * Script de configuration des permissions de base pour le rôle PLAYER
 *
 * IMPORTANT: Les permissions PLAYER sont dynamiques et dépendent du statut du personnage
 * Ce script configure uniquement les permissions de BASE qui s'appliquent à TOUS les PLAYER.
 *
 * Les permissions supplémentaires sont gérées dynamiquement par:
 * - characterStatusHelper.js: Détermine le statut du personnage
 * - permissionHelper.js: Applique les permissions selon le statut
 *
 * ═══════════════════════════════════════════════════════════════
 * PERMISSIONS DE BASE POUR TOUS LES PLAYER
 * ═══════════════════════════════════════════════════════════════
 * ✅ Voir toutes les catégories publiques (Forum Général, Forum HRP)
 * ✅ Voir toutes les sections et sous-sections publiques
 * ✅ Voir tous les topics et posts dans les sections publiques
 * ✅ Créer/éditer/supprimer leur propre contenu (topics/posts selon statut)
 *
 * ═══════════════════════════════════════════════════════════════
 * PERMISSIONS REFUSÉES POUR TOUS LES PLAYER
 * ═══════════════════════════════════════════════════════════════
 * ❌ Créer/éditer/supprimer des sections/sous-sections (sauf chefs de clan)
 * ❌ Verrouiller/déverrouiller sections et topics (sauf chefs de clan)
 * ❌ Épingler sections et topics (sauf chefs de clan)
 * ❌ Gérer les catégories
 * ❌ Voir les sections/sous-sections restreintes à un clan dont ils ne sont pas membres
 * ❌ Voir les sections/sous-sections restreintes à une faction dont ils ne sont pas membres
 * ❌ Voir/créer/modifier du contenu dans des sections restreintes sans accès
 *
 * ═══════════════════════════════════════════════════════════════
 * RESTRICTIONS POUR UTILISATEURS N'AYANT PAS ACCEPTÉ LES CGU
 * ═══════════════════════════════════════════════════════════════
 * ⚠️  TOUS LES UTILISATEURS (SAUF ADMIN) SANS ACCEPTATION DES CGU :
 * ❌ Créer des sections/sous-sections
 * ❌ Éditer des sections/sous-sections
 * ❌ Supprimer des sections/sous-sections
 * ❌ Déplacer des sections/sous-sections
 * ❌ Créer des topics et posts
 * ❌ Éditer des topics et posts
 * ❌ Supprimer des topics et posts
 * ❌ Déplacer des topics et posts
 * ❌ Verrouiller/déverrouiller sections et topics
 * ❌ Épingler sections et topics
 * ✅ Consulter le contenu (vue uniquement)
 *
 * NOTE: Cette restriction s'applique à TOUS les rôles (MODERATOR, GAME_MASTER, PLAYER)
 *       sauf ADMIN. Elle est vérifiée AVANT toutes les autres permissions.
 *
 * ═══════════════════════════════════════════════════════════════
 * PERMISSIONS SUPPLÉMENTAIRES POUR MEMBRES DE CLAN
 * ═══════════════════════════════════════════════════════════════
 * ✅ Voir toutes les sections/sous-sections restreintes à leur clan
 * ✅ Voir tous les topics/posts dans les sections de leur clan
 * ✅ Créer/éditer/supprimer leur propre contenu dans les sections de leur clan
 *
 * ═══════════════════════════════════════════════════════════════
 * PERMISSIONS SUPPLÉMENTAIRES POUR MEMBRES DE FACTION
 * ═══════════════════════════════════════════════════════════════
 * ✅ Voir toutes les sections/sous-sections restreintes à leur faction
 * ✅ Voir tous les topics/posts dans les sections de leur faction
 * ✅ Créer/éditer/supprimer leur propre contenu dans les sections de leur faction
 *
 * ═══════════════════════════════════════════════════════════════
 * PERMISSIONS SUPPLÉMENTAIRES POUR CHEFS DE CLAN
 * ═══════════════════════════════════════════════════════════════
 * ✅ Créer/éditer/supprimer des sous-sections dans les sections de leur clan
 * ✅ Verrouiller/déverrouiller des sous-sections et topics dans les sections de leur clan
 * ✅ Épingler des sous-sections et topics dans les sections de leur clan
 *
 * ═══════════════════════════════════════════════════════════════
 * RESTRICTIONS POUR JOUEURS SANS PERSONNAGE VIVANT
 * ═══════════════════════════════════════════════════════════════
 * ❌ Voir toutes les sections/sous-sections de la catégorie Forum RP
 * ❌ Voir tous les topics/posts de la catégorie Forum RP
 * ❌ Créer/éditer/supprimer des topics/posts dans la catégorie Forum RP
 */
async function setupPlayerPermissions() {
  try {
    console.log("🚀 Configuration des permissions PLAYER de base...\n");

    // ============================
    // PERMISSIONS GLOBALES
    // ============================

    console.log("📊 Configuration des permissions globales pour PLAYER...");

    // Récupérer toutes les permissions
    const allPermissions = await Permission.findAll();
    const permissionMap = {};
    allPermissions.forEach((p) => {
      permissionMap[p.name] = p;
    });

    // Définir les permissions de BASE du PLAYER
    // Les permissions dynamiques (selon statut personnage) sont gérées par le code
    const playerBasePermissions = [
      // SECTIONS - Vue uniquement
      { name: "section.view", granted: true },
      // Toutes les autres permissions de section sont REFUSÉES

      // TOPICS - Vue et création limitée
      { name: "topic.view", granted: true },
      { name: "topic.create", granted: true }, // Limité par le statut du personnage
      { name: "topic.edit", granted: true }, // Limité à son propre contenu
      { name: "topic.delete", granted: true }, // Limité à son propre contenu
      { name: "topic.move", granted: true }, // Limité à son propre contenu
      // Lock/unlock/pin refusés

      // POSTS - Vue et création limitée
      { name: "post.view", granted: true },
      { name: "post.create", granted: true }, // Limité par le statut du personnage
      { name: "post.edit", granted: true }, // Limité à son propre contenu
      { name: "post.delete", granted: true }, // Limité à son propre contenu
      { name: "post.move", granted: true }, // Limité à son propre contenu

      // CATEGORIES - Vue uniquement
      { name: "category.view", granted: true },
    ];

    // Supprimer les permissions existantes du PLAYER
    await RolePermission.destroy({ where: { role: "PLAYER" } });

    // Créer les nouvelles permissions globales
    const rolePermissionsToCreate = playerBasePermissions
      .filter((p) => permissionMap[p.name])
      .map((p) => ({
        role: "PLAYER",
        permission_id: permissionMap[p.name].id,
        granted: p.granted,
      }));

    await RolePermission.bulkCreate(rolePermissionsToCreate);
    console.log(
      `✅ ${rolePermissionsToCreate.length} permissions de base configurées pour PLAYER\n`
    );

    // ============================
    // RÉSUMÉ
    // ============================

    console.log("📋 Résumé de la configuration:");
    console.log(`   ✅ Permissions de base: ${rolePermissionsToCreate.length}`);
    console.log("");
    console.log("ℹ️  IMPORTANT: Les permissions PLAYER sont DYNAMIQUES");
    console.log("   Les permissions réelles dépendent du statut du personnage:");
    console.log("");
    console.log("   📌 Chef de clan (faction):");
    console.log("      - Peut créer/gérer des sections privées de clan");
    console.log("      - Peut poster dans les sections de faction");
    console.log("      - Max 20 topics/jour, 100 posts/jour");
    console.log("");
    console.log("   📌 Chef de clan (neutre):");
    console.log("      - Peut créer/gérer des sections privées de clan");
    console.log("      - Peut poster dans les sections neutres");
    console.log("      - Max 20 topics/jour, 100 posts/jour");
    console.log("");
    console.log("   📌 Membre de clan (faction):");
    console.log("      - Peut poster dans les sections de faction");
    console.log("      - Max 10 topics/jour, 75 posts/jour");
    console.log("");
    console.log("   📌 Membre de clan (neutre):");
    console.log("      - Peut poster dans les sections neutres");
    console.log("      - Max 10 topics/jour, 75 posts/jour");
    console.log("");
    console.log("   📌 Faction sans clan:");
    console.log("      - Peut poster dans les sections de faction");
    console.log("      - Max 7 topics/jour, 50 posts/jour");
    console.log("");
    console.log("   📌 Sans faction ni clan:");
    console.log("      - Peut poster dans les sections publiques");
    console.log("      - Max 3 topics/jour, 20 posts/jour");
    console.log("");
    console.log("   📌 Pas de personnage vivant:");
    console.log("      - Lecture seule (vue uniquement)");
    console.log("      - Aucune création/modification autorisée");
    console.log("");
    console.log("🔄 Ces limites sont gérées dynamiquement par:");
    console.log("   - characterStatusHelper.js (détection du statut)");
    console.log("   - permissionHelper.js (application des permissions)");
    console.log("");
    console.log("🎉 Configuration des permissions PLAYER terminée avec succès !\n");

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
    await setupPlayerPermissions();

    console.log("✅ Script terminé avec succès");
    process.exit(0);
  } catch (error) {
    console.error("❌ Script échoué:", error);
    process.exit(1);
  }
}

// Exécuter le script
main();
