const symbolsController = require('../controllers/symbols')

module.exports = [
  {
    method: 'GET',
    path: '/symbols',
    handler: symbolsController.index,
    options: {
      auth: false
    }
  },
  {
    method: 'GET',
    path: '/symbols/fetch',
    handler: symbolsController.fetch,
    options: {
      auth: false
    }
  }
]
