

var request = require('request')

let baseUrl = 'http://localhost:5000'
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://api.coinaly.io'
}

request(`${baseUrl}/prices/fetch`, function (error, response, body) {
  if (error) console.log('Scheduled task: Fetching new prices failed.',)
  if (!error && response.statusCode === 200 && Object.keys(JSON.parse(body)).length) {
    console.log('Scheduled task: Fetching new prices success!',  `Got ${Object.keys(JSON.parse(body)).length} prices.`)
  } else {
    console.log('Scheduled task: Got no valid data.')
  }
})
