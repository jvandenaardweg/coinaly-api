const ExchangeWorker = require('../workers/exchange')
const Boom = require('boom')
class Markets {
  index (request, h) {
    const shouldForceRefresh = (request.query) ? request.query : false
    const exchangeName = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    const apiKey = process.env.BITTREX_API_KEY // TODO: Get from db
    const apiSecret = process.env.BITTREX_API_SECRET // TODO: Get from db
    const exchangeWorker = new ExchangeWorker(1, exchangeName, apiKey, apiSecret)


    // 1. Check redis cache for balance
    // 2. if not in cache, do a call, and cache it
    // 3. if shouldForceRefresh is true, delete the cache, get new balance, store in cache

    return (async () => {
      try {
        const result = await exchangeWorker.fetchMarkets()
        return result
      } catch (error) {
        // console.log('CATCH', error)
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Markets()
