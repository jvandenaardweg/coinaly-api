const knex = require('../knex')
const transformers = require('../../helpers/transformers')
const fetch = require('node-fetch')

/*
{
  "BTC": {
    "USD": 8376.78,
    "EUR": 6993.77
  },
  "ETH": {
    "USD": 702.24,
    "EUR": 586.99
  },
  "USDT": {
    "USD": 1,
    "EUR": 0.8353
  },
  "BNB": {
    "USD": 12.47,
    "EUR": 10.41
  },
  "USD": {
    "USD": 1,
    "EUR": 0.8333
  },
  "EUR": {
    "USD": 1.2,
    "EUR": 1
  }
}
*/
async function getPrices () {
  try {
    const symbols = 'BTC,ETH,USDT,BNB,XRP,BCH,EOS,LTC,ADA' // <- Should contain a list of all quote symbols from exchanges, so we can do a proper value calculation
    const result = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD,EUR,GBP,JPY,KRW`).then(response => response.json())
    return result
  } catch (err) {
    console.log('Error getting prices from external source')
    console.log(err)
    return err
  }
}

const insertNewPrices = async function () {
  let missingPricesArray = []
  const externalPrices = await getPrices()
  const allStoredPrices = await knex.select().from('prices')

  // Make an array of the data we need to insert in the DB
  const externalPricesArray = Object.keys(externalPrices).map(symbolId => {
    return {
      symbol_id: symbolId,
      USD: externalPrices[symbolId].USD,
      EUR: externalPrices[symbolId].EUR,
      GBP: externalPrices[symbolId].GBP,
      JPY: externalPrices[symbolId].JPY,
      KRW: externalPrices[symbolId].KRW
    }
  })

  const symbolList = allStoredPrices.map(price => price.symbol_id, {}) // So we have an array of symbol IDs: ['BTC', 'ETH', 'USDT'] etc...

  // Now find missing symbols
  missingPricesArray = externalPricesArray.filter(price => {
    return !symbolList.includes(price.symbol_id)
  })

  if (missingPricesArray.length) {
    console.log('insertNewPrices', `${missingPricesArray.length} missing prices added! All good!`)
    await knex('prices').insert(missingPricesArray).returning('*')
  }

  // Update prices
  for (let price of externalPricesArray) {
    price.updated_at = 'now'
    await knex('prices').update(price).where({symbol_id: price.symbol_id})
  }

}

const getAllPrices = async function () {
  const results = await knex.select('symbol_id', 'USD', 'EUR', 'GBP', 'JPY', 'KRW', 'updated_at').from('prices').orderBy('symbol_id', 'asc')
  return results.reduce((obj, key) => {
    obj[key.symbol_id] = key
    return obj
  }, {})
}

module.exports = {
  insertNewPrices,
  getAllPrices
}
