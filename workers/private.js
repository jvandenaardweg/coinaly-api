const ccxt = require('ccxt')
const ExchangeWorker = require('./exchange')

class PrivateExchangeWorker extends ExchangeWorker {
  constructor (userId, exchangeSlug, apiKey, apiSecret) {
    super(userId, exchangeSlug, apiKey, apiSecret)
  }

  // Private
  async fetchBalance () {
    console.log('Exchange Worker (private):', 'Fetch Balance', `/ User ID: ${this.userId}`)
    // TODO: throttle/limit this async function
    try {
      const result = await this.ccxt.fetchBalance()
      if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
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
