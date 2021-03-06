const symbols = require('../symbols')

describe('routes/symbols.js', () => {
  it('should return an object', () => {
    expect(typeof symbols).toBe('object')
  })

  it('each route should have an method, path, handler and options property', () => {
    symbols.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
      expect(route).toHaveProperty('options')
    })
  })
})
