const transformers = require('./transformers')

describe('helpers/transformers', () => {
  it('returns transformed objects', () => {
    expect(transformers.transformObjects(mock)).toMatchObject(expected)
  })
})

const mock = {
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
  "ETH": {
    "Id": "7605",
    "Url": "/coins/eth/overview",
    "ImageUrl": "/media/20646/eth_logo.png",
    "Name": "ETH",
    "Symbol": "ETH",
    "CoinName": "Ethereum",
    "FullName": "Ethereum (ETH)",
    "Algorithm": "Ethash",
    "ProofType": "PoW",
    "FullyPremined": "0",
    "TotalCoinSupply": "0",
    "PreMinedValue": "N/A",
    "TotalCoinsFreeFloat": "N/A",
    "SortOrder": "2",
    "Sponsored": false,
    "IsTrading": true
  }
}

const expected = {
  "BTC": {
    "symbol": "BTC",
    "name": "Bitcoin",
    "fullName": "Bitcoin (BTC)",
    "totalSupply": 21000000,
    "isTrading": true
  },
  "ETH": {
    "symbol": "ETH",
    "name": "Ethereum",
    "fullName": "Ethereum (ETH)",
    "isTrading": true,
    "totalSupply": 0
  }
}
