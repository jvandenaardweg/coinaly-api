'use strict'
// Error reporting monitoring
const newrelic = require('newrelic')
const Raven = require('raven')
Raven.config('https://aebac961b26f4b61ad5c88c7f91ee1fc:096956741e2d42c9905fba5f73f18971@sentry.io/1098123').install();

// Base
const port = process.env.PORT || 5000
const Hapi = require('hapi')

// Route controllers
const balancesController = require('./controllers/balances')
const ordersController = require('./controllers/orders')
const usersController = require('./controllers/users')
const depositsController = require('./controllers/deposits')
const withdrawalsController = require('./controllers/withdrawals')
const marketsController = require('./controllers/markets')
const tickersController = require('./controllers/tickers')

// Create the server
const server = Hapi.server({
  port: port,
  host: 'localhost',
  cache: [
    {
        name: 'redisCache',
        engine: require('catbox-redis'),
        url: process.env.REDIS_URL,
        partition: 'cache'
    }
  ]
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
  path: '/exchanges/{exchange}/balances',
  handler: balancesController.index
})

server.route({
  method: 'GET',
  path: '/exchanges/{exchange}/orders',
  handler: ordersController.index
})

server.route({
  method: 'GET',
  path: '/exchanges/{exchange}/orders/{status}',
  handler: ordersController.indexStatus
})

server.route({
  method: 'GET',
  path: '/exchanges/{exchange}/deposits',
  handler: depositsController.index
})

server.route({
  method: 'GET',
  path: '/exchanges/{exchange}/withdrawals',
  handler: withdrawalsController.index
})

server.route({
  method: 'GET',
  path: '/exchanges/{exchange}/markets',
  handler: marketsController.index
})

server.route({
  method: 'GET',
  path: '/exchanges/{exchange}/markets/fetch',
  handler: marketsController.fetch
})

server.route({
  method: 'GET',
  path: '/exchanges/{exchange}/markets/load',
  handler: marketsController.load
})

server.route({
  method: 'GET',
  path: '/exchanges/{exchange}/tickers/{symbol?}',
  handler: tickersController.show
})

server.route({
  method: 'POST',
  path: '/users',
  handler: usersController.create
})

// Set correct New Relic transaction naming
server.ext('onRequest', function (request, h) {
  let transactionName = request.path

  // Remove first slash, so we get proper naming for new relic
  while(transactionName.charAt(0) === '/') {
    transactionName = transactionName.substr(1)
  }

  newrelic.setTransactionName(transactionName)
  return h.continue
})

const options = {
  ops: {
    interval: 5000
  },
  reporters: {
    console: [{
      module: 'good-console'
    }, 'stdout']
  }
}

const init = async () => {
  await server.register({
    plugin: require('good'),
    options
  })
  await server.start()
  console.log(`Coinaly API: Server running at: ${server.info.uri}`)


}

process.on('unhandledRejection', (err) => {
  console.log(err)
  Raven.captureException(err)
  process.exit(1)
})

init()
