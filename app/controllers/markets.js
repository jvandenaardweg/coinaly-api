const ExchangeWorkers = require('../workers')
const Boom = require('boom')
const { getPublicApiKeySecret } = require('../helpers/api-keys')

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
    const apiCredentials = getPublicApiKeySecret(exchangeSlug)

    return (async () => {
      try {
        let result

        ExchangeWorkers[exchangeSlug].ccxt.apiKey = apiCredentials.apiKey
        ExchangeWorkers[exchangeSlug].ccxt.secret = apiCredentials.apiSecret

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
    const apiCredentials = getPublicApiKeySecret(exchangeSlug)

    return (async () => {
      try {
        let result

        ExchangeWorkers[exchangeSlug].ccxt.apiKey = apiCredentials.apiKey
        ExchangeWorkers[exchangeSlug].ccxt.secret = apiCredentials.apiSecret

        result = await ExchangeWorkers[exchangeSlug].loadMarkets(forceRefresh)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Markets()
