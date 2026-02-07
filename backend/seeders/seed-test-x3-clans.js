'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Récupérer les ethnies
    const [ethnicities] = await queryInterface.sequelize.query(
      'SELECT id, name FROM ethnicities WHERE deleted_at IS NULL ORDER BY id ASC'
    );

    const inalteres = ethnicities.find(e => e.name === 'Les Inaltérés');
    const eveilles = ethnicities.find(e => e.name === 'Les Éveillés');

    // Récupérer les factions
    const [factions] = await queryInterface.sequelize.query(
      'SELECT id, name FROM factions WHERE deleted_at IS NULL ORDER BY id ASC'
    );

    const veilleurs = factions.find(f => f.name === 'Les Veilleurs de l\'Ancien Monde');
    const eclaireurs = factions.find(f => f.name === 'Les Éclaireurs de l\'Aube Nouvelle');

    // Récupérer l'admin pour approved_by
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'ADMIN' AND deleted_at IS NULL LIMIT 1"
    );

    const adminId = users.length > 0 ? users[0].id : null;

    await queryInterface.bulkInsert('clans', [
      {
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        name: 'Les Élus de l\'Avant',
        emblem: null,
        is_playable: false,
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
      {
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        name: 'Le Clan des Sentinelles',
        emblem: null,
        is_playable: true,
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
      {
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        name: 'Les Prophètes de l\'Harmonie',
        emblem: null,
        is_playable: false,
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
      {
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        name: 'La Caste des Sensitifs',
        emblem: null,
        is_playable: true,
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
      {
        ethnicity_id: null,
        faction_id: null,
        name: 'Les Vagabonds du Vent',
        emblem: null,
        is_playable: true,
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
      {
        ethnicity_id: inalteres.id,
        faction_id: null,
        name: 'Les Frères de la Terre Brûlée',
        emblem: null,
        is_playable: true,
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
      {
        ethnicity_id: eveilles.id,
        faction_id: null,
        name: 'Le Peuple des Ombres',
        emblem: null,
        is_playable: true,
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
      {
        ethnicity_id: eveilles.id,
        faction_id: null,
        name: 'Les Dévoreurs d\'Âmes',
        emblem: null,
        is_playable: false,
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
      {
        ethnicity_id: null,
        faction_id: null,
        name: 'Le Sanctuaire du Silence',
        emblem: null,
        is_playable: true,
        background: null,
        goals: null,
        status: 'draft',
        rejection_reason: null,
        is_active: true,
        approved_at: null,
        approved_by: null,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('clans', null, {});
  },
};
