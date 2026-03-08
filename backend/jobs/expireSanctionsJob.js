'use strict';

const cron = require('node-cron');
const { expireOutdatedSanctions } = require('../services/sanctionExpirationService');

/**
 * Cron job that automatically expires outdated temporary sanctions.
 *
 * Schedule: every 5 minutes ('*/5 * * * *')
 *
 * On each tick the job:
 *   1. Calls expireOutdatedSanctions() to deactivate elapsed ban/mute records
 *   2. Logs the number of processed sanctions (or any errors)
 */
function startExpireSanctionsJob() {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const count = await expireOutdatedSanctions();

      if (count > 0) {
        console.log(
          `[expireSanctionsJob] ${count} sanction(s) expirée(s) traitée(s).`
        );
      }
    } catch (error) {
      console.error('[expireSanctionsJob] Erreur inattendue:', error);
    }
  });

  console.log(
    '[expireSanctionsJob] Job d\'expiration des sanctions démarré (intervalle: toutes les 5 minutes).'
  );
}

module.exports = { startExpireSanctionsJob };
