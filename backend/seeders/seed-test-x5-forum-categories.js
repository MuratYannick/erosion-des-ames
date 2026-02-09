'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // Insert base categories
    await queryInterface.bulkInsert('forum_categories', [
      {
        parent_id: null,
        name: 'Général',
        slug: 'general',
        description: 'Annonces, règlement et informations officielles',
        icon: null,
        display_order: 0,
        is_active: true,
        is_rp: false,
        topic_count: 0,
        post_count: 0,
        last_post_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: null,
        name: 'Hors Role-Play',
        slug: 'hors-role-play',
        description: 'Discussions libres hors du contexte du jeu',
        icon: null,
        display_order: 1,
        is_active: true,
        is_rp: false,
        topic_count: 0,
        post_count: 0,
        last_post_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: null,
        name: 'Role-Play',
        slug: 'role-play',
        description: 'Espaces de jeu en personnage',
        icon: null,
        display_order: 2,
        is_active: true,
        is_rp: true,
        topic_count: 0,
        post_count: 0,
        last_post_id: null,
        created_at: now,
        updated_at: now,
      },
    ]);

    // Query to get parent IDs
    const [categories] = await queryInterface.sequelize.query(
      'SELECT id, name FROM forum_categories WHERE parent_id IS NULL AND deleted_at IS NULL ORDER BY display_order ASC'
    );
    const general = categories.find(c => c.name === 'Général');
    const hrp = categories.find(c => c.name === 'Hors Role-Play');
    const rp = categories.find(c => c.name === 'Role-Play');

    // Insert sub-categories
    await queryInterface.bulkInsert('forum_categories', [
      {
        parent_id: general.id,
        name: 'Annonces',
        slug: 'annonces',
        description: 'Annonces officielles de l\'équipe',
        icon: null,
        display_order: 0,
        is_active: true,
        is_rp: false,
        topic_count: 0,
        post_count: 0,
        last_post_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: hrp.id,
        name: 'Discussions générales',
        slug: 'discussions-generales',
        description: 'Échanges libres entre joueurs',
        icon: null,
        display_order: 0,
        is_active: true,
        is_rp: false,
        topic_count: 0,
        post_count: 0,
        last_post_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: rp.id,
        name: 'Les Terres Oubliées',
        slug: 'les-terres-oubliees',
        description: 'Zone de jeu principale',
        icon: null,
        display_order: 0,
        is_active: true,
        is_rp: true,
        topic_count: 0,
        post_count: 0,
        last_post_id: null,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('forum_categories', null, {});
  },
};
