const PublicExchangeWorker = require('../workers/public')
const Boom = require('boom')
class Tickers {
  index (request, h) {
    const shouldForceRefresh = (request.query) ? request.query : false
    const exchangeName = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    const exchangeWorker = new PublicExchangeWorker(exchangeName)


    // 1. Check redis cache for balance
    // 2. if not in cache, do a call, and cache it
    // 3. if shouldForceRefresh is true, delete the cache, get new balance, store in cache

    // redis key: public:exchanges:bittrex:tickers
    return (async () => {
      try {
        const result = await exchangeWorker.fetchTickers()
        return result
      } catch (error) {
        // console.log('CATCH', error)
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Tickers()
