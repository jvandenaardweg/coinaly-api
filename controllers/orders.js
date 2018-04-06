const PrivateExchangeWorker = require('../workers/private')
const Boom = require('boom')
class Orders {
  index (request, h) {
    const forceRefresh = (request.query.forceRefresh === "true") ? true : false
    const exchangeName = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    const apiKey = process.env.BITTREX_API_KEY // TODO: Get from db
    const apiSecret = process.env.BITTREX_API_SECRET // TODO: Get from db
    const exchangeWorker = new PrivateExchangeWorker(1, exchangeName, apiKey, apiSecret)


    // 1. Check redis cache for balance
    // 2. if not in cache, do a call, and cache it
    // 3. if shouldForceRefresh is true, delete the cache, get new balance, store in cache

    return (async () => {
      try {
        const result = await exchangeWorker.fetchOrders()
        return result
      } catch (error) {
        // console.log('CATCH', error)
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
