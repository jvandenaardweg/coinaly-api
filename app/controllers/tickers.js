const ExchangeWorkers = require('../workers')
const Boom = require('boom')

class Tickers {
  constructor () {
    // console.log('Controllers (tickers):', 'Intance created.')
  }

  show (request, h) {
    const forceRefresh = request.query.forceRefresh
    const exchangeSlug = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    const symbol = request.query.symbol

    return (async () => {
      try {
        let result

        if (symbol) {
          result = await ExchangeWorkers[exchangeSlug].fetchTicker(symbol, forceRefresh) // Cached for 5 seconds
        } else {
          result = await ExchangeWorkers[exchangeSlug].fetchTickers(forceRefresh) // Cached for 5 seconds
        }

        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Tickers()
