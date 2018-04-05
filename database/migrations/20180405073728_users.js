
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.uuid('id').notNullable().primary()
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.dateTime('activatedAt').nullable().defaultsTo(null)
    table.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
