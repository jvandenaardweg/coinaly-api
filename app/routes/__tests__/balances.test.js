const balances = require('../balances')

describe('routes/balances.js', () => {
  it('should return an object', () => {
    expect(typeof balances).toBe('object')
  })

  it('each route should have an method, path, handler and options property', () => {
    balances.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
      expect(route).toHaveProperty('options')
    })
  })
})
