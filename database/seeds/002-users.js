// const GUID = require('node-uuid')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, email: 'jordyvandenaardweg@gmail.com', password: 'testtest', nickname: null, email_verified: false},
        {id: 2, email: 'info@coinaly.io', password: 'testtest', nickname: null, email_verified: false},
      ]);
    });
};
