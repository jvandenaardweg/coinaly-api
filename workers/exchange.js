const ccxt = require('ccxt')
const redis = require('../cache/redis')
const { getPublicApiKeySecret } = require('../helpers/api-keys')
class ExchangeWorker {
  constructor (type, exchangeSlug) {
    this.exchangeSlug = exchangeSlug.toLowerCase()
    this.type = type

    this.createCCXTInstance()
  }

  // A public instance does not have access to private data, like; balance and orders
  // The results of this instance are cached heavily to not flood the API servers of the exchange
  // createPublicCCXTInstance () {
  //   const instanceId = `public-${this.exchangeSlug}`
  //   if (this.ccxt && this.ccxt.id === instanceId) return false
  //   try {
  //     console.log(`Exchange Worker (${this.type})`, `Creating public instance for ${this.exchangeSlug}...`)

  //     const apiCredentials = getPublicApiKeySecret(this.exchangeSlug)

  //     this.ccxt = new ccxt[this.exchangeSlug]({
  //       id: instanceId,
  //       apiKey: apiCredentials.apiKey,
  //       secret: apiCredentials.apiSecret,
  //       timeout: 15000,
  //       enableRateLimit: true
  //     })
  //   } catch (error) {
  //     console.log(`Exchange Worker (${this.type})`, `Creating ${this.type} instance FAILED...`)
  //     this.handleCCXTInstanceError(error)
  //   }
  // }

  // Creates a CCXT instance, without API credentials
  createCCXTInstance () {
    try {
      console.log(`Exchange Worker (${this.type})`, `Creating ${this.type} instance for ${this.exchangeSlug}...`)
      this.ccxt = new ccxt[this.exchangeSlug]({
        timeout: 15000,
        enableRateLimit: true
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
    console.log(`Exchange Worker (${this.type}):`, 'Redis:', 'Get Cache', key)
    const result = await redis.hget(key, 'all')
    return result
  }

  async setCache (key, data, expire = 3600) {
    console.log(`Exchange Worker (${this.type}):`, 'Redis:', 'Set Cache', key)
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
