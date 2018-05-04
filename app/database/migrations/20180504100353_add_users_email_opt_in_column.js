
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.boolean('email_opt_in').defaultTo(false)
 })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('email_opt_in')
  })
}
