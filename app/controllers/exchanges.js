const Boom = require('boom')
const { getAllActiveExchanges, getAllExchanges, getExchangeBySlug } = require('../database/methods/exchanges')

class Exchanges {

  index (request, h) {
    return(async() => {
      try {
        const exchanges = await getAllExchanges()
        if (exchanges) return exchanges
        return Boom.notFound('No exchanges found.')
      } catch (err) {
        console.log('Error while retrieving all the exchanges', err)
        return Boom.badImplementation('There was an error retrieving all the exchanges.')
      }
    })()
  }

  show (request, h) {
    const slug = request.query.slug

    return(async() => {
      try {
        const exchange = await getExchangeBySlug(slug)
        if (exchange) return exchange
        return Boom.notFound('No exchange found.')
      } catch (err) {
        console.log('Error while retrieving an exchange by slug', err)
        return Boom.badImplementation('There was an error retrieving the exchange.')
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
