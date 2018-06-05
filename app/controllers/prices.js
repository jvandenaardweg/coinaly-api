// https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR

const Boom = require('boom')
const { convertObjectToKeyString, convertKeyStringToObject } = require('../helpers/objects')
const redis = require('../cache/redis')
const { getAllPrices, insertNewPrices } = require('../database/methods/prices')
const fetch = require('node-fetch')

async function setCache (key, result) {
  const resultStringHMSET = convertObjectToKeyString(result)
  await redis.del(key) // Empty, the cache first, so when we add new keys, it's always in sync with our database
  await redis.hmset(key, resultStringHMSET)
  await redis.expire(key, 3600) // 1 hour
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
          const prices = await insertNewPrices()
          const result = await getAllPrices()
          await setCache('prices', result)
          return result
          // return {
          //   message: 'Prices cache is empty. First run prices/fetch.'
          // }
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
        await setCache('prices', result)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }

  history (request, h) {
    const baseId = request.query.baseId
    const quoteId = request.query.quoteId
    const interval = request.query.interval
    const symbol = baseId + '/' + quoteId
    const cacheName = `public:prices:history:${symbol}:${interval}`
    let limit = 31

    if (interval === '1w') {
      limit = 7
    } else if (interval === '1m') {
      limit = 31
    }

    return (async () => {
      try {
        const cachedPricesHistory = await redis.hget(cacheName, symbol)
        if (cachedPricesHistory) {
          return JSON.parse(cachedPricesHistory)
        }

        const result = await fetch(`https://min-api.cryptocompare.com/data/histoday?fsym=${baseId}&tsym=${quoteId}&limit=${limit}`).then(response => response.json())
        const prices = result.Data
        const data = {
          [symbol]: prices
        }
        await redis.hset(cacheName, symbol, JSON.stringify(data))
        await redis.expire(cacheName, 3600) // 1 hour
        return data
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}

module.exports = new Prices()
