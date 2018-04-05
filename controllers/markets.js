class Markets {
  index (request, h) {
    return {
      message:  'Should return all Markets'
    }
  }
}
module.exports = new Markets()
