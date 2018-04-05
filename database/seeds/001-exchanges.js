
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('exchanges').del()
    .then(function () {
      // Inserts seed entries
      return knex('exchanges').insert([
        {id: 1, name: 'Bittrex', slug: 'bittrex', url: 'https://bittrex.com', active: true},
        {id: 2, name: 'Binance', slug: 'binance', url: 'https://binance.com', active: false}
      ]);
    });
};
