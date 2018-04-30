const knex = require('../database/knex')
const bcrypt = require('bcrypt')
const util = require('util')
const Boom = require('boom')
class Users {
  create (request, h) {
    let passwordHash
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
        await knex('users').insert({email: email, password: passwordHash})
        // TODO: send verification email
        return {
          message: 'User created.'
        }
      } catch (err) {
        if (err.constraint === 'users_email_unique') {
          return Boom.conflict('E-mail address already exists')
        } else {
          console.log('Unknown error while creating a new user', err)
          return Boom.badImplementation('There was an error while creating a new user.')
        }
      }
    })()
  }

  show (request, h) {
    return (async () => {
      try {
        const email = 'jordyvandenaardweg@gmail.com' // TODO: should be logged in user, but we use this for now for dev purposes
        const user = await knex('users').where({email: email}).select('email', 'created_at', 'updated_at')
        return {
          ...user[0]
        }
      } catch (err) {
        console.log('unknown error', err)
        // return Boom.badImplementation('There was an error while creating a new user.')
      }
    })()
  }

  update (request, h) {
    return {
      message: 'Should update current logged in user info'
    }
  }

  delete (request, h) {
    return {
      message: 'Should delete current logged in user'
    }
  }
}
module.exports = new Users()
