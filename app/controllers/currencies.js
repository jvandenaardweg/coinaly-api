const Boom = require('boom')
const transformers = require('../helpers/transformers')

class Currencies {
  constructor () { }

  index (request, h) {
    return (async () => {
      try {

        // const result = await fetch('https://min-api.cryptocompare.com/data/all/coinlist').then(response => response.json())
        const result = await fetch('https://api.coinmarketcap.com/v1/ticker/?limit=0').then(response => response.json())
        // const transformedResult = transformers.transformObjectsCryptocompare(result.Data)
        const transformedResult = transformers.transformObjectsCoinmarketcap(result)

        return transformedResult
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Currencies()
