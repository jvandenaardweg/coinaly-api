
exports.up = function(knex, Promise) {
  return knex.schema.createTable('keys', function (table) {
    table.uuid('user_id').notNullable()
    table.integer('exchange_id').notNullable().unsigned()
    table.string('api_key_encoded').notNullable()
    table.string('api_secret_encoded').notNullable()

    table.unique(['user_id', 'exchange_id'])

    // Set relationships
    table.foreign('exchange_id').references('id').inTable('exchanges').onDelete('CASCADE')
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')

    table.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('keys')
}
