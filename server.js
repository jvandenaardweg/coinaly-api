require('dotenv').config()
const express = require('express')
const app = express()
const Raven = require('raven')
const bodyParser = require('body-parser')
const slashes = require('connect-slashes')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const apiRoutesExchanges = require('./routes/exchanges')

const port = process.env.PORT || 5000

// Must configure Raven before doing anything else with it
Raven.config('https://6017930c14144ebba549f005a84ea4d6:e33b2600cd274d3991e16559d71806d7@sentry.io/1085664').install();

app.use(Raven.requestHandler()) // The request handler must be the first middleware on the app
app.use(Raven.errorHandler())
app.use(cookieParser())
app.use(compression())
app.use(bodyParser.json())
app.use(slashes(false))

if (!process.env.ENCODE_SECRET) {
  console.log('Please add a ENCODE_SECRET to the .env file. This is used to encrypt and decrypt the API keys and secrets.')
  return false
}

// Disable CORS
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.header('Access-Control-Allow-Origin', 'https://app.coinaly.io')
  } else {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080')
  }
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use('/', apiRoutesExchanges)

// Catch 404
app.use(function (request, response, next) {
  response.status(404).json({message: '404 - Not found', contact: 'If this happens more often, contact us at info@coinaly.io'})
})

app.listen(port)

console.log('Coinaly API: Server started at port ' + port)
