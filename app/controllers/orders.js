const ExchangeWorkers = require('../workers')
const Boom = require('boom')
const { getPublicApiKeySecret } = require('../helpers/api-keys')
class Orders {
  constructor () {
    // console.log('Controllers (orders):', 'Intance created.')
  }

  index (request, h) {
    const userId = 1 // TODO: get from user session
    const forceRefresh = request.query.forceRefresh
    const exchangeSlug = (request.params.exchange) ? request.params.exchange.toLowerCase() : null

    // TODO: use database to get keys, not use the public keys here
    const apiCredentials = getPublicApiKeySecret(exchangeSlug)

    // Set key and secret for current user
    ExchangeWorkers[exchangeSlug].ccxt.apiKey = apiCredentials.apiKey // TODO: get from db
    ExchangeWorkers[exchangeSlug].ccxt.secret = apiCredentials.apiSecret // TODO: get from db

    return (async () => {
      try {
        const result = await ExchangeWorkers[exchangeSlug].fetchOrders(forceRefresh, userId)
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
