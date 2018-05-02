
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.string('verification').nullable()
 })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table) {
    table.dropColumn('verification')
  })
}
