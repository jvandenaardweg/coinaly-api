require('dotenv').config()
const knex = require('../database/knex')
const bcrypt = require('bcrypt')
const Boom = require('boom')
const JWT = require('jsonwebtoken')
const { verifyUser, getUserCredentialsByEmail, resetUserByEmail, getUserByEmail, getUserByResetToken, setUserResetPassword, setUserActiveAt } = require('../database/methods/users')
const { sendResetEmail } = require('../email/sendgrid')

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

      if (user) {
        if (user.activated_at) {
          const passwordIsCorrect = await bcrypt.compare(plaintextPassword, user.password)
          if (passwordIsCorrect) {

            // Make sure we don't send any other sensitive data
            const cleanUser = {
              id: user.id,
              email: user.email
            }

            await setUserActiveAt(cleanUser.id)

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
    const verificationToken = request.payload.verificationToken

    return (async () => {
      try {
        const user = await verifyUser(verificationToken)
        if (user) {
          return {
            message: 'Success!',
            user: user
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

  reset (request, h) {
    const email = request.payload.email

    return (async () => {
      try {
        const user = await getUserByEmail(email)
        if (!user) {
          return Boom.notFound('There is no account found with this e-mail address.')
        }

        // Reset the user, returning a new verification code
        const resettedUser = await resetUserByEmail(user.email)

        // Send the reset email through Sendgrid
        await sendResetEmail(resettedUser.email, resettedUser.reset_token)

        delete resettedUser.reset_token

        return {
          message: `Success! An e-mail has been send to ${resettedUser.email}.`,
          user: resettedUser
        }
      } catch (e) {
        console.log(e)
        return Boom.badImplementation('There was an error retrieving the user.')
      }
    })()

  }

  // GET: /auth/reset/password
  // Resets the password for the user with the given verification code
  resetPassword (request, h) {
    const password = request.payload.password
    const resetToken = request.payload.resetToken

    return (async () => {
      try {
        const user = await getUserByResetToken(resetToken)
        if (user) {
          const resettedUser = await setUserResetPassword(password, resetToken)
          return {
            message: 'Success! Resetted the password',
            user: resettedUser
          }
        } else {
          return Boom.notFound('There is no account found to reset.')
        }
      } catch (err) {
        console.log(err)
        return Boom.badImplementation('There was an error retrieving the user.')
      }
    })()

  }

  logout (request, h) {
    return {
      message: 'Should log a user out'
    }
  }
}
module.exports = new Auth()
