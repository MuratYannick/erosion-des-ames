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

    // Récupérer les clans
    const [clans] = await queryInterface.sequelize.query(
      'SELECT id, name FROM clans WHERE deleted_at IS NULL ORDER BY id ASC'
    );

    const sentinelles = clans.find(c => c.name === 'Le Clan des Sentinelles');
    const sensitifs = clans.find(c => c.name === 'La Caste des Sensitifs');
    const vagabonds = clans.find(c => c.name === 'Les Vagabonds du Vent');

    // Récupérer les utilisateurs
    const [users] = await queryInterface.sequelize.query(
      'SELECT id, username FROM users WHERE deleted_at IS NULL ORDER BY username ASC'
    );

    const adminUser = users.find(u => u.username === 'admin');
    const moderatorUser = users.find(u => u.username === 'moderator');
    const gamemasterUser = users.find(u => u.username === 'gamemaster');
    const player1User = users.find(u => u.username === 'player1');
    const player2User = users.find(u => u.username === 'player2');

    const adminId = adminUser ? adminUser.id : null;

    // Récupérer les clans sans faction pour varier
    const freresTerre = clans.find(c => c.name === 'Les Frères de la Terre Brûlée');

    await queryInterface.bulkInsert('characters', [
      // === Admin: 2 personnages ===
      // 1. faction + clan (Inaltéré / Veilleurs / Sentinelles)
      {
        user_id: adminId,
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        clan_id: sentinelles.id,
        name: 'Kael l\'Inaltéré',
        avatar: null,
        age: 35,
        appearance: null,
        personality: null,
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
      // 2. sans faction, sans clan (Éveillé)
      {
        user_id: adminId,
        ethnicity_id: eveilles.id,
        faction_id: null,
        clan_id: null,
        name: 'Orwen le Solitaire',
        avatar: null,
        age: 41,
        appearance: null,
        personality: null,
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

      // === Moderator: 1 personnage ===
      // faction + clan (Éveillé / Éclaireurs / Sensitifs)
      {
        user_id: moderatorUser ? moderatorUser.id : null,
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        clan_id: sensitifs.id,
        name: 'Thalia la Clairvoyante',
        avatar: null,
        age: 30,
        appearance: null,
        personality: null,
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

      // === Game Master: 1 personnage ===
      // faction, sans clan (Inaltéré / Veilleurs)
      {
        user_id: gamemasterUser ? gamemasterUser.id : null,
        ethnicity_id: inalteres.id,
        faction_id: veilleurs.id,
        clan_id: null,
        name: 'Draven le Chroniqueur',
        avatar: null,
        age: 55,
        appearance: null,
        personality: null,
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

      // === Player1: 2 personnages ===
      // 1. faction + clan (Éveillé / Éclaireurs / Sensitifs)
      {
        user_id: player1User ? player1User.id : null,
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        clan_id: sensitifs.id,
        name: 'Lyra des Brumes',
        avatar: null,
        age: 28,
        appearance: null,
        personality: null,
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
      // 2. sans faction, clan indépendant (Inaltéré / Vagabonds du Vent)
      {
        user_id: player1User ? player1User.id : null,
        ethnicity_id: inalteres.id,
        faction_id: null,
        clan_id: vagabonds.id,
        name: 'Fenris l\'Errant',
        avatar: null,
        age: 33,
        appearance: null,
        personality: null,
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

      // === Player2: 2 personnages ===
      // 1. sans faction, clan indépendant (Éveillé / Vagabonds) — draft
      {
        user_id: player2User ? player2User.id : null,
        ethnicity_id: eveilles.id,
        faction_id: null,
        clan_id: vagabonds.id,
        name: 'Zara l\'Éveillée',
        avatar: null,
        age: 22,
        appearance: null,
        personality: null,
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
      // 2. faction, sans clan (Éveillé / Éclaireurs)
      {
        user_id: player2User ? player2User.id : null,
        ethnicity_id: eveilles.id,
        faction_id: eclaireurs.id,
        clan_id: null,
        name: 'Mira l\'Audacieuse',
        avatar: null,
        age: 25,
        appearance: null,
        personality: null,
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

      // === PNJ (sans propriétaire): 1 personnage ===
      // sans faction, sans clan (Inaltéré)
      {
        user_id: null,
        ethnicity_id: inalteres.id,
        faction_id: null,
        clan_id: null,
        name: 'L\'Errant Sans Nom',
        avatar: null,
        age: null,
        appearance: null,
        personality: null,
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
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('characters', null, {});
  },
};
