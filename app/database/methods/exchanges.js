const knex = require('../knex')

const getAllActiveExchanges = function () {
  return knex('exchanges')
    .where({
      active: true
    })
}

const getExchangeById = function (exchangeId) {
  return knex('exchanges')
    .where({
      id: exchangeId
    })
    .get(0)
}

const getAllExchanges = function () {
  return knex('exchanges')
}

const getExchangeBySlug = function (slug) {
  return knex('exchanges')
  .where({
    slug: slug
  })
  .get(0)
}

module.exports = {
  getAllActiveExchanges,
  getExchangeById,
  getAllExchanges,
  getExchangeBySlug
}
