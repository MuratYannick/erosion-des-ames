'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // =========================================================================
    // Level 0 — Parent categories
    // =========================================================================
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

    // =========================================================================
    // Fetch parent IDs
    // =========================================================================
    const [parents] = await queryInterface.sequelize.query(
      'SELECT id, name FROM forum_categories WHERE parent_id IS NULL AND deleted_at IS NULL ORDER BY display_order ASC'
    );
    const general = parents.find(c => c.name === 'Général');
    const hrp = parents.find(c => c.name === 'Hors Role-Play');
    const rp = parents.find(c => c.name === 'Role-Play');

    // =========================================================================
    // Level 1 — Sub-categories
    // =========================================================================
    await queryInterface.bulkInsert('forum_categories', [
      // --- Général ---
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
        parent_id: general.id,
        name: 'Règlement et CGU',
        slug: 'reglement-et-cgu',
        description: 'Règlement du forum et Conditions Générales d\'Utilisation',
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
        parent_id: general.id,
        name: 'Informations officielles',
        slug: 'informations-officielles',
        description: 'Informations officielles et règles du jeu',
        icon: null,
        display_order: 2,
        is_active: true,
        is_rp: false,
        topic_count: 0,
        post_count: 0,
        last_post_id: null,
        created_at: now,
        updated_at: now,
      },
      // --- Hors Role-Play ---
      {
        parent_id: hrp.id,
        name: 'Discussions autour du jeu',
        slug: 'discussions-autour-du-jeu',
        description: 'Discussions et astuces autour du jeu',
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
        name: 'Discussions libres',
        slug: 'discussions-libres',
        description: 'Discussions libres, présentations et divers',
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
      // --- Role-Play ---
      {
        parent_id: rp.id,
        name: 'Les Veilleurs de l\'Ancien Monde',
        slug: 'les-veilleurs-de-lancien-monde',
        description: 'Espace de jeu de la faction des Veilleurs de l\'Ancien Monde',
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
      {
        parent_id: rp.id,
        name: 'Les Éclaireurs de l\'Aube Nouvelle',
        slug: 'les-eclaireurs-de-laube-nouvelle',
        description: 'Espace de jeu de la faction des Éclaireurs de l\'Aube Nouvelle',
        icon: null,
        display_order: 1,
        is_active: true,
        is_rp: true,
        topic_count: 0,
        post_count: 0,
        last_post_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: rp.id,
        name: 'Les Terres Abandonnées',
        slug: 'les-terres-abandonnees',
        description: 'Zones hors faction — clans indépendants et terres sauvages',
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

    // =========================================================================
    // Fetch Level 1 RP faction category IDs
    // =========================================================================
    const [level1] = await queryInterface.sequelize.query(
      'SELECT id, name FROM forum_categories WHERE parent_id IS NOT NULL AND deleted_at IS NULL'
    );
    const veilleurs = level1.find(c => c.name === 'Les Veilleurs de l\'Ancien Monde');
    const eclaireurs = level1.find(c => c.name === 'Les Éclaireurs de l\'Aube Nouvelle');
    const terresAbandonnees = level1.find(c => c.name === 'Les Terres Abandonnées');

    // =========================================================================
    // Level 2 — Clan sub-categories
    // =========================================================================
    await queryInterface.bulkInsert('forum_categories', [
      // --- Les Veilleurs de l'Ancien Monde ---
      {
        parent_id: veilleurs.id,
        name: 'Les Élus de l\'Avant',
        slug: 'les-elus-de-lavant',
        description: 'Espace RP du clan des Élus de l\'Avant',
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
      {
        parent_id: veilleurs.id,
        name: 'Le Clan des Sentinelles',
        slug: 'le-clan-des-sentinelles',
        description: 'Espace RP du Clan des Sentinelles',
        icon: null,
        display_order: 1,
        is_active: true,
        is_rp: true,
        topic_count: 0,
        post_count: 0,
        last_post_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: veilleurs.id,
        name: 'Les Portes de l\'Empalé',
        slug: 'les-portes-de-lempale',
        description: 'Espace RP ouvert pour le jeu entre Veilleurs et autres joueurs',
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
      // --- Les Éclaireurs de l'Aube Nouvelle ---
      {
        parent_id: eclaireurs.id,
        name: 'Les Prophètes de l\'Harmonie',
        slug: 'les-prophetes-de-lharmonie',
        description: 'Espace RP du clan des Prophètes de l\'Harmonie',
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
      {
        parent_id: eclaireurs.id,
        name: 'La Caste des Sensitifs',
        slug: 'la-caste-des-sensitifs',
        description: 'Espace RP de la Caste des Sensitifs',
        icon: null,
        display_order: 1,
        is_active: true,
        is_rp: true,
        topic_count: 0,
        post_count: 0,
        last_post_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: eclaireurs.id,
        name: 'La Fosse de la Lapidation',
        slug: 'la-fosse-de-la-lapidation',
        description: 'Espace RP ouvert pour le jeu entre Éclaireurs et autres joueurs',
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
      // --- Les Terres Abandonnées ---
      {
        parent_id: terresAbandonnees.id,
        name: 'Les Vagabonds du Vent',
        slug: 'les-vagabonds-du-vent',
        description: 'Espace RP du clan des Vagabonds du Vent',
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
      {
        parent_id: terresAbandonnees.id,
        name: 'Les Frères de la Terre Brûlée',
        slug: 'les-freres-de-la-terre-brulee',
        description: 'Espace RP du clan des Frères de la Terre Brûlée',
        icon: null,
        display_order: 1,
        is_active: true,
        is_rp: true,
        topic_count: 0,
        post_count: 0,
        last_post_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        parent_id: terresAbandonnees.id,
        name: 'Le Peuple des Ombres',
        slug: 'le-peuple-des-ombres',
        description: 'Espace RP du Peuple des Ombres',
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
      {
        parent_id: terresAbandonnees.id,
        name: 'Les Terres Sauvages',
        slug: 'les-terres-sauvages',
        description: 'Espace RP libre hors clans et factions',
        icon: null,
        display_order: 3,
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
