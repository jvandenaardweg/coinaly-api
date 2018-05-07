const exchangesController = require('../controllers/exchanges')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/exchanges/all',
    handler: exchangesController.index,
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/exchanges/all/active',
    handler: exchangesController.active,
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/exchanges/{slug?}',
    handler: exchangesController.show,
    options: {
      auth: false,
      validate: {
        query: {
          slug: Joi.string()
        }
      }
    }
  }
]
