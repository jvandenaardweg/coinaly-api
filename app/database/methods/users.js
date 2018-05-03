const knex = require('../knex')
const randomstring = require('randomstring')
const bcrypt = require('bcrypt')
const saltRounds = 10

const createUser = async function (email, plainTextPassword) {
  const verificationCode = randomstring.generate().toUpperCase()
  const passwordHash = await bcrypt.hash(plainTextPassword, saltRounds)
  const createdUser = await knex('users')
  .insert({
    email: email,
    password: passwordHash,
    verification: verificationCode})
    .returning(['id', 'email', 'verification', 'created_at', 'activated_at'])
  return createdUser
}

const verifyUser = async function (verificationCode) {
  const user = await knex('users').where({
    verification: verificationCode
  })
  .update({
    activated_at: new Date(),
    verification: null
  })
  .returning(['id', 'email', 'activated_at', 'verification'])
  return user
}

const showUser = async function (userId) {
  const user = await knex('users')
  .where({id: userId})
  .select('id', 'email', 'created_at', 'updated_at', 'activated_at', 'active_at')
  return user
}

const deleteUser = async function (userId) {
  const rowsDeleted = await knex('users').where({ id: userId }).del()
  return rowsDeleted
}

const deleteUserByEmail = async function (email) {
  const rowsDeleted = await knex('users').where({ email: email }).del()
  return rowsDeleted
}

const getUserCredentialsByEmail = async function (email) {
  const user = await knex('users').where({email: email}).select('id', 'email', 'password', 'activated_at')
  return user
}

module.exports = {
  createUser: createUser,
  verifyUser: verifyUser,
  showUser: showUser,
  deleteUser: deleteUser,
  deleteUserByEmail: deleteUserByEmail,
  getUserCredentialsByEmail: getUserCredentialsByEmail
}
