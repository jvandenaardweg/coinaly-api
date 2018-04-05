
exports.up = function(knex, Promise) {
  return knex.schema.createTable('keys', function (table) {
    table.uuid('user_id').notNullable()
    table.integer('exchange_id').notNullable()
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
