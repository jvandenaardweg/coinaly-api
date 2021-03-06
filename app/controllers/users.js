const knex = require('../database/knex')
const bcrypt = require('bcrypt')
const util = require('util')
const Boom = require('boom')
const randomstring = require('randomstring')
const { createUser, showUser, deleteUser, deleteUserByEmail } = require('../database/methods/users')
const { sendVerificationEmail } = require('../email/sendgrid')

class Users {
  create (request, h) {
    const email = request.payload.email
    const plainTextPassword = request.payload.password
    const emailOptIn = request.payload.emailOptIn

    return (async () => {
      try {
        const createdUser = await createUser(email, plainTextPassword, emailOptIn)

        // Send the reset email through Sendgrid
        await sendVerificationEmail(createdUser.email, createdUser.verification_token)

        delete createdUser.verification_token

        return {
          message: 'User created.',
          user: createdUser
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
        if (user) {
          return {
            ...user
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
            message: 'Succesfully deleted your account.',
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
        const rowsDeleted = await deleteUserByEmail('e2e-signup@coinaly.io')
        if (rowsDeleted) {
          return {
            message: 'Succesfully deleted the e2e test account.',
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
