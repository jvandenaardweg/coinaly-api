const ccxt = require('ccxt')

class ExchangeWorker {
  constructor (userId, exchangeSlug, apiKey, apiSecret) {
    this.exchangeSlug = exchangeSlug.toLowerCase()

    // Determine to create a public or private instance
    if (userId && apiKey && apiSecret) {
      this.userId = userId
      this.apiKey = apiKey
      this.apiSecret = apiSecret
      this.createPrivateCCXTInstance()
    } else {
      this.createPublicCCXTInstance()
    }
  }

  // A public instance does not have access to private data, like; balance and orders
  // The results of this instance are cached heavily to not flood the API servers of the exchange
  createPublicCCXTInstance () {
    const instanceId = `public-${this.exchangeSlug}`
    if (this.ccxt && this.ccxt.id === instanceId) return false
    try {
      console.log('Exchange Worker', 'Create public instance')
      this.ccxt = new ccxt[this.exchangeSlug]({
        id: instanceId,
        apiKey: process.env.PUBLIC_BITTREX_API_KEY, // TODO: MAKE DYNAMIC
        secret: process.env.PUBLIC_BITTREX_API_SECRET,// TODO: MAKE DYNAMIC
        timeout: 15000
      })
    } catch (error) {
      this.handleCCXTInstanceError(error)
    }
  }

  // A private instance has access to all API data, including; balance and orders
  // The results of this instance are only for a certain user.
  // ONLY THAT USER HAS ACCESS TO THESE RESPONSES
  createPrivateCCXTInstance () {
    // Create an CCXT instance per user
    try {
      this.ccxt = new ccxt[this.exchangeSlug]({
        id: this.userId,
        apiKey: this.apiKey,
        secret: this.apiSecret,
        timeout: 15000
      })
    } catch (error) {
      this.handleCCXTInstanceError(error)
    }

  }

  // Private
  async fetchBalance () {
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
    // TODO: throttle/limit this async function
    try {
      const result = await this.ccxt.fetchOrders()
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Public
  // TODO: should always cache this one and use organisation api read key
  async fetchMarkets () {
    try {
      const result = await this.ccxt.fetchMarkets()
      if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Public
  // TODO: should always cache this one and use organisation api read key
  async loadMarkets () {
    try {
      const result = await this.ccxt.loadMarkets()
      if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Public
  // TODO: should always cache this one and use organisation api read key
  async fetchTickers () {
    try {
      const result = await this.ccxt.fetchTickers()
      if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
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
