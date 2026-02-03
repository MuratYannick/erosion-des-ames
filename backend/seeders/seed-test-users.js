'use strict';

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash('Password_123', SALT_ROUNDS);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        id: require('crypto').randomUUID(),
        username: 'admin',
        email: 'admin@erosion.local',
        password,
        role: 'ADMIN',
        is_email_verified: true,
        accepted_cgu: true,
        accepted_rules: true,
        accepted_cgu_at: now,
        accepted_rules_at: now,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: require('crypto').randomUUID(),
        username: 'moderator',
        email: 'mod@erosion.local',
        password,
        role: 'MODERATOR',
        is_email_verified: true,
        accepted_cgu: true,
        accepted_rules: true,
        accepted_cgu_at: now,
        accepted_rules_at: now,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: require('crypto').randomUUID(),
        username: 'gamemaster',
        email: 'gm@erosion.local',
        password,
        role: 'GAME_MASTER',
        is_email_verified: true,
        accepted_cgu: true,
        accepted_rules: true,
        accepted_cgu_at: now,
        accepted_rules_at: now,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: require('crypto').randomUUID(),
        username: 'player1',
        email: 'user1@erosion.local',
        password,
        role: 'PLAYER',
        is_email_verified: true,
        accepted_cgu: true,
        accepted_rules: true,
        accepted_cgu_at: now,
        accepted_rules_at: now,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: require('crypto').randomUUID(),
        username: 'player2',
        email: 'user2@erosion.local',
        password,
        role: 'PLAYER',
        is_email_verified: true,
        accepted_cgu: true,
        accepted_rules: true,
        accepted_cgu_at: now,
        accepted_rules_at: now,
        is_active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
