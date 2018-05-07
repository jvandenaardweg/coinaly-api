const knex = require('../database/knex')
const bcrypt = require('bcrypt')
const util = require('util')
const Boom = require('boom')
const encryption = require('../helpers/encryption')
const ExchangeWorkers = require('../workers')
const { getExchangeById } = require('../database/methods/exchanges')
const { getAllKeysByUserId, createKey, deleteKey } = require('../database/methods/keys')
class Keys {

  create (request, h) {
    const exchangeId = request.payload.exchangeId
    const plainTextApiKey = request.payload.apiKey
    const plainTextApiSecret = request.payload.apiSecret
    const apiKeyEncoded = encryption.encryptString(plainTextApiKey, process.env.ENCODE_SECRET)
    const apiSecretEncoded = encryption.encryptString(plainTextApiSecret, process.env.ENCODE_SECRET)
    const userId = request.auth.credentials.id

    return (async () => {
      try {

        const exchange = await getExchangeById(exchangeId)

        if (exchange) {
          // Set key and secret for current user
          ExchangeWorkers[exchange.slug].setApiCredentials(plainTextApiKey, plainTextApiSecret)

          // Just do a call, if all goes well, the key/secret pair is valid
          // If it returns an error, an exception will be thrown
          await ExchangeWorkers[exchange.slug].fetchBalance(true, userId)
        } else {
          return Boom.badRequest('The exchange does not exist.')
        }
      } catch (err) {
        return Boom.badRequest('The API key and secret does not seem to be correct. We tried to get your balance from the exchange, but it failed. Please try an other API key or secret.')
      }

      try {
        const key = await createKey(userId, exchangeId, apiKeyEncoded, apiSecretEncoded)
        return {
          message: 'API key and secret saved securely.',
          key: key
        }
      } catch (err) {
        if (err.constraint === 'keys_user_id_exchange_id_unique') {
          return Boom.conflict('You already have an API key and secret combination for this exchange.')
        } else {
          console.log('Unknown error while storing the API key and secret.', err)
          return Boom.badImplementation('There was an error while storing the API key and secret.')
        }
      }
    })()
  }

  show (request, h) {
    const userId = request.auth.credentials.id

    return (async () => {
      try {
        const keys = await getAllKeysByUserId(userId)
        return keys
      } catch (err) {
        console.log('Unknown error while retrieving the API keys.', err)
        return Boom.badImplementation('There was an error while retrieving the API keys.')
      }
    })()
  }

  delete (request, h) {
    const userId = request.auth.credentials.id
    const exchangeId = request.params.exchangeId

    return (async () => {
      try {
        const totalDeleted = await deleteKey(userId, exchangeId)
        if (totalDeleted) {
          return {
            totalDeleted: totalDeleted
          }
        } else {
          return Boom.badRequest('Nothing to delete. API key and secret combination does not exist for this exchange ID.')
        }
      } catch (err) {
        console.log('Unknown error while deleting the API keys.', err)
        return Boom.badImplementation('There was an error while deleting the API keys.')
      }
    })()
  }

  update (request, h) {
    return {
      message: 'update keys'
    }
  }
}
module.exports = new Keys()
