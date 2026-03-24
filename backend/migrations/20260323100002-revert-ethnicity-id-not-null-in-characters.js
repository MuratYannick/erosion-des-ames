'use strict';

// Rétablit ethnicity_id NOT NULL dans characters.
// La migration 20260323100001 l'avait rendu nullable par erreur :
// les personnages de clans mixtes ont toujours une ethnie personnelle.
// Le bon endroit pour le null est clans.ethnicity_id (clan sans ethnie fixe).
// MySQL bloque changeColumn sur une colonne avec FK → drop/recreate la contrainte.

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('characters', 'characters_ibfk_2');
    await queryInterface.changeColumn('characters', 'ethnicity_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.addConstraint('characters', {
      fields: ['ethnicity_id'],
      type: 'foreign key',
      name: 'characters_ibfk_2',
      references: { table: 'ethnicities', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('characters', 'characters_ibfk_2');
    await queryInterface.changeColumn('characters', 'ethnicity_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addConstraint('characters', {
      fields: ['ethnicity_id'],
      type: 'foreign key',
      name: 'characters_ibfk_2',
      references: { table: 'ethnicities', field: 'id' },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });
  },
};
