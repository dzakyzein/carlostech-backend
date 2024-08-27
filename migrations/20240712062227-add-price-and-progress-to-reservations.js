'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reservations', 'price', {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn('Reservations', 'progress', {
      type: Sequelize.ENUM('0%', '25%', '50%', '75%', '100%'),
      defaultValue: '0%',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reservations', 'price');
    await queryInterface.removeColumn('Reservations', 'progress');
  },
};
