const ExchangeWorkers = require('../workers')
const Boom = require('boom')
const { getDecodedExchangeApiCredentials } = require('../database/methods/keys')
const { getExchangeBySlug } = require('../database/methods/exchanges')
class Orders {
  constructor () {
    // console.log('Controllers (orders):', 'Intance created.')
  }

  index (request, h) {
    const userId = request.auth.credentials.id
    const forceRefresh = request.query.forceRefresh
    const exchange = request.params.exchange

    return (async () => {
      try {
        const exchange = await getExchangeBySlug(exchange) // TODO: change slug to use just the ID in the request.params?
        const userApiCredentials = await getDecodedExchangeApiCredentials(userId, exchange.id)

        try {
          const result = await ExchangeWorkers[exchange].fetchOrders(forceRefresh, userId, userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)
          return result
        } catch (error) {
          if (typeof error === 'string') {
            return Boom.badRequest(error)
          } else {
            return Boom.badImplementation(error)
          }
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
    const exchange = request.params.exchange

    return (async () => {
      try {
        const userApiCredentials = await getDecodedExchangeApiCredentials(userId, exchangeId)

        try {
          const result = await ExchangeWorkers[exchange].fetchClosedOrders(forceRefresh, userId, userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)
          return result
        } catch (error) {
          if (typeof error === 'string') {
            return Boom.badRequest(error)
          } else {
            return Boom.badImplementation(error)
          }
        }

      } catch (err) {
        console.log(err)
        return Boom.badImplementation('Failed to retrieve the exchange API credentials from our database.')
      }
    })()
  }

  indexOpen (request, h) {
    const userId = request.auth.credentials.id
    const exchangeId = 1 // TODO: make dynamic
    const forceRefresh = request.query.forceRefresh
    const exchange = request.params.exchange

    return (async () => {
      try {
        const userApiCredentials = await getDecodedExchangeApiCredentials(userId, exchangeId)

        try {
          const result = await ExchangeWorkers[exchange].fetchOpenOrders(forceRefresh, userId, userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)
          return result
        } catch (error) {
          if (typeof error === 'string') {
            return Boom.badRequest(error)
          } else {
            return Boom.badImplementation(error)
          }
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

  createLimitOrder (request, h) {
    const userId = request.auth.credentials.id
    const exchangeSlug = request.params.exchange

    const side = request.payload.side
    const symbol = request.payload.symbol
    const amount = request.payload.amount
    const price = request.payload.price
    const params = null

    return (async () => {
      try {
        let result
        const exchange = await getExchangeBySlug(exchangeSlug)
        const userApiCredentials = await getDecodedExchangeApiCredentials(userId, exchange.id)

        // Set key and secret for current user
        // ExchangeWorkers[exchangeSlug].setApiCredentials(userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)

        if (side === 'buy') {
          result = await ExchangeWorkers[exchangeSlug].createLimitBuyOrder(symbol, amount, price, params, userId, userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)
        } else {
          result = await ExchangeWorkers[exchangeSlug].createLimitSellOrder(symbol, amount, price, params, userId, userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)
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

  createMarketOrder (request, h) {
    const userId = request.auth.credentials.id
    const exchangeSlug = request.params.exchange

    const side = request.payload.side
    const symbol = request.payload.symbol
    const amount = request.payload.amount
    const price = request.payload.price
    const params = null

    return (async () => {
      try {
        let result
        const exchange = await getExchangeBySlug(exchangeSlug)
        const userApiCredentials = await getDecodedExchangeApiCredentials(userId, exchange.id)

        // Set key and secret for current user
        // ExchangeWorkers[exchangeSlug].setApiCredentials(userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)

        if (side === 'buy') {
          result = await ExchangeWorkers[exchangeSlug].createMarketBuyOrder(symbol, amount, price, params, userId, userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)
        } else {
          result = await ExchangeWorkers[exchangeSlug].createMarketSellOrder(symbol, amount, price, params, userId, userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)
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

  delete (request, h) {
    const userId = request.auth.credentials.id
    const exchangeSlug = request.params.exchange
    const orderUuid = request.params.orderUuid

    return (async () => {
      try {
        const exchange = await getExchangeBySlug(exchangeSlug)
        const userApiCredentials = await getDecodedExchangeApiCredentials(userId, exchange.id)

        // Set key and secret for current user
        // ExchangeWorkers[exchangeSlug].setApiCredentials(userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)

        const result = await ExchangeWorkers[exchangeSlug].cancelOrder(orderUuid, userId, userApiCredentials.plainTextApiKey, userApiCredentials.plainTextApiSecret)

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
module.exports = new Orders()
