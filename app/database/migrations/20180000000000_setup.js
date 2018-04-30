// Migration that makes sure the db has the right extensions activated
exports.up = function (knex, Promise) {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
}

exports.down = function(knex, Promise) { }
