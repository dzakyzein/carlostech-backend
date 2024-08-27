'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Reservations', 'status', {
      type: Sequelize.ENUM('lunas', 'belum lunas'),
      allowNull: false,
      defaultValue: 'belum lunas',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Sequelize tidak memiliki metode bawaan untuk mengubah ENUM kembali ke STRING,
    // jadi kamu harus menghapus kolom dan menambahkannya kembali.
    await queryInterface.removeColumn('Reservations', 'status');
    await queryInterface.addColumn('Reservations', 'status', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'belum lunas',
    });
  },
};
