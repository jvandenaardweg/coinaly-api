const authController = require('../controllers/auth')
const Joi = require('joi')

module.exports = [
  {
    method: 'POST',
    path: '/auth/login',
    handler: authController.login,
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
    method: 'POST',
    path: '/auth/reset',
    handler: authController.reset,
    options: {
      auth: false,
      validate: {
        payload: {
          email: Joi.string().email({ minDomainAtoms: 2 }).required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/auth/logout',
    handler: authController.logout,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/auth/verify',
    handler: authController.verify,
    options: {
      auth: false,
      validate: {
        payload: {
          verificationToken: Joi.string().required().regex(/^[a-zA-Z0-9]/)
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/auth/reset/password',
    handler: authController.resetPassword,
    options: {
      auth: false,
      validate: {
        payload: {
          password: Joi.string().required(),
          resetToken: Joi.string().required().regex(/^[a-zA-Z0-9]/)
        }
      }
    }
  }
]
