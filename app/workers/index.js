const ExchangeWorker = require('./exchange')
const redis = require('../cache/redis')
let ExchangeWorkers = {}

// Make worker available globally per exchange, so we can use the build in rate limiter
try {
  ExchangeWorkers['bittrex'] = new ExchangeWorker('bittrex', redis)
  ExchangeWorkers['binance'] = new ExchangeWorker('binance', redis)
} catch (e) {
  console.log('Error creating all ExchangeWorkers', e)
}


module.exports = ExchangeWorkers
