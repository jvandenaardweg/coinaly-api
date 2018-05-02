const tickers = require('../tickers')

describe('routes/tickers.js', () => {
  it('should return an object', () => {
    expect(typeof tickers).toBe('object')
  })

  it('each route should have an method, path, handler and options property', () => {
    tickers.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
      expect(route).toHaveProperty('options')
    })
  })
})
