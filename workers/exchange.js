const ccxt = require('ccxt')
const redis = require('../cache/redis')
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
      console.log('Exchange Worker', 'Create private instance')
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

  async getCache (key) {
    console.log('Exchange Worker:', 'Redis:', 'Get Cache', key)
    const result = await redis.hget(key, 'all')
    return result
  }

  async setCache (key, data, expire = 3600) {
    console.log('Exchange Worker:', 'Redis:', 'Set Cache', key)
    const result = await redis.hset(key, 'all', data)
    redis.expire(key, expire) // Expire 3600 = 1 hour
    return result
  }

  async deleteCache (key) {
    const result = await redis.keys(key)
    .then(keys => {
      // Use pipeline instead of sending
      // one command each time to improve the
      // performance.
      const pipeline = redis.pipeline()
      keys.forEach(key => {
        pipeline.del(key)
      })
      return pipeline.exec()
    })
    return result
  }
}

module.exports = ExchangeWorker
