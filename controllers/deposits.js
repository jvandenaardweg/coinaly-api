class Deposits {
  index (request, h) {
    return {
      message:  'Should return all deposits'
    }
  }
}
module.exports = new Deposits()
