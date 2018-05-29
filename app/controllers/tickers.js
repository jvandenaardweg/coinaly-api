const ExchangeWorkers = require('../workers')
const Boom = require('boom')
const redis = require('../cache/redis')
const { convertKeyStringToObject } = require('../helpers/objects')
class Tickers {
  constructor () {
    // console.log('Controllers (tickers):', 'Intance created.')
  }

  index (request, h) {
    const forceRefresh = request.query.forceRefresh
    const exchangeSlug = request.params.exchange

    return (async () => {
      try {
        // The exchanges cache is filled by out websocket
        const result = await redis.hgetall(`exchanges:${exchangeSlug}:tickers`)
        const resultJSON = convertKeyStringToObject(result)
        return resultJSON
      } catch (error) {
        if (typeof error === 'string') {
          return Boom.badRequest(error)
        } else {
          return Boom.badImplementation(error)
        }
      }
    })()
  }

  show (request, h) {
    const forceRefresh = request.query.forceRefresh
    const exchangeSlug = request.params.exchange
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
        if (typeof error === 'string') {
          return Boom.badRequest(error)
        } else {
          return Boom.badImplementation(error)
        }
      }
    })()
  }
}
module.exports = new Tickers()
