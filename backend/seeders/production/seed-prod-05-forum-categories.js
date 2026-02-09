'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

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
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('forum_categories', null, {});
  },
};
