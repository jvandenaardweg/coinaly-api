
// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
require('dotenv').config()

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
sgMail.setSubstitutionWrappers('{{', '}}')

let baseUrl = 'http://localhost:8080'
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://app.coinaly.io'
}

const defaultFrom = 'info@coinaly.io'

const sendEmail = function (payload) {
  return sgMail.send(payload)
}

const sendVerificationEmail = function (email, verificationToken) {
  const payload = {
    to: email,
    from: defaultFrom,
    subject: 'Verify your e-mail address to start using Coinaly',
    text: 'Verify your e-mail address to start using Coinaly',
    html: '<p>Verify your e-mail address to start using Coinaly</p>',
    templateId: '455dd828-18b8-47ba-a64c-50360b731a9f',
    substitutions: {
      email: email,
      verificationUrl: `${baseUrl}/signup/verify/${verificationToken}`
    },
  }

  return sendEmail(payload)
}

const sendResetEmail = function (email, resetToken) {
  const payload = {
    to: email,
    from: defaultFrom,
    subject: 'Reset your Coinaly password',
    text: 'Reset your Coinaly password',
    html: '<p>Reset your Coinaly password</p>',
    templateId: '7d4b05c2-6d63-4723-a088-970611191819',
    substitutions: {
      email: email,
      resetPasswordUrl: `${baseUrl}/login/forgot/${resetToken}`
    },
  }

  return sendEmail(payload)

}

module.exports = {
  sendVerificationEmail,
  sendResetEmail,
  sendEmail
}
