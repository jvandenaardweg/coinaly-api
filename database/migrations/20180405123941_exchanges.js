
exports.up = function(knex, Promise) {
  return knex.schema.createTable('exchanges', function (table) {
    table.increments()
    table.string('name').notNullable().unique()
    table.string('slug').notNullable().unique()
    table.string('url').notNullable()
    table.boolean('active').defaultTo(true)
    table.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('exchanges')
}
