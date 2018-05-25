const knex = require('../knex')
const transformers = require('../../helpers/transformers')
const fetch = require('node-fetch')

async function getSymbols () {
  try {
    const result = await fetch('https://min-api.cryptocompare.com/data/all/coinlist').then(response => response.json())

    // Transform the data to something we can use
    // Adding a icon location, color and providing an array of objects we can use to insert in the database
    const transformedSymbolsArray = transformers.transformObjectsCryptocompareToArray(result.Data)

    return transformedSymbolsArray
  } catch (err) {
    console.log('getSymbols', 'Error getting symbols from external source.')
    console.log(err)
    return err
  }
}

const insertNewSymbols = async function () {
  let missingSymbolsArray = []
  const externalSymbols = await getSymbols()
  const allStoredSymbols = await knex.select().from('symbols')
  const symbolList = allStoredSymbols.map(symbol => symbol.id, {}) // So we have an array of symbol IDs: ['BTC', 'ETH', 'USDT'] etc...

  // Now find missing symbols
  missingSymbolsArray = externalSymbols.filter(symbol => {
    return !symbolList.includes(symbol.id)
  })

  // If we have missing symbols, insert them
  if (missingSymbolsArray.length) {
    try {
      await knex('symbols').insert(missingSymbolsArray)
      console.log('insertNewSymbols', `${missingSymbolsArray.length} missing symbols added!`)
      await syncSymbols(externalSymbols)
      console.log('insertNewSymbols', 'Successfully used the syncSymbols method to sync new external data with the data in the database. All good!')
      return true
    } catch (err) {
      console.log('insertNewSymbols', 'Something failed when adding new missing symbols...')
      console.log(err)
      return false
    }
  } else {
    // If there are no new symbols, just sync the symbols
    // So, in case a new icon for a symbol is created, the icon path and color get updated
    console.log('insertNewSymbols', 'No missing symbols found, so we added none.')

    try {
      await syncSymbols(externalSymbols)
      console.log('insertNewSymbols', 'Successfully used the syncSymbols method to sync new external data with the data in the database. All good!')
      return true
    } catch (err) {
      console.log('insertNewSymbols', 'Something failed syncing symbols...')
      console.log(err)
      return false
    }
  }
}

const syncSymbols = async function (externalSymbols) {
  console.log('syncSymbols', 'Syncing symbols in the database with the external symbols data...')
  const allStoredSymbols = await knex.select().from('symbols')
  return knex.transaction(trx => {
    const queries = []
    // Loop through the external symbols and find the symbol in the db based on id
    externalSymbols.forEach(symbol => {
      // Create a query to only update the data that might change every now and then
      const query = knex('symbols')
        .where('id', symbol.id)
        .update({
          name: symbol.name,
          icon_uri: symbol.icon_uri,
          color: symbol.color
        })
        .transacting(trx) // This makes every update be in the same transaction
      queries.push(query)
    })

    // Once every query is written, we fire it
    Promise.all(queries)
      .then((data) => {
        console.log('syncSymbols', 'Committing transaction...')
        trx.commit()
      }) // We try to execute all of them
      .catch(() => {
        console.log('updateSymbols', 'Updating failed, rolling back transaction.')
        trx.rollback()
      }) // And rollback in case any of them goes wrong
  })
}

const getAllSymbols = async function () {
  const results = await knex.select('id', 'name', 'icon_uri', 'color').from('symbols')
  return results.reduce((obj, key) => {
    obj[key.id] = key
    return obj
  }, {})
}

module.exports = {
  insertNewSymbols,
  getAllSymbols
}
