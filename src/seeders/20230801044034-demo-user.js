'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * 
    */

    // await queryInterface.bulkInsert('Users', [{
    //      email: 'John Doe',
    //      password: '123456',
    //      userName: 'test1'
    //    },
    //    {
    //     email: 'John Doe',
    //     password: '123456',
    //     userName: 'test2'
    //   },
    //   {
    //     email: 'John Doe',
    //     password: '123456',
    //     userName: 'test3'
    //   },
    //   ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
