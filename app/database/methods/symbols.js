const knex = require('../knex')
const transformers = require('../../helpers/transformers')
const fetch = require('node-fetch')

async function getSymbols () {
  try {
    const result = await fetch('https://min-api.cryptocompare.com/data/all/coinlist').then(response => response.json())
    console.log('getSymbols', result)
    const symbolsArray = transformers.transformObjectsCryptocompareToArray(result.Data)
    console.log('transformObjectsCryptocompareToArray', symbolsArray)
    return symbolsArray
  } catch (err) {
    console.log('Error getting symbols from external source')
    console.log(err)
    return err
  }
}

const insertNewSymbols = async function () {
  let missingSymbolsArray = []
  const externalSymbols = await getSymbols()
  const allStoredSymbols = await knex.select().from('symbols')
  const symbolList = allStoredSymbols.map(symbol => symbol.id, {}) // So we have an array of missing symbol IDs: ['BTC', 'ETH', 'USDT'] etc...

  // Now find missing symbols
  missingSymbolsArray = externalSymbols.filter(symbol => {
    return !symbolList.includes(symbol.id)
  })

  if (missingSymbolsArray.length) {
    await knex('symbols').insert(missingSymbolsArray)
    console.log('insertNewSymbols', `${missingSymbolsArray.length} missing symbols added!`)
    return false
  } else {
    console.log('insertNewSymbols', 'No missing symbols added.')
    return true
  }

}

const getAllSymbols = async function () {
  const results = await knex.select('id', 'name', 'icon_uri').from('symbols')
  return results.reduce((obj, key) => {
    obj[key.id] = key
    return obj
  }, {})
}

module.exports = {
  insertNewSymbols,
  getAllSymbols
}
