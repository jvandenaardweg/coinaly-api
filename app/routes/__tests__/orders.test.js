const orders = require('../orders')

describe('routes/orders.js', () => {
  it('should return an object', () => {
    expect(typeof orders).toBe('object')
  })

  it('each route should have an method, path, handler and options property', () => {
    orders.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
      expect(route).toHaveProperty('options')
    })
  })
})
