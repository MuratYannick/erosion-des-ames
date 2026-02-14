'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // =========================================================================
    // Fetch users
    // =========================================================================
    const [users] = await queryInterface.sequelize.query(
      'SELECT id, username FROM users WHERE deleted_at IS NULL'
    );
    const admin = users.find(u => u.username === 'admin');
    const moderator = users.find(u => u.username === 'moderator');
    const gamemaster = users.find(u => u.username === 'gamemaster');
    const player1 = users.find(u => u.username === 'player1');
    const player2 = users.find(u => u.username === 'player2');

    // =========================================================================
    // Fetch categories
    // =========================================================================
    const [categories] = await queryInterface.sequelize.query(
      'SELECT id, name FROM forum_categories WHERE deleted_at IS NULL'
    );
    const cat = (name) => categories.find(c => c.name === name);

    const annonces = cat('Annonces');
    const reglementCGU = cat('Règlement et CGU');
    const infosOff = cat('Informations officielles');
    const discJeu = cat('Discussions autour du jeu');
    const discLibres = cat('Discussions libres');
    const sentinelles = cat('Le Clan des Sentinelles');
    const elusAvant = cat('Les Élus de l\'Avant');
    const sensitifs = cat('La Caste des Sensitifs');
    const prophetes = cat('Les Prophètes de l\'Harmonie');
    const vagabonds = cat('Les Vagabonds du Vent');

    // =========================================================================
    // Fetch approved characters
    // =========================================================================
    const [characters] = await queryInterface.sequelize.query(
      'SELECT id, name, user_id FROM characters WHERE deleted_at IS NULL AND status = \'approved\''
    );
    const kael = characters.find(c => c.name === 'Kael l\'Inaltéré' && c.user_id === admin.id);
    const draven = characters.find(c => c.name === 'Draven le Chroniqueur' && c.user_id === gamemaster.id);
    const lyra = characters.find(c => c.name === 'Lyra des Brumes' && c.user_id === player1.id);
    const thalia = characters.find(c => c.name === 'Thalia la Clairvoyante' && c.user_id === moderator.id);
    const fenris = characters.find(c => c.name === 'Fenris l\'Errant' && c.user_id === player1.id);

    await queryInterface.bulkInsert('forum_topics', [
      // =====================================================================
      // Général > Annonces
      // =====================================================================
      {
        category_id: annonces.id,
        user_id: admin.id,
        character_id: null,
        title: 'Ouverture prochaine du site',
        slug: 'ouverture-prochaine-du-site',
        is_pinned: true,
        is_locked: true,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Général > Règlement et CGU
      // =====================================================================
      {
        category_id: reglementCGU.id,
        user_id: admin.id,
        character_id: null,
        title: 'Règlement du forum',
        slug: 'reglement-du-forum',
        is_pinned: false,
        is_locked: true,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        category_id: reglementCGU.id,
        user_id: admin.id,
        character_id: null,
        title: 'Conditions Générales d\'Utilisation',
        slug: 'conditions-generales-dutilisation',
        is_pinned: false,
        is_locked: true,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Général > Informations officielles
      // =====================================================================
      {
        category_id: infosOff.id,
        user_id: admin.id,
        character_id: null,
        title: 'Règles du jeu role-play',
        slug: 'regles-du-jeu-role-play',
        is_pinned: false,
        is_locked: true,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Hors Role-Play > Discussions autour du jeu
      // =====================================================================
      {
        category_id: discJeu.id,
        user_id: player2.id,
        character_id: null,
        title: 'Astuces pour bien débuter',
        slug: 'astuces-pour-bien-debuter',
        is_pinned: false,
        is_locked: false,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        category_id: discJeu.id,
        user_id: moderator.id,
        character_id: null,
        title: 'Événement communautaire du mois',
        slug: 'evenement-communautaire-du-mois',
        is_pinned: false,
        is_locked: false,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Hors Role-Play > Discussions libres
      // =====================================================================
      {
        category_id: discLibres.id,
        user_id: player1.id,
        character_id: null,
        title: 'Présentez-vous !',
        slug: 'presentez-vous',
        is_pinned: true,
        is_locked: false,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Role-Play > Les Veilleurs > Le Clan des Sentinelles
      // =====================================================================
      {
        category_id: sentinelles.id,
        user_id: admin.id,
        character_id: kael ? kael.id : null,
        title: 'Veillée autour du feu sacré',
        slug: 'veillee-autour-du-feu-sacre',
        is_pinned: false,
        is_locked: false,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Role-Play > Les Veilleurs > Les Élus de l'Avant
      // =====================================================================
      {
        category_id: elusAvant.id,
        user_id: gamemaster.id,
        character_id: draven ? draven.id : null,
        title: 'Les chroniques de l\'Avant-Monde',
        slug: 'les-chroniques-de-lavant-monde',
        is_pinned: false,
        is_locked: false,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Role-Play > Les Éclaireurs > La Caste des Sensitifs
      // =====================================================================
      {
        category_id: sensitifs.id,
        user_id: player1.id,
        character_id: lyra ? lyra.id : null,
        title: 'Les murmures de l\'ancien temple',
        slug: 'les-murmures-de-lancien-temple',
        is_pinned: false,
        is_locked: false,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Role-Play > Les Éclaireurs > Les Prophètes de l'Harmonie
      // =====================================================================
      {
        category_id: prophetes.id,
        user_id: moderator.id,
        character_id: thalia ? thalia.id : null,
        title: 'Méditation sous la lune brisée',
        slug: 'meditation-sous-la-lune-brisee',
        is_pinned: false,
        is_locked: false,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },

      // =====================================================================
      // Role-Play > Les Terres Abandonnées > Les Vagabonds du Vent
      // =====================================================================
      {
        category_id: vagabonds.id,
        user_id: player1.id,
        character_id: fenris ? fenris.id : null,
        title: 'À la croisée des chemins',
        slug: 'a-la-croisee-des-chemins',
        is_pinned: false,
        is_locked: false,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('forum_topics', null, {});
  },
};
