const keys = require('../keys')

describe('routes/keys.js', () => {
  it('should return an object', () => {
    expect(typeof keys).toBe('object')
  })

  it('each route should have an method, path, handler and options property', () => {
    keys.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
      expect(route).toHaveProperty('options')
    })
  })
})
