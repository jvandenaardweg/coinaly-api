const ExchangeWorkers = require('../workers')
const Boom = require('boom')
const { getPublicApiKeySecret } = require('../helpers/api-keys')
const { getDecodedExchangeApiCredentials } = require('../database/methods/keys')
class Orders {
  constructor () {
    // console.log('Controllers (orders):', 'Intance created.')
  }

  index (request, h) {
    const userId = request.auth.credentials.id
    const exchangeId = 1 // TODO: make dynamic
    const forceRefresh = request.query.forceRefresh
    const exchangeSlug = (request.params.exchange) ? request.params.exchange.toLowerCase() : null

    return (async () => {
      try {
        const userApiCredentials = await getDecodedExchangeApiCredentials(userId, exchangeId)

        try {
          ExchangeWorkers[exchangeSlug].setApiCredentials(userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)

          try {
            const result = await ExchangeWorkers[exchangeSlug].fetchOrders(forceRefresh, userId)
            return result
          } catch (error) {
            return Boom.badImplementation(error)
          }

        } catch (err) {
          return Boom.badImplementation('Failed to set the API credentials in the exchange worker.')
        }

      } catch (err) {
        console.log(err)
        return Boom.badImplementation('Failed to retrieve the exchange API credentials from our database.')
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
    const userId = request.auth.credentials.id
    const exchangeId = 1 // TODO: make dynamic
    const forceRefresh = request.query.forceRefresh
    const exchangeSlug = (request.params.exchange) ? request.params.exchange.toLowerCase() : null

    return (async () => {
      try {
        const userApiCredentials = await getDecodedExchangeApiCredentials(userId, exchangeId)

        try {
          ExchangeWorkers[exchangeSlug].setApiCredentials(userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)

          try {
            const result = await ExchangeWorkers[exchangeSlug].fetchClosedOrders(forceRefresh, userId)
            return result
          } catch (err) {
            console.log(err)
            return Boom.badImplementation('Failed to fetch the closed orders from the exchange.')
          }

        } catch (err) {
          console.log(err)
          return Boom.badImplementation('Failed to set the API credentials in the exchange worker.')
        }

      } catch (err) {
        console.log(err)
        return Boom.badImplementation('Failed to retrieve the exchange API credentials from our database.')
      }
    })()
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
