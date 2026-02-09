'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // Query users
    const [users] = await queryInterface.sequelize.query(
      'SELECT id, username FROM users WHERE deleted_at IS NULL'
    );
    const admin = users.find(u => u.username === 'admin');
    const player1 = users.find(u => u.username === 'player1');
    const player2 = users.find(u => u.username === 'player2');
    const moderator = users.find(u => u.username === 'moderator');

    // Query categories
    const [categories] = await queryInterface.sequelize.query(
      'SELECT id, name FROM forum_categories WHERE deleted_at IS NULL'
    );
    const annonces = categories.find(c => c.name === 'Annonces');
    const discussions = categories.find(c => c.name === 'Discussions générales');
    const terresOubliees = categories.find(c => c.name === 'Les Terres Oubliées');

    // Query characters
    const [characters] = await queryInterface.sequelize.query(
      'SELECT id, name, user_id FROM characters WHERE deleted_at IS NULL AND status = \'approved\''
    );
    const lyra = characters.find(c => c.name === 'Lyra des Brumes' && c.user_id === player1.id);
    const kael = characters.find(c => c.name === 'Kael l\'Inaltéré' && c.user_id === admin.id);

    await queryInterface.bulkInsert('forum_topics', [
      {
        category_id: annonces.id,
        user_id: admin.id,
        character_id: null,
        title: 'Bienvenue sur Érosion des Âmes',
        slug: 'bienvenue-sur-erosion-des-ames',
        is_pinned: true,
        is_locked: false,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        category_id: annonces.id,
        user_id: admin.id,
        character_id: null,
        title: 'Règlement du forum',
        slug: 'reglement-du-forum',
        is_pinned: true,
        is_locked: true,
        post_count: 1,
        view_count: 0,
        last_post_id: null,
        last_post_at: now,
        created_at: now,
        updated_at: now,
      },
      {
        category_id: discussions.id,
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
      {
        category_id: discussions.id,
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
        category_id: discussions.id,
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
      {
        category_id: terresOubliees.id,
        user_id: player1.id,
        character_id: lyra.id,
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
      {
        category_id: terresOubliees.id,
        user_id: admin.id,
        character_id: kael.id,
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
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('forum_topics', null, {});
  },
};
