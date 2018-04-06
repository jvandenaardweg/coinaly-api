const ExchangeWorker = require('./exchange')
const redis = require('../cache/redis')
class PublicExchangeWorker extends ExchangeWorker {
  constructor (exchangeSlug) {
    super(null, exchangeSlug, null, null)
  }

  // Public
  // Markets are cached for 1 hour
  async fetchMarkets () {
    console.log('Exchange Worker (public):', 'Fetch Markets')
    const cacheKey = `public:exchanges:markets:fetch:${this.exchangeSlug}`

    try {
      let result = await this.getCache(cacheKey)
      if (result) {
        result = JSON.parse(result)
      } else {
        result = await this.ccxt.fetchMarkets()
        if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
        this.setCache(cacheKey, JSON.stringify(result))
      }
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Public
  // Markets are cached for 1 hour
  async loadMarkets () {
    console.log('Exchange Worker (public):', 'Load Markets')
    const cacheKey = `public:exchanges:markets:load:${this.exchangeSlug}`

    try {
      let result = await this.getCache(cacheKey)
      if (result) {
        result = JSON.parse(result)
      } else {
        result = await this.ccxt.loadMarkets()
        if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
        this.setCache(cacheKey, JSON.stringify(result))
      }
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Public
  // Tickers are cached for 5 seconds
  async fetchTickers () {
    console.log('Exchange Worker (public):', 'Fetch Tickers')
    const cacheKey = `public:exchanges:markets:tickers:${this.exchangeSlug}`

    try {
      let result = await this.getCache(cacheKey)
      if (result) {
        result = JSON.parse(result)
      } else {
        result = await this.ccxt.fetchTickers()
        if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
        this.setCache(cacheKey, JSON.stringify(result), 5) // 5 = 5 seconds
      }
      return result
    }  catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }
}

module.exports = PublicExchangeWorker
