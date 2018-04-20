const Joi = require('joi')

const validations = {
  params: {
    exchange: Joi.string().valid('bittrex', 'binance', 'poloniex'),
    status: Joi.string().valid('open', 'closed')
  },
  query: {
    forceRefresh: Joi.boolean(),
    symbol: Joi.string()
  }
}

module.exports = validations
