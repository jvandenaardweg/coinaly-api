// https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR

const Boom = require('boom')
const { convertObjectToKeyString, convertKeyStringToObject } = require('../helpers/objects')
const redis = require('../cache/redis')
const fetch = require('node-fetch')

class Prices {
  constructor () { }

  index (request, h) {
    // const symbols = request.query.symbols
    const symbols = 'BTC,ETH,USDT,BNB,USD,EUR'
    const pricesCacheKey = 'prices'

    return (async () => {
      try {
        const cachedPrices = await redis.hgetall(pricesCacheKey)

        if (Object.keys(cachedPrices).length) {
          return convertKeyStringToObject(cachedPrices)
        } else {
          const result = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD,EUR`)
          .then(response => response.json())

          const resultStringHMSET = convertObjectToKeyString(result)
          redis.hmset(pricesCacheKey, resultStringHMSET)
          redis.expire(pricesCacheKey, 60) // 1 minute
          return result
        }
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Prices()
