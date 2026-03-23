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

    // Récupérer l'admin pour approved_by
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE role = 'ADMIN' AND deleted_at IS NULL LIMIT 1"
    );

    const adminId = users.length > 0 ? users[0].id : null;

    await queryInterface.bulkInsert('factions', [
      {
        ethnicity_id: inalteres.id,
        name: 'Les Veilleurs de l\'Ancien Monde',
        emblem: null,
        is_playable: true,
        background: 'La faction des Veilleurs ne jure que par les anciens savoirs oubliés : la technologie. C\'est le seul moyen de reprendre le dessus sur cette nature dégénérée devenue hostile. Pour eux, les mutants font partie de cette dégénérescence et doivent tous être exterminés avant qu\'ils contaminent les rares humains encore purs qu\'ils sont. Les clans neutres mixtes sont considérés comme une abomination et, au mieux, pour les clans neutres dont les membres sont de leur ethnie, ils sont considérés comme des parias. Ce qui ne les empêche pas de les utiliser quand ça les arrange (trocs, renseignements, mercenariat, etc.).',
        goals: 'Leur objectif principal reste l\'éradication totale des Éveillés. Ils se sont également donné pour mission de récupérer le savoir technologique perdu. Lors de leurs expéditions, il n\'est pas rare de les voir ramener un composant mécanique ou électronique qu\'ils exposeront tel une relique d\'antan, espérant en percer un jour le secret.',
        status: 'approved',
        rejection_reason: null,
        is_active: true,
        approved_at: now,
        approved_by: adminId,
        created_at: now,
        updated_at: now,
      },
      {
        ethnicity_id: eveilles.id,
        name: 'Les Éclaireurs de l\'Aube Nouvelle',
        emblem: null,
        is_playable: true,
        background: 'La faction des Éclaireurs ne jure que par l\'ordre de la nature : ils n\'ont pas muté, ils ont évolué. Le grand cataclysme a été lancé par leur dieu pour purifier la terre de l\'homme et de sa technologie, responsable de la destruction de la nature. Pour eux, ils sont les élus et tous les non-mutants doivent périr. Les clans neutres mixtes sont considérés comme une abomination et, au mieux, pour les clans neutres dont les membres sont de leur ethnie, ils sont considérés comme des parias. Ce qui ne les empêche pas de les utiliser quand ça les arrange (trocs, renseignements, mercenariat, etc.).',
        goals: 'Leur objectif principal reste l\'éradication totale des Inaltérés. Ils ont également une vision mystique de leur environnement. Lors de leurs expéditions, il n\'est pas rare de les voir se rassembler dans certains lieux pour procéder à des cérémonies étranges ou à des sacrifices, dont ils ramèneront quelques ossements qu\'ils exposeront dans leur temple tel une relique.',
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
    await queryInterface.bulkDelete('factions', null, {});
  },
};
