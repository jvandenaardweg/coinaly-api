const pricesController = require('../controllers/prices')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/prices',
    handler: pricesController.index,
    options: {
      auth: false,
      validate: {
        query: {
          symbols: Joi.string()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/prices/fetch',
    handler: pricesController.fetch,
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/prices/history',
    handler: pricesController.history,
    options: {
      auth: false,
      validate: {
        query: {
          baseId: Joi.string(),
          quoteId: Joi.string(),
          interval: Joi.string().valid('1d', '1w', '1m', '3m', '6m')
        }
      }
    }
  }
]
