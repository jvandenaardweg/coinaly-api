exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('keys').del()
    .then(function () {
      // Inserts seed entries
      return knex('keys').insert([
        {user_id: '17a4e26c-c2e5-4ab7-856b-f7f99ec2cb99', exchange_id: 1, api_key_encoded: 'test', api_secret_encoded: 'test', created_at: new Date()}
      ]);
    });
};
