#!/usr/bin/env node
'use strict';

/**
 * Script de suppression de toutes les tables
 * Annule toutes les migrations (db:migrate:undo:all)
 * ATTENTION: Supprime toutes les tables de la base de données
 */

const { execSync } = require('child_process');
const path = require('path');

async function dropDatabase() {
  try {
    console.log('==========================================');
    console.log('⚠️  SUPPRESSION DE TOUTES LES TABLES');
    console.log('==========================================\n');

    console.log('🗑️  Annulation de toutes les migrations en cours...\n');

    // Exécuter la commande sequelize-cli db:migrate:undo:all
    execSync('npx sequelize-cli db:migrate:undo:all', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    console.log('\n==========================================');
    console.log('✅ Toutes les tables ont été supprimées');
    console.log('==========================================\n');

    console.log('💡 Pour recréer les tables, exécutez:');
    console.log('   npm run db:migrate\n');

    process.exit(0);

  } catch (error) {
    console.error('\n==========================================');
    console.error('❌ Erreur lors de la suppression des tables');
    console.error('==========================================');
    console.error(error.message);
    process.exit(1);
  }
}

dropDatabase();
