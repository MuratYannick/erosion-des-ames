#!/usr/bin/env node
'use strict';

/**
 * Script de seed production
 * Exécute uniquement les seeders du dossier seeders/production/
 * Ces seeders contiennent les données de référence indispensables au fonctionnement de l'application
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const PRODUCTION_SEEDERS_PATH = path.join(__dirname, '..', 'seeders', 'production');

async function seedProduction() {
  try {
    console.log('==========================================');
    console.log('Seed de production - Données de référence');
    console.log('==========================================\n');

    // Vérifier si le dossier production existe
    if (!fs.existsSync(PRODUCTION_SEEDERS_PATH)) {
      console.log('⚠️  Aucun dossier seeders/production/ trouvé.');
      console.log('✅ Aucun seed de production à exécuter.\n');
      return;
    }

    // Lister les seeders de production
    const seeders = fs.readdirSync(PRODUCTION_SEEDERS_PATH)
      .filter(file => file.endsWith('.js'))
      .sort();

    if (seeders.length === 0) {
      console.log('⚠️  Aucun seeder de production trouvé dans seeders/production/');
      console.log('✅ Aucun seed de production à exécuter.\n');
      return;
    }

    console.log(`📦 ${seeders.length} seeder(s) de production trouvé(s):\n`);
    seeders.forEach((seeder, index) => {
      console.log(`   ${index + 1}. ${seeder}`);
    });
    console.log('');

    // Exécuter chaque seeder individuellement
    for (const seeder of seeders) {
      const seederPath = path.join(PRODUCTION_SEEDERS_PATH, seeder);
      console.log(`🔄 Exécution: ${seeder}...`);

      try {
        execSync(`npx sequelize-cli db:seed --seed ${seederPath}`, {
          stdio: 'inherit',
          cwd: path.join(__dirname, '..')
        });
        console.log(`✅ ${seeder} exécuté avec succès\n`);
      } catch (error) {
        console.error(`❌ Erreur lors de l'exécution de ${seeder}`);
        throw error;
      }
    }

    console.log('==========================================');
    console.log('✅ Seed de production terminé avec succès');
    console.log('==========================================\n');
    process.exit(0);

  } catch (error) {
    console.error('\n==========================================');
    console.error('❌ Erreur lors du seed de production');
    console.error('==========================================');
    console.error(error.message);
    process.exit(1);
  }
}

seedProduction();
