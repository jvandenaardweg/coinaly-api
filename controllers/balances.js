// let PrivateExchangeWorker = require('../workers/private')
let PrivateExchangeWorkers = require('../workers/private-workers')
const Boom = require('boom')
const { getPublicApiKeySecret } = require('../helpers/api-keys')

// Make PrivateExchangeWorkers re-usable
let exchangeWorker = {}
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
    const forceRefresh = (request.query.forceRefresh === "true") ? true : false
    const exchangeSlug = (request.params.exchange) ? request.params.exchange.toLowerCase() : null

    // TODO: use database to get keys, not use the public keys here
    const apiCredentials = getPublicApiKeySecret(exchangeSlug)

    // Set key and secret for current user
    PrivateExchangeWorkers[exchangeSlug].ccxt.apiKey = apiCredentials.apiKey
    PrivateExchangeWorkers[exchangeSlug].ccxt.secret = apiCredentials.apiSecret

    return (async () => {
      try {
        const result = await PrivateExchangeWorkers[exchangeSlug].fetchBalance(forceRefresh, userId)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Balances()
