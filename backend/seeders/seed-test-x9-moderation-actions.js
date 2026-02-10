'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // -------------------------------------------------------------------------
    // Fetch all the entities we need to reference
    // -------------------------------------------------------------------------
    const [users] = await queryInterface.sequelize.query(
      'SELECT id, username, role FROM users WHERE deleted_at IS NULL'
    );

    const admin     = users.find(u => u.username === 'admin');
    const moderator = users.find(u => u.username === 'moderator');
    const player1   = users.find(u => u.username === 'player1');
    const player2   = users.find(u => u.username === 'player2');
    const gm        = users.find(u => u.username === 'gamemaster');

    const [characters] = await queryInterface.sequelize.query(
      'SELECT id, name, user_id FROM characters WHERE deleted_at IS NULL'
    );
    // Zara is in 'draft' status — a good candidate for approve/reject actions
    const zara = characters.find(c => c.name === 'Zara l\'Éveillée');
    const lyra = characters.find(c => c.name === 'Lyra des Brumes');

    const [topics] = await queryInterface.sequelize.query(
      'SELECT id, slug FROM forum_topics WHERE deleted_at IS NULL'
    );
    const astuces  = topics.find(t => t.slug === 'astuces-pour-bien-debuter');
    const evenement = topics.find(t => t.slug === 'evenement-communautaire-du-mois');

    const [categories] = await queryInterface.sequelize.query(
      'SELECT id, name FROM forum_categories WHERE deleted_at IS NULL'
    );
    const discussions = categories.find(c => c.name === 'Discussions générales');

    // Retrieve the revoked ban sanction inserted by seeder x8 so we can
    // reference its id in the unban_user action.
    const [sanctions] = await queryInterface.sequelize.query(
      'SELECT id FROM user_sanctions WHERE user_id = ? AND is_active = 0 ORDER BY created_at ASC LIMIT 1',
      { replacements: [player1.id] }
    );
    const revokedSanction = sanctions[0] || null;

    // Retrieve the active ban sanction for the ban_user action reference.
    const [activeBans] = await queryInterface.sequelize.query(
      'SELECT id FROM user_sanctions WHERE user_id = ? AND is_active = 1 AND type = \'ban\' ORDER BY created_at ASC LIMIT 1',
      { replacements: [player1.id] }
    );
    const activeBan = activeBans[0] || null;

    // Retrieve the post report (if any) to reference in review_report
    const [reports] = await queryInterface.sequelize.query(
      'SELECT id FROM post_reports ORDER BY id ASC LIMIT 1'
    );
    const firstReport = reports[0] || null;

    // -------------------------------------------------------------------------
    // Build helper to create dates spread over the past 14 days.
    // Each action gets its own realistic timestamp so the audit log looks
    // like a genuine history rather than a bulk import done at a single moment.
    // -------------------------------------------------------------------------
    const daysAgo = (n, offsetHours = 0) => {
      const d = new Date(now);
      d.setDate(d.getDate() - n);
      d.setHours(d.getHours() - offsetHours);
      return d;
    };

    // -------------------------------------------------------------------------
    // 10 moderation actions spread over 2 weeks, ordered chronologically.
    // Oldest first so the IDs reflect the chronological order.
    // -------------------------------------------------------------------------
    await queryInterface.bulkInsert('moderation_actions', [

      // 1 — 14 days ago: admin revoked a previous ban on player1 (unban_user).
      //     This corresponds to the revoked sanction created in seeder x8.
      {
        action_type:    'unban_user',
        moderator_id:   admin.id,
        target_user_id: player1.id,
        target_id:      revokedSanction ? revokedSanction.id : null,
        target_type:    'user_sanction',
        reason:         'Joueur ayant reconnu ses torts et accepté de respecter les règles. Levée du bannissement à titre exceptionnel.',
        details:        JSON.stringify({ sanctionId: revokedSanction ? revokedSanction.id : null }),
        created_at:     daysAgo(14),
        updated_at:     daysAgo(14),
      },

      // 2 — 12 days ago: admin changed gamemaster's role from PLAYER to GAME_MASTER.
      {
        action_type:    'change_role',
        moderator_id:   admin.id,
        target_user_id: gm.id,
        target_id:      null,
        target_type:    'user',
        reason:         'Nomination officielle au poste de maître de jeu suite à l\'élection de la communauté.',
        details:        JSON.stringify({ oldRole: 'PLAYER', newRole: 'GAME_MASTER' }),
        created_at:     daysAgo(12),
        updated_at:     daysAgo(12),
      },

      // 3 — 10 days ago: admin approved Lyra's character sheet.
      {
        action_type:    'approve_character',
        moderator_id:   admin.id,
        target_user_id: player1.id,
        target_id:      lyra ? lyra.id : null,
        target_type:    'character',
        reason:         null,
        details:        JSON.stringify({ characterName: lyra ? lyra.name : null }),
        created_at:     daysAgo(10),
        updated_at:     daysAgo(10),
      },

      // 4 — 9 days ago: admin rejected Zara's character sheet with a reason.
      {
        action_type:    'reject_character',
        moderator_id:   admin.id,
        target_user_id: player2.id,
        target_id:      zara ? zara.id : null,
        target_type:    'character',
        reason:         'La fiche de personnage ne respecte pas le lore établi. Veuillez revoir l\'historique et les motivations du personnage.',
        details:        JSON.stringify({ characterName: zara ? zara.name : null }),
        created_at:     daysAgo(9),
        updated_at:     daysAgo(9),
      },

      // 5 — 8 days ago: admin pinned the "Événement communautaire" topic.
      {
        action_type:    'pin_topic',
        moderator_id:   admin.id,
        target_user_id: null,
        target_id:      evenement ? evenement.id : null,
        target_type:    'forum_topic',
        reason:         'Sujet épinglé pour mettre en avant l\'événement communautaire du mois.',
        details:        JSON.stringify({ topicSlug: 'evenement-communautaire-du-mois' }),
        created_at:     daysAgo(8),
        updated_at:     daysAgo(8),
      },

      // 6 — 7 days ago: moderator reviewed a post report.
      {
        action_type:    'review_report',
        moderator_id:   moderator.id,
        target_user_id: null,
        target_id:      firstReport ? firstReport.id : null,
        target_type:    'post_report',
        reason:         'Signalement examiné. Le message ne contrevient pas au règlement, aucune action supplémentaire requise.',
        details:        JSON.stringify({ verdict: 'dismissed', reportId: firstReport ? firstReport.id : null }),
        created_at:     daysAgo(7),
        updated_at:     daysAgo(7),
      },

      // 7 — 5 days ago: admin banned player1 (active permanent ban from seeder x8).
      {
        action_type:    'ban_user',
        moderator_id:   admin.id,
        target_user_id: player1.id,
        target_id:      activeBan ? activeBan.id : null,
        target_type:    'user_sanction',
        reason:         'Comportement toxique répété malgré plusieurs avertissements. Bannissement permanent appliqué.',
        details:        JSON.stringify({ sanctionType: 'ban', permanent: true }),
        created_at:     daysAgo(5),
        updated_at:     daysAgo(5),
      },

      // 8 — 3 days ago: moderator locked the "Astuces pour bien débuter" topic.
      {
        action_type:    'lock_topic',
        moderator_id:   moderator.id,
        target_user_id: null,
        target_id:      astuces ? astuces.id : null,
        target_type:    'forum_topic',
        reason:         'Sujet clôturé car les informations sont désormais obsolètes. Un nouveau sujet sera créé.',
        details:        JSON.stringify({ topicSlug: 'astuces-pour-bien-debuter' }),
        created_at:     daysAgo(3),
        updated_at:     daysAgo(3),
      },

      // 9 — 1 day ago: admin muted player2 (active mute from seeder x8).
      {
        action_type:    'mute_user',
        moderator_id:   admin.id,
        target_user_id: player2.id,
        target_id:      null,
        target_type:    'user_sanction',
        reason:         'Propos inappropriés dans les fils de jeu de rôle. Mise en sourdine temporaire de 7 jours.',
        details:        JSON.stringify({ durationDays: 7, sanctionType: 'mute' }),
        created_at:     daysAgo(1),
        updated_at:     daysAgo(1),
      },

      // 10 — Today: admin edited the "Discussions générales" forum category.
      {
        action_type:    'edit_category',
        moderator_id:   admin.id,
        target_user_id: null,
        target_id:      discussions ? discussions.id : null,
        target_type:    'forum_category',
        reason:         null,
        details:        JSON.stringify({
          categoryName: 'Discussions générales',
          changes: { description: 'Mise à jour de la description de la catégorie.' },
        }),
        created_at:     now,
        updated_at:     now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('moderation_actions', null, {});
  },
};
