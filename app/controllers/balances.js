// let PrivateExchangeWorker = require('../workers/private')
const ExchangeWorkers = require('../workers')
const Boom = require('boom')
const { getPublicApiKeySecret } = require('../helpers/api-keys')

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
    const userId = 1 // TODO: get from request
    const forceRefresh = request.query.forceRefresh
    const exchangeSlug = (request.params.exchange) ? request.params.exchange.toLowerCase() : null

    return (async () => {
      try {

        // TODO: use database to get keys, not use the public keys here
        const apiCredentials = getPublicApiKeySecret(exchangeSlug)

        // Set key and secret for current user
        ExchangeWorkers[exchangeSlug].setApiCredentials(apiCredentials.apiKey, apiCredentials.apiSecret)

        const result = await ExchangeWorkers[exchangeSlug].fetchBalance(forceRefresh, userId)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Balances()
