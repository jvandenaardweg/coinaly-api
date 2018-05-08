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
  }
]
