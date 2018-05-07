
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.uuid('id').primary().defaultTo(knex.raw("uuid_generate_v4()"))
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.boolean('email_opt_in').defaultTo(false)
    table.string('verification_token').nullable()
    table.string('reset_token').nullable()
    table.dateTime('activated_at').nullable().defaultsTo(null)
    table.dateTime('reset_at').nullable().defaultsTo(null)
    table.dateTime('active_at').nullable().defaultsTo(null)
    table.timestamps(false, true)
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
