
exports.up = function(knex, Promise) {
  return knex.schema.createTable('orders', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw("uuid_generate_v4()"))
    table.string('source_order_id').notNullable() // ebfc68b1-b88c-421d-acba-d944838743dc
    table.uuid('user_id').notNullable() // ebfc68b1-b88c-421d-acba-d944838743dc
    table.integer('exchange_id').unsigned().notNullable() // 1
    table.integer('timestamp').unsigned().notNullable() // 1523561690720
    table.integer('last_trade_timestamp').unsigned().notNullable() // 1523561690720
    table.string('symbol', 20).notNullable() // POWR/BTC
    table.string('base_id', 10).notNullable() // POWR
    table.string('quote_id', 10).notNullable() // BTC
    table.string('type', 10).notNullable() // limit
    table.string('side', 10).notNullable() // buy/sell
    table.float('price').notNullable().defaultsTo(0) // 0.0000463
    table.float('cost').notNullable().defaultsTo(0) // 0.01724234
    table.float('average').notNullable().defaultsTo(0) // 0.01724234
    table.float('amount').notNullable().defaultsTo(0) // 379.123123
    table.float('filled').notNullable().defaultsTo(0) // 379.123123
    table.float('remaining').notNullable().defaultsTo(0) // 0
    table.string('status').notNullable() // closed/open
    table.string('fee').notNullable() // { "cost": 0.00004394 }
    table.timestamps(false, true)

    // New order cannot be added when user_id already has a source_order_id in the table
    table.unique(['source_order_id', 'user_id'])

    // Set relationships
    table.foreign('exchange_id').references('id').inTable('exchanges').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.foreign('base_id').references('id').inTable('symbols').onDelete('RESTRICT')
    table.foreign('quote_id').references('id').inTable('symbols').onDelete('RESTRICT')

  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('orders')
}
