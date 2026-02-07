'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert('ethnicities', [
      {
        name: 'Les Inaltérés',
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Les Éveillés',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('ethnicities', null, {});
  },
};
