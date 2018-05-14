// https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR

const Boom = require('boom')
const { convertObjectToKeyString, convertKeyStringToObject } = require('../helpers/objects')
const redis = require('../cache/redis')
const { getAllPrices, insertNewPrices } = require('../database/methods/prices')

async function setCache (result) {
  const resultStringHMSET = convertObjectToKeyString(result)
  await redis.del('prices') // Empty, the cache first, so when we add new keys, it's always in sync with our database
  await redis.hmset('prices', resultStringHMSET)
}

class Prices {
  constructor () { }

  index (request, h) {
    return (async () => {
      try {
        const cachedPrices = await redis.hgetall('prices')
        if (Object.keys(cachedPrices).length) {
          return convertKeyStringToObject(cachedPrices)
        } else {
          return {
            message: 'Prices cache is empty. First run prices/fetch.'
          }
        }
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }

  fetch (request, h) {
    return (async () => {
      try {
        const prices = await insertNewPrices()
        const result = await getAllPrices()
        await setCache(result)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}

module.exports = new Prices()
