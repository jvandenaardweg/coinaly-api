const PrivateExchangeWorker = require('./private')
let PrivateExchangeWorkers = {}

// Make worker available globally per exchange, so we can use the build in rate limiter per exchange
PrivateExchangeWorkers['bittrex'] = new PrivateExchangeWorker('private', 'bittrex')
PrivateExchangeWorkers['binance'] = new PrivateExchangeWorker('private', 'binance')

module.exports = PrivateExchangeWorkers

