require('dotenv').config();
const { sequelize } = require('./models');
const app = require('./app');
const { startExpireSanctionsJob } = require('./jobs/expireSanctionsJob');
const { startBackupJob } = require('./jobs/backupJob');

const PORT = process.env.PORT || 3001;

// Start server
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Start background jobs after the DB connection is confirmed
    startExpireSanctionsJob();
    if (process.env.NODE_ENV === 'production') {
      startBackupJob();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
