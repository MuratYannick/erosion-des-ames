'use strict';

// Slugs des sections parentes concernées
const FACTION_SLUGS = [
  'les-veilleurs-de-l-ancien-monde',
  'les-eclaireurs-de-l-aube-nouvelle',
];

const CLAN_SLUGS = [
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

// Nom court pour la sous-catégorie "Affaires Publiques" de chaque parent
const AFFAIRES_PUBLIQUES_NAMES = {
  // Factions
  'les-veilleurs-de-l-ancien-monde':       'Affaires Publiques des Veilleurs',
  'les-eclaireurs-de-l-aube-nouvelle':     'Affaires Publiques des Éclaireurs',
  // Veilleurs — clans
  'les-elus-de-l-avant':                   "Affaires Publiques des Élus de l'Avant",
  'le-clan-des-sentinelles':               'Affaires Publiques des Sentinelles',
  'le-clan-des-pourvoyeurs':               'Affaires Publiques des Pourvoyeurs',
  'le-clan-des-archivistes':               'Affaires Publiques des Archivistes',
  'le-clan-des-purificateurs':             'Affaires Publiques des Purificateurs',
  'le-clan-des-explorateurs':              'Affaires Publiques des Explorateurs',
  // Éclaireurs — castes
  'les-prophetes-de-l-harmonie':           "Affaires Publiques des Prophètes de l'Harmonie",
  'la-caste-des-symbiotes':                'Affaires Publiques des Symbiotes',
  'la-caste-des-sensitifs':                'Affaires Publiques des Sensitifs',
  'la-caste-des-forgerons-de-chair':       'Affaires Publiques des Forgerons de Chair',
  'la-caste-des-dechaines':                'Affaires Publiques des Déchainés',
  'la-caste-des-scrutateurs':              'Affaires Publiques des Scrutateurs',
  // Terres Abandonnées — clans neutres
  'les-fouilleurs-de-ruines':              'Affaires Publiques des Fouilleurs de Ruines',
  'les-vagabonds-du-vent':                 'Affaires Publiques des Vagabonds du Vent',
  'les-freres-de-la-terre-brulee':         'Affaires Publiques des Frères de la Terre Brûlée',
  'le-peuple-des-ombres':                  'Affaires Publiques du Peuple des Ombres',
  'les-collecteurs-de-chuchotis':          'Affaires Publiques des Collecteurs de Chuchotis',
  'les-loups-solitaires':                  'Affaires Publiques des Loups Solitaires',
  'les-devoreurs-d-ames':                  "Affaires Publiques des Dévoreurs d'Âmes",
  'le-sanctuaire-du-silence':              'Affaires Publiques du Sanctuaire du Silence',
};

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const allSlugs = [...FACTION_SLUGS, ...CLAN_SLUGS];

    const [parents] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM forum_categories
       WHERE slug IN (${allSlugs.map(() => '?').join(',')})
       AND deleted_at IS NULL`,
      { replacements: allSlugs }
    );

    // Pour les sections faction : décaler les clans existants (display_order += 1)
    // pour laisser la place à "Affaires Publiques" en position 0
    for (const slug of FACTION_SLUGS) {
      const parent = parents.find(p => p.slug === slug);
      if (!parent) continue;
      await queryInterface.sequelize.query(
        `UPDATE forum_categories
         SET display_order = display_order + 1
         WHERE parent_id = ? AND deleted_at IS NULL`,
        { replacements: [parent.id] }
      );
    }

    // Construire les nouvelles sous-catégories
    const rows = [];
    for (const slug of allSlugs) {
      const parent = parents.find(p => p.slug === slug);
      if (!parent) continue;
      const name = AFFAIRES_PUBLIQUES_NAMES[slug];
      rows.push({
        parent_id:     parent.id,
        name,
        slug:          generateSlug(name),
        description:   'Espace public — discussions et annonces visibles par tous.',
        icon:          null,
        display_order: 0,
        is_active:     true,
        is_rp:         true,
        topic_count:   0,
        post_count:    0,
        last_post_id:  null,
        created_at:    now,
        updated_at:    now,
      });
    }

    await queryInterface.bulkInsert('forum_categories', rows);
  },

  async down(queryInterface) {
    const slugs = Object.values(AFFAIRES_PUBLIQUES_NAMES).map(generateSlug);
    await queryInterface.sequelize.query(
      `DELETE FROM forum_categories WHERE slug IN (${slugs.map(() => '?').join(',')})`,
      { replacements: slugs }
    );

    // Restaurer les display_order des clans dans les sections faction
    const allSlugs = [...FACTION_SLUGS, ...CLAN_SLUGS];
    const [parents] = await queryInterface.sequelize.query(
      `SELECT id, slug FROM forum_categories
       WHERE slug IN (${FACTION_SLUGS.map(() => '?').join(',')})
       AND deleted_at IS NULL`,
      { replacements: FACTION_SLUGS }
    );
    for (const parent of parents) {
      await queryInterface.sequelize.query(
        `UPDATE forum_categories
         SET display_order = display_order - 1
         WHERE parent_id = ? AND deleted_at IS NULL`,
        { replacements: [parent.id] }
      );
    }
  },
};
