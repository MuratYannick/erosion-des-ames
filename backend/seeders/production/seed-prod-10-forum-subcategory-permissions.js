'use strict';

// ─── Slugs ────────────────────────────────────────────────────────────────────

const FACTION_SECTION_SLUGS = [
  'les-veilleurs-de-l-ancien-monde',
  'les-eclaireurs-de-l-aube-nouvelle',
];

const CLAN_SECTION_SLUGS = [
  // Veilleurs
  'les-elus-de-l-avant',
  'le-clan-des-sentinelles',
  'le-clan-des-pourvoyeurs',
  'le-clan-des-archivistes',
  'le-clan-des-purificateurs',
  'le-clan-des-explorateurs',
  // Éclaireurs
  'les-prophetes-de-l-harmonie',
  'la-caste-des-symbiotes',
  'la-caste-des-sensitifs',
  'la-caste-des-forgerons-de-chair',
  'la-caste-des-dechaines',
  'la-caste-des-scrutateurs',
  // Terres Abandonnées
  'les-fouilleurs-de-ruines',
  'les-vagabonds-du-vent',
  'les-freres-de-la-terre-brulee',
  'le-peuple-des-ombres',
  'les-collecteurs-de-chuchotis',
  'les-loups-solitaires',
  'les-devoreurs-d-ames',
  'le-sanctuaire-du-silence',
];

const AFFAIRES_PUBLIQUES_SLUGS = [
  // Faction-level
  'affaires-publiques-des-veilleurs',
  'affaires-publiques-des-eclaireurs',
  // Veilleurs — clans
  'affaires-publiques-des-elus-de-l-avant',
  'affaires-publiques-des-sentinelles',
  'affaires-publiques-des-pourvoyeurs',
  'affaires-publiques-des-archivistes',
  'affaires-publiques-des-purificateurs',
  'affaires-publiques-des-explorateurs',
  // Éclaireurs — castes
  'affaires-publiques-des-prophetes-de-l-harmonie',
  'affaires-publiques-des-symbiotes',
  'affaires-publiques-des-sensitifs',
  'affaires-publiques-des-forgerons-de-chair',
  'affaires-publiques-des-dechaines',
  'affaires-publiques-des-scrutateurs',
  // Terres Abandonnées — clans neutres
  'affaires-publiques-des-fouilleurs-de-ruines',
  'affaires-publiques-des-vagabonds-du-vent',
  'affaires-publiques-des-freres-de-la-terre-brulee',
  'affaires-publiques-du-peuple-des-ombres',
  'affaires-publiques-des-collecteurs-de-chuchotis',
  'affaires-publiques-des-loups-solitaires',
  'affaires-publiques-des-devoreurs-d-ames',
  'affaires-publiques-du-sanctuaire-du-silence',
];

// Correspondance slug forum_category → nom de la faction
const FACTION_SECTION_TO_FACTION_NAME = {
  'les-veilleurs-de-l-ancien-monde':   "Les Veilleurs de l'Ancien Monde",
  'les-eclaireurs-de-l-aube-nouvelle': "Les Éclaireurs de l'Aube Nouvelle",
};

// Correspondance slug forum_category → nom du clan
const CLAN_SECTION_TO_CLAN_NAME = {
  'les-elus-de-l-avant':                 "Les Élus de l'Avant",
  'le-clan-des-sentinelles':             'Le Clan des Sentinelles',
  'le-clan-des-pourvoyeurs':             'Le Clan des Pourvoyeurs',
  'le-clan-des-archivistes':             'Le Clan des Archivistes',
  'le-clan-des-purificateurs':           'Le Clan des Purificateurs',
  'le-clan-des-explorateurs':            'Le Clan des Explorateurs',
  'les-prophetes-de-l-harmonie':         "Les Prophètes de l'Harmonie",
  'la-caste-des-symbiotes':              'La Caste des Symbiotes',
  'la-caste-des-sensitifs':              'La Caste des Sensitifs',
  'la-caste-des-forgerons-de-chair':     'La Caste des Forgerons de Chair',
  'la-caste-des-dechaines':              "La Caste des Déchainés",
  'la-caste-des-scrutateurs':            'La Caste des Scrutateurs',
  'les-fouilleurs-de-ruines':            'Les Fouilleurs de Ruines',
  'les-vagabonds-du-vent':               'Les Vagabonds du Vent',
  'les-freres-de-la-terre-brulee':       'Les Frères de la Terre Brûlée',
  'le-peuple-des-ombres':                'Le Peuple des Ombres',
  'les-collecteurs-de-chuchotis':        'Les Collecteurs de Chuchotis',
  'les-loups-solitaires':                'Les Loups Solitaires',
  'les-devoreurs-d-ames':                "Les Dévoreurs d'Âmes",
  'le-sanctuaire-du-silence':            'Le Sanctuaire du Silence',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rows(categoryId, permission, grantees, now) {
  return grantees.map(([granteeType, granteeId = null]) => ({
    category_id:  categoryId,
    permission,
    grantee_type: granteeType,
    grantee_id:   granteeId !== null ? String(granteeId) : null,
    created_at:   now,
    updated_at:   now,
  }));
}

// Permissions complètes pour une section avec accès restreint (override)
// grantees : tableau de [granteeType, granteeId?] autorisés à accéder + poster
function buildRestrictedPermissions(categoryId, grantees, now) {
  const staffOnly  = [['moderator'], ['game_master']];
  const allGrantees = [...staffOnly, ...grantees];

  return [
    ...rows(categoryId, 'access_category', allGrantees, now),
    ...rows(categoryId, 'create_topic',    allGrantees, now),
    ...rows(categoryId, 'edit_topic',      staffOnly,   now),
    ...rows(categoryId, 'move_topic',      staffOnly,   now),
    ...rows(categoryId, 'merge_topic',     staffOnly,   now),
    ...rows(categoryId, 'move_category',   staffOnly,   now),
  ];
}

// Permissions pour les Affaires Publiques (override, ouvertes à player_with_character)
function buildAffairesPubliquesPermissions(categoryId, now) {
  const staffAndPlayers = [['moderator'], ['game_master'], ['player_with_character']];
  const staffOnly       = [['moderator'], ['game_master']];

  return [
    ...rows(categoryId, 'access_category', staffAndPlayers, now),
    ...rows(categoryId, 'create_topic',    staffAndPlayers, now),
    ...rows(categoryId, 'edit_topic',      staffOnly,       now),
    ...rows(categoryId, 'move_topic',      staffOnly,       now),
    ...rows(categoryId, 'merge_topic',     staffOnly,       now),
    ...rows(categoryId, 'move_category',   staffOnly,       now),
  ];
}

// ─── Seeder ───────────────────────────────────────────────────────────────────

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // ── 1. Récupérer toutes les catégories concernées ─────────────────────────
    const allSlugs = [
      'annonces',
      'discussions-autour-du-jeu',
      'discussions-libres',
      ...FACTION_SECTION_SLUGS,
      ...CLAN_SECTION_SLUGS,
      ...AFFAIRES_PUBLIQUES_SLUGS,
    ];

    const placeholders = allSlugs.map(() => '?').join(',');
    const [categories] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM forum_categories
       WHERE slug IN (${placeholders}) AND deleted_at IS NULL`,
      { replacements: allSlugs }
    );

    const bySlug = Object.fromEntries(categories.map(c => [c.slug, c]));

    // ── 2. Récupérer les factions ─────────────────────────────────────────────
    const factionNames = Object.values(FACTION_SECTION_TO_FACTION_NAME);
    const [factions] = await queryInterface.sequelize.query(
      `SELECT id, name FROM factions
       WHERE name IN (${factionNames.map(() => '?').join(',')}) AND deleted_at IS NULL`,
      { replacements: factionNames }
    );
    const factionByName = Object.fromEntries(factions.map(f => [f.name, f]));

    // ── 3. Récupérer les clans ────────────────────────────────────────────────
    const clanNames = Object.values(CLAN_SECTION_TO_CLAN_NAME);
    const [clans] = await queryInterface.sequelize.query(
      `SELECT id, name FROM clans
       WHERE name IN (${clanNames.map(() => '?').join(',')}) AND deleted_at IS NULL`,
      { replacements: clanNames }
    );
    const clanByName = Object.fromEntries(clans.map(c => [c.name, c]));

    // ── 4. Permissions de la sous-catégorie Annonces ──────────────────────────
    const annonces = bySlug['annonces'];
    const permissionsToInsert = [];

    if (annonces) {
      const modOnly = [['moderator']];
      const modGm   = [['moderator'], ['game_master']];
      permissionsToInsert.push(
        ...rows(annonces.id, 'edit_category',    modOnly, now),
        ...rows(annonces.id, 'create_subcategory', modOnly, now),
        ...rows(annonces.id, 'move_category',    modOnly, now),
        ...rows(annonces.id, 'create_topic',     modGm,   now),
        ...rows(annonces.id, 'edit_topic',       modOnly, now),
        ...rows(annonces.id, 'move_topic',       modOnly, now),
        ...rows(annonces.id, 'merge_topic',      modOnly, now),
      );
    }

    // ── 5. Permissions Discussions (edit_category + create_subcategory mod) ───
    for (const slug of ['discussions-autour-du-jeu', 'discussions-libres']) {
      const cat = bySlug[slug];
      if (!cat) continue;
      const modOnly = [['moderator']];
      permissionsToInsert.push(
        ...rows(cat.id, 'edit_category',    modOnly, now),
        ...rows(cat.id, 'create_subcategory', modOnly, now),
      );
    }

    // ── 6. Sections faction → override + permissions par faction ─────────────
    const factionSectionIds = [];
    for (const slug of FACTION_SECTION_SLUGS) {
      const cat     = bySlug[slug];
      const faction = factionByName[FACTION_SECTION_TO_FACTION_NAME[slug]];
      if (!cat || !faction) continue;

      factionSectionIds.push(cat.id);
      permissionsToInsert.push(
        ...buildRestrictedPermissions(cat.id, [['player_character_faction', faction.id]], now)
      );
    }

    // ── 7. Sections clan → override + permissions par clan ───────────────────
    const clanSectionIds = [];
    for (const slug of CLAN_SECTION_SLUGS) {
      const cat  = bySlug[slug];
      const clan = clanByName[CLAN_SECTION_TO_CLAN_NAME[slug]];
      if (!cat || !clan) continue;

      clanSectionIds.push(cat.id);
      permissionsToInsert.push(
        ...buildRestrictedPermissions(cat.id, [['player_character_clan', clan.id]], now)
      );
    }

    // ── 8. Affaires Publiques → override + player_with_character ─────────────
    const affairesPubliquesIds = [];
    for (const slug of AFFAIRES_PUBLIQUES_SLUGS) {
      const cat = bySlug[slug];
      if (!cat) continue;

      affairesPubliquesIds.push(cat.id);
      permissionsToInsert.push(
        ...buildAffairesPubliquesPermissions(cat.id, now)
      );
    }

    // ── 9. Appliquer permission_mode = 'override' ─────────────────────────────
    const overrideIds = [...factionSectionIds, ...clanSectionIds, ...affairesPubliquesIds];
    if (overrideIds.length > 0) {
      await queryInterface.sequelize.query(
        `UPDATE forum_categories SET permission_mode = 'override'
         WHERE id IN (${overrideIds.map(() => '?').join(',')})`,
        { replacements: overrideIds }
      );
    }

    // ── 10. Insérer toutes les permissions ────────────────────────────────────
    if (permissionsToInsert.length > 0) {
      await queryInterface.bulkInsert('category_permissions', permissionsToInsert);
    }
  },

  async down(queryInterface) {
    const allSlugs = [
      'annonces',
      'discussions-autour-du-jeu',
      'discussions-libres',
      ...FACTION_SECTION_SLUGS,
      ...CLAN_SECTION_SLUGS,
      ...AFFAIRES_PUBLIQUES_SLUGS,
    ];

    const placeholders = allSlugs.map(() => '?').join(',');
    const [categories] = await queryInterface.sequelize.query(
      `SELECT id FROM forum_categories
       WHERE slug IN (${placeholders}) AND deleted_at IS NULL`,
      { replacements: allSlugs }
    );
    const ids = categories.map(c => c.id);
    if (ids.length === 0) return;

    // Supprimer les permissions
    await queryInterface.sequelize.query(
      `DELETE FROM category_permissions WHERE category_id IN (${ids.map(() => '?').join(',')})`,
      { replacements: ids }
    );

    // Remettre permission_mode à inherit
    const overrideSlugs = [...FACTION_SECTION_SLUGS, ...CLAN_SECTION_SLUGS, ...AFFAIRES_PUBLIQUES_SLUGS];
    const overridePlaceholders = overrideSlugs.map(() => '?').join(',');
    await queryInterface.sequelize.query(
      `UPDATE forum_categories SET permission_mode = 'inherit'
       WHERE slug IN (${overridePlaceholders})`,
      { replacements: overrideSlugs }
    );
  },
};
