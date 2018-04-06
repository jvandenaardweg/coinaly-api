exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('keys').del()
    .then(function () {
      // Inserts seed entries
      return knex('keys').insert([
        {user_id: 1, exchange_id: 1, api_key: 'test', api_secret: 'test'}
      ]);
    });
};
