const knex = require('../database/knex')

const validate = async function (decoded, request) {
  const user = await knex('users')
  .where('id', decoded.id)
  .whereNotNull('activated_at')
  .update('active_at', new Date())
  if (user) return { isValid: true }
  return { isValid: false }
}

module.exports = validate
