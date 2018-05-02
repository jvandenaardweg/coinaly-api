const currencies = require('../currencies')

describe('routes/currencies.js', () => {
  it('should return an object', () => {
    expect(typeof currencies).toBe('object')
  })

  it('each route should have an method, path, handler and options property', () => {
    currencies.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
      expect(route).toHaveProperty('options')
    })
  })
})
