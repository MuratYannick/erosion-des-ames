'use strict';

const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

const BACKUP_SCRIPT = path.join(__dirname, '../scripts/backup-db.sh');

/**
 * Cron job that triggers a daily database backup.
 *
 * Schedule: every day at 02:00 (cron expression: 0 2 * * *)
 *
 * The job runs the backup-db.sh shell script which:
 *   1. Dumps the MySQL database with mysqldump
 *   2. Compresses the dump with gzip
 *   3. Deletes backups older than RETENTION_DAYS (default: 7)
 */
function startBackupJob() {
  cron.schedule('0 2 * * *', () => {
    console.log('[backupJob] Démarrage de la sauvegarde quotidienne...');

    exec(`bash "${BACKUP_SCRIPT}"`, (error, stdout, stderr) => {
      if (stdout) console.log(stdout.trim());
      if (stderr) console.error(stderr.trim());

      if (error) {
        console.error(`[backupJob] Échec de la sauvegarde : ${error.message}`);
      } else {
        console.log('[backupJob] Sauvegarde quotidienne terminée avec succès.');
      }
    });
  }, {
    timezone: 'Europe/Paris',
  });

  console.log('[backupJob] Sauvegarde quotidienne planifiée à 02:00 (Europe/Paris).');
}

module.exports = { startBackupJob };
