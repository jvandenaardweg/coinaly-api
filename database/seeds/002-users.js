// const GUID = require('node-uuid')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: '656f3235-0c5c-466f-ba9c-232471b96bdc', email: 'jordyvandenaardweg@gmail.com', password: 'testtest'},
        {id: '1ca9deba-96e8-41d9-aa66-70d585b9f134', email: 'info@coinaly.io', password: 'testtest'},
      ]);
    });
};
