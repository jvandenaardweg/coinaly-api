const ExchangeWorkers = require('../workers')
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
    const forceRefresh = request.query.forceRefresh
    const exchangeSlug = (request.params.exchange) ? request.params.exchange.toLowerCase() : null

    return (async () => {
      try {
        let result

        ExchangeWorkers[exchangeSlug].setApiCredentials(null, null)

        result = await ExchangeWorkers[exchangeSlug].fetchMarkets(forceRefresh)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }

  load (request, h) {
    const forceRefresh = request.query.forceRefresh
    const exchangeSlug = (request.params.exchange) ? request.params.exchange.toLowerCase() : null

    return (async () => {
      try {
        let result
        console.log(exchangeSlug)
        ExchangeWorkers[exchangeSlug].setApiCredentials(null, null)

        result = await ExchangeWorkers[exchangeSlug].loadMarkets(forceRefresh)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Markets()
