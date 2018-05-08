const Boom = require('boom')
const transformers = require('../helpers/transformers')
const { convertObjectToKeyString, convertKeyStringToObject } = require('../helpers/objects')
const redis = require('../cache/redis')
const fetch = require('node-fetch')
class Currencies {
  constructor () { }

  index (request, h) {
    return (async () => {
      try {
        const cachedCurrencies = await redis.hgetall('currencies')

        if (Object.keys(cachedCurrencies).length) {
          return convertKeyStringToObject(cachedCurrencies)
        } else {
          // const result = await fetch('https://min-api.cryptocompare.com/data/all/coinlist').then(response => response.json())
          const result = await fetch('https://api.coinmarketcap.com/v1/ticker/?limit=0').then(response => response.json())
          // const transformedResult = transformers.transformObjectsCryptocompare(result.Data)
          const transformedResult = transformers.transformObjectsCoinmarketcap(result)
          const resultStringHMSET = convertObjectToKeyString(transformedResult)
          redis.hmset('currencies', resultStringHMSET)
          redis.expire('currencies', 3600 * 24) // 24 uur
          return transformedResult
        }
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Currencies()
