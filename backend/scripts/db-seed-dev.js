#!/usr/bin/env node
'use strict';

/**
 * Script de seed développement
 * Exécute les seeders du dossier seeders/ (données de test)
 * Ne fonctionne qu'en environnement de développement (NODE_ENV !== 'production')
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DEV_SEEDERS_PATH = path.join(__dirname, '..', 'seeders');

async function seedDevelopment() {
  try {
    // Vérifier l'environnement
    const nodeEnv = process.env.NODE_ENV || 'development';

    if (nodeEnv === 'production') {
      console.error('❌ Ce script ne peut pas être exécuté en production.');
      console.error('   Utilisez "npm run db:seed" pour les seeders de production uniquement.\n');
      process.exit(1);
    }

    console.log('==============================================');
    console.log('Seed de développement - Données de test');
    console.log(`Environnement: ${nodeEnv}`);
    console.log('==============================================\n');

    const devSeeders = fs.readdirSync(DEV_SEEDERS_PATH)
      .filter(file => {
        return file.endsWith('.js') &&
               !file.includes('.gitkeep') &&
               fs.statSync(path.join(DEV_SEEDERS_PATH, file)).isFile();
      })
      .sort();

    if (devSeeders.length > 0) {
      console.log(`📦 ${devSeeders.length} seeder(s) de développement trouvé(s)\n`);

      for (const seeder of devSeeders) {
        const seederPath = path.join(DEV_SEEDERS_PATH, seeder);
        console.log(`   🔄 ${seeder}...`);

        try {
          execSync(`npx sequelize-cli db:seed --seed ${seederPath}`, {
            stdio: 'inherit',
            cwd: path.join(__dirname, '..')
          });
          console.log(`   ✅ ${seeder} exécuté\n`);
        } catch (error) {
          console.error(`   ❌ Erreur lors de l'exécution de ${seeder}`);
          throw error;
        }
      }
    } else {
      console.log('   ⚠️  Aucun seeder de développement trouvé\n');
    }

    console.log('==============================================');
    console.log('✅ Seed de développement terminé avec succès');
    console.log('==============================================\n');
    process.exit(0);

  } catch (error) {
    console.error('\n==============================================');
    console.error('❌ Erreur lors du seed de développement');
    console.error('==============================================');
    console.error(error.message);
    process.exit(1);
  }
}

seedDevelopment();
