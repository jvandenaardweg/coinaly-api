const deposits = require('../deposits')

describe('routes/deposits.js', () => {
  it('should return an object', () => {
    expect(typeof deposits).toBe('object')
  })

  it('each route should have an method, path, handler and options property', () => {
    deposits.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
      expect(route).toHaveProperty('options')
    })
  })
})
