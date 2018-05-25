exports.up = function(knex, Promise) {
  return knex.schema.table('symbols', function(table) {
    table.string('color', 7).nullable().defaultTo(null) // #000000
 })
}

exports.down = function(knex, Promise) {
  return knex.schema.table('symbols', function(table) {
    table.dropColumn('color')
  })
}
