const PrivateExchangeWorker = require('../workers/private')
const Boom = require('boom')
class Balances {
  index (request, h) {
    const forceRefresh = (request.query.forceRefresh === "true") ? true : false
    const exchangeSlug = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    const apiKey = process.env.BITTREX_API_KEY // TODO: Get from db
    const apiSecret = process.env.BITTREX_API_SECRET // TODO: Get from db
    const exchangeWorker = new PrivateExchangeWorker(1, exchangeSlug, apiKey, apiSecret)

    // 1. Check redis cache for balance
    // 2. if not in cache, do a call, and cache it
    // 3. if shouldForceRefresh is true, delete the cache, get new balance, store in cache

    return (async () => {
      try {
        const result = await exchangeWorker.fetchBalance(forceRefresh)
        return result
      } catch (error) {
        // console.log('CATCH', error)
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Balances()
