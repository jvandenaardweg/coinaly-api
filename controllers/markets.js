const PublicExchangeWorkers = require('../workers/public-workers')
const Boom = require('boom')


class Markets {
  constructor () {
    // console.log('Controllers (markets):', 'Intance created.')
  }

  index (request, h) {
    return {
      message: 'Nothing here. Endpoints are /fetch and /load'
    }
  }

  fetch (request, h) {
    const forceRefresh = (request.query.forceRefresh === "true") ? true : false
    const exchangeName = (request.params.exchange) ? request.params.exchange.toLowerCase() : null

    return (async () => {
      try {
        const result = await PublicExchangeWorkers[exchangeName].fetchMarkets(forceRefresh)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }

  load (request, h) {
    const forceRefresh = (request.query.forceRefresh === "true") ? true : false
    const exchangeName = (request.params.exchange) ? request.params.exchange.toLowerCase() : null

    return (async () => {
      try {
        const result = await PublicExchangeWorkers[exchangeName].loadMarkets(forceRefresh)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Markets()
