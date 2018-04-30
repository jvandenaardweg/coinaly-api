const depositsController = require('../controllers/deposits')
const routeValidations = require('./validations')

module.exports = [
  {
    method: 'GET',
    path: '/exchanges/{exchange}/deposits',
    handler: depositsController.index,
    options: {
      auth: 'jwt',
      validate: routeValidations
    }
  }
]
