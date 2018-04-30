
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw("uuid_generate_v4()"))
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.dateTime('activated_at').nullable().defaultsTo(null)
    table.dateTime('active_at').nullable().defaultsTo(null)
    table.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
