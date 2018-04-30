'use strict'
require('dotenv').config({ path: '../.env' })
const newrelic = require('newrelic')

// Error reporting monitoring
if (process.env.NODE_ENV === 'production') {

  const Raven = require('raven')
  Raven.config('https://aebac961b26f4b61ad5c88c7f91ee1fc:096956741e2d42c9905fba5f73f18971@sentry.io/1098123').install();
}

// Base
const port = process.env.PORT || 5000
const Hapi = require('hapi')
const Joi = require('joi')

require('es6-promise').polyfill()
require('isomorphic-fetch')

// JWT validation check to see if decoded user ID is valid
const validateJwt = require('./validations/jwt')

const init = async () => {
  const server = Hapi.server({
    port: port,
    routes: {
      cors: {
        origin: ['http://localhost:8080', 'https://app.coinaly.io', 'https://coinaly.io'],
        credentials: true
      }
    }
  })

  await server.register(require('hapi-auth-jwt2'))

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate: validateJwt,
    verifyOptions: {
      algorithms: [ 'HS256' ]
    }
  })

  server.auth.default('jwt');

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

  // Load all the routes, see /routes
  server.route(require('./routes'))

  // In production, show some stats about the server usage
  if (process.env.NODE_ENV === 'production') {
    await server.register({
      plugin: require('good'),
      ops: {
        interval: 5000
      },
      reporters: {
        console: [{
          module: 'good-console'
        }, 'stdout']
      }
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
  }

  await server.start()
  console.log(`Coinaly API: Server running at: ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  if (process.env.NODE_ENV === 'production') {
    Raven.captureException(err)
  }
  process.exit(1)
})

init()
