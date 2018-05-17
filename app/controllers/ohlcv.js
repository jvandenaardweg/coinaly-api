const ExchangeWorkers = require('../workers')
const Boom = require('boom')

class OHLCV {
  constructor () { }

  index (request, h) {
    const forceRefresh = request.query.forceRefresh
    const marketSymbol = request.query.marketSymbol
    const interval = request.query.interval
    const exchangeSlug = (request.params.exchange) ? request.params.exchange.toLowerCase() : null

    return (async () => {
      try {
        const result = await ExchangeWorkers[exchangeSlug].fetchOHLCV(marketSymbol, interval, forceRefresh)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}

module.exports = new OHLCV()
