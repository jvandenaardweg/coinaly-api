const users = require('../users')

describe('routes/users.js', () => {
  it('should return an object', () => {
    expect(typeof users).toBe('object')
  })

  it('each route should have an method, path, handler and options property', () => {
    users.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
      expect(route).toHaveProperty('options')
    })
  })
})
