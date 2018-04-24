function transformObjects (objects) {
  return Object.keys(objects).reduce((obj, key) => {
    obj[key] = {
      name: objects[key].CoinName,
      symbol: objects[key].Symbol,
      fullName: objects[key].FullName,
      totalSupply: parseFloat(objects[key].TotalCoinSupply),
      isTrading: objects[key].IsTrading
    }
    return obj
  }, {})
}

module.exports = {
  transformObjects
}
