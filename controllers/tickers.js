const PublicExchangeWorker = require('../workers/public')
const Boom = require('boom')
class Tickers {
  show (request, h) {
    const forceRefresh = (request.query.forceRefresh === "true") ? true : false
    const exchangeName = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    const exchangeWorker = new PublicExchangeWorker(exchangeName)
    const symbol = request.query.symbol

    // 1. Check redis cache for balance
    // 2. if not in cache, do a call, and cache it
    // 3. if shouldForceRefresh is true, delete the cache, get new balance, store in cache

    // redis key: public:exchanges:bittrex:tickers
    return (async () => {
      try {
        let result
        if (symbol) {
          result = await exchangeWorker.fetchTicker(symbol, forceRefresh) // Cached for 5 seconds
        } else {
          result = await exchangeWorker.fetchTickers(forceRefresh) // Cached for 5 seconds
        }

        return result
      } catch (error) {
        // console.log('CATCH', error)
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Tickers()
