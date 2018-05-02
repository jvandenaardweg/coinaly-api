const auth = require('../auth')

describe('routes/auth.js', () => {
  it('should return an object', () => {
    expect(typeof auth).toBe('object')
  })

  it('each route should have an method, path, handler and options property', () => {
    auth.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
      expect(route).toHaveProperty('options')
    })
  })
})
