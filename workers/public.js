const ExchangeWorker = require('./exchange')
const redis = require('../cache/redis')
class PublicExchangeWorker extends ExchangeWorker {
  constructor (exchangeSlug) {
    super('public', exchangeSlug)
    console.log(`Exchange Worker (${this.type}):`, `Instance for ${this.exchangeSlug} created.`)
  }

  // Public
  // Markets are cached for 1 hour
  async fetchMarkets (forceRefresh) {
    console.log(`Exchange Worker (${this.type}):`, 'Fetch Markets')
    const cacheKey = `public:exchanges:markets:fetch:${this.exchangeSlug}`

    try {
      let result

      if (forceRefresh) {
        console.log(`Exchange Worker (${this.type}):`, 'Remove Fetch Markets Cache')
        await this.deleteCache(cacheKey)
      } else {
        result = await this.getCache(cacheKey)
      }

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
  async loadMarkets (forceRefresh) {
    console.log(`Exchange Worker (${this.type}):`, 'Load Markets')
    const cacheKey = `public:exchanges:markets:load:${this.exchangeSlug}`

    try {
      let result

      if (forceRefresh) {
        console.log(`Exchange Worker (${this.type}):`, 'Remove Load Markets Cache')
        await this.deleteCache(cacheKey)
      } else {
        result = await this.getCache(cacheKey)
      }

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
  async fetchTickers (forceRefresh) {
    console.log(`Exchange Worker (${this.type})`, 'Fetch Tickers')
    const cacheKey = `public:exchanges:markets:tickers:${this.exchangeSlug}`

    try {
      let result

      if (forceRefresh) {
        console.log(`Exchange Worker (${this.type}):`, 'Remove Fetch Tickers Cache')
        await this.deleteCache(cacheKey)
      } else {
        result = await this.getCache(cacheKey)
      }

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

  // Public
  // Ticker is cached for 5 seconds
  async fetchTicker (symbol, forceRefresh) {
    console.log(`Exchange Worker (${this.type}):`, 'Fetch Ticker', symbol)
    const cacheKey = `public:exchanges:markets:ticker:${this.exchangeSlug}:${symbol}`

    try {
      let result

      if (forceRefresh) {
        console.log(`Exchange Worker (${this.type}):`, 'Remove Fetch Ticker Cache')
        await this.deleteCache(cacheKey)
      } else {
        result = await this.getCache(cacheKey)
      }

      if (result) {
        result = JSON.parse(result)
      } else {
        result = await this.ccxt.fetchTicker(symbol)
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
