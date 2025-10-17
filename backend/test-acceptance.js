/**
 * Script de test pour vérifier le système de vérification des acceptations CGU et règlement
 */

import { User, Topic, Post, Section, Category } from "./models/index.js";
import { checkAndUpdateAcceptances } from "./utils/acceptanceChecker.js";
import sequelize from "./config/database.js";

async function runTests() {
  try {
    console.log("\n🧪 Test du système de vérification des acceptations\n");

    // Créer une catégorie de test
    console.log("1️⃣ Création de la catégorie de test...");
    const category = await Category.create({
      name: "Informations",
      slug: "informations",
      description: "Catégorie de test",
      order: 1,
    });

    // Créer une section de test
    console.log("2️⃣ Création de la section de test...");
    const section = await Section.create({
      name: "Règles et CGU",
      slug: "regles-et-cgu",
      description: "Section de test",
      category_id: category.id,
      order: 1,
    });

    // Supprimer les anciens topics CGU et Règlement s'ils existent et les recréer
    await Post.destroy({ where: { topic_id: (await Topic.findAll({ where: { slug: ["cgu", "reglement"] } })).map(t => t.id) } });
    await Topic.destroy({ where: { slug: ["cgu", "reglement"] } });

    // Créer les topics CGU et Règlement pour le test
    console.log("3️⃣ Création des topics CGU et Règlement...");
    const cguTopic = await Topic.create({
      title: "Conditions Générales d'Utilisation",
      slug: "cgu",
      section_id: section.id,
      author_name: "Admin",
    });

    const reglementTopic = await Topic.create({
      title: "Règlement du Forum",
      slug: "reglement",
      section_id: section.id,
      author_name: "Admin",
    });

    // Créer les posts initiaux
    console.log("4️⃣ Création des posts initiaux...");
    const cguPost = await Post.create({
      content: "Version 1.0 des CGU",
      topic_id: cguTopic.id,
      author_name: "Admin",
    });

    const reglementPost = await Post.create({
      content: "Version 1.0 du règlement",
      topic_id: reglementTopic.id,
      author_name: "Admin",
    });

    console.log(`   ✓ Post CGU créé à: ${cguPost.updated_at}`);
    console.log(`   ✓ Post Règlement créé à: ${reglementPost.updated_at}`);

    // Créer un utilisateur de test
    console.log("\n5️⃣ Création d'un utilisateur de test...");
    const user = await User.create({
      username: "test_user_acceptance",
      email: "test_acceptance@test.com",
      password_hash: "hash",
      terms_accepted: true,
      terms_accepted_at: new Date(),
      forum_rules_accepted: true,
      forum_rules_accepted_at: new Date(),
    });

    console.log(`   ✓ Utilisateur créé avec acceptations à: ${user.terms_accepted_at}`);

    // Test 1: Vérifier que rien ne change si pas de mise à jour
    console.log("\n6️⃣ Test 1: Pas de mise à jour des posts");
    await checkAndUpdateAcceptances(user);
    await user.reload();
    console.log(`   ✓ terms_accepted: ${user.terms_accepted}`);
    console.log(`   ✓ forum_rules_accepted: ${user.forum_rules_accepted}`);

    if (user.terms_accepted && user.forum_rules_accepted) {
      console.log("   ✅ Test 1 réussi: Les acceptations restent valides");
    } else {
      console.log("   ❌ Test 1 échoué: Les acceptations ont été modifiées");
    }

    // Test 2: Mettre à jour le post CGU et vérifier
    console.log("\n7️⃣ Test 2: Mise à jour du post CGU");
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Attendre 1s pour avoir une différence de date
    await cguPost.update({ content: "Version 2.0 des CGU" });
    await cguPost.reload();
    console.log(`   ✓ Post CGU mis à jour à: ${cguPost.updatedAt}`);
    console.log(`   ✓ Utilisateur a accepté à: ${user.terms_accepted_at}`);
    console.log(`   ✓ Comparaison: ${new Date(cguPost.updatedAt)} > ${new Date(user.terms_accepted_at)} = ${new Date(cguPost.updatedAt) > new Date(user.terms_accepted_at)}`);

    await checkAndUpdateAcceptances(user);
    await user.reload();
    console.log(`   ✓ terms_accepted: ${user.terms_accepted}`);
    console.log(`   ✓ terms_accepted_at: ${user.terms_accepted_at}`);

    if (!user.terms_accepted && user.terms_accepted_at === null) {
      console.log("   ✅ Test 2 réussi: L'acceptation CGU a été invalidée");
    } else {
      console.log("   ❌ Test 2 échoué: L'acceptation CGU devrait être invalidée");
    }

    // Test 3: Mettre à jour le post Règlement et vérifier
    console.log("\n8️⃣ Test 3: Mise à jour du post Règlement");
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Attendre 1s
    await reglementPost.update({ content: "Version 2.0 du règlement" });
    console.log(`   ✓ Post Règlement mis à jour à: ${reglementPost.updated_at}`);

    await checkAndUpdateAcceptances(user);
    await user.reload();
    console.log(`   ✓ forum_rules_accepted: ${user.forum_rules_accepted}`);
    console.log(`   ✓ forum_rules_accepted_at: ${user.forum_rules_accepted_at}`);

    if (!user.forum_rules_accepted && user.forum_rules_accepted_at === null) {
      console.log("   ✅ Test 3 réussi: L'acceptation du règlement a été invalidée");
    } else {
      console.log("   ❌ Test 3 échoué: L'acceptation du règlement devrait être invalidée");
    }

    // Nettoyage
    console.log("\n9️⃣ Nettoyage des données de test...");
    await user.destroy();
    await cguPost.destroy();
    await reglementPost.destroy();
    await cguTopic.destroy();
    await reglementTopic.destroy();
    await section.destroy();
    await category.destroy();
    console.log("   ✓ Nettoyage terminé");

    console.log("\n✅ Tous les tests sont terminés!\n");
  } catch (error) {
    console.error("\n❌ Erreur lors des tests:", error);
  } finally {
    await sequelize.close();
  }
}

runTests();
