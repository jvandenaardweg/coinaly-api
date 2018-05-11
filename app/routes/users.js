const usersController = require('../controllers/users')
const routeValidations = require('./validations')
const Joi = require('joi')

module.exports = [
  {
    method: 'GET',
    path: '/users/me',
    handler: usersController.show,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/users',
    handler: usersController.create,
    options: {
      auth: false,
      validate: {
        payload: {
          email: Joi.string().email({ minDomainAtoms: 2 }).required().valid(
            'info@coinaly.io',
            'jordyvandenaardweg@gmail.com',
            'e2e-test@coinaly.io',
            'test@coinaly.io',
            'e2e-signup@coinaly.io',
            'e2e-login@coinaly.io',
            'does-not-exist@coinaly.io'
          ),
          password: Joi.string().required(),
          emailOptIn: Joi.boolean()
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/users/me',
    handler: usersController.delete,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/users/delete/e2e',
    handler: usersController.deleteE2ETestUser,
    options: {
      auth: false
    }
  }
]
