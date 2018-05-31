const ExchangeWorkers = require('../workers')
const Boom = require('boom')
const { getDecodedExchangeApiCredentials } = require('../database/methods/keys')
const { getExchangeBySlug } = require('../database/methods/exchanges')
class Deposits {
  index (request, h) {
    return {
      message:  'Should return all deposits'
    }
  }

  address (request, h) {
    const userId = request.auth.credentials.id
    const forceRefresh = request.query.forceRefresh
    const exchangeSlug = request.params.exchange
    const symbolId = request.query.symbolId

    return (async () => {
      try {
        const exchange = await getExchangeBySlug(exchangeSlug) // TODO: change slug to use just the ID in the request.params?
        const userApiCredentials = await getDecodedExchangeApiCredentials(userId, exchange.id)

        const result = await ExchangeWorkers[exchangeSlug].fetchDepositAddress(symbolId, userId, forceRefresh, userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)
        return result
      } catch (error) {
        if (typeof error === 'string') {
          return Boom.badRequest(error)
        } else {
          return Boom.badImplementation(error)
        }
      }
    })()
  }
}
module.exports = new Deposits()
