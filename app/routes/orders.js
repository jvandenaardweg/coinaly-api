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
    path: '/exchanges/{exchange}/orders/limit',
    handler: ordersController.createLimitOrder,
    options: {
      auth: 'jwt',
      validate: {
        ...routeValidations,
        payload: {
          side: Joi.string().required().valid('buy', 'sell'),
          symbol: Joi.string().required(),
          amount: Joi.number().required(),
          price: Joi.number().required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/exchanges/{exchange}/orders/market',
    handler: ordersController.createMarketOrder,
    options: {
      auth: 'jwt',
      validate: {
        ...routeValidations,
        payload: {
          side: Joi.string().required().valid('buy', 'sell'),
          symbol: Joi.string().required(),
          amount: Joi.number().required(),
          price: Joi.number().required()
        }
      }
    }
  }
]
