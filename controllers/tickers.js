const PublicExchangeWorkers = require('../workers/public-workers')
const Boom = require('boom')
class Tickers {
  constructor () {
    // console.log('Controllers (tickers):', 'Intance created.')
  }

  show (request, h) {
    const forceRefresh = (request.query.forceRefresh === "true") ? true : false
    const exchangeName = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    // const exchangeWorker = new PublicExchangeWorker(exchangeName)
    const symbol = request.query.symbol

    return (async () => {
      try {
        let result
        if (symbol) {
          result = await PublicExchangeWorkers[exchangeName].fetchTicker(symbol, forceRefresh) // Cached for 5 seconds
        } else {
          result = await PublicExchangeWorkers[exchangeName].fetchTickers(forceRefresh) // Cached for 5 seconds
        }

        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Tickers()
