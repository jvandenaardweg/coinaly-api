const ordersController = require('../controllers/orders')
const routeValidations = require('./validations')
const Joi = require('joi')

module.exports = [
  {
    method: 'DELETE',
    path: '/exchanges/{exchange}/orders/{uuid}',
    handler: ordersController.delete,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  },
  {
    method: 'GET',
    path: '/exchanges/{exchange}/orders/{status}',
    handler: ordersController.indexStatus,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  },
  {
    method: 'GET',
    path: '/exchanges/{exchange}/orders',
    handler: ordersController.index,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  }
]
