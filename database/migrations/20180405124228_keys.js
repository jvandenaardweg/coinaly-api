
exports.up = function(knex, Promise) {
  return knex.schema.createTable('keys', function (table) {
    table.integer('user_id').notNullable().unsigned()
    table.integer('exchange_id').notNullable().unsigned()
    table.string('api_key').notNullable()
    table.string('api_secret').notNullable()

    // Set relationships
    table.foreign('exchange_id').references('id').inTable('exchanges').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')

    table.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('keys')
}
