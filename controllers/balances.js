const PrivateExchangeWorker = require('../workers/private')
const Boom = require('boom')
class Balances {

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
    const forceRefresh = (request.query.forceRefresh === "true") ? true : false
    const exchangeSlug = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    const apiKey = process.env.BITTREX_API_KEY // TODO: Get from db
    const apiSecret = process.env.BITTREX_API_SECRET // TODO: Get from db
    const exchangeWorker = new PrivateExchangeWorker(1, exchangeSlug, apiKey, apiSecret)

    return (async () => {
      try {
        const result = await exchangeWorker.fetchBalance(forceRefresh)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Balances()
