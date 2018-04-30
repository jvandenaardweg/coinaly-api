const balancesController = require('../controllers/balances')
const routeValidations = require('./validations')

module.exports = [
  {
    method: 'GET',
    path: '/exchanges/{exchange}/balances',
    handler: balancesController.index,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  }
]
