const transformers = require('../transformers')

describe('helpers/transformers', () => {
  it('returns transformed Cryptocompare objects', () => {
    expect(transformers.transformObjectsCryptocompare(mockCryptocompare)).toMatchObject(expectedCryptocompare)
  })

  it('returns transformed Cryptocompare objects', () => {
    expect(transformers.transformObjectsCoinmarketcap(mockCoinmarketcap)).toMatchObject(expectedCoinmarketcap)
  })
})

const mockCoinmarketcap = [
  {
    "id": "bitcoin",
    "name": "Bitcoin",
    "symbol": "BTC",
    "rank": "1",
    "price_usd": "9342.12",
    "price_btc": "1.0",
    "24h_volume_usd": "8700580000.0",
    "market_cap_usd": "158784510345",
    "available_supply": "16996625.0",
    "total_supply": "16996625.0",
    "max_supply": "21000000.0",
    "percent_change_1h": "0.1",
    "percent_change_24h": "4.68",
    "percent_change_7d": "15.42",
    "last_updated": "1524578077"
  },
  {
    "id": "ethereum",
    "name": "Ethereum",
    "symbol": "ETH",
    "rank": "2",
    "price_usd": "699.639",
    "price_btc": "0.0749236",
    "24h_volume_usd": "3094680000.0",
    "market_cap_usd": "69277484789.0",
    "available_supply": "99018901.0",
    "total_supply": "99018901.0",
    "max_supply": null,
    "percent_change_1h": "0.25",
    "percent_change_24h": "8.61",
    "percent_change_7d": "36.09",
    "last_updated": "1524578062"
  }
]

const expectedCoinmarketcap = {
  "BTC": {
    "availableSupply": 16996625,
    "maxSupply": 21000000,
    "name": "Bitcoin",
    "symbol": "BTC",
    "totalSupply": 16996625,
    "rank": 1,
    "hasIcon": true,
    "iconLocation": "/static/icons/cryptocurrencies/svg/color/btc.svg"
   },
   "ETH": {
    "availableSupply": 99018901,
    "maxSupply": null,
    "name": "Ethereum",
    "symbol": "ETH",
    "totalSupply": 99018901,
    "rank": 2,
    "hasIcon": true,
    "iconLocation": "/static/icons/cryptocurrencies/svg/color/eth.svg"
   }
}

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
  }
}

const expectedCryptocompare = {
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
