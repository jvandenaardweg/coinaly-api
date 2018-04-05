class Balances {
  index (request, h) {
    const exchangeName = (request.params.exchange) ? request.params.exchange.toLowerCase() : null
    return {
      message:  'Should return all balances from ' + exchangeName
    }
  }
}
module.exports = new Balances()
