'use strict';

// Les personnages issus de clans mixtes (sans ethnie définie) n'ont pas d'ethnicity_id.
// Cette migration rend la colonne nullable pour refléter cette réalité.

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('characters', 'ethnicity_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('characters', 'ethnicity_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
