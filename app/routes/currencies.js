const currenciesController = require('../controllers/currencies')
const routeValidations = require('./validations')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/currencies',
    handler: currenciesController.index,
    options: {
      auth: false
    }
  }
]
