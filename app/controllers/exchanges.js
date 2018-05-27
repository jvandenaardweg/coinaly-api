const Boom = require('boom')
const { getAllActiveExchanges, getAllExchanges, getExchangeBySlug } = require('../database/methods/exchanges')

class Exchanges {

  index (request, h) {
    const slug = request.query.slug
    let exchanges

    return(async() => {
      try {
        if (slug) {
          exchanges = await getExchangeBySlug(slug)
        } else {
          exchanges = await getAllExchanges()
        }
        if (exchanges) return exchanges
        return Boom.notFound('No exchanges found.')
      } catch (err) {
        console.log('Error while retrieving the exchanges', err)
        return Boom.badImplementation('There was an error retrieving the exchanges.')
      }
    })()
  }

  active (request, h) {
    return(async() => {
      try {
        const exchanges = await getAllActiveExchanges()
        if (exchanges) return exchanges
        return Boom.notFound('No active exchanges found.')
      } catch (err) {
        console.log('Error while retrieving all the active exchanges', err)
        return Boom.badImplementation('There was an error retrieving all the active exchanges.')
      }
    })()
  }
}
module.exports = new Exchanges()
