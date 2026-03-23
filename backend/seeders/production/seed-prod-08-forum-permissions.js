'use strict';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    const [categories] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM forum_categories
       WHERE slug IN ('general', 'hors-role-play', 'role-play')
       AND deleted_at IS NULL`
    );

    const general  = categories.find(c => c.slug === 'general');
    const horsRp   = categories.find(c => c.slug === 'hors-role-play');
    const rolePlay = categories.find(c => c.slug === 'role-play');

    const row = (categoryId, permission, granteeType, granteeId = null) => ({
      category_id:  categoryId,
      permission,
      grantee_type: granteeType,
      grantee_id:   granteeId,
      created_at:   now,
      updated_at:   now,
    });

    await queryInterface.bulkInsert('category_permissions', [

      // ── Général ──────────────────────────────────────────────────────────────
      // Lecture publique — tout le reste est admin uniquement (implicite dans le service)
      row(general.id, 'access_category', 'public'),

      // ── Hors Role-Play ───────────────────────────────────────────────────────
      // Lecture : tout joueur connecté (inclut PLAYER, GAME_MASTER, MODERATOR)
      row(horsRp.id, 'access_category', 'player'),

      // Déplacement de catégorie : modérateur
      row(horsRp.id, 'move_category', 'moderator'),

      // Création de topic : modérateur, game master, joueur ayant accepté le règlement
      row(horsRp.id, 'create_topic', 'moderator'),
      row(horsRp.id, 'create_topic', 'game_master'),
      row(horsRp.id, 'create_topic', 'player_accepted_rules'),

      // Édition de topic : modérateur (l'auteur est géré dans forumTopicController)
      row(horsRp.id, 'edit_topic', 'moderator'),

      // Déplacement et fusion de topics : modérateur
      row(horsRp.id, 'move_topic',  'moderator'),
      row(horsRp.id, 'merge_topic', 'moderator'),

      // ── Role-Play ────────────────────────────────────────────────────────────
      // Lecture : modérateur et game master sans personnage, joueur avec personnage actif
      row(rolePlay.id, 'access_category', 'moderator'),
      row(rolePlay.id, 'access_category', 'game_master'),
      row(rolePlay.id, 'access_category', 'player_with_character'),

      // Déplacement de catégorie : modérateur, game master
      row(rolePlay.id, 'move_category', 'moderator'),
      row(rolePlay.id, 'move_category', 'game_master'),

      // Création de topic : modérateur, game master, joueur avec personnage actif
      row(rolePlay.id, 'create_topic', 'moderator'),
      row(rolePlay.id, 'create_topic', 'game_master'),
      row(rolePlay.id, 'create_topic', 'player_with_character'),

      // Édition de topic : modérateur, game master (l'auteur est géré dans forumTopicController)
      row(rolePlay.id, 'edit_topic', 'moderator'),
      row(rolePlay.id, 'edit_topic', 'game_master'),

      // Déplacement et fusion de topics : modérateur, game master
      row(rolePlay.id, 'move_topic',  'moderator'),
      row(rolePlay.id, 'move_topic',  'game_master'),
      row(rolePlay.id, 'merge_topic', 'moderator'),
      row(rolePlay.id, 'merge_topic', 'game_master'),

    ]);
  },

  async down(queryInterface) {
    const [categories] = await queryInterface.sequelize.query(
      `SELECT id FROM forum_categories
       WHERE slug IN ('general', 'hors-role-play', 'role-play')
       AND deleted_at IS NULL`
    );
    const ids = categories.map(c => c.id);
    if (ids.length === 0) return;

    await queryInterface.sequelize.query(
      `DELETE FROM category_permissions WHERE category_id IN (${ids.join(',')})`
    );
  },
};
