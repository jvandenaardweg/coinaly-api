const ExchangeWorker = require('./exchange')
const redis = require('../cache/redis')
class PrivateExchangeWorker extends ExchangeWorker {
  constructor (type, exchangeSlug) {
    super(type, exchangeSlug)
  }

  // Private
  async fetchBalance (forceRefresh, userId) {
    console.log('Exchange Worker (private):', 'Fetch Balance', `/ User ID: ${userId}`)
    // TODO: throttle/limit this async function


    const cacheKey = `private:exchanges:balance:${this.exchangeSlug}:${userId}`

    try {
      if (forceRefresh) {
        console.log('Exchange Worker (private):', 'Remove Balance Cache')
        await this.deleteCache(cacheKey)
      }

      let result = await this.getCache(cacheKey)
      if (result) {
        result = JSON.parse(result)
      } else {
        result = await this.ccxt.fetchBalance()
        if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
        this.setCache(cacheKey, JSON.stringify(result))
      }
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Private
  async fetchOrders (forceRefresh, userId) {
    console.log('Exchange Worker (private):', 'Fetch Orders', `/ User ID: ${userId}`)
    const cacheKey = `private:exchanges:orders:${this.exchangeSlug}:${userId}`
    // TODO: throttle/limit this async function

    try {
      if (forceRefresh) {
        console.log('Exchange Worker (private):', 'Remove Balance Cache')
        await this.deleteCache(cacheKey)
      }

      let result = await this.getCache(cacheKey)
      if (result) {
        result = JSON.parse(result)
      } else {
        // TODO: Binance requires a list of symbols to fetch the orders
        result = await this.ccxt.fetchOrders()
        if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
        this.setCache(cacheKey, JSON.stringify(result))
      }
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }
}

module.exports = PrivateExchangeWorker
