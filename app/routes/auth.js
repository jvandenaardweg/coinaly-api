const authController = require('../controllers/auth')
const Joi = require('joi')

module.exports = [
  {
    method: 'POST',
    path: '/auth/login',
    handler: authController.login,
    options: {
      auth: false
    }
  },
  {
    method: 'POST',
    path: '/auth/forgotpassword',
    handler: authController.forgotPassword,
    options: {
      auth: false
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
          verificationCode: Joi.string().required()
        }
      }
    }
  }
]
