exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('keys').del()
    .then(function () {
      // Inserts seed entries
      return knex('keys').insert([
        {user_id: '656f3235-0c5c-466f-ba9c-232471b96bdc', exchange_id: 1, api_key: 'test', api_secret: 'test'}
      ]);
    });
};
