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
        return {
          message: 'User created.'
        }
      } catch (err) {
        if (err.constraint === 'users_email_unique') {
          return Boom.conflict('E-mail address already exists')
        } else {
          console.log('unknown error', err)
          return Boom.badImplementation('There was an error while creating a new user.')
        }
      }
    })()
  }

  show (request, h) {
    return {
      message: 'show user'
    }
  }

  update (request, h) {
    return {
      message: 'update user'
    }
  }

  delete (request, h) {
    return {
      message: 'delete user'
    }
  }
}
module.exports = new Users()
