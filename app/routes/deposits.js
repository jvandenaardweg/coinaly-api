const depositsController = require('../controllers/deposits')
const routeValidations = require('./validations')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/exchanges/{exchange}/deposits',
    handler: depositsController.index,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  },
  {
    method: 'GET',
    path: '/exchanges/{exchange}/deposits/address',
    handler: depositsController.address,
    options: {
      auth: 'jwt',
      validate: {
        params: {
          exchange: Joi.string().valid('bittrex', 'binance', 'poloniex'),
        },
        query: {
          forceRefresh: Joi.boolean(),
          symbolId: Joi.string().required()
        }
      }
    }
  }
]
