const ExchangeWorker = require('./exchange')

let ExchangeWorkers = {}

// Make worker available globally per exchange, so we can use the build in rate limiter
ExchangeWorkers['bittrex'] = new ExchangeWorker('bittrex')
ExchangeWorkers['binance'] = new ExchangeWorker('binance')

module.exports = ExchangeWorkers
