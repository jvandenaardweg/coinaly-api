const ccxt = require('ccxt')

class ExchangeWorker {
  constructor (exchangeSlug, redis) {
    this.exchangeSlug = exchangeSlug.toLowerCase()
    this.redis = redis
    this.supportedExchanges = ['bittrex', 'binance', 'poloniex']

    if (this.supportedExchanges.includes(exchangeSlug)) {
      this.createCCXTInstance()
    } else {
      throw new Error(`The exchange "${exchangeSlug}" is currently not supported.`)
    }
  }

  setApiCredentials (apiKey, apiSecret) {
    if (this.ccxt) {
      this.ccxt.apiKey = apiKey
      this.ccxt.secret = apiSecret
    } else {
      throw new Error('CCXT is not created in this instance, so we cannot set the API credentials.')
    }
  }

  // Creates a CCXT instance, without API credentials
  createCCXTInstance () {
    try {
      this.ccxt = new ccxt[this.exchangeSlug]({
        timeout: 15000,
        enableRateLimit: true
      })
      if (process.env.NODE_ENV !== 'test') console.log(`Exchange Worker:`, `Worker instance for ${this.exchangeSlug} created.`)
    } catch (error) {
      console.log(`Exchange Worker:`, `FAILED to create worker instance for ${this.exchangeSlug} created.`)
      this.handleCCXTInstanceError(error)
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
    // this.handleSentryError(`${this.exchangeSlug} Worker: CCXT Exchange Error: ${message}`)
  }

  // Public
  // Markets are cached for 1 hour
  async fetchMarkets (forceRefresh) {
    console.log(`Exchange Worker (public method):`, 'Fetch Markets')

    const cacheKey = `public:exchanges:markets:fetch:${this.exchangeSlug}`

    try {
      let result

      if (forceRefresh) {
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
    console.log(`Exchange Worker (public method):`, 'Load Markets')

    const cacheKey = `public:exchanges:markets:load:${this.exchangeSlug}`

    try {
      let result

      if (forceRefresh) {
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
    console.log(`Exchange Worker (public method):`, 'Fetch Tickers (multiple)')

    const cacheKey = `public:exchanges:markets:tickers:${this.exchangeSlug}`

    try {
      let result

      if (forceRefresh) {
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
    console.log(`Exchange Worker (public method):`, 'Fetch Ticker (single)')

    const cacheKey = `public:exchanges:ticker:${this.exchangeSlug}:${symbol}`

    try {
      let result

      if (forceRefresh) {
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

  // Private (needs userId)
  async fetchBalance (forceRefresh, userId) {
    console.log('Exchange Worker (private method):', 'Fetch Balance', `/ User ID: ${userId}`)

    const cacheKey = `private:exchanges:balances:${this.exchangeSlug}:${userId}`

    try {
      let result

      if (forceRefresh) {
        await this.deleteCache(cacheKey)
      } else {
        result = await this.getCache(cacheKey)
      }

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

  // Private (needs userId)
  async fetchOrders (forceRefresh, userId) {
    console.log('Exchange Worker (private method):', 'Fetch Orders', `/ User ID: ${userId}`)

    const cacheKey = `private:exchanges:orders:${this.exchangeSlug}:${userId}`

    try {
      let result

      if (forceRefresh) {
        await this.deleteCache(cacheKey)
      } else {
        result = await this.getCache(cacheKey)
      }

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

  async getCache (key) {
    console.log(`Exchange Worker (redis):`, 'Get Cache', key)
    const result = await this.redis.hget(key, 'all')
    return result
  }

  async setCache (key, data, expire = 3600) {
    console.log(`Exchange Worker (redis):`, 'Set Cache', key)
    const result = await this.redis.hset(key, 'all', data)
    this.redis.expire(key, expire) // Expire 3600 = 1 hour
    return result
  }

  async deleteCache (key) {
    console.log(`Exchange Worker (redis):`, 'Delete Cache', key)
    const result = await this.redis.keys(key)
    .then(keys => {
      const pipeline = this.redis.pipeline()
      keys.forEach(key => {
        pipeline.del(key)
      })
      return pipeline.exec()
    })
    return result
  }
}

module.exports = ExchangeWorker
