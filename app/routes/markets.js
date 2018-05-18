const marketsController = require('../controllers/markets')
const routeValidations = require('./validations')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/exchanges/{exchange}/markets',
    handler: marketsController.index,
    options: {
      auth: false,
      validate: routeValidations
    }
  },
  {
    method: 'GET',
    path: '/exchanges/{exchange}/markets/load',
    handler: marketsController.load,
    options: {
      auth: false,
      validate: routeValidations
    }
  },
  {
    method: 'GET',
    path: '/exchanges/{exchange}/markets/fetch',
    handler: marketsController.fetch,
    options: {
      auth: false,
      validate: routeValidations
    }
  },
  {
    method: 'GET',
    path: '/exchanges/{exchange}/markets/ohlcv',
    handler: marketsController.ohlcv,
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
