const ExchangeWorkers = require('../workers')
const Boom = require('boom')
const { getDecodedExchangeApiCredentials } = require('../database/methods/keys')
const { getExchangeBySlug } = require('../database/methods/exchanges')

class Balances {
  constructor () {
    // console.log('Controllers (balances):', 'Intance created.')
  }
  /**
   * @api {get} /:exchange/balances Get Balance
   * @apiName index
   * @apiGroup Balances
   *
   * @apiParam {forceRefresh} boolean Boolean value to determine if we need to delete the cache
   *
   * @apiSuccess {Object[]} balances List of balances.
   */
  index (request, h) {
    const userId = request.auth.credentials.id
    const forceRefresh = request.query.forceRefresh
    const exchangeSlug = request.params.exchange

    return (async () => {
      try {
        const exchange = await getExchangeBySlug(exchangeSlug) // TODO: change slug to use just the ID in the request.params?
        const userApiCredentials = await getDecodedExchangeApiCredentials(userId, exchange.id)

        // Set key and secret for current user
        // ExchangeWorkers[exchangeSlug].setApiCredentials(userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)

        const result = await ExchangeWorkers[exchangeSlug].fetchBalance(forceRefresh, userId, userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)
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
module.exports = new Balances()
