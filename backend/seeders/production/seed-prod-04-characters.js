'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Récupérer les ethnies
    const [ethnicities] = await queryInterface.sequelize.query(
      'SELECT id, name FROM ethnicities WHERE deleted_at IS NULL ORDER BY id ASC'
    );

    const inalteres = ethnicities.find(e => e.name === 'Les Inaltérés');

    // Récupérer l'admin pour approved_by
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'ADMIN' AND deleted_at IS NULL LIMIT 1"
    );

    const adminId = users.length > 0 ? users[0].id : null;

    await queryInterface.bulkInsert('characters', [
      {
        user_id: null,
        ethnicity_id: inalteres.id,
        faction_id: null,
        clan_id: null,
        name: 'L\'Errant Sans Nom',
        avatar: null,
        age: null,
        appearance: null,
        personality: null,
        background: null,
        goals: null,
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('characters', null, {});
  },
};
