const knex = require('../knex')
const randomstring = require('randomstring')
const bcrypt = require('bcrypt')
const saltRounds = 10


const createUser = function (email, plainTextPassword, emailOptIn) {
  const verificationToken = randomstring.generate().toUpperCase()
  return bcrypt.hash(plainTextPassword, saltRounds)
  .then(passwordHash => {
    return knex('users')
      .insert({
        email: email,
        password: passwordHash,
        verification_token: verificationToken,
        email_opt_in: emailOptIn
      })
      .returning(['id', 'email', 'verification_token', 'email_opt_in', 'created_at', 'activated_at'])
      .get(0)
  })
}

const verifyUser = function (verificationToken) {
  return knex('users').where({
    verification_token: verificationToken
  })
  .update({
    activated_at: new Date(),
    verification_token: null
  })
  .returning(['id', 'email', 'activated_at', 'verification_token'])
  .get(0)
}

const showUser = function (userId) {
  return knex('users')
  .where({id: userId})
  .select('id', 'email', 'email_opt_in', 'activated_at', 'reset_at', 'active_at', 'created_at', 'updated_at', 'onboarded')
  .get(0)
}

const deleteUser = function (userId) {
  return knex('users')
  .where({ id: userId })
  .del()
}

const deleteUserByEmail = function (email) {
  return knex('users')
  .where({ email: email })
  .del()
}

const getUserCredentialsByEmail = function (email) {
  return knex('users')
  .where({email: email}).select('id', 'email', 'password', 'activated_at')
  .first()
}

const getUserByEmail = function (email) {
  return knex('users')
  .where({email: email})
  .first()
}

const getUserByVerification = function (verificationToken) {
  return knex('users')
  .where({verification_token: verificationToken})
  .select('id', 'email')
  .first()
}

const getUserByResetToken = function (resetToken) {
  return knex('users')
  .where({reset_token: resetToken})
  .select('id', 'email')
  .first()
}

const resetUserByEmail = function (email) {
  const resetToken = randomstring.generate().toUpperCase()
  return knex('users')
  .where({
    email: email
  })
  .update({
    reset_token: resetToken
  })
  .returning(['id', 'email', 'activated_at', 'reset_token'])
  .get(0)
}

// Sets a new password for the user with the given verification code
// This is used in the password forgot/reset flow
const setUserResetPassword = async function (plainTextPassword, resetToken) {
  const passwordHash = await bcrypt.hash(plainTextPassword, saltRounds)
  return knex('users')
  .where({
    reset_token: resetToken
  })
  .update({
    password: passwordHash,
    reset_token: null,
    reset_at: new Date()
  })
  .returning(['id', 'email', 'reset_token', 'reset_at'])
  .get(0)
}

const setUserActiveAt = function (userId) {
  return knex('users')
  .where({
    id: userId
  })
  .update({
    active_at: new Date()
  })
  .get(0)
}

module.exports = {
  createUser,
  verifyUser,
  showUser,
  deleteUser,
  deleteUserByEmail,
  getUserCredentialsByEmail,
  getUserByEmail,
  resetUserByEmail,
  getUserByVerification,
  getUserByResetToken,
  setUserResetPassword,
  setUserActiveAt
}
