const ExchangeWorker = require('./exchange')
const redis = require('../cache/redis')
class PrivateExchangeWorker extends ExchangeWorker {
  constructor (userId, exchangeSlug, apiKey, apiSecret) {
    super(userId, exchangeSlug, apiKey, apiSecret)
  }

  // Private
  async fetchBalance (forceRefresh) {
    console.log('Exchange Worker (private):', 'Fetch Balance', `/ User ID: ${this.userId}`)
    // TODO: throttle/limit this async function


    const cacheKey = `private:exchanges:balance:${this.exchangeSlug}:${this.userId}`

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
  async fetchOrders () {
    console.log('Exchange Worker (private):', 'Fetch Orders', `/ User ID: ${this.userId}`)
    // TODO: throttle/limit this async function
    try {
      const result = await this.ccxt.fetchOrders()
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }
}

module.exports = PrivateExchangeWorker
