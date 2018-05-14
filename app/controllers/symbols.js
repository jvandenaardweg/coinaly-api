const Boom = require('boom')
const { convertObjectToKeyString, convertKeyStringToObject } = require('../helpers/objects')
const redis = require('../cache/redis')
const { getAllSymbols, insertNewSymbols } = require('../database/methods/symbols')

function setCache (symbols) {
  const resultStringHMSET = convertObjectToKeyString(symbols)
  redis.hmset('symbols', resultStringHMSET)
  // redis.expire('symbols', 3600 * 24) // 24 uur
}

class Symbols {
  constructor () { }

  // Gets the symbols from cache
  // If cache is empty, first run: GET /symbols/fetch
  index (request, h) {
    return (async () => {
      try {
        const cachedSymbols = await redis.hgetall('symbols')
        if (Object.keys(cachedSymbols).length) return convertKeyStringToObject(cachedSymbols)
        return {
          message: 'Cache is empty. First run symbols/fetch.'
        }
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }

  // Fetches the symbols from an external source
  // Saves new symbols in the DB
  // Saves the symbols in cache (Redis)
  // This method should be run every X minutes in a worker process
  fetch (request, h) {
    return (async () => {
      try {
        await insertNewSymbols()
        const result = await getAllSymbols()
        setCache(result)
        return result
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Symbols()
