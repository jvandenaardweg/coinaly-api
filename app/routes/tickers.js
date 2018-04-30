const tickersController = require('../controllers/tickers')
const routeValidations = require('./validations')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/exchanges/{exchange}/tickers/{symbol?}',
    handler: tickersController.show,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  }
]
