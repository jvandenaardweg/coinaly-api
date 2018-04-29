const knex = require('../database/knex')
const bcrypt = require('bcrypt')
const util = require('util')
const Boom = require('boom')
class Keys {
  create (request, h) {
    const exchangeId = null
    const apiKey = null
    const apiSecret = null
    const apiKeyEncoded = null
    const apiSecretEncoded = null
    const userId = null

    return (async () => {

      try {
        await knex('keys').insert({
          userId: userId,
          exchange_id: exchangeId,
          api_key_encoded: apiKeyEncoded,
          api_secret_encoded: apiSecretEncoded
        })
        return {
          message: 'Keys created.'
        }
      } catch (err) {
        console.log('unknown error', err)
        return Boom.badImplementation('There was an error while storing the API key and secret.')
      }
    })()
  }

  show (request, h) {
    return {
      message: 'show keys'
    }
  }

  update (request, h) {
    return {
      message: 'update keys'
    }
  }

  delete (request, h) {
    return {
      message: 'delete keys'
    }
  }
}
module.exports = new Keys()
