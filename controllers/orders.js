const PrivateExchangeWorker = require('../workers/private')
const Boom = require('boom')
class Orders {
  index (request, h) {
    const forceRefresh = (request.query.forceRefresh === "true") ? true : false
    const exchangeName = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    const apiKey = process.env.BITTREX_API_KEY // TODO: Get from db
    const apiSecret = process.env.BITTREX_API_SECRET // TODO: Get from db
    const exchangeWorker = new PrivateExchangeWorker(1, exchangeName, apiKey, apiSecret)

    return (async () => {
      try {
        const result = await exchangeWorker.fetchOrders(forceRefresh)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }

  indexHistory (request, h) {
    return {
      message: 'should return all historical orders (closed orders essentially)'
    }
  }

  indexStatus (request, h) {
    return {
      message: 'should return all [open/closed] orders'
    }
  }

  indexClosed (request, h) {
    return {
      message: 'should return all closed orders'
    }
  }

  show (request, h) {
    return {
      mesage: 'should return one order'
    }
  }

  createBuy (request, h) {
    return {
      message: 'create buy limit or market order'
    }
  }

  createSell (request, h) {
    return {
      message: 'create sell limit or market order'
    }
  }

  delete (request, h) {
    return {
      message: 'should cancel an order'
    }
  }
}
module.exports = new Orders()
