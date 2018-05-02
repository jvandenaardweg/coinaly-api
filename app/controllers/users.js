const knex = require('../database/knex')
const bcrypt = require('bcrypt')
const util = require('util')
const Boom = require('boom')
const { sendEmail } = require('../email/mandrill')
const randomstring = require('randomstring')

class Users {
  create (request, h) {
    let passwordHash
    let verificationCode
    const saltRounds = 10
    const email = request.payload.email
    const plainTextPassword = request.payload.password

    return (async () => {
      try {
        passwordHash = await bcrypt.hash(plainTextPassword, saltRounds)
      } catch (err) {
        console.log('error generating password hash', err)
        return Boom.badImplementation('There was an error while encoding your password.')
      }

      try {
        verificationCode = randomstring.generate().toUpperCase()
        const createdUser = await knex('users').insert({email: email, password: passwordHash, verification: verificationCode}).returning(['id', 'email'])
        await sendEmail('signup-verify', email, verificationCode)

        return {
          message: 'User created.',
          user: createdUser[0]
        }
      } catch (err) {
        if (err.constraint === 'users_email_unique') {
          return Boom.conflict('E-mail address already exists')
        } else {
          // console.log('Unknown error while creating a new user', err)
          return Boom.badImplementation('There was an error while creating a new user.')
        }
      }
    })()
  }

  show (request, h) {
    const userId = request.auth.credentials.id

    return (async () => {
      try {
        const user = await knex('users').where({id: userId}).select('email', 'created_at', 'updated_at', 'activated_at', 'active_at')
        if (user.length) {
          return {
            ...user[0]
          }
        } else {
          return Boom.notFound('User not found.')
        }

      } catch (err) {
        console.log('unknown error', err)
        return Boom.badImplementation('There was an error while retrieving the user.')
      }
    })()
  }

  update (request, h) {
    return {
      message: 'Should update current logged in user info'
    }
  }

  delete (request, h) {
    const userId = request.auth.credentials.id

    return (async () => {
      try {
        const deletedUser = await knex('users').where({ id: userId }).del()
        if (deletedUser) {
          return {
            totalDeleted: deletedUser
          }
        } else {
          return Boom.badRequest('Nothing to delete. User does not exist.')
        }
      } catch (err) {
        console.log('Unknown error while deleting the user.', err)
        return Boom.badImplementation('There was an error while deleting the user.')
      }
    })()
  }
}
module.exports = new Users()
