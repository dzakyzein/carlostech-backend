'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSaltSync(10);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'admin',
          email: 'admin@gmail.com',
          password: bcrypt.hashSync('12345678', salt),
          role: 'admin',
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
