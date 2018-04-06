const PublicExchangeWorker = require('../workers/public')
const Boom = require('boom')
class Markets {
  index (request, h) {
    return {
      message: 'Nothing here. Endpoints are /fetch and /load'
    }
  }

  fetch (request, h) {
    const forceRefresh = (request.query.forceRefresh === "true") ? true : false
    const exchangeName = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    const exchangeWorker = new PublicExchangeWorker(exchangeName)

    return (async () => {
      try {
        const result = await exchangeWorker.fetchMarkets()
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }

  load (request, h) {
    const forceRefresh = (request.query.forceRefresh === "true") ? true : false
    const exchangeName = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    const exchangeWorker = new PublicExchangeWorker(exchangeName)

    return (async () => {
      try {
        const result = await exchangeWorker.loadMarkets()
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Markets()
