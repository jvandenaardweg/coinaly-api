const Joi = require('joi')

const validations = {
  params: {
    exchange: Joi.string().required().lowercase().valid('bittrex', 'binance', 'poloniex')
  },
  query: {
    forceRefresh: Joi.boolean(),
    symbol: Joi.string()
  }
}

module.exports = validations
