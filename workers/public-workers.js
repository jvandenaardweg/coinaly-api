const PublicExchangeWorker = require('./public')
let PublicExchangeWorkers = {}

// Make worker available globally per exchange, so we can use the build in rate limiter
PublicExchangeWorkers['bittrex'] = new PublicExchangeWorker('bittrex')
PublicExchangeWorkers['binance'] = new PublicExchangeWorker('binance')

module.exports = PublicExchangeWorkers
