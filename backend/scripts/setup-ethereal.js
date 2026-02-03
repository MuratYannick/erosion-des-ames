/**
 * Script pour générer des credentials Ethereal (email de test)
 *
 * Usage: node scripts/setup-ethereal.js
 *
 * Les emails envoyés seront visibles sur https://ethereal.email
 */

const nodemailer = require('nodemailer')

async function setupEthereal() {
  console.log('Génération des credentials Ethereal...\n')

  try {
    // Créer un compte de test Ethereal
    const testAccount = await nodemailer.createTestAccount()

    console.log('✅ Compte Ethereal créé avec succès!\n')
    console.log('=' .repeat(50))
    console.log('Copie ces valeurs dans ton fichier .env :')
    console.log('=' .repeat(50))
    console.log(`
# Email (SMTP - Ethereal Test)
SMTP_HOST=${testAccount.smtp.host}
SMTP_PORT=${testAccount.smtp.port}
SMTP_SECURE=${testAccount.smtp.secure}
SMTP_USER=${testAccount.user}
SMTP_PASS=${testAccount.pass}
EMAIL_FROM="Érosion des Âmes" <${testAccount.user}>
`)
    console.log('=' .repeat(50))
    console.log('\n📧 Pour voir les emails envoyés :')
    console.log(`   URL: https://ethereal.email`)
    console.log(`   Login: ${testAccount.user}`)
    console.log(`   Password: ${testAccount.pass}`)
    console.log('\n💡 Les credentials sont valides pendant quelques jours.')
    console.log('   Relance ce script si ils expirent.\n')

  } catch (error) {
    console.error('❌ Erreur lors de la création du compte Ethereal:', error.message)
    process.exit(1)
  }
}

setupEthereal()
