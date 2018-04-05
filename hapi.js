'use strict'
const port = process.env.PORT || 5000
const Hapi = require('hapi')

// Error reporting
const Raven = require('raven')
Raven.config('https://aebac961b26f4b61ad5c88c7f91ee1fc:096956741e2d42c9905fba5f73f18971@sentry.io/1098123').install();

// Route controllers
const balancesController = require('./controllers/balances')
const ordersController = require('./controllers/orders')
const usersController = require('./controllers/users')
const depositsController = require('./controllers/deposits')
const withdrawalsController = require('./controllers/withdrawals')
const marketsController = require('./controllers/markets')

// Create the server
const server = Hapi.server({
  port: port,
  host: 'localhost'
})

// Routes
server.route({
  method: 'GET',
  path: '/',
  handler: (request, h) => {
    return {
      message: 'Hello! info@coinaly.io'
    }
  }
})

server.route({
  method: 'GET',
  path: '/balances',
  handler: balancesController.index
})

server.route({
  method: 'GET',
  path: '/orders',
  handler: ordersController.index
})

server.route({
  method: 'GET',
  path: '/orders/{status}',
  handler: ordersController.indexStatus
})

server.route({
  method: 'GET',
  path: '/deposits',
  handler: depositsController.index
})

server.route({
  method: 'GET',
  path: '/withdrawals',
  handler: withdrawalsController.index
})

server.route({
  method: 'GET',
  path: '/markets',
  handler: marketsController.index
})

server.route({
  method: 'POST',
  path: '/users',
  handler: usersController.create
})

const init = async () => {
  await server.start()
  console.log(`Coinaly API: Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  Raven.captureException(err)
  process.exit(1)
})

init()
