const Joi = require('joi')

const validations = {
  params: {
    exchange: Joi.string().valid('bittrex', 'binance'),
    status: Joi.string().valid('open', 'closed')
  },
  query: {
    forceRefresh: Joi.boolean()
  }
}

module.exports = validations
