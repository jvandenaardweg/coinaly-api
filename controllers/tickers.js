const PublicExchangeWorker = require('../workers/public')
const Boom = require('boom')
class Tickers {
  show (request, h) {
    const forceRefresh = (request.query.forceRefresh === "true") ? true : false
    const exchangeName = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    const exchangeWorker = new PublicExchangeWorker(exchangeName)
    const symbol = request.query.symbol

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
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Tickers()
