
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id').primary().unsigned()
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    table.string('nickname').nullable().defaultsTo(null)
    table.boolean('email_verified').notNullable().defaultsTo(false)
    table.dateTime('activatedAt').nullable().defaultsTo(null)
    table.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
