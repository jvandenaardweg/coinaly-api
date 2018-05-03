require('dotenv').config()
const knex = require('../database/knex')
const bcrypt = require('bcrypt')
const Boom = require('boom')
const JWT = require('jsonwebtoken')
const { verifyUser, getUserCredentialsByEmail } = require('../database/methods/users')

class Auth {

  login (request, h) {
    const email = request.payload.email
    const plaintextPassword = request.payload.password
    let user

    // TODO: should ban a user after multiple login fails
    // TODO: should log login attempts

    // TODO: check if user activated email

    return (async () => {
      try {
        user = await getUserCredentialsByEmail(email)
      } catch (e) {
        return Boom.badImplementation('There was an error retrieving the user.')
      }

      if (user.length) {
        if (user[0].activated_at) {
          const passwordIsCorrect = await bcrypt.compare(plaintextPassword, user[0].password)
          if (passwordIsCorrect) {

            // Make sure we don't send any other sensitive data
            const cleanUser = {
              id: user[0].id,
              email: user[0].email
            }

            const token = JWT.sign(cleanUser, process.env.JWT_SECRET)

            return {
              token: token,
              user: cleanUser // Send the cleanUser object, which does not contain sensitive data
            }
          } else {
            return Boom.badRequest('Password is incorrect.')
          }
        } else {
          return Boom.badRequest('Your account is not acivated yet. Please check your e-mail.')
        }
      } else {
        return Boom.notFound('E-mail address is not found.')
      }
    })()
  }

  verify (request, h) {
    const verificationCode = request.payload.verificationCode

    return (async () => {
      try {
        const user = await verifyUser(verificationCode)
        if (user.length) {
          return {
            message: 'Success!',
            user: user[0]
          }
        } else {
          return Boom.badRequest('There is no account to activate with this verification code.')
        }
      } catch (e) {
        console.log('Error while verifiying the user', e)
        return Boom.badImplementation('There was an error while verifying the user.')
      }
    })()

  }

  forgotPassword (request, h) {
    return {
      message: 'Password reset flow'
    }
  }

  logout (request, h) {
    return {
      message: 'Should log a user out'
    }
  }
}
module.exports = new Auth()
