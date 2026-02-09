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

    // Query topics
    const [topics] = await queryInterface.sequelize.query(
      'SELECT id, slug FROM forum_topics WHERE deleted_at IS NULL'
    );
    const bienvenue = topics.find(t => t.slug === 'bienvenue-sur-erosion-des-ames');
    const reglement = topics.find(t => t.slug === 'reglement-du-forum');
    const presentations = topics.find(t => t.slug === 'presentez-vous');
    const astuces = topics.find(t => t.slug === 'astuces-pour-bien-debuter');
    const evenement = topics.find(t => t.slug === 'evenement-communautaire-du-mois');
    const croisee = topics.find(t => t.slug === 'a-la-croisee-des-chemins');
    const temple = topics.find(t => t.slug === 'les-murmures-de-lancien-temple');

    // Query characters
    const [characters] = await queryInterface.sequelize.query(
      'SELECT id, name, user_id FROM characters WHERE deleted_at IS NULL AND status = \'approved\''
    );
    const lyra = characters.find(c => c.name === 'Lyra des Brumes' && c.user_id === player1.id);
    const kael = characters.find(c => c.name === 'Kael l\'Inaltéré' && c.user_id === admin.id);

    await queryInterface.bulkInsert('forum_posts', [
      // Topic "Bienvenue sur Érosion des Âmes"
      {
        topic_id: bienvenue.id,
        user_id: admin.id,
        character_id: null,
        content: '<p>Bienvenue à tous sur le forum d\'Érosion des Âmes ! Ce forum est votre espace d\'échange et de jeu.</p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: bienvenue.id,
        user_id: player1.id,
        character_id: null,
        content: '<p>Merci pour l\'accueil ! Hâte de commencer l\'aventure.</p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: bienvenue.id,
        user_id: player2.id,
        character_id: null,
        content: '<p>Super, le forum est magnifique !</p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },
      // Topic "Règlement du forum"
      {
        topic_id: reglement.id,
        user_id: admin.id,
        character_id: null,
        content: '<p>Voici les règles du forum. Merci de les respecter pour le bien de la communauté.</p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
      // Topic "Présentez-vous !"
      {
        topic_id: presentations.id,
        user_id: player1.id,
        character_id: null,
        content: '<p>Salut tout le monde ! Venez vous présenter ici.</p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: presentations.id,
        user_id: player2.id,
        character_id: null,
        content: '<p>Hello ! Je suis nouveau ici, content de rejoindre la communauté.</p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: presentations.id,
        user_id: moderator.id,
        character_id: null,
        content: '<p>Bienvenue à tous les nouveaux membres !</p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },
      // Topic "Astuces pour bien débuter"
      {
        topic_id: astuces.id,
        user_id: player2.id,
        character_id: null,
        content: '<p>Voici quelques conseils pour les débutants sur Érosion des Âmes.</p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: astuces.id,
        user_id: player1.id,
        character_id: null,
        content: '<p>Merci pour ces conseils, très utile !</p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },
      // Topic "Événement communautaire du mois"
      {
        topic_id: evenement.id,
        user_id: moderator.id,
        character_id: null,
        content: '<p>Nous organisons un événement spécial ce mois-ci. Restez connectés !</p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
      // Topic "À la croisée des chemins"
      {
        topic_id: croisee.id,
        user_id: player1.id,
        character_id: lyra.id,
        content: '<p><em>Lyra s\'arrêta au carrefour, scrutant l\'horizon brumeux...</em></p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: croisee.id,
        user_id: admin.id,
        character_id: kael.id,
        content: '<p><em>Une silhouette imposante émergea de la brume. Kael observa la jeune femme d\'un regard perçant.</em></p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },
      // Topic "Les murmures de l'ancien temple"
      {
        topic_id: temple.id,
        user_id: admin.id,
        character_id: kael.id,
        content: '<p><em>Le temple semblait vivant, ses murs résonnant de murmures oubliés...</em></p>',
        is_first_post: true,
        created_at: now,
        updated_at: now,
      },
      {
        topic_id: temple.id,
        user_id: player1.id,
        character_id: lyra.id,
        content: '<p><em>Lyra posa sa main sur la pierre froide, sentant une vibration étrange sous ses doigts.</em></p>',
        is_first_post: false,
        created_at: now,
        updated_at: now,
      },
    ]);

    // Update topic counters
    const [topicPosts] = await queryInterface.sequelize.query(
      'SELECT topic_id, COUNT(*) as cnt, MAX(id) as last_id, MAX(created_at) as last_at FROM forum_posts WHERE deleted_at IS NULL GROUP BY topic_id'
    );
    for (const tp of topicPosts) {
      await queryInterface.sequelize.query(
        'UPDATE forum_topics SET post_count = ?, last_post_id = ?, last_post_at = ?, updated_at = ? WHERE id = ?',
        { replacements: [tp.cnt, tp.last_id, tp.last_at, now, tp.topic_id] }
      );
    }

    // Update category counters
    const [catStats] = await queryInterface.sequelize.query(`
      SELECT c.id,
        COUNT(DISTINCT t.id) as topic_cnt,
        COUNT(DISTINCT p.id) as post_cnt,
        MAX(p.id) as last_post_id
      FROM forum_categories c
      LEFT JOIN forum_topics t ON t.category_id = c.id AND t.deleted_at IS NULL
      LEFT JOIN forum_posts p ON p.topic_id = t.id AND p.deleted_at IS NULL
      WHERE c.deleted_at IS NULL
      GROUP BY c.id
    `);
    for (const cs of catStats) {
      await queryInterface.sequelize.query(
        'UPDATE forum_categories SET topic_count = ?, post_count = ?, last_post_id = ?, updated_at = ? WHERE id = ?',
        { replacements: [cs.topic_cnt, cs.post_cnt, cs.last_post_id, now, cs.id] }
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('forum_posts', null, {});
  },
};
