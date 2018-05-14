
exports.up = function(knex, Promise) {
  return knex.schema.createTable('symbols', function (table) {
    table.string('id', 10).primary().unique() // BTC
    table.string('name', 50).notNullable() // Bitcoin
    table.string('icon_uri', 100).notNullable() // /static/icons/cryptocurrencies/svg/black/btc.svg
    table.boolean('active').notNullable().defaultsTo(false) // true/false

    table.timestamps(false, true)

  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('symbols')
}
