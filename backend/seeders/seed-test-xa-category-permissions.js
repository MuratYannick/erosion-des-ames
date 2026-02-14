'use strict';

/**
 * Seeder pour les permissions de catégories du forum
 *
 * Structure des permissions:
 * - access_category: Qui peut voir la catégorie
 * - edit_category: Qui peut modifier la catégorie (nom, description, etc.)
 * - create_subcategory: Qui peut créer des sous-catégories
 * - move_category: Qui peut déplacer la catégorie
 * - create_topic: Qui peut créer des sujets dans cette catégorie
 * - edit_topic: Qui peut modifier des sujets
 * - move_topic: Qui peut déplacer des sujets
 * - merge_topic: Qui peut fusionner des sujets
 *
 * Grantee types disponibles:
 * - public: Tout le monde (y compris non connectés)
 * - player: Joueur connecté
 * - player_accepted_rules: Joueur ayant accepté le règlement
 * - player_with_character: Joueur possédant un personnage
 * - player_character_faction: Joueur dont le personnage appartient à une faction (grantee_id requis)
 * - player_character_clan: Joueur dont le personnage appartient à un clan (grantee_id requis)
 * - game_master: MJ
 * - moderator: Modérateur
 */

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // ============================================================
    // 1. RÉCUPÉRATION DES CATÉGORIES
    // ============================================================
    const [categories] = await queryInterface.sequelize.query(
      'SELECT id, name FROM forum_categories WHERE deleted_at IS NULL'
    );

    const catMap = {};
    categories.forEach(cat => {
      catMap[cat.name] = cat.id;
    });

    // ============================================================
    // 2. RÉCUPÉRATION DES FACTIONS
    // ============================================================
    const [factions] = await queryInterface.sequelize.query(
      "SELECT id, name FROM factions WHERE deleted_at IS NULL AND name IN ('Les Veilleurs de l\\'Ancien Monde', 'Les Éclaireurs de l\\'Aube Nouvelle')"
    );

    const factionMap = {};
    factions.forEach(faction => {
      factionMap[faction.name] = faction.id.toString();
    });

    // ============================================================
    // 3. RÉCUPÉRATION DES CLANS
    // ============================================================
    const [clans] = await queryInterface.sequelize.query(
      "SELECT id, name FROM clans WHERE deleted_at IS NULL AND name IN ('Les Vagabonds du Vent', 'Les Frères de la Terre Brûlée', 'Le Peuple des Ombres')"
    );

    const clanMap = {};
    clans.forEach(clan => {
      clanMap[clan.name] = clan.id.toString();
    });

    // ============================================================
    // 4. HELPERS
    // ============================================================
    const permissions = [];

    const addPermission = (categoryName, permission, granteeType, granteeId = null) => {
      const categoryId = catMap[categoryName];
      if (!categoryId) {
        console.warn(`Warning: Category "${categoryName}" not found, skipping permission`);
        return;
      }

      permissions.push({
        category_id: categoryId,
        permission,
        grantee_type: granteeType,
        grantee_id: granteeId,
        created_at: now,
        updated_at: now,
      });
    };

    const addMultiple = (categoryName, permission, granteeTypes) => {
      granteeTypes.forEach(granteeType => {
        addPermission(categoryName, permission, granteeType);
      });
    };

    // ============================================================
    // 5. ACCESS_CATEGORY
    // ============================================================
    // Général → public (enfants héritent: Annonces, Règlement, Infos)
    addPermission('Général', 'access_category', 'public');

    // Hors Role-Play → player + game_master + moderator
    addMultiple('Hors Role-Play', 'access_category', ['player', 'game_master', 'moderator']);

    // Role-Play → player_with_character + game_master + moderator (enfants héritent)
    addMultiple('Role-Play', 'access_category', ['player_with_character', 'game_master', 'moderator']);

    // ============================================================
    // 6. EDIT_CATEGORY
    // ============================================================
    // 10 catégories RP feuilles → moderator + game_master
    const editCategoryLeaves = [
      'Les Élus de l\'Avant',
      'Le Clan des Sentinelles',
      'Les Portes de l\'Empalé',
      'Les Prophètes de l\'Harmonie',
      'La Caste des Sensitifs',
      'La Fosse de la Lapidation',
      'Les Vagabonds du Vent',
      'Les Frères de la Terre Brûlée',
      'Le Peuple des Ombres',
      'Les Terres Sauvages',
    ];

    editCategoryLeaves.forEach(catName => {
      addMultiple(catName, 'edit_category', ['game_master', 'moderator']);
    });

    // ============================================================
    // 7. CREATE_SUBCATEGORY
    // ============================================================
    // moderator (4 catégories)
    ['Annonces', 'Discussions autour du jeu', 'Discussions libres', 'Role-Play'].forEach(catName => {
      addPermission(catName, 'create_subcategory', 'moderator');
    });

    // game_master (3 catégories)
    ['Les Veilleurs de l\'Ancien Monde', 'Les Éclaireurs de l\'Aube Nouvelle', 'Les Terres Abandonnées'].forEach(catName => {
      addPermission(catName, 'create_subcategory', 'game_master');
    });

    // ============================================================
    // 8. MOVE_CATEGORY
    // ============================================================
    // moderator (5 catégories)
    ['Annonces', 'Informations officielles', 'Discussions autour du jeu', 'Discussions libres', 'Role-Play'].forEach(catName => {
      addPermission(catName, 'move_category', 'moderator');
    });

    // game_master AND moderator (3 catégories, 6 rows total)
    ['Les Veilleurs de l\'Ancien Monde', 'Les Éclaireurs de l\'Aube Nouvelle', 'Les Terres Abandonnées'].forEach(catName => {
      addPermission(catName, 'move_category', 'game_master');
      addPermission(catName, 'move_category', 'moderator');
    });

    // ============================================================
    // 9. CREATE_TOPIC
    // ============================================================
    // Informations officielles → moderator
    addPermission('Informations officielles', 'create_topic', 'moderator');

    // Annonces → game_master + moderator
    addMultiple('Annonces', 'create_topic', ['game_master', 'moderator']);

    // Hors Role-Play → game_master + moderator
    addMultiple('Hors Role-Play', 'create_topic', ['game_master', 'moderator']);

    // Role-Play → game_master + moderator
    addMultiple('Role-Play', 'create_topic', ['game_master', 'moderator']);

    // Discussions autour du jeu → player_accepted_rules
    addPermission('Discussions autour du jeu', 'create_topic', 'player_accepted_rules');

    // Discussions libres → player_accepted_rules
    addPermission('Discussions libres', 'create_topic', 'player_accepted_rules');

    // Factions (player_character_faction avec grantee_id)
    addPermission(
      'Les Veilleurs de l\'Ancien Monde',
      'create_topic',
      'player_character_faction',
      factionMap['Les Veilleurs de l\'Ancien Monde']
    );

    addPermission(
      'Les Éclaireurs de l\'Aube Nouvelle',
      'create_topic',
      'player_character_faction',
      factionMap['Les Éclaireurs de l\'Aube Nouvelle']
    );

    // Clans (player_character_clan avec grantee_id)
    addPermission(
      'Les Vagabonds du Vent',
      'create_topic',
      'player_character_clan',
      clanMap['Les Vagabonds du Vent']
    );

    addPermission(
      'Les Frères de la Terre Brûlée',
      'create_topic',
      'player_character_clan',
      clanMap['Les Frères de la Terre Brûlée']
    );

    addPermission(
      'Le Peuple des Ombres',
      'create_topic',
      'player_character_clan',
      clanMap['Le Peuple des Ombres']
    );

    // Catégories ouvertes à tous les joueurs avec personnage
    ['Les Portes de l\'Empalé', 'La Fosse de la Lapidation', 'Les Terres Sauvages'].forEach(catName => {
      addPermission(catName, 'create_topic', 'player_with_character');
    });

    // ============================================================
    // 10. EDIT_TOPIC
    // ============================================================
    // moderator (3 catégories)
    ['Annonces', 'Informations officielles', 'Hors Role-Play'].forEach(catName => {
      addPermission(catName, 'edit_topic', 'moderator');
    });

    // Role-Play → game_master + moderator
    addMultiple('Role-Play', 'edit_topic', ['game_master', 'moderator']);

    // ============================================================
    // 11. MOVE_TOPIC
    // ============================================================
    // moderator (4 catégories)
    ['Annonces', 'Informations officielles', 'Hors Role-Play', 'Role-Play'].forEach(catName => {
      addPermission(catName, 'move_topic', 'moderator');
    });

    // ============================================================
    // 12. MERGE_TOPIC
    // ============================================================
    // moderator (4 catégories)
    ['Annonces', 'Informations officielles', 'Hors Role-Play', 'Role-Play'].forEach(catName => {
      addPermission(catName, 'merge_topic', 'moderator');
    });

    // ============================================================
    // 13. INSERTION
    // ============================================================
    await queryInterface.bulkInsert('category_permissions', permissions);

    console.log(`✓ Inserted ${permissions.length} category permissions`);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('category_permissions', null, {});
  },
};
