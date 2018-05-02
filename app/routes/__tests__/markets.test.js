const markets = require('../markets')

describe('routes/markets.js', () => {
  it('should return an object', () => {
    expect(typeof markets).toBe('object')
  })

  it('each route should have an method, path, handler and options property', () => {
    markets.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
      expect(route).toHaveProperty('options')
    })
  })
})
