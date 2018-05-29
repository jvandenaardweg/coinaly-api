const ccxt = require('ccxt')

class ExchangeWorker {
  constructor (exchangeSlug, redis) {
    this.ccxt = {}
    this.exchangeSlug = exchangeSlug.toLowerCase()
    this.redis = redis
    this.supportedExchanges = ['bittrex', 'binance', 'poloniex']

    if (this.supportedExchanges.includes(exchangeSlug)) {
      // this.createCCXTInstance(userId)
    } else {
      throw new Error(`The exchange "${exchangeSlug}" is currently not supported.`)
    }
  }

  setApiCredentials (userId, plainTextApiKey, plainTextApiSecret) {
    if (!this.ccxt[userId]) {
      this.createCCXTInstance(userId, plainTextApiKey, plainTextApiSecret)
    }
  }

  removeApiCredentials (userId) {
    if (this.ccxt[userId]) {
      this.ccxt.apiKey = null
      this.ccxt.secret = null
    } else {
      throw new Error('CCXT is not created in this instance, so we cannot remove the API credentials.')
    }
  }

  // Creates a CCXT instance, without API credentials
  createCCXTInstance (userId, plainTextApiKey, plainTextApiSecret) {
    try {
      this.ccxt[userId] = new ccxt[this.exchangeSlug]({
        id: userId,
        timeout: 15000,
        enableRateLimit: true,
        verbose: false,
        apiKey: plainTextApiKey,
        secret: plainTextApiSecret
      })
      if (process.env.NODE_ENV !== 'test') console.log(`Exchange Worker:`, `Worker instance for User ID "${userId}" for "${this.exchangeSlug}" created.`)
    } catch (error) {
      console.log(`Exchange Worker:`, `FAILED to create worker instance for ${this.exchangeSlug} created.`)
      this.handleCCXTInstanceError(error)
    }
  }

  handleCCXTInstanceError (error) {
    // Create custom messages with the available errors
    // So we can show these friendly message to the user
    // More: https://github.com/ccxt/ccxt/wiki/Manual#error-handling
    // We break up the error in 2 sections: NetworkError and ExchangeError
    /*
    + BaseError
    |
    +---+ ExchangeError
    |   |
    |   +---+ NotSupported
    |   |
    |   +---+ AuthenticationError
    |   |   |
    |   |   +---+ PermissionDenied
    |   |
    |   +---+ InsufficientFunds
    |   |
    |   +---+ InvalidAddress
    |   |
    |   +---+ InvalidOrder
    |       |
    |       +---+ OrderNotFound
    |
    +---+ NetworkError (recoverable)
        |
        +---+ DDoSProtection
        |
        +---+ RequestTimeout
        |
        +---+ ExchangeNotAvailable
        |
        +---+ InvalidNonce
    */

    let message
    const errorName = error.constructor.name

    if (error instanceof ccxt.ExchangeError) {
      if (error instanceof ccxt.NotSupported) {
        message = `There ${this.exchangeSlug} exchange does not support this.`
        console.log('CCXT:', 'Error', errorName, message)
        throw message
      } else if (error instanceof ccxt.AuthenticationError) {
        if (error instanceof ccxt.PermissionDenied) {
          message = `The ${this.exchangeSlug} exchange responded with a Permission Denied error while authenticating. Is your API key and secret correct and active?`
          console.log('CCXT:', 'Error', errorName, message)
          throw message
        } else {
          message = `There was an error authenticating with the ${this.exchangeSlug} exchange. Is your API key and secret correct and active?`
          console.log(error)
          console.log('CCXT:', 'Error', errorName, message)
          throw message
        }
      } else if (error instanceof ccxt.InsufficientFunds) {
        message = `It seems you do not have sufficient funds available on the ${this.exchangeSlug} exchange.`
        console.log('CCXT:', 'Error', errorName, message)
        throw message
      } else if (error instanceof ccxt.InvalidAddress) {
        message = 'The address is invalid.'
        console.log('CCXT:', 'Error', errorName, message)
        throw message
      } else if (error instanceof ccxt.InvalidOrder) {
        if (error instanceof ccxt.OrderNotFound) {
          message = 'The order is not found.'
          console.log('CCXT:', 'Error', errorName, message)
          throw message
        } else {
          message = 'The order is invalid.'
          console.log('CCXT:', 'Error', errorName, message)
          throw message
        }
      } else {
        message = `The ${this.exchangeSlug} exchange responded with an unknown error. Is your API key and secret correct and active? If so, you should try again.`
        console.log('CCXT:', 'Error', errorName, message)
        throw message
      }
    } else if (error instanceof ccxt.NetworkError) {
      if (error instanceof ccxt.DDoSProtection || error.message.includes('ECONNRESET')) {
        message = `The exchange ${this.exchangeSlug} seems to be under heavy load and activated DDoS protection. You should try again later.`
        console.log('CCXT:', 'Error', errorName, message)
        throw message
      } else if (error instanceof ccxt.RequestTimeout) {
        message = `There was a delay in communicating with the ${this.exchangeSlug} exchange. You should try again.`
        console.log('CCXT:', 'Error', errorName, message)
        throw message
      } else if (error instanceof ccxt.ExchangeNotAvailable) {
        message = `The exchange ${this.exchangeSlug} does not seem to be available right now. You should try again later.`
        console.log('CCXT:', 'Error', errorName, message)
        throw message
      } else if (error instanceof ccxt.InvalidNonce) {
        message = `The "nonce" used to communicate with the ${this.exchangeSlug} exchange seems to be invalid. Contact us when this keeps happening.`
        console.log('CCXT:', 'Error', errorName, message)
        throw message
      } else {
        message = `There was a network error while communicating with the ${this.exchangeSlug} exchange. You should try again later.`
        console.log('CCXT:', 'Error', errorName, message)
        throw message
      }
    } else {
      throw error
    }
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
        this.setApiCredentials('public', null, null)
        result = await this.ccxt['public'].fetchMarkets()
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
        this.setApiCredentials('public', null, null)
        result = await this.ccxt['public'].loadMarkets()
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
        this.setApiCredentials('public', null, null)
        result = await this.ccxt['public'].fetchTickers()
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
        this.setApiCredentials('public', null, null)
        result = await this.ccxt['public'].fetchTicker(symbol)
        if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
        this.setCache(cacheKey, JSON.stringify(result), 5) // 5 = 5 seconds
      }
      return result
    }  catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Public method
  async fetchOHLCV (marketSymbol, interval = '1m', forceRefresh) {
    console.log(`Exchange Worker (public method):`, 'Fetch OHLCV')

    const cacheKey = `public:exchanges:ohlcv:${this.exchangeSlug}:${marketSymbol}:${interval}`

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
        this.setApiCredentials('public', null, null)
        result = await this.ccxt['public'].fetchOHLCV(marketSymbol, interval)
        // if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
        this.setCache(cacheKey, JSON.stringify(result), 1800) // 30 minutes
      }
      return result
    }  catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Private (needs userId)
  async fetchBalance (forceRefresh, userId, plainTextApiKey, plainTextApiSecret) {
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
        this.setApiCredentials(userId, plainTextApiKey, plainTextApiSecret)
        result = await this.ccxt[userId].fetchBalance()
        if (result.info) delete result.info // Deletes the "info" object from the response. The info object contains the original exchange data
        this.setCache(cacheKey, JSON.stringify(result))
      }
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Private (needs userId)
  async fetchOrders (forceRefresh, userId, plainTextApiKey, plainTextApiSecret) {
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
        this.setApiCredentials(userId, plainTextApiKey, plainTextApiSecret)
        result = await this.ccxt[userId].fetchOrders()
        this.removeApiCredentials()
        this.setCache(cacheKey, JSON.stringify(result))
      }
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Private (needs userId)
  async fetchClosedOrders (forceRefresh, userId, plainTextApiKey, plainTextApiSecret) {
    console.log('Exchange Worker (private method):', 'Fetch Closed Orders', `/ User ID: ${userId}`)

    const cacheKey = `private:exchanges:orders:closed:${this.exchangeSlug}:${userId}`

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
        this.setApiCredentials(userId, plainTextApiKey, plainTextApiSecret)
        result = await this.ccxt[userId].fetchClosedOrders()
        this.setCache(cacheKey, JSON.stringify(result))
      }
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Private (needs userId)
  async fetchOpenOrders (forceRefresh, userId, plainTextApiKey, plainTextApiSecret) {
    console.log('Exchange Worker (private method):', 'Fetch Open Orders', `/ User ID: ${userId}`)

    const cacheKey = `private:exchanges:orders:open:${this.exchangeSlug}:${userId}`

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
        this.setApiCredentials(userId, plainTextApiKey, plainTextApiSecret)
        result = await this.ccxt[userId].fetchOpenOrders()
        this.setCache(cacheKey, JSON.stringify(result))
      }
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Private (needs userId)
  async createLimitBuyOrder (symbol, amount, price, params = {}, userId, plainTextApiKey, plainTextApiSecret) {
    console.log('Exchange Worker (private method):', 'Create Limit Buy Order', `/ User ID: ${userId}`)

    try {
      this.setApiCredentials(userId, plainTextApiKey, plainTextApiSecret)
      const result = await this.ccxt[userId].createLimitBuyOrder(symbol, amount, price, params)
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Private (needs userId)
  async createLimitSellOrder (symbol, amount, price, params = {}, userId, plainTextApiKey, plainTextApiSecret) {
    console.log('Exchange Worker (private method):', 'Create Limit Sell Order', `/ User ID: ${userId}`)

    try {
      this.setApiCredentials(userId, plainTextApiKey, plainTextApiSecret)
      const result = await this.ccxt[userId].createLimitSellOrder(symbol, amount, price, params)
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Private (needs userId)
  async createMarketBuyOrder (symbol, amount, price, params = {}, userId, plainTextApiKey, plainTextApiSecret) {
    console.log('Exchange Worker (private method):', 'Create Market Buy Order', `/ User ID: ${userId}`)

    try {
      this.setApiCredentials(userId, plainTextApiKey, plainTextApiSecret)
      const result = await this.ccxt[userId].createMarketBuyOrder(symbol, amount, price, params)
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Private (needs userId)
  async createMarketSellOrder (symbol, amount, price, params = {}, userId, plainTextApiKey, plainTextApiSecret) {
    console.log('Exchange Worker (private method):', 'Create Market Sell Order', `/ User ID: ${userId}`)

    try {
      this.setApiCredentials(userId, plainTextApiKey, plainTextApiSecret)
      const result = await this.ccxt[userId].createMarketSellOrder (symbol, amount, price, params)
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Private (needs userId)
  async cancelOrder(orderUuid, userId, plainTextApiKey, plainTextApiSecret) {
    console.log('Exchange Worker (private method):', 'Cancel Order', `/ User ID: ${userId}`)

    try {
      this.setApiCredentials(userId, plainTextApiKey, plainTextApiSecret)
      const result = await this.ccxt[userId].cancelOrder(orderUuid)
      return result
    } catch (error) {
      return this.handleCCXTInstanceError(error)
    }
  }

  // Private
  // IMPORTENT: We should never cache this endpoint, so we always got the latest address from the exchange
  async fetchDepositAddress (symbolId, userId, forceRefresh, plainTextApiKey, plainTextApiSecret) {
    console.log(`Exchange Worker (private method):`, 'Fetch Deposit Address')

    try {
      this.setApiCredentials(userId, plainTextApiKey, plainTextApiSecret)
      const result = await this.ccxt[userId].fetchDepositAddress(symbolId)
      return result
    }  catch (error) {
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
