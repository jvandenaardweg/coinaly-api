const ExchangeWorker = require('./exchange')

class PublicExchangeWorker extends ExchangeWorker {
  constructor (exchangeSlug) {
    super(null, exchangeSlug, null, null)
  }

  // Public
  // TODO: should always cache this
  async fetchMarkets () {
    console.log('Exchange Worker (public):', 'Fetch Markets')
    try {
      const result = await this.ccxt.fetchMarkets()
      if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Public
  // TODO: should always cache this
  async loadMarkets () {
    console.log('Exchange Worker (public):', 'Load Markets')
    try {
      const result = await this.ccxt.loadMarkets()
      if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Public
  // TODO: should always cache this for 1 second
  async fetchTickers () {
    console.log('Exchange Worker (public):', 'Fetch Tickers')
    try {
      const result = await this.ccxt.fetchTickers()
      if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }
}

module.exports = PublicExchangeWorker
