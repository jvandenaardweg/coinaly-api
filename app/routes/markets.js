const marketsController = require('../controllers/markets')
const routeValidations = require('./validations')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/exchanges/{exchange}/markets',
    handler: marketsController.index,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  },
  {
    method: 'GET',
    path: '/exchanges/{exchange}/markets/load',
    handler: marketsController.load,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  },
  {
    method: 'GET',
    path: '/exchanges/{exchange}/markets/fetch',
    handler: marketsController.fetch,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  }
]
