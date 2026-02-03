'use strict';

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshExpiresIn: '30d',
  bcryptSaltRounds: 12,
  emailVerificationExpiresIn: 24 * 60 * 60 * 1000, // 24h en millisecondes
  passwordResetExpiresIn: 60 * 60 * 1000, // 1h en millisecondes
};
