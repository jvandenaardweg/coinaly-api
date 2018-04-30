const authController = require('../controllers/auth')

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
  }
]
