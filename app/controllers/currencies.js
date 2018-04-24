const Boom = require('boom')
const transformers = require('../helpers/transformers')

class Currencies {
  constructor () { }

  index (request, h) {
    return (async () => {
      try {

        // TODO : get from coinmarketcap
        const result = await fetch('https://min-api.cryptocompare.com/data/all/coinlist').then(response => response.json())
        // const result = await fetch('https://api.coinmarketcap.com/v1/ticker/?limit=0').then(response => response.json())

        const newResult = transformers.transformObjects(result.Data)

        /*
        "BTC": {
          "Id": "1182",
          "Url": "/coins/btc/overview",
          "ImageUrl": "/media/19633/btc.png",
          "Name": "BTC",
          "Symbol": "BTC",
          "CoinName": "Bitcoin",
          "FullName": "Bitcoin (BTC)",
          "Algorithm": "SHA256",
          "ProofType": "PoW",
          "FullyPremined": "0",
          "TotalCoinSupply": "21000000",
          "PreMinedValue": "N/A",
          "TotalCoinsFreeFloat": "N/A",
          "SortOrder": "1",
          "Sponsored": false,
          "IsTrading": true
          },
        */
        return newResult
      } catch (error) {
        return Boom.badImplementation(error)
      }
    })()
  }
}
module.exports = new Currencies()
