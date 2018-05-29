const Joi = require('joi')

const validations = {
  params: {
    exchange: Joi.string().lowercase().valid('bittrex', 'binance', 'poloniex')
  },
  query: {
    forceRefresh: Joi.boolean(),
    symbol: Joi.string()
  }
}

module.exports = validations
