const ccxt = require('ccxt')

class ExchangeWorker {
  constructor (userId, exchangeSlug, apiKey, apiSecret) {
    this.userId = userId
    this.exchangeSlug = exchangeSlug.toLowerCase()
    this.apiKey = apiKey
    this.apiSecret = apiSecret

    this.createCCXTInstance()
  }

  createCCXTInstance () {
    const exchangeSlug = this.exchangeSlug

    // Create an CCXT instance per user
    try {
      this.ccxt = new ccxt[exchangeSlug]({
        id: this.userId,
        apiKey: this.apiKey,
        secret: this.apiSecret,
        timeout: 15000
      })
    } catch (error) {
      this.handleCCXTInstanceError(error)
    }

  }

  async fetchBalance () {
    try {
      const result = await this.ccxt.fetchBalance()
      if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  async fetchMarkets () {
    try {
      const result = await this.ccxt.fetchMarkets()
      if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  async loadMarkets () {
    try {
      const result = await this.ccxt.loadMarkets()
      if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  async fetchTickers () {
    try {
      const result = await this.ccxt.fetchTickers()
      if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  async fetchOrders () {
    try {
      const result = await this.ccxt.fetchOrders()
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  handleCCXTInstanceError (error) {
    let message
    let reason = null
    let exchangeErrorCode = null
    if (error instanceof ccxt.DDoSProtection || error.message.includes('ECONNRESET')) {
      message = error.message
      reason = 'ddos protection'
      console.log('CCXT:', 'Error', 'DDOS Protection')
    } else if (error instanceof ccxt.RequestTimeout) {
      message = error.message
      reason = 'request timeout'
      console.log('CCXT:', 'Error', 'Request Timeout')
    } else if (error instanceof ccxt.AuthenticationError) {
      message = error.message
      reason = 'authentication error'
      console.log('CCXT:', 'Error', 'Authenticfation Error')
    } else if (error instanceof ccxt.ExchangeNotAvailable) {
      message = error.message
      reason = 'exchange not available error'
      console.log('CCXT:', 'Error', 'Exchange Not Available')
    } else if (error instanceof ccxt.ExchangeError) {
      message = error.message
      reason = 'exchange error'
      console.log('CCXT:', 'Error', 'Exchange Error')
    } else if (error instanceof ccxt.NetworkError) {
      message = error.message
      reason = 'network error'
      console.log('CCXT:', 'Error', 'Network Error')
    } else {
      message = error.message
    }


    console.log('CCXT:', 'Error', message)
    throw new Error(message)

    // TODO: if error, restart instance?
    // this.handleSentryError(`${this.exchangeName} Worker: CCXT Exchange Error: ${message}`)
  }
}

module.exports = ExchangeWorker
