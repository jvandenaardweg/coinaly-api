
exports.up = function(knex, Promise) {
  return knex.schema.createTable('balances', function (table) {
    table.uuid('user_id').notNullable()
    table.integer('exchange_id').notNullable().unsigned()
    table.string('symbol_id', 10).notNullable()
    table.float('free').notNullable()
    table.float('used').notNullable()
    table.float('total').notNullable()

    // User can only have one symbol balance per exchange
    table.unique(['user_id', 'exchange_id', 'symbol_id'])

    // Set relationships
    table.foreign('exchange_id').references('id').inTable('exchanges').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('symbol_id').references('id').inTable('symbols').onDelete('RESTRICT')

    table.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('balances')
}
