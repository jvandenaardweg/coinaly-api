const express = require('express')
const bodyParser = require('body-parser')
const oauthserver = require('oauth2-server')

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.oauth = oauthserver({
  model: {}, // See below for specification
  grants: ['password'],
  debug: true
});

app.all('/oauth/token', app.oauth.grant())

app.get('/', app.oauth.authorise(), function (req, res) {
  res.send('Secret area')
})

app.use(app.oauth.errorHandler())

app.listen(3000)
