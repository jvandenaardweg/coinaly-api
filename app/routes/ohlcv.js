const ohlcvController = require('../controllers/ohlcv')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/exchanges/{exchange}/ohlcv',
    handler: ohlcvController.index,
    options: {
      auth: false,
      validate: {
        query: {
          forceRefresh: Joi.boolean(),
          marketSymbol: Joi.string().required(),
          interval: Joi.string().required().valid('1h', '1d', '1w', '1m')
        },
        params: {
          exchange: Joi.string().valid('bittrex', 'binance', 'poloniex').required()
        }
      }
    }
  }
]
