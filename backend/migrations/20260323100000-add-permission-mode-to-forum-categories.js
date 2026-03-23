'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('forum_categories', 'permission_mode', {
      type: Sequelize.ENUM('inherit', 'override'),
      allowNull: false,
      defaultValue: 'inherit',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('forum_categories', 'permission_mode');
    await queryInterface.sequelize.query(
      "DROP TYPE IF EXISTS enum_forum_categories_permission_mode"
    );
  },
};
