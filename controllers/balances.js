class Balances {
  index (request, h) {
    return {
      message:  'Should return all balances'
    }
  }
}
module.exports = new Balances()
