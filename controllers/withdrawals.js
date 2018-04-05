class Withdrawals {
  index (request, h) {
    return {
      message:  'Should return all Withdrawals'
    }
  }
}
module.exports = new Withdrawals()
