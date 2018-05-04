const knex = require('../database/knex')
const bcrypt = require('bcrypt')
const util = require('util')
const Boom = require('boom')
const { sendEmail } = require('../email/mandrill')
const randomstring = require('randomstring')
const { createUser, showUser, deleteUser, deleteUserByEmail } = require('../database/methods/users')

class Users {
  create (request, h) {
    const email = request.payload.email
    const plainTextPassword = request.payload.password
    const emailOptIn = request.payload.emailOptIn

    return (async () => {
      try {
        const createdUser = await createUser(email, plainTextPassword, emailOptIn)
        await sendEmail('signup-verify', email, createdUser[0].verification)

        delete createdUser[0].verification

        return {
          message: 'User created.',
          user: createdUser[0]
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
    const userId = request.auth.credentials.id

    return (async () => {
      try {
        const user = await showUser(userId)
        if (user.length) {
          return {
            ...user[0]
          }
        } else {
          return Boom.notFound('User not found.')
        }
      } catch (err) {
        console.log('Unknown error while showing the logged in user details', err)
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
        const rowsDeleted = await deleteUser(userId)
        if (rowsDeleted) {
          return {
            totalDeleted: rowsDeleted
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

  deleteE2ETestUser (request, h) {
    return (async () => {
      try {
        const rowsDeleted = await deleteUserByEmail('e2e-test@coinaly.io')
        if (rowsDeleted) {
          return {
            totalDeleted: rowsDeleted
          }
        } else {
          return Boom.badRequest('Nothing to delete. User e2e test email does not exist.')
        }
      } catch (err) {
        console.log('Unknown error while deleting the user.', err)
        return Boom.badImplementation('There was an error while deleting the user.')
      }
    })()
  }
}
module.exports = new Users()
