const {
  insertAllSymbols,
  insertNewSymbols
} = require('../symbols')

describe('database/methods/symbols.js', () => {

  // it('insertAllSymbols should insert all symbols from the external API', async (done) => {

  //   const symbolIds = await insertAllSymbols()
  //   expect(Array.isArray(symbolIds)).toBe(true)
  //   done()
  // })

  it('insertNewSymbols should insert new symbols from the external API', async (done) => {
    const result = await insertNewSymbols()
    expect(typeof result).toBe('boolean')
    done()
  })

})
