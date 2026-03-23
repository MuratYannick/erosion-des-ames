'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const [categories] = await queryInterface.sequelize.query(
      'SELECT id, slug FROM forum_categories WHERE parent_id IS NULL AND deleted_at IS NULL ORDER BY id ASC'
    );

    const general    = categories.find(c => c.slug === 'general');
    const horsRp     = categories.find(c => c.slug === 'hors-role-play');
    const rolePlay   = categories.find(c => c.slug === 'role-play');

    await queryInterface.bulkInsert('forum_categories', [
      // ── Général ──────────────────────────────────────────────────────────────
      {
        parent_id:     general.id,
        name:          'Annonces',
        slug:          'annonces',
        description:   'Annonces officielles du staff',
        icon:          null,
        display_order: 0,
        is_active:     true,
        is_rp:         false,
        topic_count:   0,
        post_count:    0,
        last_post_id:  null,
        created_at:    now,
        updated_at:    now,
      },
      {
        parent_id:     general.id,
        name:          'Règlement et CGU',
        slug:          'reglement-et-cgu',
        description:   'Règlement du forum et conditions générales d\'utilisation',
        icon:          null,
        display_order: 1,
        is_active:     true,
        is_rp:         false,
        topic_count:   0,
        post_count:    0,
        last_post_id:  null,
        created_at:    now,
        updated_at:    now,
      },
      {
        parent_id:     general.id,
        name:          'Informations Générales',
        slug:          'informations-generales',
        description:   'Informations pratiques sur le jeu et la communauté',
        icon:          null,
        display_order: 2,
        is_active:     true,
        is_rp:         false,
        topic_count:   0,
        post_count:    0,
        last_post_id:  null,
        created_at:    now,
        updated_at:    now,
      },

      // ── Hors Role-Play ───────────────────────────────────────────────────────
      {
        parent_id:     horsRp.id,
        name:          'Discussions Autour du Jeu',
        slug:          'discussions-autour-du-jeu',
        description:   'Stratégies, questions de gameplay, retours sur le jeu',
        icon:          null,
        display_order: 0,
        is_active:     true,
        is_rp:         false,
        topic_count:   0,
        post_count:    0,
        last_post_id:  null,
        created_at:    now,
        updated_at:    now,
      },
      {
        parent_id:     horsRp.id,
        name:          'Discussions Libres',
        slug:          'discussions-libres',
        description:   'Discussions sans rapport avec le jeu',
        icon:          null,
        display_order: 1,
        is_active:     true,
        is_rp:         false,
        topic_count:   0,
        post_count:    0,
        last_post_id:  null,
        created_at:    now,
        updated_at:    now,
      },

      // ── Role-Play ────────────────────────────────────────────────────────────
      {
        parent_id:     rolePlay.id,
        name:          'Les Veilleurs de l\'Ancien Monde',
        slug:          'les-veilleurs-de-l-ancien-monde',
        description:   'Espace de jeu réservé aux Veilleurs de l\'Ancien Monde',
        icon:          null,
        display_order: 0,
        is_active:     true,
        is_rp:         true,
        topic_count:   0,
        post_count:    0,
        last_post_id:  null,
        created_at:    now,
        updated_at:    now,
      },
      {
        parent_id:     rolePlay.id,
        name:          'Les Éclaireurs de l\'Aube Nouvelle',
        slug:          'les-eclaireurs-de-l-aube-nouvelle',
        description:   'Espace de jeu réservé aux Éclaireurs de l\'Aube Nouvelle',
        icon:          null,
        display_order: 1,
        is_active:     true,
        is_rp:         true,
        topic_count:   0,
        post_count:    0,
        last_post_id:  null,
        created_at:    now,
        updated_at:    now,
      },
      {
        parent_id:     rolePlay.id,
        name:          'Les Terres Abandonnées',
        slug:          'les-terres-abandonnees',
        description:   'Espace de jeu pour les clans neutres et les zones sans faction',
        icon:          null,
        display_order: 2,
        is_active:     true,
        is_rp:         true,
        topic_count:   0,
        post_count:    0,
        last_post_id:  null,
        created_at:    now,
        updated_at:    now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'DELETE FROM forum_categories WHERE parent_id IS NOT NULL'
    );
  },
};
