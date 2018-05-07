const {
  getAllActiveExchanges,
  getExchangeById,
  getAllExchanges,
  getExchangeBySlug
} = require('../exchanges')

describe('database/methods/exchanges.js', () => {

  it('getAllActiveExchanges should get an array of all active exchanges', async (done) => {
    const activeExchanges = await getAllActiveExchanges()
    expect(Array.isArray(activeExchanges)).toBe(true)

    activeExchanges.forEach(activeExchange => {
      expect(activeExchange.active).toBe(true)
    })

    done()
  })

  it('getAllExchanges should get an array all exchanges', async (done) => {
    const activeExchanges = await getAllExchanges()
    expect(Array.isArray(activeExchanges)).toBe(true)
    done()
  })

  it('getExchangeBySlug should return an exchange found by slug', async (done) => {
    const exchange = await getExchangeBySlug('bittrex')
    expect(exchange.slug).toBe('bittrex')
    done()
  })

  it('getExchangeById should return an exchange found by id', async (done) => {
    const exchange = await getExchangeById(1)
    expect(exchange.id).toBe(1)
    done()
  })


})
