#!/usr/bin/env node
'use strict';

/**
 * Script de nettoyage de la base de données
 * Vide toutes les tables (TRUNCATE) sans les supprimer
 * Désactive temporairement les contraintes de foreign key
 */

const db = require('../models');

async function clearDatabase() {
  try {
    console.log('==========================================');
    console.log('Nettoyage de la base de données');
    console.log('==========================================\n');

    const sequelize = db.sequelize;
    const queryInterface = sequelize.getQueryInterface();

    // Récupérer toutes les tables
    const tables = await queryInterface.showAllTables();

    if (tables.length === 0) {
      console.log('⚠️  Aucune table trouvée dans la base de données.\n');
      await sequelize.close();
      process.exit(0);
    }

    // Filtrer la table SequelizeMeta (ne doit pas être vidée)
    const tablesToClear = tables.filter(table =>
      table !== 'SequelizeMeta' && table !== 'sequelizemeta'
    );

    console.log(`📋 ${tablesToClear.length} table(s) à vider:\n`);
    tablesToClear.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table}`);
    });
    console.log('');

    // Désactiver les contraintes de foreign key
    console.log('🔓 Désactivation des contraintes de foreign key...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    console.log('✅ Contraintes désactivées\n');

    // Vider chaque table
    let successCount = 0;
    let errorCount = 0;

    for (const table of tablesToClear) {
      try {
        console.log(`🗑️  TRUNCATE ${table}...`);
        await sequelize.query(`TRUNCATE TABLE \`${table}\``);
        console.log(`✅ ${table} vidée\n`);
        successCount++;
      } catch (error) {
        console.error(`❌ Erreur sur ${table}: ${error.message}\n`);
        errorCount++;
      }
    }

    // Réactiver les contraintes de foreign key
    console.log('🔒 Réactivation des contraintes de foreign key...');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Contraintes réactivées\n');

    // Résumé
    console.log('==========================================');
    console.log('Résumé du nettoyage:');
    console.log(`  ✅ Tables vidées: ${successCount}`);
    if (errorCount > 0) {
      console.log(`  ❌ Erreurs: ${errorCount}`);
    }
    console.log('==========================================\n');

    if (errorCount > 0) {
      console.log('⚠️  Le nettoyage s\'est terminé avec des erreurs.\n');
      await sequelize.close();
      process.exit(1);
    } else {
      console.log('✅ Nettoyage terminé avec succès.\n');
      await sequelize.close();
      process.exit(0);
    }

  } catch (error) {
    console.error('\n==========================================');
    console.error('❌ Erreur fatale lors du nettoyage');
    console.error('==========================================');
    console.error(error.message);
    console.error(error.stack);

    // Tenter de réactiver les contraintes en cas d'erreur
    try {
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    } catch (e) {
      // Ignorer l'erreur si la connexion est déjà fermée
    }

    await db.sequelize.close();
    process.exit(1);
  }
}

clearDatabase();
