'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // -------------------------------------------------------------------------
    // Fetch users needed for the sanctions
    // -------------------------------------------------------------------------
    const [users] = await queryInterface.sequelize.query(
      'SELECT id, username FROM users WHERE deleted_at IS NULL'
    );

    const admin   = users.find(u => u.username === 'admin');
    const player1 = users.find(u => u.username === 'player1');
    const player2 = users.find(u => u.username === 'player2');

    // -------------------------------------------------------------------------
    // Build anchor dates relative to "now" so the data stays coherent
    // regardless of when the seeder is executed.
    // -------------------------------------------------------------------------
    const daysAgo = (n) => {
      const d = new Date(now);
      d.setDate(d.getDate() - n);
      return d;
    };

    const daysFromNow = (n) => {
      const d = new Date(now);
      d.setDate(d.getDate() + n);
      return d;
    };

    // Sanction 1 — Active permanent ban on player1
    //   Started 5 days ago, no expiry, still active.
    const activeBanStartsAt = daysAgo(5);

    // Sanction 2 — Active temporary mute on player2
    //   Started yesterday, expires in 7 days.
    const activeMuteStartsAt = daysAgo(1);
    const activeMuteExpiresAt = daysFromNow(7);

    // Sanction 3 — Revoked permanent ban on player1
    //   Issued 2 weeks ago, was permanent, but revoked 1 week ago.
    const revokedBanStartsAt = daysAgo(14);
    const revokedBanRevokedAt = daysAgo(7);

    // Deactivate player1 account since they have an active permanent ban
    await queryInterface.sequelize.query(
      'UPDATE users SET is_active = false WHERE id = ?',
      { replacements: [player1.id] }
    );

    await queryInterface.bulkInsert('user_sanctions', [
      // ------------------------------------------------------------------
      // 1. Active permanent ban — player1 is permanently banned
      // ------------------------------------------------------------------
      {
        user_id:    player1.id,
        type:       'ban',
        reason:     'Comportement toxique répété envers les autres membres de la communauté malgré plusieurs avertissements préalables.',
        issued_by:  admin.id,
        starts_at:  activeBanStartsAt,
        expires_at: null,
        is_active:  true,
        revoked_by: null,
        revoked_at: null,
        created_at: activeBanStartsAt,
        updated_at: activeBanStartsAt,
      },

      // ------------------------------------------------------------------
      // 2. Active temporary mute — player2 is muted for 7 days
      // ------------------------------------------------------------------
      {
        user_id:    player2.id,
        type:       'mute',
        reason:     'Propos inappropriés et hors-sujet dans les fils de discussion de jeu de rôle. Silence temporaire de 7 jours.',
        issued_by:  admin.id,
        starts_at:  activeMuteStartsAt,
        expires_at: activeMuteExpiresAt,
        is_active:  true,
        revoked_by: null,
        revoked_at: null,
        created_at: activeMuteStartsAt,
        updated_at: activeMuteStartsAt,
      },

      // ------------------------------------------------------------------
      // 3. Revoked permanent ban — player1 had a previous ban that was lifted
      //    This record demonstrates the audit trail: the ban existed, was
      //    permanent (no expires_at), but was manually revoked by the admin.
      // ------------------------------------------------------------------
      {
        user_id:    player1.id,
        type:       'ban',
        reason:     'Partage de contenu non autorisé et violation des règles de propriété intellectuelle du forum.',
        issued_by:  admin.id,
        starts_at:  revokedBanStartsAt,
        expires_at: null,
        is_active:  false,
        revoked_by: admin.id,
        revoked_at: revokedBanRevokedAt,
        created_at: revokedBanStartsAt,
        updated_at: revokedBanRevokedAt,
      },
    ]);
  },

  async down(queryInterface) {
    // Restore is_active for all users before deleting sanctions
    await queryInterface.sequelize.query(
      'UPDATE users SET is_active = true WHERE is_active = false AND deleted_at IS NULL'
    );
    await queryInterface.bulkDelete('user_sanctions', null, {});
  },
};
