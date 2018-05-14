// Source: https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH&tsyms=USD,EUR,GBP,JPY,KRW
// Or: https://api.coindesk.com/v1/bpi/currentprice.json
// https://www.investopedia.com/tech/top-fiat-currencies-used-trade-bitcoin/

exports.up = function(knex, Promise) {
  return knex.schema.createTable('prices', function (table) {
    table.string('symbol').primary().unique() // BTC
    table.float('USD').notNullable() // 8387.96
    table.float('EUR').notNullable() // 7027.04
    table.float('GBP').notNullable() // 6228.6
    table.float('JPY').notNullable() // 953966.5
    table.float('KRW').notNullable() // 9465052.81
    table.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('prices')
}
