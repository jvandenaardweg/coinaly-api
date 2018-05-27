const exchangesController = require('../controllers/exchanges')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/exchanges',
    handler: exchangesController.index,
    options: {
      auth: false,
      validate: {
        query: {
          slug: Joi.string()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/exchanges/all/active',
    handler: exchangesController.active,
    options: {
      auth: false
    }
  }
]
