
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function (table) {
    table.uuid('id').notNullable().primary()
    table.string('email').notNullable().unique()
    table.string('password').notNullable()
    // table.dateTime('createdAt').defaultTo(knex.fn.now())
    // table.dateTime('updatedAt').defaultTo(knex.fn.now())
    table.dateTime('activated_at')
    table.timestamps()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users')
}
