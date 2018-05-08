const knex = require('../knex')
const encryption = require('../../helpers/encryption')

// VERY IMPORTANT: NEVER EVER return the encoded API key and/or secret

const getAllKeysByUserId = function (userId) {
  return knex('keys')
  .where({ user_id: userId})
  .select('exchange_id', 'created_at', 'updated_at')
}

const getDecodedExchangeApiCredentials = function (userId, exchangeId) {
  return knex('keys')
  .where({
    user_id: userId,
    exchange_id: exchangeId
  })
  .select('api_key_encoded', 'api_secret_encoded')
  .get(0)
  .then(key => {
    return {
      plainTextApiKey: encryption.decryptString(key.api_key_encoded, process.env.ENCODE_SECRET),
      plainTextApiSecret: encryption.decryptString(key.api_secret_encoded, process.env.ENCODE_SECRET)
    }
  })
}

const createKey = function (userId, exchangeId, apiKeyEncoded, apiSecretEncoded) {
  return knex('keys').insert({
    user_id: userId,
    exchange_id: exchangeId,
    api_key_encoded: apiKeyEncoded,
    api_secret_encoded: apiSecretEncoded
  })
  .returning(['exchange_id', 'created_at', 'updated_at'])
  .get(0)
}

const deleteKey = function (userId, exchangeId) {
  return knex('keys')
  .where({
    user_id: userId,
    exchange_id: exchangeId})
  .del()
}

module.exports = {
  getAllKeysByUserId,
  getDecodedExchangeApiCredentials,
  createKey,
  deleteKey
}
