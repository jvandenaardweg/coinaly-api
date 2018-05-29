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
    path: '/exchanges/{exchange}/orders',
    handler: ordersController.index,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  },
  {
    method: 'GET',
    path: '/exchanges/{exchange}/orders/closed',
    handler: ordersController.indexClosed,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  },
  {
    method: 'GET',
    path: '/exchanges/{exchange}/orders/open',
    handler: ordersController.indexOpen,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  },
  {
    method: 'POST',
    path: '/exchanges/{exchange}/orders',
    handler: ordersController.create,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  }
]
