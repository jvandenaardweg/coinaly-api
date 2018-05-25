const transformers = require('../transformers')

describe('helpers/transformers', () => {
  it('returns transformed Cryptocompare objects', () => {
    expect(transformers.transformObjectsCryptocompareToArray(mockCryptocompare)).toMatchObject(expectedCryptocompare)
  })
})

const mockCryptocompare = {
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
  },
  "UNKNOWNNN": {
    "Id": "7605",
    "Url": "/coins/unknownnn/overview",
    "ImageUrl": "/media/20646/unknownnn_logo.png",
    "Name": "UNKNOWNNN",
    "Symbol": "UNKNOWNNN",
    "CoinName": "Unknownnn",
    "FullName": "Unknownnn (UNKNOWNNN)",
    "Algorithm": null,
    "ProofType": "PoW",
    "FullyPremined": "0",
    "TotalCoinSupply": "0",
    "PreMinedValue": "N/A",
    "TotalCoinsFreeFloat": "N/A",
    "SortOrder": "0",
    "Sponsored": false,
    "IsTrading": false
  }
}

const expectedCryptocompare = [
  {
    "id": "BTC",
    "name": "Bitcoin",
    "active": true,
    "icon_uri": "/static/icons/cryptocurrencies/svg/color/btc.svg",
    "color": "#F7931A"
  },
  {
    "id": "ETH",
    "name": "Ethereum",
    "active": true,
    "icon_uri": "/static/icons/cryptocurrencies/svg/color/eth.svg",
    "color": "#627EEA"
  },
  {
    "id": "UNKNOWNNN",
    "name": "Unknownnn",
    "active": false,
    "icon_uri": "/static/icons/cryptocurrencies/svg/black/generic.svg",
    "color": null
  }
]
