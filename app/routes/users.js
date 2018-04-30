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
          email: Joi.string().email({ minDomainAtoms: 2 }).required(),
          password: Joi.string().required()
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
  }
]
