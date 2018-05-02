const withdrawals = require('../withdrawals')

describe('routes/withdrawals.js', () => {
  it('should return an object', () => {
    expect(typeof withdrawals).toBe('object')
  })

  it('each route should have an method, path, handler and options property', () => {
    withdrawals.forEach(route => {
      expect(route).toHaveProperty('method')
      expect(route).toHaveProperty('path')
      expect(route).toHaveProperty('handler')
      expect(route).toHaveProperty('options')
    })
  })
})
