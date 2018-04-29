const GUID = require('node-uuid')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: '17a4e26c-c2e5-4ab7-856b-f7f99ec2cb99', email: 'jordyvandenaardweg@gmail.com', password: 'testtest', created_at: new Date()},
        {id: 'eab6377a-c073-44ac-90d7-f248a47915ed', email: 'info@coinaly.io', password: 'testtest', created_at: new Date()}
      ]);
    });
};
