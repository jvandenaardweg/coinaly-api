const keysController = require('../controllers/keys')
const routeValidations = require('./validations')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/keys',
    handler: keysController.show,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/keys',
    handler: keysController.create,
    options: {
      auth: 'jwt',
      validate: {
        payload: {
          apiKey: Joi.string().required(),
          apiSecret: Joi.string().required(),
          exchangeId: Joi.number().required()
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/keys/{exchangeId}',
    handler: keysController.delete,
    options: {
      auth: 'jwt',
      validate: {
        params: {
          exchangeId: Joi.number().required()
        }
      }
    }
  }
]
