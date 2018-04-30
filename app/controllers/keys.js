const knex = require('../database/knex')
const bcrypt = require('bcrypt')
const util = require('util')
const Boom = require('boom')
const encryption = require('../helpers/encryption')
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
        await knex('keys').insert({
          user_id: userId,
          exchange_id: exchangeId,
          api_key_encoded: apiKeyEncoded,
          api_secret_encoded: apiSecretEncoded
        })
        return {
          message: 'API key and secret saved securely.'
        }
      } catch (err) {
        console.log('Unknown error while storing the API key and secret.', err)
        if (err.constraint === 'keys_user_id_exchange_id_unique') {
          return Boom.conflict('You already have an API key and secret combination for this exchange.')
        } else {
          return Boom.badImplementation('There was an error while storing the API key and secret.')
        }
      }
    })()
  }

  show (request, h) {
    const userId = request.auth.credentials.id

    return (async () => {
      try {
        // VERY IMPORTANT: NEVER return the encoded API key and/or secret
        const keys = await knex('keys').where({ user_id: userId}).select('exchange_id', 'created_at', 'updated_at')
        return {
          keys: keys
        }
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
        // VERY IMPORTANT: NEVER return the encoded API key and/or secret
        const deletedKeys = await knex('keys').where({ user_id: userId, exchange_id: exchangeId}).del()
        if (deletedKeys) {
          return {
            totalDeleted: deletedKeys
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
