const withdrawalsController = require('../controllers/withdrawals')
const routeValidations = require('./validations')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/exchanges/{exchange}/withdrawals',
    handler: withdrawalsController.index,
    options: {
      auth: 'jwt'
    }
  }
]
