const icons = require('../../node_modules/cryptocurrency-icons/manifest.json').icons

function transformObjectsCryptocompareToArray (objects) {
  return Object.keys(objects).reduce((obj, key) => {
    const symbolLower = objects[key].Symbol.toLowerCase()
    const icon = icons.includes(symbolLower)
    const hasIcon = (icon) ? true : false
    const iconLocation = (hasIcon) ? `/static/icons/cryptocurrencies/svg/color/${symbolLower}.svg` : `/static/icons/cryptocurrencies/svg/black/generic.svg`

    const newObject = {
      id: objects[key].Symbol,
      name: objects[key].CoinName,
      active: objects[key].IsTrading,
      icon_uri: iconLocation
    }

    obj.push(newObject)

    // Some exchanges use "IOTA" for what is actually "MIOTA" (Binance for example)
    // So we just overwrite "IOTA" with the "MIOTA" object
    if (newObject.id === 'IOT') {
      const iotaObject = Object.assign({}, newObject)
      iotaObject.id = 'IOTA'
      iotaObject.name = 'MIOTA'
      obj.push(iotaObject)
    }

    return obj
  }, [])
}

function transformObjectsCryptocompare (objects) {
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
  return Object.keys(objects).reduce((obj, key) => {
    const symbolLower = objects[key].Symbol.toLowerCase()
    const icon = icons.includes(symbolLower)
    const hasIcon = (icon) ? true : false
    const iconLocation = (hasIcon) ? `/static/icons/cryptocurrencies/svg/color/${symbolLower}.svg` : `/static/icons/cryptocurrencies/svg/black/generic.svg`

    obj[key] = {
      name: objects[key].CoinName,
      symbol: objects[key].Symbol,
      symbolLower: symbolLower,
      fullName: objects[key].FullName,
      totalSupply: parseFloat(objects[key].TotalCoinSupply),
      isTrading: objects[key].IsTrading,
      hasIcon: hasIcon,
      iconLocation: iconLocation
    }
    return obj
  }, {})
}

function transformObjectsCoinmarketcap (objects) {
  /*
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
    }
  */
  return objects.reduce((obj, key) => {
    const symbolLower = key.symbol.toLowerCase()
    const icon = icons.includes(symbolLower)
    const hasIcon = (icon) ? true : false
    const iconLocation = (hasIcon) ? `/static/icons/cryptocurrencies/svg/color/${symbolLower}.svg` : `/static/icons/cryptocurrencies/svg/black/generic.svg`

    obj[key.symbol] = {
      name: key.name,
      symbol: key.symbol,
      symbolLower: symbolLower,
      totalSupply: (key.total_supply) ? parseFloat(key.total_supply) : null,
      availableSupply: (key.available_supply) ? parseFloat(key.available_supply) : null,
      maxSupply: (key.max_supply) ? parseFloat(key.max_supply) : null,
      rank: (key.rank) ? parseFloat(key.rank) : null,
      hasIcon: hasIcon,
      iconLocation: iconLocation
    }
    return obj
  }, {})
}

module.exports = {
  transformObjectsCryptocompareToArray,
  transformObjectsCryptocompare,
  transformObjectsCoinmarketcap
}
