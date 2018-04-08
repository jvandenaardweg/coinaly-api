const ExchangeWorker = require('./exchange')

const redisMock = {
  hget: function () {},
  hset: function () {}
}

describe('workers/exchange', () => {

  let ExchangeWorkers = {}

  beforeEach(() => {
    ExchangeWorkers['bittrex'] = new ExchangeWorker('bittrex', redisMock)
    ExchangeWorkers['binance'] = new ExchangeWorker('binance', redisMock)
  })

  it('should create a ExchangeWorker instance', () => {
    expect(ExchangeWorkers['bittrex']).toBeInstanceOf(ExchangeWorker)
    expect(ExchangeWorkers['binance']).toBeInstanceOf(ExchangeWorker)
  })

  it('should throw an error when exchange is not supported', () => {
    try {
      ExchangeWorkers['someweirdexchangename'] = new ExchangeWorker('someweirdexchangename')
    } catch (e) {
      expect(e.message).toBe('The exchange "someweirdexchangename" is currently not supported.')
    }
  })

  it('should create a CCXT instance upon creation', () => {
    expect(typeof ExchangeWorkers['bittrex'].ccxt).toBe('object')
  })

  it('should create a CCXT instance without API credentials', () => {
    expect(ExchangeWorkers['bittrex'].ccxt.apiKey).toBe(undefined)
    expect(ExchangeWorkers['bittrex'].ccxt.secret).toBe(undefined)
  })

  it('should create a CCXT instance with rate limiting enabled', () => {
    expect(ExchangeWorkers['bittrex'].ccxt.enableRateLimit).toBe(true)
  })

  it('should set the correct API credentials', () => {
    ExchangeWorkers['bittrex'].setApiCredentials('test', 'test')
    expect(ExchangeWorkers['bittrex'].ccxt.apiKey).toBe('test')
    expect(ExchangeWorkers['bittrex'].ccxt.secret).toBe('test')
  })

})
