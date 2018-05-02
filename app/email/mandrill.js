require('dotenv').config({ path: '../.env' })

const mandrill = require('mandrill-api/mandrill')
const mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_API_KEY)

let baseUrl = 'http://localhost:8080'
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://app.coinaly.io'
}

function sendTemplate(opts) {
  return new Promise(function (resolve, reject) {
    return mandrill_client.messages.sendTemplate(opts, resolve, reject)
  })
}

const sendEmail = function (templateName, userEmail, verificationCode) {
  const params = {
    template_name: templateName,
    template_content: [],
    message: {
      // subject: config.subject,
      to: [
        {
          email: userEmail,
          type: 'to'
        }
      ],
      global_merge_vars: [
        {
          name: 'verification_url',
          content: `${baseUrl}/signup/verify/${verificationCode}`
        }
      ]
    }
  }

  return sendTemplate(params)
}

module.exports = {
  sendEmail
}
